import React from 'react';
import { Outlet } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Container, 
  Box,
  IconButton,
  Badge
} from '@mui/material';
import { 
  ShoppingCart, 
  Person, 
  ConfirmationNumber,
  Menu as MenuIcon 
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const MainLayout: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Header */}
      <AppBar position="sticky" sx={{ bgcolor: 'white', color: 'text.primary' }}>
        <Toolbar>
          <Typography
            variant="h5"
            component="div"
            sx={{ 
              flexGrow: 1, 
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              cursor: 'pointer'
            }}
            onClick={() => navigate('/')}
          >
            🎫 Festival Tickets
          </Typography>
          
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
            <Button color="inherit" onClick={() => navigate('/eventos')}>
              Eventos
            </Button>
            <Button color="inherit" onClick={() => navigate('/validar')}>
              Validar Bilhete
            </Button>
            <Button 
              variant="outlined" 
              startIcon={<Person />}
              onClick={() => navigate('/login')}
            >
              Entrar
            </Button>
            <Button 
              variant="contained" 
              startIcon={<ConfirmationNumber />}
              onClick={() => navigate('/registar')}
            >
              Registar
            </Button>
          </Box>

          <IconButton
            sx={{ display: { xs: 'flex', md: 'none' } }}
            color="inherit"
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Outlet />
      </Box>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          bgcolor: 'grey.900',
          color: 'white',
          py: 4,
          mt: 'auto'
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="body2" textAlign="center">
            © 2024 Festival Tickets. Todos os direitos reservados.
          </Typography>
          <Typography variant="body2" textAlign="center" sx={{ mt: 1 }}>
            Pagamentos seguros com MB Way
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default MainLayout;