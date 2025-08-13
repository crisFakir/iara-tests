import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import { FaTicketAlt, FaCalendarAlt, FaMapMarkerAlt, FaUser, FaSignOutAlt } from 'react-icons/fa';

const DashboardContainer = styled.div`
  min-height: 100vh;
  background: #f8fafc;
  padding: 2rem 0;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 1rem;
`;

const Subtitle = styled.p`
  color: #6b7280;
  font-size: 1.1rem;
`;

const DashboardContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: grid;
  grid-template-columns: 1fr 3fr;
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Sidebar = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  height: fit-content;
`;

const UserInfo = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #e5e7eb;
`;

const UserAvatar = styled.div`
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  color: white;
  font-size: 2rem;
  font-weight: 600;
`;

const UserName = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.5rem;
`;

const UserEmail = styled.p`
  color: #6b7280;
  font-size: 0.9rem;
`;

const SidebarMenu = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const MenuItem = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  color: #374151;
  text-decoration: none;
  border-radius: 8px;
  transition: all 0.3s ease;
  
  &:hover {
    background: #f3f4f6;
    color: #667eea;
  }
  
  &.active {
    background: #f0f4ff;
    color: #667eea;
  }
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.75rem 1rem;
  background: none;
  border: none;
  color: #ef4444;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.3s ease;
  
  &:hover {
    background: #fef2f2;
  }
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Section = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const TicketsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const TicketCard = styled.div`
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #667eea;
    box-shadow: 0 4px 20px rgba(102, 126, 234, 0.1);
  }
`;

const TicketHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const TicketStatus = styled.span`
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
  
  &.confirmed {
    background: #f0fdf4;
    color: #15803d;
  }
  
  &.reserved {
    background: #fef3c7;
    color: #d97706;
  }
  
  &.expired {
    background: #fef2f2;
    color: #dc2626;
  }
`;

const TicketTitle = styled.h4`
  font-size: 1.1rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.5rem;
`;

const TicketInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  color: #6b7280;
  font-size: 0.9rem;
`;

const TicketPrice = styled.div`
  font-size: 1.25rem;
  font-weight: 700;
  color: #059669;
`;

const NoTickets = styled.div`
  text-align: center;
  padding: 3rem;
  color: #6b7280;
`;

const NoTicketsTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #374151;
`;

const BrowseButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);
  }
`;

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserTickets();
    }
  }, [user]);

  const fetchUserTickets = async () => {
    try {
      const response = await fetch(`/api/tickets/user/${user.email}`);
      const data = await response.json();
      
      if (data.success) {
        setTickets(data.data);
      }
    } catch (error) {
      console.error('Erro ao carregar bilhetes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmado';
      case 'reserved':
        return 'Reservado';
      case 'expired':
        return 'Expirado';
      default:
        return status;
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'confirmed':
        return 'confirmed';
      case 'reserved':
        return 'reserved';
      case 'expired':
        return 'expired';
      default:
        return '';
    }
  };

  return (
    <DashboardContainer>
      <Header>
        <Title>Dashboard</Title>
        <Subtitle>Bem-vindo de volta, {user?.name}!</Subtitle>
      </Header>

      <DashboardContent>
        <Sidebar>
          <UserInfo>
            <UserAvatar>
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </UserAvatar>
            <UserName>{user?.name}</UserName>
            <UserEmail>{user?.email}</UserEmail>
          </UserInfo>

          <SidebarMenu>
            <MenuItem to="/dashboard" className="active">
              <FaTicketAlt />
              Meus Bilhetes
            </MenuItem>
            <MenuItem to="/profile">
              <FaUser />
              Perfil
            </MenuItem>
            <LogoutButton onClick={handleLogout}>
              <FaSignOutAlt />
              Sair
            </LogoutButton>
          </SidebarMenu>
        </Sidebar>

        <MainContent>
          <Section>
            <SectionTitle>
              <FaTicketAlt />
              Meus Bilhetes
            </SectionTitle>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                A carregar bilhetes...
              </div>
            ) : tickets.length === 0 ? (
              <NoTickets>
                <NoTicketsTitle>Ainda não tens bilhetes</NoTicketsTitle>
                <p>Explora os festivais disponíveis e reserva os teus primeiros bilhetes!</p>
                <BrowseButton to="/festivals" style={{ marginTop: '1rem' }}>
                  Ver Festivais
                </BrowseButton>
              </NoTickets>
            ) : (
              <TicketsGrid>
                {tickets.map((ticket) => (
                  <TicketCard key={ticket.id}>
                    <TicketHeader>
                      <TicketStatus className={getStatusClass(ticket.status)}>
                        {getStatusText(ticket.status)}
                      </TicketStatus>
                    </TicketHeader>
                    
                    <TicketTitle>Bilhete #{ticket.ticketCode}</TicketTitle>
                    
                    <TicketInfo>
                      <span>
                        <FaCalendarAlt /> {new Date(ticket.reservedAt).toLocaleDateString('pt-PT')}
                      </span>
                    </TicketInfo>
                    
                    <TicketPrice>€{ticket.price}</TicketPrice>
                  </TicketCard>
                ))}
              </TicketsGrid>
            )}
          </Section>
        </MainContent>
      </DashboardContent>
    </DashboardContainer>
  );
};

export default Dashboard;