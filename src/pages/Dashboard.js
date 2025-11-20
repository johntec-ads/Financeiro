import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Joyride, { STATUS } from 'react-joyride';
import TransactionForm from '../components/TransactionForm';
import TransactionList from '../components/TransactionList';
import Summary from '../components/Summary';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import UserHeader from '../components/UserHeader';
import useTransactions from '../hooks/useTransactions';
import { FaQuestionCircle } from 'react-icons/fa';

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

const TitleContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const Title = styled.h1`
  color: var(--text);
  font-size: 1.75rem;
  font-weight: 700;
  text-align: left;
  letter-spacing: -0.02em;

  @media (max-width: 768px) {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
    text-align: center;
  }
`;

const TutorialButton = styled.button`
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  color: var(--text-secondary);
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  margin-left: auto;
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  border-radius: 999px;
  transition: all 0.2s ease;
  gap: 0.5rem;

  &:hover {
    background: var(--primary-light);
    color: var(--primary);
    border-color: var(--primary-light);
  }

  span {
    margin-left: 0;
  }

  @media (max-width: 768px) {
    margin-left: 0;
    margin-top: 0.5rem;
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
    primaryColor: '#6366f1',
    textColor: '#1e293b',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: '1.5rem',
    fontSize: 15,
    width: 380,
    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  },
  tooltip: {
    borderRadius: 16,
    padding: '1.5rem',
    fontSize: 15,
    maxWidth: 380,
    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  },
  buttonNext: {
    backgroundColor: '#6366f1',
    borderRadius: 8,
    fontWeight: 600,
    fontSize: 14,
    padding: '0.6rem 1rem',
    color: '#fff',
  },
  buttonBack: {
    color: '#6366f1',
    fontWeight: 600,
    fontSize: 14,
    padding: '0.6rem 1rem',
  },
  buttonSkip: {
    color: '#ef4444',
    fontWeight: 600,
    fontSize: 14,
    padding: '0.6rem 1rem',
  },
};

// Media query para mobile
const isMobile = window.innerWidth <= 600;

const Dashboard = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [runTutorial, setRunTutorial] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      navigate('/');
    }
  }, [currentUser, navigate]);

  const { transactions, loading, error, addTransaction, deleteTransaction, updateTransaction } = useTransactions(selectedMonth, selectedYear);

  const handleJoyrideCallback = (data) => {
    const { status } = data;
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      setRunTutorial(false);
    }
  };

  const stepsDesktop = [
    {
      target: '.joyride-tipo',
      content: 'Comece por aqui! Defina se a transação é uma **Receita** (dinheiro que entra) ou uma **Despesa** (dinheiro que sai). Esta é a base para organizar suas finanças.',
      disableBeacon: true,
    },
    {
      target: '.joyride-grupo',
      content: 'Agora, agrupe sua transação. Pertence a algo **Pessoal**, do **Trabalho** ou outra área? Agrupar ajuda a ter uma visão geral de onde seu dinheiro está circulando.',
    },
    {
      target: '.joyride-categoria',
      content: 'Seja específico! Escolha uma **categoria** como "Alimentação", "Transporte" ou "Salário". Quanto mais detalhado, melhores e mais úteis serão seus relatórios financeiros.',
    },
    {
      target: '.joyride-valor',
      content: 'Qual o **valor** desta transação? Insira o montante usando o formato de moeda local. Este é o coração do seu controle financeiro!',
    },
    {
      target: '.joyride-data',
      content: 'Quando esta transação aconteceu ou está agendada? Selecione a **data** correta para manter seu fluxo de caixa sempre preciso e organizado.',
    },
    {
      target: '.joyride-descricao',
      content: 'Tem algum detalhe que vale a pena lembrar? Adicione uma **descrição** curta. Por exemplo: "Almoço com cliente" ou "Conta de luz de Maio". Ajuda muito na hora de revisar seus gastos!',
    },
    {
      target: '.add-transaction-btn',
      content: 'Tudo pronto! Clique aqui para **salvar** sua nova transação e vê-la registrada na sua lista. Parabéns por manter o controle de suas finanças!',
    },
  ];

  const stepsMobile = [
    {
      target: '.joyride-tipo',
      content: 'É uma **Receita** (entrada) ou **Despesa** (saída)? Comece por aqui para organizar a transação.',
      disableBeacon: true,
    },
    {
      target: '.joyride-grupo',
      content: 'Agrupe a transação. É algo **Pessoal**, do **Trabalho**, etc? Isso ajuda a dar uma visão geral.',
    },
    {
      target: '.joyride-categoria',
      content: 'Escolha uma **categoria** (ex: "Alimentação", "Salário"). Detalhes geram relatórios melhores!',
    },
    {
      target: '.joyride-valor',
      content: 'Qual o **valor** da transação? Insira o montante para seu controle financeiro.',
    },
    {
      target: '.joyride-data',
      content: 'Selecione a **data** da transação para manter seu fluxo de caixa preciso.',
    },
    {
      target: '.joyride-descricao',
      content: 'Adicione uma **descrição** curta para lembrar dos detalhes. (Opcional)',
    },
    {
      target: '.add-transaction-btn',
      content: 'Pronto! Clique para **salvar** a transação na sua lista.',
    },
  ];

  const steps = isMobile ? stepsMobile : stepsDesktop;

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
            callback={handleJoyrideCallback}
          />
          <UserHeader />
          <TitleContainer>
            <Title>Controle Financeiro</Title>
            <TutorialButton onClick={() => setRunTutorial(true)} aria-label="Iniciar tutorial">
              <FaQuestionCircle />
              <span>Tutorial</span>
            </TutorialButton>
          </TitleContainer>
          <NavBar />

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
