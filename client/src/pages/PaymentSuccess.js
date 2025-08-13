import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaHome, FaUser } from 'react-icons/fa';

const SuccessContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

const SuccessCard = styled(motion.div)`
  background: white;
  padding: 3rem;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 500px;
  text-align: center;
`;

const SuccessIcon = styled.div`
  width: 80px;
  height: 80px;
  background: #10b981;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 2rem;
  color: white;
  font-size: 2.5rem;
`;

const SuccessTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 1rem;
`;

const SuccessMessage = styled.p`
  color: #6b7280;
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 2rem;
`;

const PaymentDetails = styled.div`
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  text-align: left;
`;

const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const DetailLabel = styled.span`
  font-weight: 500;
  color: #374151;
`;

const DetailValue = styled.span`
  font-weight: 600;
  color: #059669;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  
  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

const ActionButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
  
  &.primary {
    background: #10b981;
    color: white;
    
    &:hover {
      background: #059669;
      transform: translateY(-2px);
    }
  }
  
  &.secondary {
    background: #f3f4f6;
    color: #374151;
    border: 1px solid #d1d5db;
    
    &:hover {
      background: #e5e7eb;
      transform: translateY(-2px);
    }
  }
`;

const PaymentSuccess = () => {
  const location = useLocation();
  const { paymentId, amount, festivalName } = location.state || {};

  return (
    <SuccessContainer>
      <SuccessCard
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <SuccessIcon>
          <FaCheckCircle />
        </SuccessIcon>

        <SuccessTitle>Pagamento Realizado com Sucesso!</SuccessTitle>
        
        <SuccessMessage>
          O teu bilhete foi confirmado e enviado para o teu email. 
          Guarda esta informação para referência futura.
        </SuccessMessage>

        <PaymentDetails>
          <DetailRow>
            <DetailLabel>Festival:</DetailLabel>
            <DetailValue>{festivalName || 'Festival'}</DetailValue>
          </DetailRow>
          <DetailRow>
            <DetailLabel>Valor Pago:</DetailLabel>
            <DetailValue>€{amount?.toFixed(2) || '0.00'}</DetailValue>
          </DetailRow>
          <DetailRow>
            <DetailLabel>ID do Pagamento:</DetailLabel>
            <DetailValue>{paymentId || 'N/A'}</DetailValue>
          </DetailRow>
          <DetailRow>
            <DetailLabel>Data:</DetailLabel>
            <DetailValue>{new Date().toLocaleDateString('pt-PT')}</DetailValue>
          </DetailRow>
        </PaymentDetails>

        <ActionButtons>
          <ActionButton to="/dashboard" className="primary">
            <FaUser />
            Ver Meus Bilhetes
          </ActionButton>
          <ActionButton to="/" className="secondary">
            <FaHome />
            Voltar ao Início
          </ActionButton>
        </ActionButtons>
      </SuccessCard>
    </SuccessContainer>
  );
};

export default PaymentSuccess;