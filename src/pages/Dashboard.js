import React, { useState } from 'react';
import styled from 'styled-components';
import TransactionForm from '../components/TransactionForm';
import TransactionList from '../components/TransactionList';
import Summary from '../components/Summary';
import useTransactions from '../hooks/useTransactions';

const DashboardContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;

  @media (max-width: 768px) {
    padding: var(--mobile-padding);
  }
`;

const Title = styled.h1`
  color: var(--primary);
  margin-bottom: 2rem;
  font-size: 2rem;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  justify-content: center;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.5rem;
  }
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 1px solid var(--border);
  border-radius: 8px;
  background-color: var(--card-bg);
  min-width: 150px;
  font-size: 1rem;
  
  &:focus {
    outline: 2px solid var(--primary);
    border-color: transparent;
  }

  @media (max-width: 768px) {
    width: 100%;
    min-width: auto;
  }
`;

const Dashboard = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // Mês atual
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());   // Ano atual

  const { transactions, loading, error, addTransaction, deleteTransaction, updateTransaction } = useTransactions(selectedMonth, selectedYear);

  const months = Array.from({ length: 12 }, (_, i) => i + 1); // [1, 2, ..., 12]
  const years = [2023, 2024, 2025, 2026]; // Adicione mais anos conforme necessário

  console.log('Estado atual:', { selectedMonth, selectedYear, transactions }); // Debug

  return (
    <DashboardContainer>
      <Title>Controle Financeiro</Title>

      <FilterContainer>
        <Select value={selectedMonth} onChange={(e) => setSelectedMonth(parseInt(e.target.value))}>
          {months.map(month => (
            <option key={month} value={month}>{month}</option>
          ))}
        </Select>
        <Select value={selectedYear} onChange={(e) => setSelectedYear(parseInt(e.target.value))}>
          {years.map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </Select>
      </FilterContainer>

      <Summary transactions={transactions} />
      <TransactionForm addTransaction={addTransaction} selectedMonth={selectedMonth} selectedYear={selectedYear} />
      {loading && <p>Carregando transações...</p>}
      {error && <p>Erro: {error.message}</p>}
      <TransactionList 
        transactions={transactions} 
        deleteTransaction={deleteTransaction} 
        updateTransaction={updateTransaction}
        loading={loading}
        error={error}
      />
    </DashboardContainer>
  );
};

export default Dashboard;
