import React, { useState } from 'react';
import styled from 'styled-components';
import Joyride, { STATUS } from 'react-joyride';
import Charts from '../components/Charts';
import NavBar from '../components/NavBar';
import UserHeader from '../components/UserHeader';
import useTransactions from '../hooks/useTransactions';
import AnalyticsPanels from '../components/AnalyticsPanels';
import { FaQuestionCircle } from 'react-icons/fa';

const AnalyticsContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Title = styled.h1`
  color: var(--primary);
  margin-bottom: 0.5rem;
  text-align: center;
`;

const Subtitle = styled.p`
  margin: 0 0 2rem;
  color: var(--text-secondary);
  text-align: center;
`;

const TutorialButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin: 0 auto 1.5rem;
  padding: 0.5rem 1rem;
  color: var(--text-secondary);
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 600;

  &:hover {
    color: var(--primary);
    background: var(--primary-light);
    border-color: var(--primary-light);
  }
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
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [activeView, setActiveView] = useState('resumo');
  const [runTutorial, setRunTutorial] = useState(false);
  
  const { transactions, loading, error } = useTransactions(null, selectedYear);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, index) => currentYear - index);

  const handleJoyrideCallback = ({ status }) => {
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      setRunTutorial(false);
    }
  };

  const steps = [
    {
      target: '.joyride-analytics-year',
      title: 'Selecione o ano',
      content: 'Os indicadores e a evolução mensal consideram as movimentações do ano selecionado.',
      disableBeacon: true,
    },
    {
      target: '.joyride-analytics-tabs',
      title: 'Resumo ou gráficos',
      content: 'Use Resumo para consultar os totais anuais e Gráficos Detalhados para comparar receitas e despesas mês a mês.',
    },
    {
      target: '.joyride-analytics-results',
      title: 'Leia os resultados',
      content: activeView === 'resumo'
        ? 'O resumo apresenta receitas, despesas e saldo anual. O saldo é calculado pela diferença entre receitas e despesas.'
        : 'O gráfico compara receitas e despesas por mês. Passe o cursor ou toque nos pontos para consultar os valores.',
    },
  ];

  const locale = {
    back: 'Voltar',
    close: 'Fechar',
    last: 'Finalizar',
    next: 'Próximo',
    skip: 'Pular',
  };

  if (loading) {
    return (
      <>
        <UserHeader />
        <NavBar />
        <AnalyticsContainer>
          <Title>Análise anual</Title>
          <Subtitle>Veja a evolução das receitas, despesas e do saldo ao longo do ano.</Subtitle>
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
          <Title>Análise anual</Title>
          <Subtitle>Veja a evolução das receitas, despesas e do saldo ao longo do ano.</Subtitle>
          <p>Erro ao carregar dados: {error.message}</p>
        </AnalyticsContainer>
      </>
    );
  }

  return (
    <>
      <Joyride
        steps={steps}
        run={runTutorial}
        continuous
        showSkipButton
        showProgress
        locale={locale}
        callback={handleJoyrideCallback}
        styles={{ options: { zIndex: 9999, primaryColor: '#6366f1' } }}
      />
      <UserHeader />
      <NavBar />
      <AnalyticsContainer>
        <Title>Análise anual</Title>
        <Subtitle>Veja a evolução das receitas, despesas e do saldo ao longo do ano.</Subtitle>
        <TutorialButton type="button" onClick={() => setRunTutorial(true)} aria-label="Iniciar tutorial da análise anual">
          <FaQuestionCircle />
          Tutorial da análise anual
        </TutorialButton>

        <FilterContainer>
          <Select 
            className="joyride-analytics-year"
            value={selectedYear} 
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
          >
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </Select>

        </FilterContainer>

        <TabContainer className="joyride-analytics-tabs">
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

        <div className="joyride-analytics-results">
          {activeView === 'resumo' ? (
            <AnalyticsPanels
              transactions={transactions}
              year={selectedYear}
            />
          ) : (
            <Charts
              transactions={transactions}
              year={selectedYear}
            />
          )}
        </div>
      </AnalyticsContainer>
    </>

  );
}

export default Analytics;
