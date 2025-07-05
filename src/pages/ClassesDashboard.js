import React, { useState } from 'react';
import styled from 'styled-components';
import { useClasses } from '../context/ClassContext';
import { useAuth } from '../context/AuthContext';
import NavBar from '../components/NavBar';
import UserHeader from '../components/UserHeader';
import ClassCard from '../components/ClassCard';
import ClassManager from '../components/ClassManager';
import { FiPlus, FiGrid, FiBarChart2 } from 'react-icons/fi';

const DashboardContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const HeaderSection = styled.div`
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  color: var(--primary);
  margin-bottom: 1rem;
  font-size: 2rem;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const StatsOverview = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background-color: var(--card-bg);
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const StatItem = styled.div`
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary);
  margin-bottom: 0.25rem;
`;

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: var(--text-secondary);
`;

const ActionsBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding: 1rem;
  background-color: var(--card-bg);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const ActionTitle = styled.h2`
  margin: 0;
  color: var(--text);
  font-size: 1.25rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
  }
`;

const ActionButton = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  background-color: var(--primary);
  color: white;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background-color: var(--primary-hover);
  }

  &:focus {
    outline: 2px solid var(--primary);
  }

  &.secondary {
    background-color: transparent;
    color: var(--primary);
    border: 1px solid var(--primary);

    &:hover {
      background-color: var(--primary-light);
    }
  }
`;

const ClassesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  color: var(--text-secondary);
`;

const EmptyStateIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.5;
`;

const EmptyStateTitle = styled.h3`
  margin: 0 0 0.5rem 0;
  color: var(--text);
`;

const EmptyStateDescription = styled.p`
  margin: 0 0 2rem 0;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.5;
`;

const FilterSection = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  justify-content: center;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 1px solid var(--border);
  border-radius: 8px;
  background-color: var(--card-bg);
  color: var(--text);
  min-width: 150px;
  font-size: 1rem;
  
  &:focus {
    outline: 2px solid var(--primary);
    border-color: transparent;
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const ClassesDashboard = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [showClassManager, setShowClassManager] = useState(false);
  
  const { currentUser } = useAuth();
  const { classes, activeClass, switchActiveClass } = useClasses();

  // Calcular estatísticas gerais
  const getClassSummary = (classItem) => {
    // Por simplicidade, retornando dados mock
    // Em uma implementação real, você consultaria as transações de cada classe
    return {
      receitas: Math.random() * 5000,
      despesas: Math.random() * 3000,
      total: (Math.random() - 0.5) * 2000,
      transactionCount: Math.floor(Math.random() * 20) + 1
    };
  };

  const totalClasses = classes.length;
  const totalReceitas = classes.reduce((sum, cls) => sum + getClassSummary(cls).receitas, 0);
  const totalDespesas = classes.reduce((sum, cls) => sum + getClassSummary(cls).despesas, 0);
  const saldoGeral = totalReceitas - totalDespesas;

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril',
    'Maio', 'Junho', 'Julho', 'Agosto',
    'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const years = [2023, 2024, 2025, 2026];

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const handleClassClick = (classItem) => {
    switchActiveClass(classItem);
    // Navegar para o dashboard principal ou mostrar detalhes
  };

  if (!currentUser) {
    return <div>Carregando...</div>;
  }

  return (
    <DashboardContainer>
      <UserHeader onManageClasses={() => setShowClassManager(true)} />
      <NavBar />
      
      <HeaderSection>
        <Title>Todas as Classes Financeiras</Title>
        
        <StatsOverview>
          <StatItem>
            <StatValue>{totalClasses}</StatValue>
            <StatLabel>Classes Ativas</StatLabel>
          </StatItem>
          <StatItem>
            <StatValue>{formatCurrency(totalReceitas)}</StatValue>
            <StatLabel>Total Receitas</StatLabel>
          </StatItem>
          <StatItem>
            <StatValue>{formatCurrency(totalDespesas)}</StatValue>
            <StatLabel>Total Despesas</StatLabel>
          </StatItem>
          <StatItem>
            <StatValue style={{ color: saldoGeral >= 0 ? 'var(--success)' : 'var(--danger)' }}>
              {formatCurrency(saldoGeral)}
            </StatValue>
            <StatLabel>Saldo Geral</StatLabel>
          </StatItem>
        </StatsOverview>
      </HeaderSection>

      <ActionsBar>
        <ActionTitle>
          <FiGrid />
          Minhas Classes ({classes.length})
        </ActionTitle>
        <ActionButtons>
          <ActionButton 
            className="secondary"
            onClick={() => setShowClassManager(true)}
          >
            <FiBarChart2 />
            Gerenciar
          </ActionButton>
          <ActionButton onClick={() => setShowClassManager(true)}>
            <FiPlus />
            Nova Classe
          </ActionButton>
        </ActionButtons>
      </ActionsBar>

      <FilterSection>
        <Select 
          value={selectedMonth} 
          onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
          aria-label="Selecionar mês"
        >
          {monthNames.map((month, index) => (
            <option key={index + 1} value={index + 1}>
              {month}
            </option>
          ))}
        </Select>
        <Select 
          value={selectedYear} 
          onChange={(e) => setSelectedYear(parseInt(e.target.value))}
          aria-label="Selecionar ano"
        >
          {years.map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </Select>
      </FilterSection>

      {classes.length === 0 ? (
        <EmptyState>
          <EmptyStateIcon>📊</EmptyStateIcon>
          <EmptyStateTitle>Nenhuma classe encontrada</EmptyStateTitle>
          <EmptyStateDescription>
            Crie sua primeira classe financeira para começar a organizar 
            suas receitas e despesas por categoria ou projeto.
          </EmptyStateDescription>
          <ActionButton onClick={() => setShowClassManager(true)}>
            <FiPlus />
            Criar Primeira Classe
          </ActionButton>
        </EmptyState>
      ) : (
        <ClassesGrid>
          {classes.map(classItem => (
            <ClassCard
              key={classItem.id}
              classData={classItem}
              summary={getClassSummary(classItem)}
              onClick={() => handleClassClick(classItem)}
              isActive={activeClass?.id === classItem.id}
            />
          ))}
        </ClassesGrid>
      )}

      <ClassManager 
        isOpen={showClassManager}
        onClose={() => setShowClassManager(false)}
      />
    </DashboardContainer>
  );
};

export default ClassesDashboard;
