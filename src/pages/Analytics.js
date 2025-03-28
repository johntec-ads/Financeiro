import React, { useState } from 'react';
import styled from 'styled-components';
import Charts from '../components/Charts';
import NavBar from '../components/NavBar';
import { useAuth } from '../context/AuthContext';
import useTransactions from '../hooks/useTransactions';

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

const Analytics = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const { currentUser } = useAuth();
  
  const { transactions, loading, error } = useTransactions(selectedMonth, selectedYear);

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril',
    'Maio', 'Junho', 'Julho', 'Agosto',
    'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const years = [2023, 2024, 2025, 2026];

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro ao carregar dados: {error.message}</div>;

  return (
    <AnalyticsContainer>
      <NavBar />
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
      </FilterContainer>

      <Charts transactions={transactions} />
    </AnalyticsContainer>
  );
};

export default Analytics;
