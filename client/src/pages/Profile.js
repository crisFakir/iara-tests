import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import { FaUser, FaEnvelope, FaPhone, FaSave, FaEdit, FaArrowLeft } from 'react-icons/fa';

const ProfileContainer = styled.div`
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

const BackButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
  margin-bottom: 2rem;
  
  &:hover {
    color: #5a67d8;
  }
`;

const ProfileContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 0 20px;
`;

const ProfileCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
`;

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #e5e7eb;
  
  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

const Avatar = styled.div`
  width: 100px;
  height: 100px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 2.5rem;
  font-weight: 600;
`;

const UserInfo = styled.div`
  flex: 1;
`;

const UserName = styled.h2`
  font-size: 1.75rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.5rem;
`;

const UserEmail = styled.p`
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
  
  &:disabled {
    background: #f9fafb;
    color: #6b7280;
    cursor: not-allowed;
  }
`;

const Button = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem 2rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const EditButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: #f3f4f6;
  color: #374151;
  padding: 0.75rem 1.5rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: #e5e7eb;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  
  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const result = await updateProfile(formData);
      if (result.success) {
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setFormData({
      name: user?.name || '',
      phone: user?.phone || ''
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      name: user?.name || '',
      phone: user?.phone || ''
    });
  };

  if (!user) {
    return (
      <ProfileContainer>
        <div className="container">
          <h2>Utilizador não autenticado</h2>
          <Link to="/login">Fazer login</Link>
        </div>
      </ProfileContainer>
    );
  }

  return (
    <ProfileContainer>
      <div className="container">
        <BackButton to="/dashboard">
          <FaArrowLeft />
          Voltar ao Dashboard
        </BackButton>

        <Header>
          <Title>Perfil do Utilizador</Title>
          <Subtitle>Gerencia as tuas informações pessoais</Subtitle>
        </Header>

        <ProfileContent>
          <ProfileCard>
            <ProfileHeader>
              <Avatar>
                {user.name?.charAt(0)?.toUpperCase() || 'U'}
              </Avatar>
              <UserInfo>
                <UserName>{user.name}</UserName>
                <UserEmail>{user.email}</UserEmail>
              </UserInfo>
            </ProfileHeader>

            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Label>
                  <FaUser />
                  Nome Completo
                </Label>
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="Introduz o teu nome completo"
                />
              </FormGroup>

              <FormGroup>
                <Label>
                  <FaEnvelope />
                  Email
                </Label>
                <Input
                  type="email"
                  value={user.email}
                  disabled
                  placeholder="exemplo@email.com"
                />
              </FormGroup>

              <FormGroup>
                <Label>
                  <FaPhone />
                  Número de Telemóvel
                </Label>
                <Input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="912345678"
                />
              </FormGroup>

              {isEditing ? (
                <ButtonGroup>
                  <Button type="submit">
                    <FaSave />
                    Guardar Alterações
                  </Button>
                  <EditButton type="button" onClick={handleCancel}>
                    Cancelar
                  </EditButton>
                </ButtonGroup>
              ) : (
                <EditButton onClick={handleEdit}>
                  <FaEdit />
                  Editar Perfil
                </EditButton>
              )}
            </Form>
          </ProfileCard>
        </ProfileContent>
      </div>
    </ProfileContainer>
  );
};

export default Profile;