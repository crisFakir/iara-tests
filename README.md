# 🎵 Festival Tickets - Sistema de Bilhetes com MB WAY

Um sistema completo de venda de bilhetes para festivais com integração de pagamentos MB WAY, inspirado na Weezevent.

## ✨ Funcionalidades

- 🎫 **Gestão de Festivais**: CRUD completo de festivais com imagens e informações detalhadas
- 💳 **Pagamentos MB WAY**: Sistema de pagamento seguro via telemóvel português
- 👤 **Sistema de Utilizadores**: Registo, login e gestão de perfis
- 🎟️ **Reserva de Bilhetes**: Sistema de reserva com expiração automática
- 📱 **Interface Responsiva**: Design moderno e adaptável a todos os dispositivos
- 🔒 **Autenticação Segura**: Sistema de tokens e rotas protegidas
- 📊 **Dashboard**: Área de gestão para utilizadores e administradores

## 🚀 Tecnologias Utilizadas

### Backend
- **Node.js** com **Express.js**
- **RESTful API** com validação de dados
- **Rate limiting** e **Helmet** para segurança
- **CORS** configurado para desenvolvimento

### Frontend
- **React 18** com **React Router**
- **Styled Components** para estilização
- **Framer Motion** para animações
- **React Hook Form** para formulários
- **React Hot Toast** para notificações

### Pagamentos
- **Simulação MB WAY** com validação de números portugueses
- **Processamento assíncrono** de pagamentos
- **Sistema de reembolsos** integrado

## 📋 Pré-requisitos

- **Node.js** 16+ 
- **npm** ou **yarn**
- **Git**

## 🛠️ Instalação

### 1. Clonar o Repositório

```bash
git clone <url-do-repositorio>
cd festival-tickets-mbway
```

### 2. Instalar Dependências

```bash
# Instalar todas as dependências (backend + frontend)
npm run install-all

# Ou instalar separadamente:
npm install                    # Dependências principais
cd server && npm install      # Dependências do backend
cd ../client && npm install   # Dependências do frontend
```

### 3. Configuração

Criar ficheiro `.env` na pasta `server/`:

```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

## 🚀 Execução

### Desenvolvimento (Backend + Frontend)

```bash
# Executar ambos simultaneamente
npm run dev

# Ou executar separadamente:
npm run server    # Backend na porta 5000
npm run client    # Frontend na porta 3000
```

### Produção

```bash
# Construir frontend
npm run build

# Executar apenas backend
npm start
```

## 🌐 Endpoints da API

### Festivais
- `GET /api/festivals` - Listar todos os festivais
- `GET /api/festivals/:id` - Obter festival específico
- `POST /api/festivals` - Criar novo festival
- `PUT /api/festivals/:id` - Atualizar festival
- `DELETE /api/festivals/:id` - Remover festival

### Utilizadores
- `POST /api/users/register` - Registar utilizador
- `POST /api/users/login` - Login de utilizador
- `GET /api/users/profile/:id` - Obter perfil
- `PUT /api/users/profile/:id` - Atualizar perfil

### Bilhetes
- `POST /api/tickets/reserve` - Reservar bilhete
- `POST /api/tickets/:id/confirm` - Confirmar bilhete
- `GET /api/tickets/user/:email` - Bilhetes do utilizador

### Pagamentos
- `POST /api/payments/mbway` - Processar pagamento MB WAY
- `GET /api/payments/history` - Histórico de pagamentos
- `POST /api/payments/:id/refund` - Processar reembolso

## 📱 Funcionalidades MB WAY

### Validação de Números
- Aceita números portugueses: `912345678`, `+351912345678`, `00351912345678`
- Validação de formato: deve começar com 9 e ter 9 dígitos

### Processamento
- Simulação de processamento com delay de 2 segundos
- Taxa de sucesso de 80% (para demonstração)
- Geração automática de IDs de transação

## 🎨 Estrutura do Projeto

```
festival-tickets-mbway/
├── server/                 # Backend Node.js
│   ├── routes/            # Rotas da API
│   ├── index.js           # Servidor principal
│   └── package.json       # Dependências do backend
├── client/                 # Frontend React
│   ├── src/
│   │   ├── components/    # Componentes reutilizáveis
│   │   ├── pages/         # Páginas da aplicação
│   │   ├── contexts/      # Contextos React
│   │   └── App.js         # Componente principal
│   └── package.json       # Dependências do frontend
├── package.json            # Scripts principais
└── README.md              # Este ficheiro
```

## 🔧 Scripts Disponíveis

```bash
npm run dev          # Executar em desenvolvimento
npm run server       # Executar apenas backend
npm run client       # Executar apenas frontend
npm run build        # Construir frontend para produção
npm run install-all  # Instalar todas as dependências
```

## 🌟 Características Destacadas

### Design Moderno
- Interface inspirada em aplicações modernas
- Gradientes e sombras para profundidade
- Animações suaves com Framer Motion
- Totalmente responsivo

### Segurança
- Validação de dados no frontend e backend
- Rate limiting para prevenir abusos
- Headers de segurança com Helmet
- Validação de números de telefone portugueses

### Experiência do Utilizador
- Feedback visual em tempo real
- Notificações toast para ações
- Estados de loading e erro
- Navegação intuitiva

## 🚧 Funcionalidades Futuras

- [ ] Integração real com MB WAY
- [ ] Sistema de notificações push
- [ ] QR codes para validação de bilhetes
- [ ] Sistema de afiliados
- [ ] Relatórios avançados
- [ ] App móvel nativo

## 🤝 Contribuição

1. Fork o projeto
2. Cria uma branch para a tua feature (`git checkout -b feature/AmazingFeature`)
3. Commit as tuas alterações (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abre um Pull Request

## 📄 Licença

Este projeto está licenciado sob a licença MIT - vê o ficheiro [LICENSE](LICENSE) para detalhes.

## 📞 Suporte

Para questões ou suporte:
- Abre uma issue no GitHub
- Contacta a equipa de desenvolvimento

---

**Desenvolvido com ❤️ para a comunidade de festivais portuguesa**