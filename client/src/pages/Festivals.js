import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaSearch, FaFilter, FaCalendarAlt, FaMapMarkerAlt, FaTicketAlt } from 'react-icons/fa';

const FestivalsContainer = styled.div`
  min-height: 100vh;
  background: #f8fafc;
  padding: 2rem 0;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const Title = styled.h1`
  font-size: 3rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 1rem;
`;

const Subtitle = styled.p`
  font-size: 1.25rem;
  color: #6b7280;
  max-width: 600px;
  margin: 0 auto;
`;

const FiltersSection = styled.div`
  max-width: 1200px;
  margin: 0 auto 3rem;
  padding: 0 20px;
`;

const FiltersContainer = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  align-items: center;
`;

const SearchInput = styled.input`
  flex: 1;
  min-width: 200px;
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const FilterSelect = styled.select`
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  background: white;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const FestivalsGrid = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
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

const FestivalDescription = styled.p`
  color: #6b7280;
  margin-bottom: 1rem;
  line-height: 1.5;
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

const BuyButton = styled(Link)`
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

const NoResults = styled.div`
  text-align: center;
  padding: 4rem;
  color: #6b7280;
`;

const Festivals = () => {
  const [festivals, setFestivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  
  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';

  useEffect(() => {
    fetchFestivals();
  }, [search, category]);

  const fetchFestivals = async () => {
    try {
      setLoading(true);
      let url = '/api/festivals';
      const params = new URLSearchParams();
      
      if (search) params.append('search', search);
      if (category) params.append('category', category);
      
      if (params.toString()) {
        url += '?' + params.toString();
      }

      const response = await fetch(url);
      const data = await response.json();
      
      if (data.success) {
        setFestivals(data.data);
      }
    } catch (error) {
      console.error('Erro ao carregar festivais:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    if (value) {
      setSearchParams({ search: value, ...(category && { category }) });
    } else {
      setSearchParams(category ? { category } : {});
    }
  };

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    if (value) {
      setSearchParams({ category: value, ...(search && { search }) });
    } else {
      setSearchParams(search ? { search } : {});
    }
  };

  if (loading) {
    return (
      <FestivalsContainer>
        <LoadingSpinner />
      </FestivalsContainer>
    );
  }

  return (
    <FestivalsContainer>
      <Header>
        <Title>Festivais Disponíveis</Title>
        <Subtitle>
          Descobre os melhores festivais de música em Portugal e reserva os teus bilhetes
        </Subtitle>
      </Header>

      <FiltersSection>
        <FiltersContainer>
          <SearchInput
            type="text"
            placeholder="Pesquisar festivais..."
            value={search}
            onChange={handleSearch}
          />
          <FilterSelect value={category} onChange={handleCategoryChange}>
            <option value="">Todas as Categorias</option>
            <option value="Rock">Rock</option>
            <option value="Alternative">Alternative</option>
            <option value="Electronic">Eletrónica</option>
            <option value="Pop">Pop</option>
          </FilterSelect>
        </FiltersContainer>
      </FiltersSection>

      {festivals.length === 0 ? (
        <NoResults>
          <h3>Nenhum festival encontrado</h3>
          <p>Tenta ajustar os filtros ou pesquisar por outro termo.</p>
        </NoResults>
      ) : (
        <FestivalsGrid>
          {festivals.map((festival, index) => (
            <FestivalCard
              key={festival.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <FestivalImage src={festival.image} alt={festival.name} />
              <FestivalContent>
                <FestivalName>{festival.name}</FestivalName>
                <FestivalDescription>{festival.description}</FestivalDescription>
                
                <FestivalInfo>
                  <span>
                    <FaCalendarAlt /> {new Date(festival.startDate).toLocaleDateString('pt-PT')}
                  </span>
                  <span>
                    <FaMapMarkerAlt /> {festival.location}
                  </span>
                </FestivalInfo>
                
                <FestivalPrice>€{festival.price}</FestivalPrice>
                
                <BuyButton to={`/checkout?festival=${festival.id}`}>
                  <FaTicketAlt />
                  Comprar Bilhete
                </BuyButton>
              </FestivalContent>
            </FestivalCard>
          ))}
        </FestivalsGrid>
      )}
    </FestivalsContainer>
  );
};

export default Festivals;