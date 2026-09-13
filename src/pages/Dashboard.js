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
      target: '.navbar',
      title: 'Navegação do sistema',
      content: (
        <>
          Use <strong>Resumo mensal</strong> para lançar e acompanhar as movimentações do mês.
          A <strong>Análise anual</strong> mostra a evolução de receitas, despesas e saldo ao longo do ano.
        </>
      ),
      disableBeacon: true,
    },
    {
      target: '.joyride-tipo',
      title: '1. Defina o tipo',
      content: (
        <>
          Escolha <strong>Receita</strong> para o dinheiro que entra ou <strong>Despesa</strong> para o dinheiro que sai.
          O tipo fica selecionado para facilitar lançamentos consecutivos.
        </>
      ),
    },
    {
      target: '.joyride-grupo',
      title: '2. Escolha o grupo',
      content: (
        <>
          Selecione a área da movimentação, como <strong>Pessoal</strong>, <strong>Trabalho</strong>,
          <strong> Família</strong> ou <strong>Investimentos</strong>.
        </>
      ),
    },
    {
      target: '.joyride-categoria',
      title: '3. Detalhe a categoria',
      content: (
        <>
          As categorias dependem do <strong>Tipo</strong> e do <strong>Grupo</strong>.
          Primeiro escolha o Grupo; depois selecione a categoria mais adequada.
        </>
      ),
    },
    {
      target: '.joyride-valor',
      title: '4. Informe o valor',
      content: 'Digite o valor da movimentação. Use o formato de moeda local, por exemplo, 1.250,00.',
    },
    {
      target: '.joyride-data',
      title: '5. Informe a data',
      content: 'Selecione quando a movimentação aconteceu. A data define em qual mês e ano ela aparecerá nos resumos.',
    },
    {
      target: '.joyride-descricao',
      title: '6. Adicione uma descrição',
      content: (
        <>
          Este campo é opcional. Use uma descrição curta para facilitar consultas futuras,
          como <strong>Almoço com cliente</strong> ou <strong>Conta de luz</strong>.
        </>
      ),
    },
    {
      target: '.add-transaction-btn',
      title: '7. Salve o lançamento',
      content: 'Confira os dados e clique aqui para registrar a movimentação na lista do resumo mensal.',
    },
  ];

  const stepsMobile = [
    {
      target: '.navbar',
      title: 'Navegação',
      content: 'Use Resumo mensal para os lançamentos e Análise anual para acompanhar o ano.',
      disableBeacon: true,
    },
    {
      target: '.joyride-tipo',
      title: '1. Tipo',
      content: 'Escolha Receita (entrada) ou Despesa (saída). O tipo permanece selecionado no próximo lançamento.',
    },
    {
      target: '.joyride-grupo',
      title: '2. Grupo',
      content: 'Escolha o grupo da movimentação, como Pessoal, Trabalho, Família ou Investimentos.',
    },
    {
      target: '.joyride-categoria',
      title: '3. Categoria',
      content: 'Escolha o Grupo primeiro. As categorias disponíveis mudam conforme o Tipo e o Grupo.',
    },
    {
      target: '.joyride-valor',
      title: '4. Valor',
      content: 'Digite o valor da movimentação.',
    },
    {
      target: '.joyride-data',
      title: '5. Data',
      content: 'A data define o mês do Resumo mensal e o ano da Análise anual.',
    },
    {
      target: '.joyride-descricao',
      title: '6. Descrição opcional',
      content: 'Adicione uma observação curta para encontrar este lançamento com mais facilidade depois.',
    },
    {
      target: '.add-transaction-btn',
      title: '7. Salvar',
      content: 'Confira os dados e toque aqui para salvar.',
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
