import React from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Grid, 
  Card, 
  CardContent,
  CardMedia,
  Chip,
  Stack,
  Paper,
  IconButton
} from '@mui/material';
import { 
  ConfirmationNumber, 
  Security, 
  Speed, 
  PhoneIphone,
  ArrowForward,
  Star,
  CalendarMonth,
  LocationOn,
  Search
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const featuredEvents = [
    {
      id: 1,
      name: 'Summer Music Festival 2024',
      date: '15-17 Julho 2024',
      location: 'Praia de Carcavelos',
      price: 'Desde €45',
      image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400',
      category: 'Festival',
      soldOut: false
    },
    {
      id: 2,
      name: 'Rock in Lisboa',
      date: '22-23 Agosto 2024',
      location: 'Parque das Nações',
      price: 'Desde €65',
      image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400',
      category: 'Concerto',
      soldOut: false
    },
    {
      id: 3,
      name: 'Porto Electronic Nights',
      date: '5-6 Setembro 2024',
      location: 'Pavilhão Rosa Mota',
      price: 'Desde €35',
      image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400',
      category: 'Festival',
      soldOut: true
    }
  ];

  const features = [
    {
      icon: <PhoneIphone sx={{ fontSize: 40 }} />,
      title: 'Pagamento MB Way',
      description: 'Pague de forma rápida e segura com o seu telemóvel'
    },
    {
      icon: <Security sx={{ fontSize: 40 }} />,
      title: '100% Seguro',
      description: 'Transações encriptadas e dados protegidos'
    },
    {
      icon: <Speed sx={{ fontSize: 40 }} />,
      title: 'Bilhetes Instantâneos',
      description: 'Receba os seus bilhetes digitais imediatamente'
    },
    {
      icon: <ConfirmationNumber sx={{ fontSize: 40 }} />,
      title: 'QR Code Digital',
      description: 'Entre nos eventos apenas com o seu telemóvel'
    }
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: { xs: 8, md: 12 },
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Typography variant="h2" component="h1" gutterBottom fontWeight="bold">
                  Bilhetes para os Melhores Festivais
                </Typography>
                <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
                  Compre com MB Way de forma rápida e segura. 
                  Zero complicações, máxima diversão!
                </Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => navigate('/eventos')}
                    sx={{
                      bgcolor: 'white',
                      color: 'primary.main',
                      '&:hover': {
                        bgcolor: 'grey.100'
                      },
                      py: 1.5,
                      px: 4
                    }}
                    endIcon={<ArrowForward />}
                  >
                    Ver Eventos
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() => navigate('/registar')}
                    sx={{
                      borderColor: 'white',
                      color: 'white',
                      '&:hover': {
                        borderColor: 'white',
                        bgcolor: 'rgba(255,255,255,0.1)'
                      },
                      py: 1.5,
                      px: 4
                    }}
                  >
                    Criar Conta
                  </Button>
                </Stack>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Box
                  component="img"
                  src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600"
                  alt="Festival"
                  sx={{
                    width: '100%',
                    borderRadius: 3,
                    boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
                  }}
                />
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Search Bar */}
      <Container maxWidth="lg" sx={{ mt: -4, mb: 6 }}>
        <Paper
          elevation={3}
          sx={{
            p: 3,
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}
        >
          <Search color="action" />
          <input
            type="text"
            placeholder="Pesquisar eventos, artistas ou locais..."
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              fontSize: '16px',
              fontFamily: 'Inter'
            }}
          />
          <Button variant="contained" size="large">
            Pesquisar
          </Button>
        </Paper>
      </Container>

      {/* Featured Events */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography variant="h3" component="h2" gutterBottom fontWeight="bold" textAlign="center">
          Eventos em Destaque
        </Typography>
        <Typography variant="h6" color="text.secondary" textAlign="center" sx={{ mb: 4 }}>
          Os melhores eventos selecionados para si
        </Typography>
        
        <Grid container spacing={4}>
          {featuredEvents.map((event, index) => (
            <Grid item xs={12} md={4} key={event.id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card
                  sx={{
                    height: '100%',
                    cursor: 'pointer',
                    transition: 'transform 0.3s',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 12px 24px rgba(0,0,0,0.15)'
                    }
                  }}
                  onClick={() => navigate(`/evento/${event.id}`)}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={event.image}
                    alt={event.name}
                  />
                  <CardContent>
                    <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                      <Chip label={event.category} size="small" color="primary" />
                      {event.soldOut && (
                        <Chip label="Esgotado" size="small" color="error" />
                      )}
                    </Stack>
                    <Typography variant="h6" gutterBottom fontWeight="600">
                      {event.name}
                    </Typography>
                    <Stack spacing={1}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CalendarMonth fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">
                          {event.date}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LocationOn fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">
                          {event.location}
                        </Typography>
                      </Box>
                    </Stack>
                    <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
                      {event.price}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate('/eventos')}
            endIcon={<ArrowForward />}
          >
            Ver Todos os Eventos
          </Button>
        </Box>
      </Container>

      {/* Features Section */}
      <Box sx={{ bgcolor: 'grey.50', py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" component="h2" gutterBottom fontWeight="bold" textAlign="center">
            Porquê Escolher-nos?
          </Typography>
          <Typography variant="h6" color="text.secondary" textAlign="center" sx={{ mb: 6 }}>
            A forma mais segura e rápida de comprar bilhetes
          </Typography>
          
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Paper
                    sx={{
                      p: 3,
                      textAlign: 'center',
                      height: '100%',
                      transition: 'transform 0.3s',
                      '&:hover': {
                        transform: 'translateY(-4px)'
                      }
                    }}
                  >
                    <Box sx={{ color: 'primary.main', mb: 2 }}>
                      {feature.icon}
                    </Box>
                    <Typography variant="h6" gutterBottom fontWeight="600">
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </Paper>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Stats Section */}
      <Box sx={{ py: 8 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} textAlign="center">
            <Grid item xs={6} md={3}>
              <Typography variant="h3" color="primary" fontWeight="bold">
                10K+
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Utilizadores Ativos
              </Typography>
            </Grid>
            <Grid item xs={6} md={3}>
              <Typography variant="h3" color="primary" fontWeight="bold">
                500+
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Eventos Realizados
              </Typography>
            </Grid>
            <Grid item xs={6} md={3}>
              <Typography variant="h3" color="primary" fontWeight="bold">
                99.9%
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Taxa de Sucesso
              </Typography>
            </Grid>
            <Grid item xs={6} md={3}>
              <Typography variant="h3" color="primary" fontWeight="bold">
                4.9★
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Avaliação Média
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: 8,
          textAlign: 'center'
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h3" gutterBottom fontWeight="bold">
            Pronto para o Próximo Festival?
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
            Junte-se a milhares de pessoas que já usam a nossa plataforma
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/registar')}
            sx={{
              bgcolor: 'white',
              color: 'primary.main',
              '&:hover': {
                bgcolor: 'grey.100'
              },
              py: 1.5,
              px: 6
            }}
          >
            Começar Agora
          </Button>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;