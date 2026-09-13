import React from 'react';
import styled from 'styled-components';
import { Line } from 'react-chartjs-2';
import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const ChartContainer = styled.section`
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  box-shadow: var(--shadow-sm);
`;

const ChartTitle = styled.h2`
  margin: 0;
  color: var(--text);
  font-size: 1.15rem;
`;

const ChartDescription = styled.p`
  margin: 0.35rem 0 1.25rem;
  color: var(--text-secondary);
  font-size: 0.9rem;
`;

const ChartWrapper = styled.div`
  height: 390px;

  @media (max-width: 600px) {
    height: 280px;
  }
`;

const EmptyState = styled.p`
  padding: 2rem 0;
  color: var(--text-secondary);
  text-align: center;
`;

const Charts = ({ transactions, year }) => {
  const months = [
    'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
    'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez',
  ];
  const monthly = months.map((_, month) => transactions.reduce((acc, transaction) => {
    const transactionMonth = new Date(transaction.date).getMonth();
    if (transactionMonth !== month) return acc;
    const value = Number(transaction.value) || 0;
    if (transaction.type === 'receita') acc.receitas += value;
    if (transaction.type === 'despesa') acc.despesas += value;
    return acc;
  }, { receitas: 0, despesas: 0 }));

  const hasData = monthly.some(month => month.receitas > 0 || month.despesas > 0);
  const data = {
    labels: months,
    datasets: [
      {
        label: 'Receitas',
        data: monthly.map(month => month.receitas),
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.16)',
        fill: true,
        tension: 0.4,
        pointRadius: 3,
      },
      {
        label: 'Despesas',
        data: monthly.map(month => month.despesas),
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.12)',
        fill: true,
        tension: 0.4,
        pointRadius: 3,
      },
    ],
  };
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: value => `R$ ${Number(value).toLocaleString('pt-BR')}`,
        },
      },
    },
    plugins: {
      legend: { position: 'bottom' },
      tooltip: {
        callbacks: {
          label: context => `${context.dataset.label}: R$ ${Number(context.raw).toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
          })}`,
        },
      },
    },
  };

  return (
    <ChartContainer>
      <ChartTitle>Evolução financeira</ChartTitle>
      <ChartDescription>
        Comparativo mensal de receitas e despesas em {year}.
      </ChartDescription>
      {hasData ? (
        <ChartWrapper>
          <Line data={data} options={options} />
        </ChartWrapper>
      ) : (
        <EmptyState>Nenhuma movimentação registrada em {year}.</EmptyState>
      )}
    </ChartContainer>
  );
};

export default Charts;
