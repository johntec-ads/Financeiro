import React from 'react';
import styled from 'styled-components';

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

const Metric = styled.div`
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-top: 4px solid ${props => props.color};
  border-radius: var(--radius-lg);
  padding: 1.25rem;
  box-shadow: var(--shadow-sm);
`;

const Label = styled.span`
  display: block;
  color: var(--text-secondary);
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
`;

const Value = styled.strong`
  display: block;
  margin-top: 0.35rem;
  color: ${props => props.color};
  font-size: 1.5rem;
`;

const BalancePanel = styled.section`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  box-shadow: var(--shadow-sm);

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`;

const BalanceColumn = styled.div`
  padding: 1rem;
  border-radius: var(--radius-md);
  background: ${props => props.background};
`;

const BalanceTitle = styled.h2`
  margin: 0 0 0.5rem;
  color: var(--text);
  font-size: 1rem;
`;

const BalanceValue = styled.strong`
  color: ${props => props.color};
  font-size: 1.5rem;
`;

const Explanation = styled.p`
  margin: 1rem 0 0;
  color: var(--text-secondary);
  font-size: 0.9rem;
  line-height: 1.5;
`;

const formatCurrency = value => new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
}).format(value);

const AnalyticsPanels = ({ transactions, year }) => {
  const totals = transactions.reduce((acc, transaction) => {
    const value = Number(transaction.value) || 0;
    if (transaction.type === 'receita') acc.receitas += value;
    if (transaction.type === 'despesa') acc.despesas += value;
    return acc;
  }, { receitas: 0, despesas: 0 });
  const saldo = totals.receitas - totals.despesas;

  return (
    <AnalyticsPanelContainer>
      <MetricGrid>
        <Metric color="var(--success)">
          <Label>Receitas no ano</Label>
          <Value color="var(--success)">{formatCurrency(totals.receitas)}</Value>
        </Metric>
        <Metric color="var(--danger)">
          <Label>Despesas no ano</Label>
          <Value color="var(--danger)">{formatCurrency(totals.despesas)}</Value>
        </Metric>
        <Metric color={saldo >= 0 ? 'var(--primary)' : 'var(--danger)'}>
          <Label>Saldo do ano</Label>
          <Value color={saldo >= 0 ? 'var(--primary)' : 'var(--danger)'}>
            {formatCurrency(saldo)}
          </Value>
        </Metric>
      </MetricGrid>

      <BalancePanel>
        <BalanceColumn background="var(--success-light)">
          <BalanceTitle>Total de receitas em {year}</BalanceTitle>
          <BalanceValue color="var(--success)">{formatCurrency(totals.receitas)}</BalanceValue>
          <Explanation>Todo o dinheiro recebido no período selecionado.</Explanation>
        </BalanceColumn>
        <BalanceColumn background="var(--danger-light)">
          <BalanceTitle>Total de despesas em {year}</BalanceTitle>
          <BalanceValue color="var(--danger)">{formatCurrency(totals.despesas)}</BalanceValue>
          <Explanation>Todo o dinheiro lançado como saída no período selecionado.</Explanation>
        </BalanceColumn>
      </BalancePanel>

      <BalancePanel>
        <BalanceColumn background="var(--primary-light)">
          <BalanceTitle>Balanço anual</BalanceTitle>
          <BalanceValue color={saldo >= 0 ? 'var(--primary)' : 'var(--danger)'}>
            {formatCurrency(saldo)}
          </BalanceValue>
          <Explanation>
            Resultado de receitas menos despesas. Um valor positivo indica sobra no ano.
          </Explanation>
        </BalanceColumn>
      </BalancePanel>
    </AnalyticsPanelContainer>
  );
};

export default AnalyticsPanels;
