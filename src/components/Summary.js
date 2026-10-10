import React, { useState } from 'react';
import styled from 'styled-components';
import { FiArrowUpCircle, FiArrowDownCircle, FiDollarSign, FiEye, FiEyeOff } from 'react-icons/fi';

const formatCurrency = (value) => new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL'
}).format(value);

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
  box-shadow: var(--shadow-sm);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  overflow: hidden;

  @media (hover: hover) {
    &:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow-lg);
    }
  }

  @media (hover: none) {
    &:active {
      transform: translateY(-2px);
      box-shadow: var(--shadow-md);
    }
  }

  @media (max-width: 768px) {
    box-shadow: var(--shadow-sm);
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

const PendingFooterBar = styled.div`
  position: fixed;
  left: 50%;
  bottom: 16px;
  transform: translateX(-50%);
  z-index: 1000;
  width: min(620px, calc(100% - 32px));
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.55rem 0.9rem;
  background: rgba(15, 23, 42, 0.02);
  border: 1px solid var(--border);
  border-radius: 14px;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08);
  backdrop-filter: blur(8px);

  @media (max-width: 768px) {
    width: min(100%, calc(100% - 16px));
    padding: 0.6rem 0.75rem;
    bottom: 12px;
  }
`;

const PendingFooterLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-secondary);
  opacity: 0.9;
`;

const PendingFooterValue = styled.p`
  margin: 0;
  font-size: 1.05rem;
  font-weight: 800;
  color: var(--danger);
  letter-spacing: -0.02em;
`;

const ToggleVisibilityButton = styled.button`
  border: 1px solid var(--border);
  background: transparent;
  color: var(--text-secondary);
  border-radius: 999px;
  padding: 0.3rem 0.7rem;
  font-size: 0.68rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  cursor: pointer;

  &:hover {
    border-color: var(--primary);
    color: var(--text);
  }
`;

const HiddenCardButtonWrapper = styled.div`
  position: fixed;
  left: 50%;
  bottom: 16px;
  transform: translateX(-50%);
  z-index: 1000;
  display: flex;
  justify-content: flex-end;
`;

const Summary = ({ transactions }) => {
  const [showPendingCard, setShowPendingCard] = useState(true);

  const calculateTotals = () => {
    if (!Array.isArray(transactions) || transactions.length === 0) {
      return {
        receitas: 0,
        despesas: 0,
        saldo: 0,
        pendentes: 0
      };
    }

    return transactions.reduce((acc, transaction) => {
      const value = Number(transaction.value) || 0;

      if (transaction.type === 'receita') {
        acc.receitas += value;
      } else if (transaction.type === 'despesa') {
        acc.despesas += value;

        if (transaction.paid) {
          acc.pagamentosRealizados += value;
        }
      }

      acc.saldo = acc.receitas - acc.despesas;
      acc.pendentes = Math.max(acc.despesas - acc.pagamentosRealizados, 0);
      return acc;
    }, {
      receitas: 0,
      despesas: 0,
      saldo: 0,
      pagamentosRealizados: 0,
      pendentes: 0
    });
  };

  const { receitas, despesas, saldo, pendentes } = calculateTotals();

  return (
    <>
      <SummaryContainer>
        <SummaryCard type="receita">
          <CardHeader>
            <Title>Entradas</Title>
            <IconWrapper type="receita">
              <FiArrowUpCircle />
            </IconWrapper>
          </CardHeader>
          <Value>{formatCurrency(receitas)}</Value>
        </SummaryCard>

        <SummaryCard type="despesa">
          <CardHeader>
            <Title>Saídas</Title>
            <IconWrapper type="despesa">
              <FiArrowDownCircle />
            </IconWrapper>
          </CardHeader>
          <Value>{formatCurrency(despesas)}</Value>
        </SummaryCard>

        <SummaryCard type="saldo">
          <CardHeader>
            <Title>Saldo Total</Title>
            <IconWrapper type="saldo">
              <FiDollarSign />
            </IconWrapper>
          </CardHeader>
          <Value style={{ color: saldo >= 0 ? 'var(--success)' : 'var(--danger)' }}>
            {formatCurrency(saldo)}
          </Value>
        </SummaryCard>
      </SummaryContainer>

      {showPendingCard ? (
        <PendingFooterBar>
          <PendingFooterLabel>
            <span>Restante a pagar</span>
          </PendingFooterLabel>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <PendingFooterValue>{formatCurrency(pendentes)}</PendingFooterValue>
            <ToggleVisibilityButton
              type="button"
              aria-label="Ocultar card"
              onClick={() => setShowPendingCard(false)}
            >
              <FiEyeOff size={12} />
              Ocultar
            </ToggleVisibilityButton>
          </div>
        </PendingFooterBar>
      ) : (
        <HiddenCardButtonWrapper>
          <ToggleVisibilityButton
            type="button"
            aria-label="Mostrar card"
            onClick={() => setShowPendingCard(true)}
          >
            <FiEye size={12} />
            Mostrar card
          </ToggleVisibilityButton>
        </HiddenCardButtonWrapper>
      )}
    </>
  );
};

export default Summary;
