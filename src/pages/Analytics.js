import React from 'react';
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

const Analytics = () => {
  const { currentUser } = useAuth();
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();
  
  const { transactions, loading, error } = useTransactions(currentMonth, currentYear);

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro ao carregar dados: {error.message}</div>;

  return (
    <AnalyticsContainer>
      <NavBar />
      <Title>Análise Financeira</Title>
      <Charts transactions={transactions} />
    </AnalyticsContainer>
  );
};

export default Analytics;
