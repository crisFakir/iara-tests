import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import styled from 'styled-components';
import { FaBars, FaTimes, FaTicketAlt, FaUser, FaSignOutAlt } from 'react-icons/fa';

const Nav = styled.nav`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
`;

const NavContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  text-decoration: none;
  color: white;
  font-size: 1.5rem;
  font-weight: 700;
  
  svg {
    margin-right: 0.5rem;
    font-size: 1.8rem;
  }
  
  &:hover {
    color: #fbbf24;
    transform: scale(1.05);
    transition: all 0.3s ease;
  }
`;

const NavMenu = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled(Link)`
  color: white;
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #fbbf24;
  }
  
  &.active {
    background: rgba(255, 255, 255, 0.2);
    color: #fbbf24;
  }
`;

const UserMenu = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const UserButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.3);
  }
`;

const LogoutButton = styled.button`
  background: #ef4444;
  border: none;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    background: #dc2626;
    transform: translateY(-2px);
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  
  @media (max-width: 768px) {
    display: block;
  }
`;

const MobileMenu = styled.div`
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 1rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  
  @media (max-width: 768px) {
    display: ${props => props.isOpen ? 'block' : 'none'};
  }
`;

const MobileNavLink = styled(Link)`
  display: block;
  color: white;
  text-decoration: none;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  margin-bottom: 0.5rem;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #fbbf24;
  }
  
  &.active {
    background: rgba(255, 255, 255, 0.2);
    color: #fbbf24;
  }
`;

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <Nav>
      <NavContainer>
        <Logo to="/">
          <FaTicketAlt />
          Festival Tickets
        </Logo>

        <NavMenu>
          <NavLink to="/" className={isActive('/') ? 'active' : ''}>
            Início
          </NavLink>
          <NavLink to="/festivals" className={isActive('/festivals') ? 'active' : ''}>
            Festivais
          </NavLink>
        </NavMenu>

        <UserMenu>
          {isAuthenticated ? (
            <>
              <UserButton as={Link} to="/dashboard">
                <FaUser />
                {user?.name}
              </UserButton>
              <LogoutButton onClick={handleLogout}>
                <FaSignOutAlt />
                Sair
              </LogoutButton>
            </>
          ) : (
            <>
              <NavLink to="/login">Entrar</NavLink>
              <NavLink to="/register">Registar</NavLink>
            </>
          )}
        </UserMenu>

        <MobileMenuButton onClick={toggleMobileMenu}>
          {mobileMenuOpen ? <FaTimes /> : <FaBars />}
        </MobileMenuButton>
      </NavContainer>

      <MobileMenu isOpen={mobileMenuOpen}>
        <MobileNavLink to="/" className={isActive('/') ? 'active' : ''}>
          Início
        </MobileNavLink>
        <MobileNavLink to="/festivals" className={isActive('/festivals') ? 'active' : ''}>
          Festivais
        </MobileNavLink>
        
        {isAuthenticated ? (
          <>
            <MobileNavLink to="/dashboard">
              <FaUser /> {user?.name}
            </MobileNavLink>
            <MobileNavLink to="/profile">
              Perfil
            </MobileNavLink>
            <MobileNavLink as="button" onClick={handleLogout}>
              <FaSignOutAlt /> Sair
            </MobileNavLink>
          </>
        ) : (
          <>
            <MobileNavLink to="/login">Entrar</MobileNavLink>
            <MobileNavLink to="/register">Registar</MobileNavLink>
          </>
        )}
      </MobileMenu>
    </Nav>
  );
};

export default Navbar;