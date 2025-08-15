import axios, { AxiosInstance } from 'axios';
import crypto from 'crypto';
import { prisma } from '../server';
import { logger } from '../server';
import { PaymentStatus } from '@prisma/client';
import { RedisService } from './redis.service';
import { NotificationService } from './notification.service';
import { AuditService } from './audit.service';

interface MBWayPaymentRequest {
  orderId: string;
  amount: number;
  phoneNumber: string;
  description: string;
  email: string;
}

interface MBWayPaymentResponse {
  success: boolean;
  transactionId?: string;
  reference?: string;
  status?: string;
  error?: string;
  retryAfter?: number;
}

interface MBWayWebhookData {
  transactionId: string;
  reference: string;
  status: string;
  amount: number;
  timestamp: string;
  signature: string;
}

export class MBWayService {
  private client: AxiosInstance;
  private redis: RedisService;
  private notification: NotificationService;
  private audit: AuditService;
  private readonly maxRetries: number;
  private readonly retryDelay: number;
  private readonly timeout: number;

  constructor() {
    this.redis = new RedisService();
    this.notification = new NotificationService();
    this.audit = new AuditService();
    
    this.maxRetries = parseInt(process.env.MBWAY_MAX_RETRIES || '3');
    this.retryDelay = 2000; // 2 seconds
    this.timeout = parseInt(process.env.MBWAY_TIMEOUT_MINUTES || '5') * 60 * 1000;

    // Configure axios client with interceptors
    this.client = axios.create({
      baseURL: process.env.MBWAY_API_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        'API-Key': process.env.MBWAY_API_KEY,
        'Entity': process.env.MBWAY_ENTITY,
        'SubEntity': process.env.MBWAY_SUBENTITY,
      },
    });

    // Request interceptor for logging
    this.client.interceptors.request.use(
      (config) => {
        logger.info('MB Way API Request:', {
          method: config.method,
          url: config.url,
          timestamp: new Date().toISOString(),
        });
        return config;
      },
      (error) => {
        logger.error('MB Way Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => {
        logger.info('MB Way API Response:', {
          status: response.status,
          data: response.data,
          timestamp: new Date().toISOString(),
        });
        return response;
      },
      async (error) => {
        logger.error('MB Way Response Error:', {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        });

        // Implement exponential backoff for retries
        if (error.response?.status === 429) {
          const retryAfter = error.response.headers['retry-after'] || 5;
          await this.delay(retryAfter * 1000);
        }

        return Promise.reject(error);
      }
    );
  }

  /**
   * Initiate MB Way payment with automatic retry and validation
   */
  async initiatePayment(request: MBWayPaymentRequest): Promise<MBWayPaymentResponse> {
    const startTime = Date.now();
    let attempt = 0;
    let lastError: any;

    // Validate phone number format
    if (!this.validatePhoneNumber(request.phoneNumber)) {
      throw new Error('Número de telefone inválido para MB Way');
    }

    // Check for duplicate payment attempts
    const duplicateCheck = await this.checkDuplicatePayment(request.orderId);
    if (duplicateCheck) {
      logger.warn('Duplicate payment attempt detected', { orderId: request.orderId });
      return duplicateCheck;
    }

    // Create idempotency key
    const idempotencyKey = this.generateIdempotencyKey(request);

    while (attempt < this.maxRetries) {
      attempt++;
      
      try {
        logger.info(`MB Way payment attempt ${attempt}/${this.maxRetries}`, {
          orderId: request.orderId,
          amount: request.amount,
        });

        // Store attempt in Redis for monitoring
        await this.redis.set(
          `payment:attempt:${request.orderId}`,
          JSON.stringify({ attempt, timestamp: Date.now() }),
          300 // 5 minutes TTL
        );

        // Make API request
        const response = await this.client.post('/payments/mbway', {
          amount: Math.round(request.amount * 100), // Convert to cents
          phone: this.formatPhoneNumber(request.phoneNumber),
          email: request.email,
          description: request.description,
          reference: request.orderId,
          callback_url: `${process.env.API_URL}/api/v1/payments/mbway/webhook`,
          idempotency_key: idempotencyKey,
          metadata: {
            orderId: request.orderId,
            timestamp: new Date().toISOString(),
          },
        });

        // Validate response
        if (!this.validateResponse(response.data)) {
          throw new Error('Invalid MB Way response format');
        }

        // Store payment record
        const payment = await prisma.payment.create({
          data: {
            orderId: request.orderId,
            transactionId: response.data.transactionId,
            method: 'MBWAY',
            amount: request.amount,
            status: 'PENDING',
            mbWayPhone: request.phoneNumber,
            mbWayReference: response.data.reference,
            mbWayStatus: response.data.status,
            processorData: response.data,
            attempts: attempt,
            lastAttemptAt: new Date(),
          },
        });

        // Cache payment data
        await this.redis.set(
          `payment:${response.data.transactionId}`,
          JSON.stringify(payment),
          this.timeout / 1000
        );

        // Start payment monitoring
        this.startPaymentMonitoring(response.data.transactionId, request.orderId);

        // Log success
        await this.audit.log({
          action: 'PAYMENT_INITIATED',
          entity: 'Payment',
          entityId: payment.id,
          data: {
            orderId: request.orderId,
            amount: request.amount,
            method: 'MBWAY',
            attempt,
          },
        });

        return {
          success: true,
          transactionId: response.data.transactionId,
          reference: response.data.reference,
          status: response.data.status,
        };

      } catch (error: any) {
        lastError = error;
        
        logger.error(`MB Way payment attempt ${attempt} failed:`, {
          orderId: request.orderId,
          error: error.message,
          stack: error.stack,
        });

        // Check if error is retryable
        if (!this.isRetryableError(error)) {
          break;
        }

        // Wait before retry with exponential backoff
        if (attempt < this.maxRetries) {
          const delay = this.calculateBackoffDelay(attempt);
          logger.info(`Retrying MB Way payment in ${delay}ms...`);
          await this.delay(delay);
        }
      }
    }

    // All attempts failed
    await this.handlePaymentFailure(request.orderId, lastError);
    
    return {
      success: false,
      error: lastError?.message || 'Payment failed after maximum retries',
      retryAfter: 60,
    };
  }

