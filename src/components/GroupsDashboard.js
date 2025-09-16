import React, { useState } from 'react';
import styled from 'styled-components';
import { FiGrid, FiBarChart2 } from 'react-icons/fi';
import { transactionTypes, typeDescriptions } from '../constants/transactionTypes';

const DashboardContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const Header = styled.div`
  margin-bottom: 2rem;
  text-align: center;
`;

const Title = styled.h1`
  color: var(--primary);
  margin-bottom: 1rem;
  font-size: 2rem;
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const TypesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const TypeCard = styled.div`
  background: var(--card-bg);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid ${props => props.active ? 'var(--primary)' : 'transparent'};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

const TypeTitle = styled.h3`
  color: var(--text);
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const TypeDescription = styled.p`
  color: var(--text-secondary);
  font-size: 0.9rem;
`;

const StatsSection = styled.div`
  background: var(--card-bg);
  border-radius: 12px;
  padding: 1.5rem;
  margin-top: 2rem;
`;

const FilterBar = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
`;

const FilterButton = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 20px;
  border: none;
  background: ${props => props.active ? 'var(--primary)' : 'var(--bg-secondary)'};
  color: ${props => props.active ? 'white' : 'var(--text)'};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.active ? 'var(--primary-hover)' : 'var(--border)'};
  }
`;

const GroupsDashboard = () => {
  const [selectedType, setSelectedType] = useState(null);
  const [viewMode, setViewMode] = useState('grid');

  return (
    <DashboardContainer>
      <Header>
        <Title>Visão por Grupos</Title>
      </Header>

      <FilterBar>
        <FilterButton 
          active={viewMode === 'grid'} 
          onClick={() => setViewMode('grid')}
        >
          <FiGrid /> Grade
        </FilterButton>
        <FilterButton 
          active={viewMode === 'stats'} 
          onClick={() => setViewMode('stats')}
        >
          <FiBarChart2 /> Estatísticas
        </FilterButton>
      </FilterBar>

      <TypesGrid>
        {transactionTypes.map(type => (
          <TypeCard
            key={type}
            active={selectedType === type}
            onClick={() => setSelectedType(type)}
          >
            <TypeTitle>{type}</TypeTitle>
            <TypeDescription>{typeDescriptions[type]}</TypeDescription>
          </TypeCard>
        ))}
      </TypesGrid>

      {selectedType && (
        <StatsSection>
          {/* Aqui você pode adicionar gráficos e estatísticas específicas do tipo selecionado */}
        </StatsSection>
      )}
    </DashboardContainer>
  );
};

export default GroupsDashboard;