import React from 'react';
import styled from 'styled-components';
import { Bar } from 'react-chartjs-2';
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const AnalyticsPanelContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const MetricGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`;

const Panel = styled.section`
  background: var(--card-bg);
  padding: 1.5rem;
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
`;

const Metric = styled(Panel)`
  border-top: 4px solid ${props => props.color};
`;

const Eyebrow = styled.span`
  display: block;
  color: var(--text-secondary);
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;

const MetricValue = styled.strong`
  display: block;
  margin-top: 0.35rem;
  color: ${props => props.color};
  font-size: 1.5rem;
`;

const PanelTitle = styled.h2`
  margin: 0 0 0.35rem;
  color: var(--text);
  font-size: 1.15rem;
`;

const PanelDescription = styled.p`
  margin: 0 0 1rem;
  color: var(--text-secondary);
  font-size: 0.9rem;
`;

const ChartWrapper = styled.div`
  height: 320px;

  @media (max-width: 600px) {
    height: 260px;
  }
`;

const GroupList = styled.div`
  display: grid;
  gap: 0.75rem;
`;

const GroupRow = styled.div`
  display: grid;
  grid-template-columns: minmax(120px, 1fr) repeat(3, minmax(95px, auto));
  gap: 1rem;
  align-items: center;
  padding: 0.85rem 0;
  border-bottom: 1px solid var(--border);

  &:last-child {
    border-bottom: none;
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr 1fr;
    gap: 0.5rem;
  }
`;

const GroupName = styled.strong`
  color: var(--text);
`;

const Amount = styled.span`
  color: ${props => props.color};
  font-size: 0.9rem;
  text-align: right;

  @media (max-width: 600px) {
    text-align: left;
  }
`;

const EmptyState = styled.p`
  margin: 0;
  padding: 1rem 0;
  color: var(--text-secondary);
  text-align: center;
`;

const formatCurrency = value => new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
}).format(value);

const AnalyticsPanels = ({ transactions, monthName, year }) => {
  const groups = transactions.reduce((acc, transaction) => {
    const group = transaction.transactionType || 'Outros';
    if (!acc[group]) acc[group] = { receitas: 0, despesas: 0 };

    const value = Number(transaction.value) || 0;
    if (transaction.type === 'receita') {
      acc[group].receitas += value;
    } else if (transaction.type === 'despesa') {
      acc[group].despesas += value;
    }
    return acc;
  }, {});

  const totals = Object.values(groups).reduce(
    (acc, group) => ({
      receitas: acc.receitas + group.receitas,
      despesas: acc.despesas + group.despesas,
    }),
    { receitas: 0, despesas: 0 }
  );
  const saldo = totals.receitas - totals.despesas;
  const groupNames = Object.keys(groups);

  const chartData = {
    labels: groupNames,
    datasets: [
      {
        label: 'Receitas',
        data: groupNames.map(group => groups[group].receitas),
        backgroundColor: '#10b981',
        borderRadius: 6,
      },
      {
        label: 'Despesas',
        data: groupNames.map(group => groups[group].despesas),
        backgroundColor: '#ef4444',
        borderRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: value => formatCurrency(value),
        },
      },
    },
    plugins: {
      legend: { position: 'bottom' },
      tooltip: {
        callbacks: {
          label: context => `${context.dataset.label}: ${formatCurrency(context.raw)}`,
        },
      },
    },
  };

  return (
    <AnalyticsPanelContainer>
      <MetricGrid>
        <Metric color="var(--success)">
          <Eyebrow>Receitas no período</Eyebrow>
          <MetricValue color="var(--success)">{formatCurrency(totals.receitas)}</MetricValue>
        </Metric>
        <Metric color="var(--danger)">
          <Eyebrow>Despesas no período</Eyebrow>
          <MetricValue color="var(--danger)">{formatCurrency(totals.despesas)}</MetricValue>
        </Metric>
        <Metric color={saldo >= 0 ? 'var(--primary)' : 'var(--danger)'}>
          <Eyebrow>Saldo do período</Eyebrow>
          <MetricValue color={saldo >= 0 ? 'var(--primary)' : 'var(--danger)'}>
            {formatCurrency(saldo)}
          </MetricValue>
        </Metric>
      </MetricGrid>

      <Panel>
        <PanelTitle>Receitas e despesas por grupo</PanelTitle>
        <PanelDescription>{monthName} de {year}</PanelDescription>
        {groupNames.length > 0 ? (
          <ChartWrapper>
            <Bar data={chartData} options={chartOptions} />
          </ChartWrapper>
        ) : (
          <EmptyState>Nenhuma transação encontrada neste período.</EmptyState>
        )}
      </Panel>

      <Panel>
        <PanelTitle>Resumo por grupo</PanelTitle>
        <PanelDescription>Compare entradas, saídas e saldo de cada grupo.</PanelDescription>
        {groupNames.length > 0 ? (
          <GroupList>
            <GroupRow>
              <Eyebrow>Grupo</Eyebrow>
              <Eyebrow>Receitas</Eyebrow>
              <Eyebrow>Despesas</Eyebrow>
              <Eyebrow>Saldo</Eyebrow>
            </GroupRow>
            {groupNames.map(group => {
              const values = groups[group];
              return (
                <GroupRow key={group}>
                  <GroupName>{group}</GroupName>
                  <Amount color="var(--success)">{formatCurrency(values.receitas)}</Amount>
                  <Amount color="var(--danger)">{formatCurrency(values.despesas)}</Amount>
                  <Amount color={values.receitas - values.despesas >= 0 ? 'var(--primary)' : 'var(--danger)'}>
                    {formatCurrency(values.receitas - values.despesas)}
                  </Amount>
                </GroupRow>
              );
            })}
          </GroupList>
        ) : (
          <EmptyState>Nenhum grupo possui movimentações neste período.</EmptyState>
        )}
      </Panel>
    </AnalyticsPanelContainer>
  );
};

export default AnalyticsPanels;
