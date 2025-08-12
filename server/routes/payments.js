const express = require('express');
const router = express.Router();

// Simulação de pagamentos MB WAY
let payments = [];

// POST - Processar pagamento MB WAY
router.post('/mbway', async (req, res) => {
  try {
    const { phoneNumber, amount, ticketId, festivalId, userName, userEmail } = req.body;

    if (!phoneNumber || !amount || !ticketId || !festivalId || !userName || !userEmail) {
      return res.status(400).json({ 
        success: false, 
        error: 'Todos os campos obrigatórios devem ser preenchidos' 
      });
    }

    // Validar formato do número de telefone português
    const phoneRegex = /^(\+351|00351|351)?[9][1236]\d{7}$/;
    if (!phoneRegex.test(phoneNumber.replace(/\s/g, ''))) {
      return res.status(400).json({ 
        success: false, 
        error: 'Número de telefone inválido. Deve ser um número português válido.' 
      });
    }

    // Simular processamento do pagamento
    const paymentId = `MB_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Simular diferentes estados de pagamento (80% sucesso, 20% falha)
    const isSuccess = Math.random() > 0.2;
    
    const payment = {
      id: paymentId,
      phoneNumber: phoneNumber.replace(/\s/g, ''),
      amount: parseFloat(amount),
      ticketId,
      festivalId,
      userName,
      userEmail,
      method: 'MB WAY',
      status: isSuccess ? 'completed' : 'failed',
      transactionId: isSuccess ? `TXN_${Date.now()}` : null,
      createdAt: new Date().toISOString(),
      completedAt: isSuccess ? new Date().toISOString() : null,
      errorMessage: isSuccess ? null : 'Pagamento rejeitado pelo banco'
    };

    payments.push(payment);

    // Simular delay de processamento
    await new Promise(resolve => setTimeout(resolve, 2000));

    if (isSuccess) {
      res.json({
        success: true,
        data: {
          paymentId: payment.id,
          transactionId: payment.transactionId,
          status: 'completed',
          message: 'Pagamento processado com sucesso via MB WAY!',
          amount: payment.amount,
          completedAt: payment.completedAt
        }
      });
    } else {
      res.status(400).json({
        success: false,
        error: 'Pagamento falhou',
        details: payment.errorMessage,
        paymentId: payment.id
      });
    }

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET - Obter histórico de pagamentos
router.get('/history', (req, res) => {
  try {
    const { status, method, limit = 50 } = req.query;
    let filteredPayments = [...payments];

    if (status) {
      filteredPayments = filteredPayments.filter(p => p.status === status);
    }

    if (method) {
      filteredPayments = filteredPayments.filter(p => p.method === method);
    }

    // Ordenar por data mais recente
    filteredPayments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Limitar resultados
    filteredPayments = filteredPayments.slice(0, parseInt(limit));

    res.json({
      success: true,
      data: filteredPayments,
      total: filteredPayments.length
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET - Obter pagamento por ID
router.get('/:id', (req, res) => {
  try {
    const payment = payments.find(p => p.id === req.params.id);
    
    if (!payment) {
      return res.status(404).json({ success: false, error: 'Pagamento não encontrado' });
    }

    res.json({ success: true, data: payment });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST - Reembolso
router.post('/:id/refund', async (req, res) => {
  try {
    const payment = payments.find(p => p.id === req.params.id);
    
    if (!payment) {
      return res.status(404).json({ success: false, error: 'Pagamento não encontrado' });
    }

    if (payment.status !== 'completed') {
      return res.status(400).json({ success: false, error: 'Apenas pagamentos completados podem ser reembolsados' });
    }

    // Simular processamento do reembolso
    await new Promise(resolve => setTimeout(resolve, 1500));

    payment.status = 'refunded';
    payment.refundedAt = new Date().toISOString();
    payment.refundAmount = payment.amount;

    res.json({
      success: true,
      data: {
        paymentId: payment.id,
        status: 'refunded',
        message: 'Reembolso processado com sucesso',
        refundAmount: payment.refundAmount,
        refundedAt: payment.refundedAt
      }
    });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET - Estatísticas de pagamentos
router.get('/stats/overview', (req, res) => {
  try {
    const totalPayments = payments.length;
    const completedPayments = payments.filter(p => p.status === 'completed').length;
    const failedPayments = payments.filter(p => p.status === 'failed').length;
    const refundedPayments = payments.filter(p => p.status === 'refunded').length;
    
    const totalAmount = payments
      .filter(p => p.status === 'completed')
      .reduce((sum, p) => sum + p.amount, 0);

    const mbwayPayments = payments.filter(p => p.method === 'MB WAY').length;

    res.json({
      success: true,
      data: {
        totalPayments,
        completedPayments,
        failedPayments,
        refundedPayments,
        totalAmount: parseFloat(totalAmount.toFixed(2)),
        mbwayPayments,
        successRate: totalPayments > 0 ? ((completedPayments / totalPayments) * 100).toFixed(2) : 0
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;