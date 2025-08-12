import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaTicketAlt, FaFacebook, FaTwitter, FaInstagram, FaEnvelope, FaPhone } from 'react-icons/fa';

const FooterContainer = styled.footer`
  background: #1f2937;
  color: white;
  padding: 3rem 0 1rem;
  margin-top: 4rem;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
`;

const FooterSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FooterTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #fbbf24;
  margin-bottom: 0.5rem;
`;

const FooterLink = styled(Link)`
  color: #d1d5db;
  text-decoration: none;
  transition: color 0.3s ease;
  
  &:hover {
    color: #fbbf24;
  }
`;

const FooterText = styled.p`
  color: #d1d5db;
  line-height: 1.6;
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const SocialLink = styled.a`
  width: 40px;
  height: 40px;
  background: #374151;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  text-decoration: none;
  transition: all 0.3s ease;
  
  &:hover {
    background: #fbbf24;
    color: #1f2937;
    transform: translateY(-2px);
  }
`;

const ContactInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #d1d5db;
  margin-bottom: 0.5rem;
`;

const FooterBottom = styled.div`
  border-top: 1px solid #374151;
  padding-top: 1rem;
  text-align: center;
  color: #9ca3af;
  font-size: 0.875rem;
`;

const Footer = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <FooterSection>
          <FooterTitle>
            <FaTicketAlt style={{ marginRight: '0.5rem' }} />
            Festival Tickets
          </FooterTitle>
          <FooterText>
            A tua plataforma de confiança para bilhetes de festivais em Portugal. 
            Pagamentos seguros via MB WAY e entrega instantânea.
          </FooterText>
          <SocialLinks>
            <SocialLink href="#" aria-label="Facebook">
              <FaFacebook />
            </SocialLink>
            <SocialLink href="#" aria-label="Twitter">
              <FaTwitter />
            </SocialLink>
            <SocialLink href="#" aria-label="Instagram">
              <FaInstagram />
            </SocialLink>
          </SocialLinks>
        </FooterSection>

        <FooterSection>
          <FooterTitle>Festivais</FooterTitle>
          <FooterLink to="/festivals">Ver Todos os Festivais</FooterLink>
          <FooterLink to="/festivals?category=Rock">Rock</FooterLink>
          <FooterLink to="/festivals?category=Alternative">Alternative</FooterLink>
          <FooterLink to="/festivals?category=Electronic">Eletrónica</FooterLink>
          <FooterLink to="/festivals?category=Pop">Pop</FooterLink>
        </FooterSection>

        <FooterSection>
          <FooterTitle>Suporte</FooterTitle>
          <FooterLink to="/help">Centro de Ajuda</FooterLink>
          <FooterLink to="/contact">Contactar Suporte</FooterLink>
          <FooterLink to="/faq">Perguntas Frequentes</FooterLink>
          <FooterLink to="/terms">Termos e Condições</FooterLink>
          <FooterLink to="/privacy">Política de Privacidade</FooterLink>
        </FooterSection>

        <FooterSection>
          <FooterTitle>Contacto</FooterTitle>
          <ContactInfo>
            <FaEnvelope />
            <span>info@festivaltickets.pt</span>
          </ContactInfo>
          <ContactInfo>
            <FaPhone />
            <span>+351 210 123 456</span>
          </ContactInfo>
          <FooterText>
            Segunda a Sexta: 9h - 18h<br />
            Sábado: 10h - 16h
          </FooterText>
        </FooterSection>
      </FooterContent>

      <FooterBottom>
        <div className="container">
          © 2024 Festival Tickets. Todos os direitos reservados. 
          Desenvolvido com ❤️ em Portugal.
        </div>
      </FooterBottom>
    </FooterContainer>
  );
};

export default Footer;