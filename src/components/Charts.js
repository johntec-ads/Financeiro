import React, { useState } from 'react';
import styled from 'styled-components';
import {
  Chart as ChartJS,//Lib para gráficos
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import { Pie } from 'react-chartjs-2';//Lib para gráficos de pizza
import {
  expenseCategories,
  incomeCategories,
  transactionCategories,
} from '../constants/categories';

const categoriesByType = {
  receita: Array.from(new Set([
    ...incomeCategories,
    ...Object.values(transactionCategories.receita).flat(),
  ])),
  despesa: Array.from(new Set([
    ...expenseCategories,
    ...Object.values(transactionCategories.despesa).flat(),
  ])),
};

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

const ChartContainer = styled.div`
  background-color: var(--card-bg);
  padding: 1.5rem;
  border-radius: 12px;
  margin: 1rem 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const ChartDescription = styled.p`
  margin: -0.5rem 0 1rem;
  color: var(--text-secondary);
  font-size: 0.9rem;
  text-align: center;
`;

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
`;

const ChartTitle = styled.h3`
  text-align: center;
  margin-bottom: 1rem;
  color: var(--text);
`;

const TotalValue = styled.p`
  text-align: center;
  font-size: 1.2rem;
  margin-top: 1rem;
  color: ${props => props.type === 'receita' ? 'var(--success)' : 'var(--danger)'};
`;

const CategoryFilter = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
`;

const Checkbox = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: var(--text);
`;

const Charts = ({ transactions, monthName, year }) => {
  const [selectedCategories, setSelectedCategories] = useState({
    receita: categoriesByType.receita.reduce((acc, cat) => ({ ...acc, [cat]: true }), {}),
    despesa: categoriesByType.despesa.reduce((acc, cat) => ({ ...acc, [cat]: true }), {}),
  });

  const toggleCategory = (type, category) => {
    setSelectedCategories(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [category]: !prev[type][category],
      },
    }));
  };

  const calculateCategoryTotals = (type) => {
    if (!Array.isArray(transactions)) {
      return { totals: {}, total: 0 };
    }

    const categories = categoriesByType[type];
    const totals = {};
    let total = 0;

    categories.forEach(cat => {
      if (!selectedCategories[type][cat]) return; // Ignorar categorias desmarcadas

      const categoryTotal = transactions
        .filter(t => t.type === type && t.category === cat)
        .reduce((sum, t) => {
          const valor = Number(t.value) || 0; // Garantir que o campo 'value' seja usado corretamente
          return sum + valor;
        }, 0);

      if (categoryTotal > 0) {
        totals[cat] = categoryTotal;
        total += categoryTotal;
      }
    });

    return { totals, total };
  };

  const createChartData = (type) => {
    const { totals, total } = calculateCategoryTotals(type);
    
    if (total === 0) {
      return {
        labels: ['Sem dados'],
        datasets: [{
          data: [1],
          backgroundColor: ['#e0e0e0'],
          borderWidth: 1,
        }]
      };
    }

    const labels = Object.keys(totals);
    const data = Object.values(totals);
    
    const labelsWithPercentage = labels.map((label, index) => {
      const percentage = ((data[index] / total) * 100).toFixed(1);
      return `${label} (${percentage}%)`;
    });

    const colorPalette = type === 'receita'
      ? ['#2E7D32', '#388E3C', '#43A047', '#4CAF50', '#66BB6A', '#81C784']
      : ['#C62828', '#D32F2F', '#E53935', '#F44336', '#EF5350', '#E57373', '#EF9A9A', '#FFCDD2'];
    const colors = data.map((_, index) => colorPalette[index % colorPalette.length]);

    return {
      labels: labelsWithPercentage,
      datasets: [{
        data: data,
        backgroundColor: colors.slice(0, data.length),
        borderWidth: 1
      }]
    };
  };

  const options = {
    plugins: {
      legend: {
        position: 'right',
        labels: {
          font: {
            size: 12
          },
          padding: 20
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            if (context.raw === 1 && context.label === 'Sem dados') {
              return 'Nenhuma transação registrada';
            }
            const value = context.raw;
            return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
          }
        }
      }
    },
    maintainAspectRatio: true,
    responsive: true
  };

  const { total: totalDespesas } = calculateCategoryTotals('despesa');
  const { total: totalReceitas } = calculateCategoryTotals('receita');

  return (
    <>
      <CategoryFilter>
        <div>
          <h4>Receitas</h4>
          {categoriesByType.receita.map(cat => (
            <Checkbox key={cat}>
              <input
                type="checkbox"
                checked={selectedCategories.receita[cat]}
                onChange={() => toggleCategory('receita', cat)}
              />
              {cat}
            </Checkbox>
          ))}
        </div>
        <div>
          <h4>Despesas</h4>
          {categoriesByType.despesa.map(cat => (
            <Checkbox key={cat}>
              <input
                type="checkbox"
                checked={selectedCategories.despesa[cat]}
                onChange={() => toggleCategory('despesa', cat)}
              />
              {cat}
            </Checkbox>
          ))}
        </div>
      </CategoryFilter>

      <ChartsGrid>
        <ChartContainer>
          <ChartTitle>Despesas por Categoria</ChartTitle>
          <ChartDescription>{monthName} de {year}</ChartDescription>
          <Pie data={createChartData('despesa')} options={options} />
          <TotalValue type="despesa">
            Total: R$ {totalDespesas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </TotalValue>
        </ChartContainer>
        
        <ChartContainer>
          <ChartTitle>Receitas por Categoria</ChartTitle>
          <ChartDescription>{monthName} de {year}</ChartDescription>
          <Pie data={createChartData('receita')} options={options} />
          <TotalValue type="receita">
            Total: R$ {totalReceitas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </TotalValue>
        </ChartContainer>
      </ChartsGrid>
    </>
  );
};

export default Charts;
