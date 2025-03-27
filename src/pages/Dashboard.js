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
    padding: 1rem;
  }
`;

const Title = styled.h1`
  color: var(--primary);
  margin-bottom: 2rem;
  font-size: 2rem;
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
  
  &:focus {
    outline: 2px solid var(--primary);
    border-color: transparent;
  }
`;

const Dashboard = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // Mês atual
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());   // Ano atual

  const { transactions, loading, error, addTransaction, deleteTransaction, updateTransaction } = useTransactions(selectedMonth, selectedYear);

  const months = Array.from({ length: 12 }, (_, i) => i + 1); // [1, 2, ..., 12]
  const years = [2023, 2024, 2025, 2026]; // Adicione mais anos conforme necessário

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
      <TransactionList transactions={transactions} deleteTransaction={deleteTransaction} updateTransaction={updateTransaction} />
    </DashboardContainer>
  );
};

export default Dashboard;
