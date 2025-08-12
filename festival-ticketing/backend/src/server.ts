import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import winston from 'winston';

// Import routes
import authRoutes from './routes/auth.routes';
import eventRoutes from './routes/event.routes';
import ticketRoutes from './routes/ticket.routes';
import paymentRoutes from './routes/payment.routes';
import userRoutes from './routes/user.routes';
import adminRoutes from './routes/admin.routes';
import validationRoutes from './routes/validation.routes';

// Import middleware
import { errorHandler } from './middleware/error.middleware';
import { authMiddleware } from './middleware/auth.middleware';
import { loggingMiddleware } from './middleware/logging.middleware';
import { cacheMiddleware } from './middleware/cache.middleware';

// Import services
import { RedisService } from './services/redis.service';
import { MonitoringService } from './services/monitoring.service';
import { BackupService } from './services/backup.service';

// Load environment variables
dotenv.config();

// Initialize Prisma
export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  errorFormat: 'minimal',
});

// Initialize Winston Logger
export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'festival-ticketing-api' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ],
});

// Initialize Express app
const app: Application = express();
const PORT = process.env.PORT || 3000;

// Initialize HTTP server and WebSocket
const server = createServer(app);
const wss = new WebSocketServer({ server });

// Initialize services
const redisService = new RedisService();
const monitoringService = new MonitoringService();
const backupService = new BackupService();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
}));

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? [process.env.APP_URL!, process.env.ADMIN_URL!]
    : true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID'],
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: process.env.MAX_REQUESTS_PER_MINUTE ? parseInt(process.env.MAX_REQUESTS_PER_MINUTE) : 100,
  message: 'Demasiados pedidos, por favor tente novamente mais tarde.',
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn(`Rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      error: 'Rate limit exceeded',
      message: 'Demasiados pedidos, por favor tente novamente mais tarde.',
      retryAfter: 60,
    });
  },
});

// Apply rate limiting to all routes
if (process.env.ENABLE_RATE_LIMITING === 'true') {
  app.use('/api/', limiter);
}

// Strict rate limiting for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  skipSuccessfulRequests: true,
});

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Custom middleware
app.use(loggingMiddleware);

// Health check endpoint
app.get('/health', async (req: Request, res: Response) => {
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`;
    
    // Check Redis connection
    const redisHealthy = await redisService.ping();
    
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      services: {
        database: 'connected',
        redis: redisHealthy ? 'connected' : 'disconnected',
        monitoring: monitoringService.isHealthy() ? 'active' : 'inactive',
      },
      version: process.env.npm_package_version || '1.0.0',
    });
  } catch (error) {
    logger.error('Health check failed:', error);
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Service unavailable',
    });
  }
});

// API Routes
app.use('/api/v1/auth', authLimiter, authRoutes);
app.use('/api/v1/events', cacheMiddleware(300), eventRoutes);
app.use('/api/v1/tickets', authMiddleware, ticketRoutes);
app.use('/api/v1/payments', authMiddleware, paymentRoutes);
app.use('/api/v1/users', authMiddleware, userRoutes);
app.use('/api/v1/admin', authMiddleware, adminRoutes);
app.use('/api/v1/validate', validationRoutes);

// WebSocket connections for real-time updates
wss.on('connection', (ws, req) => {
  logger.info('New WebSocket connection established');
  
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message.toString());
      // Handle real-time ticket validation, live updates, etc.
      handleWebSocketMessage(ws, data);
    } catch (error) {
      logger.error('WebSocket message error:', error);
      ws.send(JSON.stringify({ error: 'Invalid message format' }));
    }
  });
  
  ws.on('close', () => {
    logger.info('WebSocket connection closed');
  });
  
  ws.on('error', (error) => {
    logger.error('WebSocket error:', error);
  });
});

// Handle WebSocket messages
function handleWebSocketMessage(ws: any, data: any) {
  switch (data.type) {
    case 'subscribe_event':
      // Subscribe to event updates
      ws.eventId = data.eventId;
      ws.send(JSON.stringify({ type: 'subscribed', eventId: data.eventId }));
      break;
    case 'ticket_validation':
      // Real-time ticket validation
      // Implementation would go here
      break;
    default:
      ws.send(JSON.stringify({ error: 'Unknown message type' }));
  }
}

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'O endpoint solicitado não existe',
    path: req.path,
  });
});

// Global error handler
app.use(errorHandler);

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  server.close(async () => {
    logger.info('HTTP server closed');
    
    // Close database connections
    await prisma.$disconnect();
    
    // Close Redis connections
    await redisService.disconnect();
    
    // Stop monitoring service
    monitoringService.stop();
    
    // Final backup before shutdown
    if (process.env.BACKUP_ENABLED === 'true') {
      await backupService.performBackup();
    }
    
    process.exit(0);
  });
});

// Unhandled rejection handler
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Send alert to monitoring service
  monitoringService.sendAlert('critical', 'Unhandled rejection detected', { reason });
});

// Uncaught exception handler
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  // Send alert to monitoring service
  monitoringService.sendAlert('critical', 'Uncaught exception detected', { error: error.message });
  
  // Graceful shutdown
  server.close(() => {
    process.exit(1);
  });
});

// Start server
async function startServer() {
  try {
    // Test database connection
    await prisma.$connect();
    logger.info('Database connected successfully');
    
    // Initialize Redis
    await redisService.connect();
    logger.info('Redis connected successfully');
    
    // Start monitoring
    monitoringService.start();
    logger.info('Monitoring service started');
    
    // Start backup service
    if (process.env.BACKUP_ENABLED === 'true') {
      backupService.start();
      logger.info('Backup service started');
    }
    
    // Start HTTP server
    server.listen(PORT, () => {
      logger.info(`🚀 Server running on port ${PORT}`);
      logger.info(`📍 Environment: ${process.env.NODE_ENV}`);
      logger.info(`🔒 Security features: enabled`);
      logger.info(`💾 Database: connected`);
      logger.info(`🔄 Redis cache: ${redisService.isConnected() ? 'connected' : 'disconnected'}`);
      logger.info(`📊 Monitoring: ${monitoringService.isHealthy() ? 'active' : 'inactive'}`);
      logger.info(`💼 Backup service: ${process.env.BACKUP_ENABLED === 'true' ? 'active' : 'inactive'}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Start the server
startServer();

export { app, server, wss };