import React from 'react';
import styled from 'styled-components';
import { FiArrowUpCircle, FiArrowDownCircle, FiDollarSign } from 'react-icons/fi';

const SummaryContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const SummaryCard = styled.div`
  background-color: var(--card-bg);
  padding: 1.75rem;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-lg);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background-color: ${props => {
      if (props.type === 'receita') return 'var(--success)';
      if (props.type === 'despesa') return 'var(--danger)';
      return 'var(--primary)';
    }};
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const Title = styled.h3`
  color: var(--text-secondary);
  font-size: 0.95rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const IconWrapper = styled.div`
  font-size: 1.5rem;
  color: ${props => {
    if (props.type === 'receita') return 'var(--success)';
    if (props.type === 'despesa') return 'var(--danger)';
    return 'var(--primary)';
  }};
  background-color: ${props => {
    if (props.type === 'receita') return 'var(--success-light)';
    if (props.type === 'despesa') return 'var(--danger-light)';
    return 'var(--primary-light)';
  }};
  padding: 0.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Value = styled.p`
  font-size: 2rem;
  font-weight: 700;
  color: var(--text);
  letter-spacing: -0.02em;
`;

const Summary = ({ transactions }) => {
  const calculateTotals = () => {
    if (!Array.isArray(transactions) || transactions.length === 0) {
      return {
        receitas: 0,
        despesas: 0,
        saldo: 0
      };
    }

    return transactions.reduce((acc, transaction) => {
      const value = Number(transaction.value) || 0;
      
      if (transaction.type === 'receita') {
        acc.receitas += value;
      } else if (transaction.type === 'despesa') {
        acc.despesas += value;
      }
      
      acc.saldo = acc.receitas - acc.despesas;
      return acc;
    }, {
      receitas: 0,
      despesas: 0,
      saldo: 0
    });
  };

  const { receitas, despesas, saldo } = calculateTotals();

  return (
    <SummaryContainer>
      <SummaryCard type="receita">
        <CardHeader>
          <Title>Entradas</Title>
          <IconWrapper type="receita">
            <FiArrowUpCircle />
          </IconWrapper>
        </CardHeader>
        <Value>
          {new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
          }).format(receitas)}
        </Value>
      </SummaryCard>

      <SummaryCard type="despesa">
        <CardHeader>
          <Title>Saídas</Title>
          <IconWrapper type="despesa">
            <FiArrowDownCircle />
          </IconWrapper>
        </CardHeader>
        <Value>
          {new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
          }).format(despesas)}
        </Value>
      </SummaryCard>

      <SummaryCard type="saldo">
        <CardHeader>
          <Title>Saldo Total</Title>
          <IconWrapper type="saldo">
            <FiDollarSign />
          </IconWrapper>
        </CardHeader>
        <Value style={{ color: saldo >= 0 ? 'var(--success)' : 'var(--danger)' }}>
          {new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
          }).format(saldo)}
        </Value>
      </SummaryCard>
    </SummaryContainer>
  );
};

export default Summary;
