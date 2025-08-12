import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { FaMobileAlt, FaCreditCard, FaShieldAlt, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import toast from 'react-hot-toast';

const CheckoutContainer = styled.div`
  min-height: 100vh;
  background: #f8fafc;
  padding: 2rem 0;
`;

const CheckoutContent = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 20px;
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 3rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const CheckoutForm = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
`;

const OrderSummary = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  height: fit-content;
  position: sticky;
  top: 2rem;
  
  @media (max-width: 768px) {
    position: static;
  }
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 2rem;
  color: #1f2937;
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #1f2937;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #374151;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
  
  &.error {
    border-color: #ef4444;
  }
`;

const ErrorMessage = styled.span`
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 0.25rem;
  display: block;
`;

const PaymentMethod = styled.div`
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &.selected {
    border-color: #667eea;
    background: #f0f4ff;
  }
  
  &:hover {
    border-color: #667eea;
  }
`;

const PaymentMethodHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const PaymentIcon = styled.div`
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2rem;
`;

const PaymentMethodTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: #1f2937;
`;

const PaymentMethodDescription = styled.p`
  color: #6b7280;
  font-size: 0.9rem;
  line-height: 1.5;
`;

const SubmitButton = styled.button`
  width: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const LoadingSpinner = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid #ffffff;
  border-top: 2px solid transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const TicketItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid #e5e7eb;
  
  &:last-child {
    border-bottom: none;
  }
`;

const TicketInfo = styled.div`
  flex: 1;
`;

const TicketName = styled.h4`
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.25rem;
`;

const TicketDetails = styled.p`
  color: #6b7280;
  font-size: 0.9rem;
`;

const TicketPrice = styled.div`
  font-weight: 600;
  color: #059669;
`;

const TotalSection = styled.div`
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 2px solid #e5e7eb;
`;

const TotalRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  
  &.total {
    font-size: 1.25rem;
    font-weight: 700;
    color: #1f2937;
    border-top: 1px solid #e5e7eb;
    padding-top: 1rem;
    margin-top: 1rem;
  }
`;

const SecurityInfo = styled.div`
  background: #f0f9ff;
  border: 1px solid #0ea5e9;
  border-radius: 8px;
  padding: 1rem;
  margin-top: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #0369a1;
  font-size: 0.9rem;
`;

const Checkout = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [festival, setFestival] = useState(null);
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
  
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const selectedQuantity = watch('quantity', 1);

  useEffect(() => {
    const festivalId = searchParams.get('festival');
    if (festivalId) {
      fetchFestival(festivalId);
    }
  }, [searchParams]);

  const fetchFestival = async (festivalId) => {
    try {
      const response = await fetch(`/api/festivals/${festivalId}`);
      const data = await response.json();
      if (data.success) {
        setFestival(data.data);
      }
    } catch (error) {
      console.error('Erro ao carregar festival:', error);
      toast.error('Erro ao carregar informações do festival');
    }
  };

  const onSubmit = async (data) => {
    if (!festival) return;

    setLoading(true);
    setPaymentStatus(null);

    try {
      // Primeiro, reservar o bilhete
      const ticketResponse = await fetch('/api/tickets/reserve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          festivalId: festival.id,
          userName: data.userName,
          userEmail: data.userEmail,
          userPhone: data.phoneNumber,
          quantity: parseInt(data.quantity)
        })
      });

      const ticketData = await ticketResponse.json();

      if (!ticketData.success) {
        throw new Error(ticketData.error);
      }

      // Processar pagamento MB WAY
      const paymentResponse = await fetch('/api/payments/mbway', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          phoneNumber: data.phoneNumber,
          amount: ticketData.data.totalAmount,
          ticketId: ticketData.data.tickets[0].id,
          festivalId: festival.id,
          userName: data.userName,
          userEmail: data.userEmail
        })
      });

      const paymentData = await paymentResponse.json();

      if (paymentData.success) {
        // Confirmar bilhete após pagamento bem-sucedido
        await fetch(`/api/tickets/${ticketData.data.tickets[0].id}/confirm`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            paymentId: paymentData.data.paymentId,
            transactionId: paymentData.data.transactionId
          })
        });

        setPaymentStatus('success');
        toast.success('Pagamento realizado com sucesso!');
        
        // Redirecionar para página de sucesso após 2 segundos
        setTimeout(() => {
          navigate('/payment/success', { 
            state: { 
              paymentId: paymentData.data.paymentId,
              amount: paymentData.data.amount,
              festivalName: festival.name
            }
          });
        }, 2000);
      } else {
        setPaymentStatus('failed');
        toast.error(paymentData.error || 'Pagamento falhou');
      }
    } catch (error) {
      setPaymentStatus('failed');
      toast.error(error.message || 'Erro ao processar pagamento');
    } finally {
      setLoading(false);
    }
  };

  if (!festival) {
    return (
      <CheckoutContainer>
        <div className="container">
          <div style={{ textAlign: 'center', padding: '4rem 0' }}>
            <LoadingSpinner />
            <p>A carregar informações do festival...</p>
          </div>
        </div>
      </CheckoutContainer>
    );
  }

  const totalAmount = festival.price * selectedQuantity;

  return (
    <CheckoutContainer>
      <div className="container">
        <Title>Finalizar Compra</Title>
        
        <CheckoutContent>
          <CheckoutForm>
            <SectionTitle>
              <FaCreditCard />
              Informações de Pagamento
            </SectionTitle>

            <form onSubmit={handleSubmit(onSubmit)}>
              <FormGroup>
                <Label>Nome Completo *</Label>
                <Input
                  {...register('userName', { required: 'Nome é obrigatório' })}
                  className={errors.userName ? 'error' : ''}
                  placeholder="Introduz o teu nome completo"
                />
                {errors.userName && <ErrorMessage>{errors.userName.message}</ErrorMessage>}
              </FormGroup>

              <FormGroup>
                <Label>Email *</Label>
                <Input
                  type="email"
                  {...register('userEmail', { 
                    required: 'Email é obrigatório',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Email inválido'
                    }
                  })}
                  className={errors.userEmail ? 'error' : ''}
                  placeholder="exemplo@email.com"
                />
                {errors.userEmail && <ErrorMessage>{errors.userEmail.message}</ErrorMessage>}
              </FormGroup>

              <FormGroup>
                <Label>Quantidade de Bilhetes *</Label>
                <Input
                  type="number"
                  min="1"
                  max="10"
                  {...register('quantity', { 
                    required: 'Quantidade é obrigatória',
                    min: { value: 1, message: 'Mínimo 1 bilhete' },
                    max: { value: 10, message: 'Máximo 10 bilhetes' }
                  })}
                  className={errors.quantity ? 'error' : ''}
                />
                {errors.quantity && <ErrorMessage>{errors.quantity.message}</ErrorMessage>}
              </FormGroup>

              <SectionTitle>
                <FaMobileAlt />
                Método de Pagamento
              </SectionTitle>

              <PaymentMethod className="selected">
                <PaymentMethodHeader>
                  <PaymentIcon>
                    <FaMobileAlt />
                  </PaymentIcon>
                  <div>
                    <PaymentMethodTitle>MB WAY</PaymentMethodTitle>
                    <PaymentMethodDescription>
                      Paga com o teu telemóvel de forma rápida e segura
                    </PaymentMethodDescription>
                  </div>
                </PaymentMethodHeader>
              </PaymentMethod>

              <FormGroup>
                <Label>Número de Telemóvel *</Label>
                <Input
                  {...register('phoneNumber', { 
                    required: 'Número de telemóvel é obrigatório',
                    pattern: {
                      value: /^(\+351|00351|351)?[9][1236]\d{7}$/,
                      message: 'Número de telemóvel português inválido'
                    }
                  })}
                  className={errors.phoneNumber ? 'error' : ''}
                  placeholder="912345678"
                />
                {errors.phoneNumber && <ErrorMessage>{errors.phoneNumber.message}</ErrorMessage>}
              </FormGroup>

              <SubmitButton type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <LoadingSpinner />
                    Processando Pagamento...
                  </>
                ) : (
                  <>
                    <FaShieldAlt />
                    Pagar com MB WAY - €{totalAmount.toFixed(2)}
                  </>
                )}
              </SubmitButton>

              {paymentStatus === 'success' && (
                <div style={{ 
                  background: '#f0fdf4', 
                  border: '1px solid #22c55e', 
                  borderRadius: '8px', 
                  padding: '1rem', 
                  marginTop: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  color: '#15803d'
                }}>
                  <FaCheckCircle />
                  Pagamento realizado com sucesso! A redirecionar...
                </div>
              )}

              {paymentStatus === 'failed' && (
                <div style={{ 
                  background: '#fef2f2', 
                  border: '1px solid #ef4444', 
                  borderRadius: '8px', 
                  padding: '1rem', 
                  marginTop: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  color: '#dc2626'
                }}>
                  <FaTimesCircle />
                  Pagamento falhou. Tenta novamente.
                </div>
              )}
            </form>
          </CheckoutForm>

          <OrderSummary>
            <SectionTitle>Resumo da Encomenda</SectionTitle>
            
            <TicketItem>
              <TicketInfo>
                <TicketName>{festival.name}</TicketName>
                <TicketDetails>
                  {new Date(festival.startDate).toLocaleDateString('pt-PT')} • {festival.location}
                </TicketDetails>
              </TicketInfo>
              <TicketPrice>€{festival.price}</TicketPrice>
            </TicketItem>

            <TotalSection>
              <TotalRow>
                <span>Quantidade:</span>
                <span>{selectedQuantity}</span>
              </TotalRow>
              <TotalRow>
                <span>Preço por bilhete:</span>
                <span>€{festival.price}</span>
              </TotalRow>
              <TotalRow className="total">
                <span>Total:</span>
                <span>€{totalAmount.toFixed(2)}</span>
              </TotalRow>
            </TotalSection>

            <SecurityInfo>
              <FaShieldAlt />
              Pagamento seguro via MB WAY. Os teus dados estão protegidos.
            </SecurityInfo>
          </OrderSummary>
        </CheckoutContent>
      </div>
    </CheckoutContainer>
  );
};

export default Checkout;