import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaMapMarkerAlt, FaTicketAlt, FaMusic, FaArrowLeft, FaUsers } from 'react-icons/fa';

const DetailContainer = styled.div`
  min-height: 100vh;
  background: #f8fafc;
  padding: 2rem 0;
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

const HeroSection = styled.div`
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  margin-bottom: 2rem;
`;

const HeroImage = styled.img`
  width: 100%;
  height: 400px;
  object-fit: cover;
`;

const HeroContent = styled.div`
  padding: 2rem;
`;

const FestivalTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 1rem;
`;

const FestivalMeta = styled.div`
  display: flex;
  gap: 2rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #6b7280;
  font-size: 1rem;
`;

const FestivalDescription = styled.p`
  color: #374151;
  line-height: 1.7;
  font-size: 1.1rem;
  margin-bottom: 2rem;
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
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
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const LineupGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`;

const ArtistCard = styled.div`
  background: #f8fafc;
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
  border: 2px solid transparent;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #667eea;
    background: #f0f4ff;
  }
`;

const ArtistName = styled.h4`
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.5rem;
`;

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const TicketCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  text-align: center;
`;

const Price = styled.div`
  font-size: 3rem;
  font-weight: 700;
  color: #059669;
  margin-bottom: 1rem;
`;

const Availability = styled.div`
  color: #6b7280;
  margin-bottom: 2rem;
`;

const BuyButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem 2rem;
  border-radius: 12px;
  text-decoration: none;
  font-weight: 600;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);
  }
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4rem;
  
  &::after {
    content: '';
    width: 40px;
    height: 40px;
    border: 4px solid #e5e7eb;
    border-top: 4px solid #667eea;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const FestivalDetail = () => {
  const { id } = useParams();
  const [festival, setFestival] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFestival();
  }, [id]);

  const fetchFestival = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/festivals/${id}`);
      const data = await response.json();
      
      if (data.success) {
        setFestival(data.data);
      }
    } catch (error) {
      console.error('Erro ao carregar festival:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DetailContainer>
        <LoadingSpinner />
      </DetailContainer>
    );
  }

  if (!festival) {
    return (
      <DetailContainer>
        <div className="container">
          <h2>Festival não encontrado</h2>
          <Link to="/festivals">Voltar aos festivais</Link>
        </div>
      </DetailContainer>
    );
  }

  return (
    <DetailContainer>
      <div className="container">
        <BackButton to="/festivals">
          <FaArrowLeft />
          Voltar aos Festivais
        </BackButton>

        <HeroSection>
          <HeroImage src={festival.image} alt={festival.name} />
          <HeroContent>
            <FestivalTitle>{festival.name}</FestivalTitle>
            
            <FestivalMeta>
              <MetaItem>
                <FaCalendarAlt />
                {new Date(festival.startDate).toLocaleDateString('pt-PT')} - {new Date(festival.endDate).toLocaleDateString('pt-PT')}
              </MetaItem>
              <MetaItem>
                <FaMapMarkerAlt />
                {festival.location}
              </MetaItem>
              <MetaItem>
                <FaUsers />
                {festival.availableTickets} bilhetes disponíveis
              </MetaItem>
            </FestivalMeta>
            
            <FestivalDescription>{festival.description}</FestivalDescription>
          </HeroContent>
        </HeroSection>

        <ContentGrid>
          <MainContent>
            <Section>
              <SectionTitle>
                <FaMusic />
                Lineup
              </SectionTitle>
              <LineupGrid>
                {festival.lineup.map((artist, index) => (
                  <ArtistCard key={index}>
                    <ArtistName>{artist}</ArtistName>
                  </ArtistCard>
                ))}
              </LineupGrid>
            </Section>
          </MainContent>

          <Sidebar>
            <TicketCard>
              <Price>€{festival.price}</Price>
              <Availability>
                {festival.availableTickets} bilhetes disponíveis
              </Availability>
              <BuyButton to={`/checkout?festival=${festival.id}`}>
                <FaTicketAlt />
                Comprar Bilhete
              </BuyButton>
            </TicketCard>
          </Sidebar>
        </ContentGrid>
      </div>
    </DetailContainer>
  );
};

export default FestivalDetail;