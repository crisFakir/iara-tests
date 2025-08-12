const express = require('express');
const router = express.Router();

// Dados mockados para demonstração
let festivals = [
  {
    id: '1',
    name: 'Rock in Rio Lisboa 2024',
    description: 'O maior festival de rock de Portugal',
    location: 'Parque da Bela Vista, Lisboa',
    startDate: '2024-06-15',
    endDate: '2024-06-16',
    image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800',
    price: 89.99,
    capacity: 50000,
    availableTickets: 45000,
    category: 'Rock',
    lineup: ['Metallica', 'Foo Fighters', 'Red Hot Chili Peppers', 'The Killers'],
    status: 'active'
  },
  {
    id: '2',
    name: 'NOS Alive 2024',
    description: 'Festival de música alternativa e indie',
    location: 'Passeio Marítimo de Algés, Oeiras',
    startDate: '2024-07-11',
    endDate: '2024-07-13',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800',
    price: 75.00,
    capacity: 35000,
    availableTickets: 32000,
    category: 'Alternative',
    lineup: ['Arctic Monkeys', 'The Strokes', 'Tame Impala', 'Vampire Weekend'],
    status: 'active'
  },
  {
    id: '3',
    name: 'Super Bock Super Rock 2024',
    description: 'Festival de rock e música eletrónica',
    location: 'Meco, Sesimbra',
    startDate: '2024-07-18',
    endDate: '2024-07-20',
    image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800',
    price: 65.00,
    capacity: 25000,
    availableTickets: 22000,
    category: 'Rock/Electronic',
    lineup: ['Queens of the Stone Age', 'The Chemical Brothers', 'Royal Blood', 'Bombay Bicycle Club'],
    status: 'active'
  }
];

// GET - Listar todos os festivais
router.get('/', (req, res) => {
  try {
    const { category, status, search } = req.query;
    let filteredFestivals = [...festivals];

    if (category) {
      filteredFestivals = filteredFestivals.filter(f => f.category === category);
    }

    if (status) {
      filteredFestivals = filteredFestivals.filter(f => f.status === status);
    }

    if (search) {
      filteredFestivals = filteredFestivals.filter(f => 
        f.name.toLowerCase().includes(search.toLowerCase()) ||
        f.description.toLowerCase().includes(search.toLowerCase()) ||
        f.location.toLowerCase().includes(search.toLowerCase())
      );
    }

    res.json({
      success: true,
      data: filteredFestivals,
      total: filteredFestivals.length
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET - Obter festival por ID
router.get('/:id', (req, res) => {
  try {
    const festival = festivals.find(f => f.id === req.params.id);
    
    if (!festival) {
      return res.status(404).json({ success: false, error: 'Festival não encontrado' });
    }

    res.json({ success: true, data: festival });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST - Criar novo festival
router.post('/', (req, res) => {
  try {
    const { name, description, location, startDate, endDate, price, capacity, category, lineup } = req.body;

    if (!name || !description || !location || !startDate || !endDate || !price || !capacity) {
      return res.status(400).json({ success: false, error: 'Todos os campos obrigatórios devem ser preenchidos' });
    }

    const newFestival = {
      id: Date.now().toString(),
      name,
      description,
      location,
      startDate,
      endDate,
      image: req.body.image || 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800',
      price: parseFloat(price),
      capacity: parseInt(capacity),
      availableTickets: parseInt(capacity),
      category: category || 'General',
      lineup: lineup || [],
      status: 'active',
      createdAt: new Date().toISOString()
    };

    festivals.push(newFestival);

    res.status(201).json({ success: true, data: newFestival });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT - Atualizar festival
router.put('/:id', (req, res) => {
  try {
    const festivalIndex = festivals.findIndex(f => f.id === req.params.id);
    
    if (festivalIndex === -1) {
      return res.status(404).json({ success: false, error: 'Festival não encontrado' });
    }

    const updatedFestival = { ...festivals[festivalIndex], ...req.body, updatedAt: new Date().toISOString() };
    festivals[festivalIndex] = updatedFestival;

    res.json({ success: true, data: updatedFestival });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE - Remover festival
router.delete('/:id', (req, res) => {
  try {
    const festivalIndex = festivals.findIndex(f => f.id === req.params.id);
    
    if (festivalIndex === -1) {
      return res.status(404).json({ success: false, error: 'Festival não encontrado' });
    }

    festivals.splice(festivalIndex, 1);

    res.json({ success: true, message: 'Festival removido com sucesso' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;