  /**
   * Verify payment status with double confirmation
   */
  async verifyPaymentStatus(transactionId: string): Promise<PaymentStatus> {
    try {
      // Check cache first
      const cached = await this.redis.get(`payment:status:${transactionId}`);
      if (cached) {
        return cached as PaymentStatus;
      }

      // Query MB Way API
      const response = await this.client.get(`/payments/${transactionId}/status`);
      
      // Double confirmation - query again after short delay
      await this.delay(1000);
      const confirmResponse = await this.client.get(`/payments/${transactionId}/status`);
      
      // Verify both responses match
      if (response.data.status !== confirmResponse.data.status) {
        logger.warn('Payment status mismatch detected, using second response', {
          transactionId,
          first: response.data.status,
          second: confirmResponse.data.status,
        });
      }

      const status = this.mapMBWayStatus(confirmResponse.data.status);
      
      // Update database
      await prisma.payment.update({
        where: { transactionId },
        data: {
          status,
          mbWayStatus: confirmResponse.data.status,
          processorData: confirmResponse.data,
          updatedAt: new Date(),
        },
      });

      // Cache status
      await this.redis.set(
        `payment:status:${transactionId}`,
        status,
        60 // 1 minute cache
      );

      return status;

    } catch (error) {
      logger.error('Failed to verify payment status:', error);
      throw new Error('Unable to verify payment status');
    }
  }

  /**
   * Handle MB Way webhook with signature verification
   */
  async handleWebhook(data: MBWayWebhookData): Promise<void> {
    try {
      // Verify webhook signature
      if (!this.verifyWebhookSignature(data)) {
        logger.error('Invalid webhook signature', { transactionId: data.transactionId });
        throw new Error('Invalid webhook signature');
      }

      // Prevent duplicate webhook processing
      const processed = await this.redis.get(`webhook:processed:${data.transactionId}:${data.timestamp}`);
      if (processed) {
        logger.info('Webhook already processed', { transactionId: data.transactionId });
        return;
      }

      // Lock for processing
      const lock = await this.redis.acquireLock(`webhook:lock:${data.transactionId}`, 30);
      if (!lock) {
        logger.warn('Could not acquire webhook lock', { transactionId: data.transactionId });
        return;
      }

      try {
        // Get payment record
        const payment = await prisma.payment.findUnique({
          where: { transactionId: data.transactionId },
          include: { order: true },
        });

        if (!payment) {
          logger.error('Payment not found for webhook', { transactionId: data.transactionId });
          return;
        }

        // Map status
        const newStatus = this.mapMBWayStatus(data.status);
        
        // Update payment status
        await prisma.payment.update({
          where: { id: payment.id },
          data: {
            status: newStatus,
            mbWayStatus: data.status,
            processorData: data as any,
            succeededAt: newStatus === 'SUCCESS' ? new Date() : undefined,
            failedAt: newStatus === 'FAILED' ? new Date() : undefined,
            updatedAt: new Date(),
          },
        });

        // Store webhook record
        await prisma.paymentWebhook.create({
          data: {
            paymentId: payment.id,
            type: 'STATUS_UPDATE',
            status: data.status,
            data: data as any,
            processedAt: new Date(),
          },
        });

        // Handle status-specific actions
        if (newStatus === 'SUCCESS') {
          await this.handlePaymentSuccess(payment.orderId);
        } else if (newStatus === 'FAILED' || newStatus === 'CANCELLED') {
          await this.handlePaymentFailure(payment.orderId, new Error(data.status));
        }

        // Mark webhook as processed
        await this.redis.set(
          `webhook:processed:${data.transactionId}:${data.timestamp}`,
          'true',
          86400 // 24 hours
        );

        // Send real-time update via WebSocket
        this.broadcastPaymentUpdate(payment.orderId, newStatus);

      } finally {
        // Release lock
        await this.redis.releaseLock(`webhook:lock:${data.transactionId}`);
      }

    } catch (error) {
      logger.error('Webhook processing failed:', error);
      throw error;
    }
  }

