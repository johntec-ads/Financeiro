import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Joyride from 'react-joyride';
import TransactionForm from '../components/TransactionForm';
import TransactionList from '../components/TransactionList';
import Summary from '../components/Summary';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import UserHeader from '../components/UserHeader';
import useTransactions from '../hooks/useTransactions';

const DashboardContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const Title = styled.h1`
  color: var(--primary);
  margin-bottom: 2rem;
  font-size: 2rem;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 1.3rem;
    margin-bottom: 0.8rem;
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
    gap: 0.8rem;
    margin-bottom: 1.5rem;
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
    padding: 0.8rem;
    font-size: 0.9rem;
  }
`;

const ContentContainer = styled.div`
  width: 100%;
  
  @media (max-width: 768px) {
    padding: 0;
    overflow-x: hidden;
  }
`;

const LoadingMessage = styled.p`
  text-align: center;
  font-size: 1.5rem;
  color: var(--primary);
`;

// Estilo customizado para o tooltip do Joyride
const CustomJoyrideStyles = {
  options: {
    zIndex: 9999,
    primaryColor: '#2E7D32',
    textColor: '#333',
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: '1.2rem',
    fontSize: 16,
    width: 350,
    boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
  },
  tooltip: {
    borderRadius: 24,
    padding: '1.2rem',
    fontSize: 16,
    maxWidth: 350,
    boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
  },
  buttonNext: {
    backgroundColor: '#2E7D32',
    borderRadius: 8,
    fontWeight: 600,
    fontSize: 15,
    padding: '0.5rem 0.8rem',
  },
  buttonBack: {
    color: '#2E7D32',
    fontWeight: 600,
    fontSize: 15,
    padding: '0.5rem 0.8rem',
  },
  buttonSkip: {
    color: '#C62828',
    fontWeight: 600,
    fontSize: 15,
    padding: '0.5rem 0.8rem',
  },
};

// Media query para mobile
const isMobile = window.innerWidth <= 600;

const Dashboard = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [runTutorial, setRunTutorial] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      navigate('/');
    }
  }, [currentUser, navigate]);

  const { transactions, loading, error, addTransaction, deleteTransaction, updateTransaction } = useTransactions(selectedMonth, selectedYear);

  const steps = [
    {
      target: '.joyride-tipo',
      content: isMobile ? 'Escolha Receita ou Despesa.' : 'Escolha se a transação é uma Receita (entrada) ou Despesa (saída).',
      disableBeacon: true,
    },
    {
      target: '.joyride-grupo',
      content: isMobile ? 'Selecione o grupo.' : 'Selecione o grupo ao qual essa transação pertence (ex: Pessoal, Trabalho, etc).',
    },
    {
      target: '.joyride-categoria',
      content: isMobile ? 'Escolha a categoria.' : 'Escolha a categoria para organizar melhor suas finanças.',
    },
    {
      target: '.joyride-valor',
      content: isMobile ? 'Informe o valor.' : 'Informe o valor da transação.',
    },
    {
      target: '.joyride-data',
      content: isMobile ? 'Escolha a data.' : 'Selecione o dia do vencimento ou recebimento.',
    },
    {
      target: '.joyride-descricao',
      content: isMobile ? 'Descrição (opcional).' : 'Adicione uma descrição para identificar melhor a transação (opcional).',
    },
    {
      target: '.add-transaction-btn',
      content: isMobile ? 'Salvar.' : 'Clique aqui para salvar a transação preenchida.',
    },
  ];

  const locale = {
    back: 'Voltar',
    close: 'Fechar',
    last: 'Finalizar',
    next: 'Próximo',
    skip: 'Pular',
  };

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril',
    'Maio', 'Junho', 'Julho', 'Agosto',
    'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const years = [2023, 2024, 2025, 2026];

  return (
    <DashboardContainer>
      {currentUser ? (
        <>
          <Joyride
            steps={steps}
            run={runTutorial}
            continuous
            showSkipButton
            showProgress
            locale={locale}
            styles={CustomJoyrideStyles}
          />
          <UserHeader />
          <NavBar />
          <Title>Controle Financeiro</Title>

          <FilterContainer>
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
          </FilterContainer>

          <ContentContainer>
            <Summary transactions={transactions} />
            <TransactionForm addTransaction={addTransaction} selectedMonth={selectedMonth} selectedYear={selectedYear} />
            {loading && <p>Carregando transações...</p>}
            {error && <p>Erro ao carregar transações.</p>}
            <TransactionList 
              transactions={transactions} 
              deleteTransaction={deleteTransaction} 
              updateTransaction={updateTransaction}
              loading={loading}
              error={error}
            />
          </ContentContainer>
        </>
      ) : (
        <LoadingMessage role="status" aria-live="polite">
          Carregando...
        </LoadingMessage>
      )}
    </DashboardContainer>
  );
};

export default Dashboard;