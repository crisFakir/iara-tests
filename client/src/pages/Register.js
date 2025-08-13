import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

const Card = styled.div`
  background: white;
  padding: 3rem;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 450px;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 1rem;
`;

const Subtitle = styled.p`
  color: #6b7280;
  margin-bottom: 2rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const Button = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 1rem;
`;

const LoginLink = styled(Link)`
  color: #667eea;
  text-decoration: none;
  margin-top: 1rem;
  display: block;
`;

const Register = () => {
  return (
    <Container>
      <Card>
        <Title>Criar Conta</Title>
        <Subtitle>Junta-te à comunidade de festivais!</Subtitle>
        
        <Form>
          <Input type="text" placeholder="Nome Completo" />
          <Input type="email" placeholder="Email" />
          <Input type="tel" placeholder="Telemóvel" />
          <Input type="password" placeholder="Password" />
          <Input type="password" placeholder="Confirmar Password" />
          <Button type="submit">Criar Conta</Button>
        </Form>
        
        <LoginLink to="/login">Já tens conta? Entra aqui</LoginLink>
      </Card>
    </Container>
  );
};

export default Register;