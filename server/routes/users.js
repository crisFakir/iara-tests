const express = require('express');
const router = express.Router();

// Dados mockados para utilizadores
let users = [];

// POST - Registar novo utilizador
router.post('/register', (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({ 
        success: false, 
        error: 'Todos os campos obrigatórios devem ser preenchidos' 
      });
    }

    // Verificar se email já existe
    if (users.find(u => u.email === email)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Email já registado' 
      });
    }

    // Validar formato do email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Formato de email inválido' 
      });
    }

    // Validar formato do telefone português
    const phoneRegex = /^(\+351|00351|351)?[9][1236]\d{7}$/;
    if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
      return res.status(400).json({ 
        success: false, 
        error: 'Número de telefone inválido' 
      });
    }

    const newUser = {
      id: Date.now().toString(),
      name,
      email: email.toLowerCase(),
      phone: phone.replace(/\s/g, ''),
      password: password, // Em produção, usar bcrypt para hash
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isActive: true,
      preferences: {
        notifications: true,
        marketing: false
      }
    };

    users.push(newUser);

    // Remover password da resposta
    const { password: _, ...userResponse } = newUser;

    res.status(201).json({
      success: true,
      data: userResponse,
      message: 'Utilizador registado com sucesso'
    });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST - Login de utilizador
router.post('/login', (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        error: 'Email e password são obrigatórios' 
      });
    }

    const user = users.find(u => u.email === email.toLowerCase());

    if (!user || user.password !== password) {
      return res.status(401).json({ 
        success: false, 
        error: 'Credenciais inválidas' 
      });
    }

    if (!user.isActive) {
      return res.status(403).json({ 
        success: false, 
        error: 'Conta desativada' 
      });
    }

    // Em produção, gerar JWT token aqui
    const token = `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Remover password da resposta
    const { password: _, ...userResponse } = user;

    res.json({
      success: true,
      data: {
        user: userResponse,
        token
      },
      message: 'Login realizado com sucesso'
    });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET - Obter perfil do utilizador
router.get('/profile/:id', (req, res) => {
  try {
    const user = users.find(u => u.id === req.params.id);
    
    if (!user) {
      return res.status(404).json({ success: false, error: 'Utilizador não encontrado' });
    }

    // Remover password da resposta
    const { password: _, ...userResponse } = user;

    res.json({ success: true, data: userResponse });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT - Atualizar perfil do utilizador
router.put('/profile/:id', (req, res) => {
  try {
    const userIndex = users.findIndex(u => u.id === req.params.id);
    
    if (userIndex === -1) {
      return res.status(404).json({ success: false, error: 'Utilizador não encontrado' });
    }

    const { name, phone, preferences } = req.body;
    const updatedUser = { ...users[userIndex] };

    if (name) updatedUser.name = name;
    if (phone) {
      // Validar formato do telefone
      const phoneRegex = /^(\+351|00351|351)?[9][1236]\d{7}$/;
      if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
        return res.status(400).json({ 
          success: false, 
          error: 'Número de telefone inválido' 
        });
      }
      updatedUser.phone = phone.replace(/\s/g, '');
    }
    if (preferences) updatedUser.preferences = { ...updatedUser.preferences, ...preferences };

    updatedUser.updatedAt = new Date().toISOString();
    users[userIndex] = updatedUser;

    // Remover password da resposta
    const { password: _, ...userResponse } = updatedUser;

    res.json({
      success: true,
      data: userResponse,
      message: 'Perfil atualizado com sucesso'
    });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT - Alterar password
router.put('/profile/:id/password', (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userIndex = users.findIndex(u => u.id === req.params.id);
    
    if (userIndex === -1) {
      return res.status(404).json({ success: false, error: 'Utilizador não encontrado' });
    }

    if (users[userIndex].password !== currentPassword) {
      return res.status(400).json({ 
        success: false, 
        error: 'Password atual incorreta' 
      });
    }

    users[userIndex].password = newPassword;
    users[userIndex].updatedAt = new Date().toISOString();

    res.json({
      success: true,
      message: 'Password alterada com sucesso'
    });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE - Desativar conta
router.delete('/profile/:id', (req, res) => {
  try {
    const userIndex = users.findIndex(u => u.id === req.params.id);
    
    if (userIndex === -1) {
      return res.status(404).json({ success: false, error: 'Utilizador não encontrado' });
    }

    users[userIndex].isActive = false;
    users[userIndex].updatedAt = new Date().toISOString();

    res.json({
      success: true,
      message: 'Conta desativada com sucesso'
    });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET - Listar todos os utilizadores (admin)
router.get('/', (req, res) => {
  try {
    const { limit = 50, active } = req.query;
    let filteredUsers = [...users];

    if (active !== undefined) {
      filteredUsers = filteredUsers.filter(u => u.isActive === (active === 'true'));
    }

    // Limitar resultados
    filteredUsers = filteredUsers.slice(0, parseInt(limit));

    // Remover passwords das respostas
    const usersResponse = filteredUsers.map(u => {
      const { password: _, ...userResponse } = u;
      return userResponse;
    });

    res.json({
      success: true,
      data: usersResponse,
      total: usersResponse.length
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;