  /**
   * Cancel MB Way payment
   */
  async cancelPayment(transactionId: string, reason: string): Promise<boolean> {
    try {
      const response = await this.client.post(`/payments/${transactionId}/cancel`, {
        reason,
        timestamp: new Date().toISOString(),
      });

      if (response.data.success) {
        await prisma.payment.update({
          where: { transactionId },
          data: {
            status: 'CANCELLED',
            failureReason: reason,
            failedAt: new Date(),
          },
        });

        return true;
      }

      return false;
    } catch (error) {
      logger.error('Failed to cancel payment:', error);
      return false;
    }
  }

  /**
   * Start monitoring payment status
   */
  private startPaymentMonitoring(transactionId: string, orderId: string): void {
    const checkInterval = 5000; // 5 seconds
    const maxChecks = Math.floor(this.timeout / checkInterval);
    let checks = 0;

    const monitor = setInterval(async () => {
      checks++;
      
      try {
        const status = await this.verifyPaymentStatus(transactionId);
        
        if (status === 'SUCCESS' || status === 'FAILED' || status === 'CANCELLED') {
          clearInterval(monitor);
          logger.info('Payment monitoring completed', { transactionId, status });
        } else if (checks >= maxChecks) {
          clearInterval(monitor);
          logger.warn('Payment monitoring timeout', { transactionId });
          await this.handlePaymentTimeout(orderId);
        }
      } catch (error) {
        logger.error('Payment monitoring error:', error);
      }
    }, checkInterval);
  }

  /**
   * Handle successful payment
   */
  private async handlePaymentSuccess(orderId: string): Promise<void> {
    try {
      // Update order status
      const order = await prisma.order.update({
        where: { id: orderId },
        data: {
          status: 'CONFIRMED',
          paymentStatus: 'SUCCESS',
          paidAt: new Date(),
        },
        include: {
          user: true,
          event: true,
          items: {
            include: {
              ticketType: true,
            },
          },
        },
      });

      // Generate tickets
      const tickets = [];
      for (const item of order.items) {
        for (let i = 0; i < item.quantity; i++) {
          const ticketNumber = this.generateTicketNumber();
          const qrCode = await this.generateQRCode(ticketNumber);
          
          tickets.push({
            ticketNumber,
            orderId: order.id,
            userId: order.userId,
            eventId: order.eventId,
            ticketTypeId: item.ticketTypeId,
            qrCode: qrCode.code,
            qrCodeUrl: qrCode.url,
            holderName: `${order.user.firstName} ${order.user.lastName}`,
            holderEmail: order.user.email,
            holderPhone: order.user.phone,
          });
        }
      }

      // Bulk create tickets
      await prisma.ticket.createMany({ data: tickets });

      // Update ticket type sold count
      for (const item of order.items) {
        await prisma.ticketType.update({
          where: { id: item.ticketTypeId },
          data: {
            sold: { increment: item.quantity },
          },
        });
      }

      // Update event capacity
      await prisma.event.update({
        where: { id: order.eventId },
        data: {
          currentCapacity: { increment: tickets.length },
        },
      });

      // Send confirmation email
      await this.notification.sendOrderConfirmation(order);

      // Send SMS with tickets
      await this.notification.sendTicketsSMS(order.user.phone, tickets);

      // Log success
      await this.audit.log({
        action: 'PAYMENT_SUCCESS',
        entity: 'Order',
        entityId: orderId,
        data: { ticketsGenerated: tickets.length },
      });

    } catch (error) {
      logger.error('Failed to handle payment success:', error);
      throw error;
    }
  }

