const express = require('express');
const router = express.Router();

// Dados mockados para bilhetes
let tickets = [];
let ticketCounter = 1;

// POST - Reservar bilhete
router.post('/reserve', async (req, res) => {
  try {
    const { festivalId, userName, userEmail, userPhone, quantity = 1 } = req.body;

    if (!festivalId || !userName || !userEmail || !userPhone) {
      return res.status(400).json({ 
        success: false, 
        error: 'Todos os campos obrigatórios devem ser preenchidos' 
      });
    }

    // Simular verificação de disponibilidade
    const festival = require('./festivals').getFestivalById ? 
      require('./festivals').getFestivalById(festivalId) : 
      { availableTickets: 1000, price: 75.00 };

    if (festival.availableTickets < quantity) {
      return res.status(400).json({ 
        success: false, 
        error: 'Quantidade solicitada não disponível' 
      });
    }

    // Criar bilhetes
    const newTickets = [];
    for (let i = 0; i < quantity; i++) {
      const ticket = {
        id: `TKT_${ticketCounter++}`,
        festivalId,
        userName,
        userEmail,
        userPhone,
        status: 'reserved',
        price: festival.price,
        reservedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutos para pagar
        ticketCode: `TKT_${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        qrCode: `QR_${Math.random().toString(36).substr(2, 12).toUpperCase()}`
      };
      newTickets.push(ticket);
      tickets.push(ticket);
    }

    // Atualizar disponibilidade do festival
    if (festival.availableTickets !== undefined) {
      festival.availableTickets -= quantity;
    }

    res.status(201).json({
      success: true,
      data: {
        tickets: newTickets,
        totalAmount: newTickets.reduce((sum, t) => sum + t.price, 0),
        expiresAt: newTickets[0].expiresAt,
        message: `${quantity} bilhete(s) reservado(s) com sucesso. Tem 15 minutos para completar o pagamento.`
      }
    });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST - Confirmar bilhete após pagamento
router.post('/:ticketId/confirm', async (req, res) => {
  try {
    const { paymentId, transactionId } = req.body;
    const ticket = tickets.find(t => t.id === req.params.ticketId);

    if (!ticket) {
      return res.status(404).json({ success: false, error: 'Bilhete não encontrado' });
    }

    if (ticket.status !== 'reserved') {
      return res.status(400).json({ success: false, error: 'Bilhete não está reservado' });
    }

    // Verificar se não expirou
    if (new Date() > new Date(ticket.expiresAt)) {
      ticket.status = 'expired';
      return res.status(400).json({ success: false, error: 'Reserva expirou' });
    }

    // Confirmar bilhete
    ticket.status = 'confirmed';
    ticket.paymentId = paymentId;
    ticket.transactionId = transactionId;
    ticket.confirmedAt = new Date().toISOString();
    ticket.expiresAt = null; // Remover expiração

    res.json({
      success: true,
      data: {
        ticketId: ticket.id,
        status: 'confirmed',
        message: 'Bilhete confirmado com sucesso!',
        ticketCode: ticket.ticketCode,
        qrCode: ticket.qrCode
      }
    });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET - Obter bilhete por ID
router.get('/:ticketId', (req, res) => {
  try {
    const ticket = tickets.find(t => t.id === req.params.ticketId);
    
    if (!ticket) {
      return res.status(404).json({ success: false, error: 'Bilhete não encontrado' });
    }

    res.json({ success: true, data: ticket });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET - Listar bilhetes por utilizador
router.get('/user/:email', (req, res) => {
  try {
    const userTickets = tickets.filter(t => t.userEmail === req.params.email);
    
    res.json({
      success: true,
      data: userTickets,
      total: userTickets.length
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET - Listar bilhetes por festival
router.get('/festival/:festivalId', (req, res) => {
  try {
    const festivalTickets = tickets.filter(t => t.festivalId === req.params.festivalId);
    
    res.json({
      success: true,
      data: festivalTickets,
      total: festivalTickets.length
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT - Cancelar bilhete
router.put('/:ticketId/cancel', async (req, res) => {
  try {
    const ticket = tickets.find(t => t.id === req.params.ticketId);
    
    if (!ticket) {
      return res.status(404).json({ success: false, error: 'Bilhete não encontrado' });
    }

    if (ticket.status === 'confirmed') {
      return res.status(400).json({ success: false, error: 'Bilhetes confirmados não podem ser cancelados' });
    }

    ticket.status = 'cancelled';
    ticket.cancelledAt = new Date().toISOString();

    // Devolver bilhete à disponibilidade do festival
    // (implementar lógica de devolução)

    res.json({
      success: true,
      data: {
        ticketId: ticket.id,
        status: 'cancelled',
        message: 'Bilhete cancelado com sucesso'
      }
    });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET - Estatísticas de bilhetes
router.get('/stats/overview', (req, res) => {
  try {
    const totalTickets = tickets.length;
    const reservedTickets = tickets.filter(t => t.status === 'reserved').length;
    const confirmedTickets = tickets.filter(t => t.status === 'confirmed').length;
    const cancelledTickets = tickets.filter(t => t.status === 'cancelled').length;
    const expiredTickets = tickets.filter(t => t.status === 'expired').length;

    const totalRevenue = tickets
      .filter(t => t.status === 'confirmed')
      .reduce((sum, t) => sum + t.price, 0);

    res.json({
      success: true,
      data: {
        totalTickets,
        reservedTickets,
        confirmedTickets,
        cancelledTickets,
        expiredTickets,
        totalRevenue: parseFloat(totalRevenue.toFixed(2)),
        conversionRate: totalTickets > 0 ? ((confirmedTickets / totalTickets) * 100).toFixed(2) : 0
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Função auxiliar para obter festival por ID
function getFestivalById(id) {
  // Esta função seria implementada para aceder aos dados dos festivais
  return null;
}

module.exports = router;