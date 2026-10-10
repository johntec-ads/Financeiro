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

const HeadingBlock = styled.div`
  min-width: 0;
  text-align: center;
`;

const Title = styled.h1`
  margin: 0;
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

const Subtitle = styled.p`
  margin: 0.5rem 0 0;
  color: var(--text-secondary);
  text-align: center;
  line-height: 1.4;
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
  padding-bottom: 90px;
  
  @media (max-width: 768px) {
    padding: 0 0 85px 0;
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
    width: 400,
    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  },
  tooltip: {
    borderRadius: 16,
    padding: '1.25rem',
    fontSize: 15,
    maxWidth: 400,
    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  },
  buttonNext: {
    backgroundColor: '#6366f1',
    borderRadius: 8,
    fontWeight: 600,
    fontSize: 14,
    padding: '0.65rem 1.1rem',
    color: '#fff',
    boxShadow: '0 4px 10px rgb(99 102 241 / 0.25)',
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
  beacon: {
    display: 'none',
  },
};

const Dashboard = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [runTutorial, setRunTutorial] = useState(false);

  useEffect(() => {
    const updateMobileState = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', updateMobileState);
    return () => window.removeEventListener('resize', updateMobileState);
  }, []);

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

  const steps = [
    {
      target: '.navbar',
      title: 'Navegação',
      content: 'O Resumo mensal concentra os lançamentos e o acompanhamento do mês. A Análise anual reúne os resultados e gráficos do ano.',
      disableBeacon: true,
    },
    {
      target: '.joyride-period-filter',
      title: 'Escolha o período',
      content: 'Selecione mês e ano. Os totais e lançamentos desta tela acompanham o período selecionado.',
    },
    {
      target: '.joyride-summary',
      title: 'Resumo do mês',
      content: 'Entradas mostram as receitas; Saídas, as despesas; e Saldo Total é a diferença entre elas, independentemente do pagamento.',
    },
    {
      target: '.joyride-pending',
      title: 'Restante a pagar',
      content: 'Este valor soma as despesas ainda não pagas. Você pode ocultar a barra e reabri-la pelo botão Mostrar card.',
    },
    {
      target: '.joyride-tipo',
      title: 'Comece um lançamento',
      content: 'Escolha Receita para uma entrada ou Despesa para uma saída. O tipo determina as categorias disponíveis.',
    },
    {
      target: '.joyride-grupo',
      title: 'Grupo e categoria',
      content: 'Escolha o grupo e depois uma categoria. Informe também valor e data; a descrição é opcional. A data define o período do lançamento.',
    },
    {
      target: '.add-transaction-btn',
      title: 'Salvar lançamento',
      content: isMobile ? 'Toque aqui para validar e salvar a movimentação.' : 'Clique aqui para validar e salvar a movimentação.',
    },
    {
      target: '.joyride-transactions',
      title: 'Acompanhe os lançamentos',
      content: transactions.length
        ? 'Na lista, use o controle de status para marcar uma despesa como paga. Também é possível editar ou excluir lançamentos; itens pagos ficam visualmente atenuados.'
        : 'Depois de salvar o primeiro lançamento, ele aparecerá nesta área. Você poderá marcar despesas como pagas e editar ou excluir itens.',
    },
    ...(transactions.length > 0 ? [{
      target: isMobile ? '.joyride-expense-filters-mobile' : '.joyride-expense-filters-desktop',
      title: 'Filtre e ordene despesas',
      content: isMobile
        ? 'Toque em Mostrar filtros de despesas para filtrar por vencimento ou pagamento e ordenar por vencimento ou valor.'
        : 'Filtre despesas vencidas, próximas, pagas ou não pagas e ordene por vencimento ou valor.',
    }] : []),
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
            callback={handleJoyrideCallback}
          />
          <UserHeader />
          <TitleContainer>
            <HeadingBlock>
              <Title>Resumo mensal</Title>
              <Subtitle>Acompanhe suas movimentações e resultados do mês selecionado.</Subtitle>
            </HeadingBlock>
            <TutorialButton onClick={() => setRunTutorial(true)} aria-label="Iniciar tutorial">
              <FaQuestionCircle />
              <span>Tutorial</span>
            </TutorialButton>
          </TitleContainer>
          <NavBar />

          <FilterContainer className="joyride-period-filter">
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
            <div className="joyride-transactions">
              <TransactionList 
                transactions={transactions} 
                deleteTransaction={deleteTransaction} 
                updateTransaction={updateTransaction}
                loading={loading}
                error={error}
              />
            </div>
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