  /**
   * Handle payment failure
   */
  private async handlePaymentFailure(orderId: string, error: Error): Promise<void> {
    try {
      await prisma.order.update({
        where: { id: orderId },
        data: {
          status: 'CANCELLED',
          paymentStatus: 'FAILED',
        },
      });

      // Send failure notification
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: { user: true },
      });

      if (order) {
        await this.notification.sendPaymentFailure(order.user, error.message);
      }

      // Log failure
      await this.audit.log({
        action: 'PAYMENT_FAILED',
        entity: 'Order',
        entityId: orderId,
        data: { error: error.message },
      });

    } catch (err) {
      logger.error('Failed to handle payment failure:', err);
    }
  }

  /**
   * Handle payment timeout
   */
  private async handlePaymentTimeout(orderId: string): Promise<void> {
    try {
      await prisma.order.update({
        where: { id: orderId },
        data: {
          status: 'EXPIRED',
          paymentStatus: 'FAILED',
        },
      });

      logger.info('Payment timeout handled', { orderId });
    } catch (error) {
      logger.error('Failed to handle payment timeout:', error);
    }
  }

  /**
   * Utility functions
   */
  private validatePhoneNumber(phone: string): boolean {
    // Portuguese phone number validation
    const regex = /^(?:\+351)?9[1236]\d{7}$/;
    return regex.test(phone.replace(/\s/g, ''));
  }

  private formatPhoneNumber(phone: string): string {
    const cleaned = phone.replace(/\s/g, '');
    if (cleaned.startsWith('+351')) {
      return cleaned.substring(4);
    }
    return cleaned;
  }

  private validateResponse(data: any): boolean {
    return data && 
           data.transactionId && 
           data.reference && 
           data.status;
  }

  private generateIdempotencyKey(request: MBWayPaymentRequest): string {
    const data = `${request.orderId}-${request.amount}-${request.phoneNumber}`;
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  private async checkDuplicatePayment(orderId: string): Promise<MBWayPaymentResponse | null> {
    const existing = await prisma.payment.findFirst({
      where: {
        orderId,
        status: { in: ['PENDING', 'PROCESSING', 'SUCCESS'] },
        createdAt: { gte: new Date(Date.now() - this.timeout) },
      },
    });

    if (existing) {
      return {
        success: true,
        transactionId: existing.transactionId,
        reference: existing.mbWayReference || undefined,
        status: existing.status,
      };
    }

    return null;
  }

  private isRetryableError(error: any): boolean {
    const retryableCodes = [408, 429, 500, 502, 503, 504];
    return retryableCodes.includes(error.response?.status) ||
           error.code === 'ECONNRESET' ||
           error.code === 'ETIMEDOUT';
  }

  private calculateBackoffDelay(attempt: number): number {
    return Math.min(this.retryDelay * Math.pow(2, attempt - 1), 30000);
  }

  private mapMBWayStatus(mbwayStatus: string): PaymentStatus {
    const statusMap: Record<string, PaymentStatus> = {
      'PENDING': 'PENDING',
      'PROCESSING': 'PROCESSING',
      'APPROVED': 'SUCCESS',
      'COMPLETED': 'SUCCESS',
      'REJECTED': 'FAILED',
      'FAILED': 'FAILED',
      'CANCELLED': 'CANCELLED',
      'EXPIRED': 'FAILED',
    };

    return statusMap[mbwayStatus] || 'PENDING';
  }

  private verifyWebhookSignature(data: MBWayWebhookData): boolean {
    const secret = process.env.MBWAY_WEBHOOK_SECRET!;
    const payload = `${data.transactionId}:${data.reference}:${data.amount}:${data.timestamp}`;
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');
    
    return crypto.timingSafeEqual(
      Buffer.from(data.signature),
      Buffer.from(expectedSignature)
    );
  }

  private generateTicketNumber(): string {
    const prefix = 'TKT';
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `${prefix}-${timestamp}-${random}`;
  }

  private async generateQRCode(ticketNumber: string): Promise<{ code: string; url: string }> {
    // Implementation would generate actual QR code
    // For now, returning mock data
    const code = crypto.createHash('sha256').update(ticketNumber).digest('hex');
    const url = `${process.env.API_URL}/qr/${code}`;
    return { code, url };
  }

  private broadcastPaymentUpdate(orderId: string, status: PaymentStatus): void {
    // Broadcast via WebSocket to connected clients
    // Implementation depends on WebSocket setup
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default new MBWayService();