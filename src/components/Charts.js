import React from 'react';
import styled from 'styled-components';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import { expenseCategories, incomeCategories } from '../constants/categories';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const ChartContainer = styled.div`
  background-color: var(--card-bg);
  padding: 1.5rem;
  border-radius: 12px;
  margin: 1rem 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
`;

const Charts = ({ transactions }) => {
  const calculateCategoryTotals = (type) => {
    const categories = type === 'receita' ? incomeCategories : expenseCategories;
    const totals = {};
    
    categories.forEach(cat => {
      totals[cat] = transactions
        .filter(t => t.type === type && t.category === cat)
        .reduce((sum, t) => sum + t.value, 0);
    });

    return totals;
  };

  const expensesData = {
    labels: expenseCategories,
    datasets: [{
      label: 'Despesas por Categoria',
      data: Object.values(calculateCategoryTotals('despesa')),
      backgroundColor: [
        '#FF6384',
        '#36A2EB',
        '#FFCE56',
        '#4BC0C0',
        '#9966FF',
        '#FF9F40',
        '#FF6384',
        '#36A2EB',
        '#FFCE56'
      ]
    }]
  };

  const incomesData = {
    labels: incomeCategories,
    datasets: [{
      label: 'Receitas por Categoria',
      data: Object.values(calculateCategoryTotals('receita')),
      backgroundColor: [
        '#4BC0C0',
        '#9966FF',
        '#FF9F40',
        '#FF6384',
        '#36A2EB',
        '#FFCE56'
      ]
    }]
  };

  return (
    <ChartsGrid>
      <ChartContainer>
        <h3>Despesas por Categoria</h3>
        <Pie data={expensesData} />
      </ChartContainer>
      
      <ChartContainer>
        <h3>Receitas por Categoria</h3>
        <Pie data={incomesData} />
      </ChartContainer>
    </ChartsGrid>
  );
};

export default Charts;
