import React from 'react';
import styled from 'styled-components';
import { Doughnut, Bar } from 'react-chartjs-2';
import { 
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const AnalyticsPanelContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

const Panel = styled.div`
  background: var(--card-bg);
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const PanelTitle = styled.h2`
  color: var(--text);
  font-size: 1.2rem;
  margin-bottom: 1rem;
  text-align: center;
`;

const SummaryList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 1rem 0;
`;

const SummaryItem = styled.li`
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--border);
  
  &:last-child {
    border-bottom: none;
  }
`;

const Label = styled.span`
  color: var(--text);
`;

const Value = styled.span`
  color: ${props => props.type === 'receita' ? 'var(--success)' : 'var(--danger)'};
  font-weight: 500;
`;

const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

const AnalyticsPanels = ({ transactions }) => {
  // Agrupa transações por tipo
  const groupedByType = transactions.reduce((acc, transaction) => {
    const type = transaction.transactionType || 'Outros';
    if (!acc[type]) {
      acc[type] = {
        receitas: 0,
        despesas: 0,
        total: 0
      };
    }
    if (transaction.type === 'receita') {
      acc[type].receitas += Number(transaction.value) || 0;
      acc[type].total += Number(transaction.value) || 0;
    } else {
      acc[type].despesas += Number(transaction.value) || 0;
      acc[type].total -= Number(transaction.value) || 0;
    }
    return acc;
  }, {});

  // Agrupa transações por categoria
  const groupedByCategory = transactions.reduce((acc, transaction) => {
    const category = transaction.category;
    if (!acc[category]) {
      acc[category] = 0;
    }
    if (transaction.type === 'despesa') {
      acc[category] += transaction.value;
    }
    return acc;
  }, {});

  // Prepara dados para o gráfico de grupos
  const groupsChartData = {
    labels: Object.keys(groupedByType),
    datasets: [
      {
        data: Object.values(groupedByType).map(group => group.despesas),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF'
        ]
      }
    ]
  };

  // Prepara dados para o gráfico de categorias
  const categoriesChartData = {
    labels: Object.keys(groupedByCategory),
    datasets: [{
      label: 'Despesas por Categoria',
      data: Object.values(groupedByCategory),
      backgroundColor: 'rgba(54, 162, 235, 0.5)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 1
    }]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom'
      }
    }
  };

  return (
    <AnalyticsPanelContainer>
      <Panel>
        <PanelTitle>Distribuição por Grupos</PanelTitle>
        <Doughnut data={groupsChartData} options={options} />
        <SummaryList>
          {Object.entries(groupedByType).map(([type, values]) => (
            <SummaryItem key={type}>
              <Label>{type}</Label>
              <div>
                <Value type="receita">{formatCurrency(values.receitas)}</Value>
                {" / "}
                <Value type="despesa">{formatCurrency(values.despesas)}</Value>
              </div>
            </SummaryItem>
          ))}
        </SummaryList>
      </Panel>

      <Panel>
        <PanelTitle>Despesas por Categoria</PanelTitle>
        <Bar data={categoriesChartData} options={options} />
      </Panel>
    </AnalyticsPanelContainer>
  );
};

export default AnalyticsPanels;