import React from 'react';
import styled from 'styled-components';

const SummaryContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
`;

const SummaryCard = styled.div`
  background-color: var(--card-bg);
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    padding: 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
`;

const Title = styled.h3`
  color: var(--text);
  font-size: 1rem;
  margin-bottom: 0.5rem;

  @media (max-width: 768px) {
    margin-bottom: 0;
  }
`;

const Value = styled.p`
  font-size: 1.5rem;
  font-weight: bold;
  color: ${props => {
    if (props.type === 'receita') return 'var(--success)';
    if (props.type === 'despesa') return 'var(--danger)';
    return props.value >= 0 ? 'var(--success)' : 'var(--danger)';
  }};
`;

const Summary = ({ transactions }) => {
  const totalReceitas = transactions
    .filter(transaction => transaction.type === 'receita')
    .reduce((acc, transaction) => acc + transaction.value, 0);

  const totalDespesas = transactions
    .filter(transaction => transaction.type === 'despesa')
    .reduce((acc, transaction) => acc + transaction.value, 0);

  const saldo = totalReceitas - totalDespesas;

  return (
    <SummaryContainer>
      <SummaryCard>
        <Title>Total de Receitas</Title>
        <Value type="receita">R$ {totalReceitas.toFixed(2)}</Value>
      </SummaryCard>
      <SummaryCard>
        <Title>Total de Despesas</Title>
        <Value type="despesa">R$ {totalDespesas.toFixed(2)}</Value>
      </SummaryCard>
      <SummaryCard>
        <Title>Saldo</Title>
        <Value value={saldo}>R$ {saldo.toFixed(2)}</Value>
      </SummaryCard>
    </SummaryContainer>
  );
};

export default Summary;
