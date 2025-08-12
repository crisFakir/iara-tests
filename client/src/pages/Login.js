import React from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaEnvelope, FaLock, FaSignInAlt, FaUserPlus } from 'react-icons/fa';

const LoginContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

const LoginCard = styled(motion.div)`
  background: white;
  padding: 3rem;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
`;

const LoginHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const LoginTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.5rem;
`;

const LoginSubtitle = styled.p`
  color: #6b7280;
  font-size: 1rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 500;
  color: #374151;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Input = styled.input`
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
`;

const SubmitButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
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

const Divider = styled.div`
  text-align: center;
  margin: 1.5rem 0;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 1px;
    background: #e5e7eb;
  }
  
  span {
    background: white;
    padding: 0 1rem;
    color: #6b7280;
    font-size: 0.875rem;
  }
`;

const RegisterLink = styled(Link)`
  display: block;
  text-align: center;
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #667eea;
    background: #f0f4ff;
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

const Login = () => {
  const { login, loading } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    const result = await login(data.email, data.password);
    if (!result.success) {
      // O erro já é mostrado pelo toast no contexto
      console.log('Login falhou:', result.error);
    }
  };

  return (
    <LoginContainer>
      <LoginCard
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <LoginHeader>
          <LoginTitle>Entrar na Conta</LoginTitle>
          <LoginSubtitle>Bem-vindo de volta! Acede à tua conta para continuar.</LoginSubtitle>
        </LoginHeader>

        <Form onSubmit={handleSubmit(onSubmit)}>
          <FormGroup>
            <Label>
              <FaEnvelope />
              Email
            </Label>
            <Input
              type="email"
              {...register('email', { 
                required: 'Email é obrigatório',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Email inválido'
                }
              })}
              className={errors.email ? 'error' : ''}
              placeholder="exemplo@email.com"
            />
            {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
          </FormGroup>

          <FormGroup>
            <Label>
              <FaLock />
              Password
            </Label>
            <Input
              type="password"
              {...register('password', { required: 'Password é obrigatória' })}
              className={errors.password ? 'error' : ''}
              placeholder="Introduz a tua password"
            />
            {errors.password && <ErrorMessage>{errors.password.message}</ErrorMessage>}
          </FormGroup>

          <SubmitButton type="submit" disabled={loading}>
            {loading ? (
              <>
                <LoadingSpinner />
                A Entrar...
              </>
            ) : (
              <>
                <FaSignInAlt />
                Entrar
              </>
            )}
          </SubmitButton>
        </Form>

        <Divider>
          <span>ou</span>
        </Divider>

        <RegisterLink to="/register">
          <FaUserPlus />
          Criar Nova Conta
        </RegisterLink>
      </LoginCard>
    </LoginContainer>
  );
};

export default Login;