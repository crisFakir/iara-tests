import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaTimesCircle, FaHome, FaTicketAlt, FaExclamationTriangle } from 'react-icons/fa';

const FailedContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

const FailedCard = styled(motion.div)`
  background: white;
  padding: 3rem;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 500px;
  text-align: center;
`;

const FailedIcon = styled.div`
  width: 80px;
  height: 80px;
  background: #ef4444;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 2rem;
  color: white;
  font-size: 2.5rem;
`;

const FailedTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 1rem;
`;

const FailedMessage = styled.p`
  color: #6b7280;
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 2rem;
`;

const ErrorDetails = styled.div`
  background: #fef2f2;
  border: 1px solid #fecaca;
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
  color: #dc2626;
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
    background: #ef4444;
    color: white;
    
    &:hover {
      background: #dc2626;
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

const PaymentFailed = () => {
  const location = useLocation();
  const { paymentId, amount, festivalName, error } = location.state || {};

  return (
    <FailedContainer>
      <FailedCard
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <FailedIcon>
          <FaTimesCircle />
        </FailedIcon>

        <FailedTitle>Pagamento Falhou</FailedTitle>
        
        <FailedMessage>
          Ocorreu um erro ao processar o teu pagamento. 
          Não te preocupes, não foste cobrado. Tenta novamente ou contacta o suporte.
        </FailedMessage>

        <ErrorDetails>
          <DetailRow>
            <DetailLabel>Festival:</DetailLabel>
            <DetailValue>{festivalName || 'N/A'}</DetailValue>
          </DetailRow>
          <DetailRow>
            <DetailLabel>Valor:</DetailLabel>
            <DetailValue>€{amount?.toFixed(2) || '0.00'}</DetailValue>
          </DetailRow>
          <DetailRow>
            <DetailLabel>ID do Pagamento:</DetailLabel>
            <DetailValue>{paymentId || 'N/A'}</DetailValue>
          </DetailRow>
          <DetailRow>
            <DetailLabel>Erro:</DetailLabel>
            <DetailValue>{error || 'Erro desconhecido'}</DetailValue>
          </DetailRow>
        </ErrorDetails>

        <ActionButtons>
          <ActionButton to="/checkout" className="primary">
            <FaTicketAlt />
            Tentar Novamente
          </ActionButton>
          <ActionButton to="/" className="secondary">
            <FaHome />
            Voltar ao Início
          </ActionButton>
        </ActionButtons>
      </FailedCard>
    </FailedContainer>
  );
};

export default PaymentFailed;