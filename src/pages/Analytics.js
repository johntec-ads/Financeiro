import React, { useState } from 'react';
import styled from 'styled-components';
import Charts from '../components/Charts';
import NavBar from '../components/NavBar';
import UserHeader from '../components/UserHeader';
import useTransactions from '../hooks/useTransactions';
import AnalyticsPanels from '../components/AnalyticsPanels';
import { transactionTypes } from '../constants/transactionTypes';

const AnalyticsContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Title = styled.h1`
  color: var(--primary);
  margin-bottom: 2rem;
  text-align: center;
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  justify-content: center;
  flex-wrap: wrap;
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 1px solid var(--border);
  border-radius: 8px;
  background-color: var(--card-bg);
  min-width: 150px;
  font-size: 1rem;
`;

const TabContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  justify-content: center;
`;

const Tab = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  background-color: ${props => props.active ? 'var(--primary)' : 'var(--card-bg)'};
  color: ${props => props.active ? 'white' : 'var(--text)'};
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s;

  &:hover {
    background-color: ${props => props.active ? 'var(--primary-hover)' : 'var(--border)'};
  }
`;

const Analytics = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedType, setSelectedType] = useState('');
  const [activeView, setActiveView] = useState('resumo');
  
  const { transactions, loading, error } = useTransactions(selectedMonth, selectedYear);

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril',
    'Maio', 'Junho', 'Julho', 'Agosto',
    'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const years = [2023, 2024, 2025, 2026];

  // Filtra transações baseado no tipo selecionado
  const filteredTransactions = selectedType
    ? transactions.filter(t => t.transactionType === selectedType)
    : transactions;

  if (loading) {
    return (
      <>
        <UserHeader />
        <NavBar />
        <AnalyticsContainer>
          <Title>Análise Financeira</Title>
          <p>Carregando análises...</p>
        </AnalyticsContainer>
      </>
    );
  }

  if (error) {
    return (
      <>
        <UserHeader />
        <NavBar />
        <AnalyticsContainer>
          <Title>Análise Financeira</Title>
          <p>Erro ao carregar dados: {error.message}</p>
        </AnalyticsContainer>
      </>
    );
  }

  return (
    <>
      <UserHeader />
      <NavBar />
      <AnalyticsContainer>
        <Title>Análise Financeira</Title>

        <FilterContainer>
          <Select 
            value={selectedMonth} 
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
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
          >
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </Select>

          <Select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option value="">Todos os grupos</option>
            {transactionTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </Select>
        </FilterContainer>

        <TabContainer>
          <Tab 
            active={activeView === 'resumo'} 
            onClick={() => setActiveView('resumo')}
          >
            Resumo
          </Tab>
          <Tab 
            active={activeView === 'graficos'} 
            onClick={() => setActiveView('graficos')}
          >
            Gráficos Detalhados
          </Tab>
        </TabContainer>

        {activeView === 'resumo' ? (
          <AnalyticsPanels transactions={filteredTransactions} />
        ) : (
          <Charts transactions={filteredTransactions} />
        )}
      </AnalyticsContainer>
    </>

  );
}

export default Analytics;

