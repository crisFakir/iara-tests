import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaTicketAlt, FaMusic, FaMapMarkerAlt, FaCalendarAlt, FaArrowRight } from 'react-icons/fa';

const HeroSection = styled.section`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 6rem 0;
  text-align: center;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200') center/cover;
    opacity: 0.1;
    z-index: 1;
  }
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 2;
  max-width: 800px;
  margin: 0 auto;
  padding: 0 20px;
`;

const HeroTitle = styled(motion.h1)`
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  line-height: 1.2;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const HeroSubtitle = styled(motion.p)`
  font-size: 1.25rem;
  margin-bottom: 2rem;
  opacity: 0.9;
  line-height: 1.6;
`;

const CTAButton = styled(motion(Link))`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: #fbbf24;
  color: #1f2937;
  padding: 1rem 2rem;
  border-radius: 50px;
  text-decoration: none;
  font-weight: 600;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(251, 191, 36, 0.3);
  
  &:hover {
    background: #f59e0b;
    transform: translateY(-2px);
    box-shadow: 0 6px 25px rgba(251, 191, 36, 0.4);
  }
`;

const FeaturesSection = styled.section`
  padding: 5rem 0;
  background: white;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

const FeatureCard = styled(motion.div)`
  background: white;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  text-align: center;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  }
`;

const FeatureIcon = styled.div`
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  color: white;
  font-size: 2rem;
`;

const FeatureTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #1f2937;
`;

const FeatureDescription = styled.p`
  color: #6b7280;
  line-height: 1.6;
`;

const FestivalsSection = styled.section`
  padding: 5rem 0;
  background: #f8fafc;
`;

const SectionTitle = styled.h2`
  text-align: center;
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 3rem;
  color: #1f2937;
`;

const FestivalsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

const FestivalCard = styled(motion.div)`
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  }
`;

const FestivalImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const FestivalContent = styled.div`
  padding: 1.5rem;
`;

const FestivalName = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #1f2937;
`;

const FestivalInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  color: #6b7280;
  font-size: 0.9rem;
`;

const FestivalPrice = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: #059669;
  margin-bottom: 1rem;
`;

const ViewButton = styled(Link)`
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

const Home = () => {
  const [featuredFestivals, setFeaturedFestivals] = useState([]);

  useEffect(() => {
    // Carregar festivais em destaque
    fetch('/api/festivals?limit=3')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setFeaturedFestivals(data.data);
        }
      })
      .catch(error => console.error('Erro ao carregar festivais:', error));
  }, []);

  return (
    <>
      <HeroSection>
        <HeroContent>
          <HeroTitle
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Os Melhores Festivais de Portugal
          </HeroTitle>
          <HeroSubtitle
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Reserva os teus bilhetes para os festivais mais incríveis do país. 
            Pagamento seguro via MB WAY e entrega instantânea.
          </HeroSubtitle>
          <CTAButton
            to="/festivals"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Ver Festivais
            <FaArrowRight />
          </CTAButton>
        </HeroContent>
      </HeroSection>

      <FeaturesSection>
        <div className="container">
          <SectionTitle>Porquê Escolher Festival Tickets?</SectionTitle>
          <FeaturesGrid>
            <FeatureCard
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <FeatureIcon>
                <FaTicketAlt />
              </FeatureIcon>
              <FeatureTitle>Bilhetes Instantâneos</FeatureTitle>
              <FeatureDescription>
                Recebe os teus bilhetes imediatamente após o pagamento. 
                Sem esperas, sem complicações.
              </FeatureDescription>
            </FeatureCard>

            <FeatureCard
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <FeatureIcon>
                <FaMusic />
              </FeatureIcon>
              <FeatureTitle>Festivais Exclusivos</FeatureTitle>
              <FeatureDescription>
                Acesso aos melhores festivais de música de Portugal. 
                Rock, eletrónica, indie e muito mais.
              </FeatureDescription>
            </FeatureCard>

            <FeatureCard
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <FeatureIcon>
                <FaMapMarkerAlt />
              </FeatureIcon>
              <FeatureTitle>Localizações Incríveis</FeatureTitle>
              <FeatureDescription>
                Festivais em locais deslumbrantes por todo o país. 
                Da costa ao interior, sempre com a melhor experiência.
              </FeatureDescription>
            </FeatureCard>
          </FeaturesGrid>
        </div>
      </FeaturesSection>

      <FestivalsSection>
        <div className="container">
          <SectionTitle>Festivais em Destaque</SectionTitle>
          <FestivalsGrid>
            {featuredFestivals.map((festival, index) => (
              <FestivalCard
                key={festival.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <FestivalImage src={festival.image} alt={festival.name} />
                <FestivalContent>
                  <FestivalName>{festival.name}</FestivalName>
                  <FestivalInfo>
                    <span>
                      <FaCalendarAlt /> {new Date(festival.startDate).toLocaleDateString('pt-PT')}
                    </span>
                    <span>
                      <FaMapMarkerAlt /> {festival.location}
                    </span>
                  </FestivalInfo>
                  <FestivalPrice>€{festival.price}</FestivalPrice>
                  <ViewButton to={`/festival/${festival.id}`}>
                    Ver Detalhes
                    <FaArrowRight />
                  </ViewButton>
                </FestivalContent>
              </FestivalCard>
            ))}
          </FestivalsGrid>
        </div>
      </FestivalsSection>
    </>
  );
};

export default Home;