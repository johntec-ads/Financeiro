import React from 'react';
import styled from 'styled-components';
import { FiTrendingUp, FiTrendingDown, FiDollarSign, FiTarget, FiCalendar } from 'react-icons/fi';

const Card = styled.div`
  background-color: var(--card-bg);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid var(--border);
  transition: all 0.2s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
    border-color: ${props => props.color || 'var(--primary)'};
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, ${props => props.color || '#2E7D32'}, ${props => props.color ? `${props.color}80` : '#2E7D3280'});
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const ClassInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const ClassColor = styled.div`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: ${props => props.color || '#2E7D32'};
  border: 2px solid white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
`;

const ClassName = styled.h3`
  margin: 0;
  color: var(--text);
  font-size: 1.1rem;
  font-weight: 600;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  padding: 0.5rem;
  border-radius: 6px;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: var(--bg-secondary);
    color: var(--primary);
  }

  &:focus {
    outline: 2px solid var(--primary);
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const StatItem = styled.div`
  text-align: center;
`;

const StatIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin: 0 auto 0.5rem;
  color: white;
  
  &.receita {
    background-color: var(--success);
  }
  
  &.despesa {
    background-color: var(--danger);
  }
`;

const StatValue = styled.div`
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 0.25rem;
`;

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: var(--text-secondary);
`;

const BalanceSection = styled.div`
  background-color: var(--bg-secondary);
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
`;

const BalanceHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
`;

const BalanceValue = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => {
    if (props.value > 0) return 'var(--success)';
    if (props.value < 0) return 'var(--danger)';
    return 'var(--text-secondary)';
  }};
`;

const BudgetSection = styled.div`
  ${props => props.budget && `
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid var(--border);
  `}
`;

const BudgetHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
`;

const BudgetLabel = styled.span`
  font-size: 0.875rem;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const BudgetPercentage = styled.span`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${props => {
    if (props.percentage > 100) return 'var(--danger)';
    if (props.percentage > 80) return 'var(--warning)';
    return 'var(--success)';
  }};
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background-color: var(--border);
  border-radius: 4px;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  background-color: ${props => {
    if (props.percentage > 100) return 'var(--danger)';
    if (props.percentage > 80) return 'var(--warning)';
    return 'var(--success)';
  }};
  width: ${props => Math.min(props.percentage, 100)}%;
  transition: width 0.3s ease;
`;

const FooterInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border);
  font-size: 0.875rem;
  color: var(--text-secondary);
`;

const TransactionCount = styled.span`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const LastUpdate = styled.span`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ClassCard = ({ 
  classData, 
  summary, 
  onClick,
  isActive = false 
}) => {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getBudgetPercentage = () => {
    if (!classData.budget || classData.budget <= 0) return 0;
    return (Math.abs(summary.despesas) / classData.budget) * 100;
  };

  const budgetPercentage = getBudgetPercentage();

  return (
    <Card color={classData.color} onClick={onClick}>
      <CardHeader>
        <ClassInfo>
          <ClassColor color={classData.color} />
          <ClassName>{classData.name}</ClassName>
        </ClassInfo>
        {isActive && (
          <ActionButton title="Classe ativa">
            <FiTarget size={16} />
          </ActionButton>
        )}
      </CardHeader>

      <StatsGrid>
        <StatItem>
          <StatIcon className="receita">
            <FiTrendingUp size={20} />
          </StatIcon>
          <StatValue>{formatCurrency(summary.receitas)}</StatValue>
          <StatLabel>Receitas</StatLabel>
        </StatItem>

        <StatItem>
          <StatIcon className="despesa">
            <FiTrendingDown size={20} />
          </StatIcon>
          <StatValue>{formatCurrency(summary.despesas)}</StatValue>
          <StatLabel>Despesas</StatLabel>
        </StatItem>
      </StatsGrid>

      <BalanceSection>
        <BalanceHeader>
          <FiDollarSign size={16} />
          <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Saldo Atual
          </span>
        </BalanceHeader>
        <BalanceValue value={summary.total}>
          {formatCurrency(summary.total)}
        </BalanceValue>
      </BalanceSection>

      {classData.budget && classData.budget > 0 && (
        <BudgetSection budget>
          <BudgetHeader>
            <BudgetLabel>
              <FiTarget size={14} />
              Orçamento: {formatCurrency(classData.budget)}
            </BudgetLabel>
            <BudgetPercentage percentage={budgetPercentage}>
              {budgetPercentage.toFixed(0)}%
            </BudgetPercentage>
          </BudgetHeader>
          <ProgressBar>
            <ProgressFill percentage={budgetPercentage} />
          </ProgressBar>
        </BudgetSection>
      )}

      <FooterInfo>
        <TransactionCount>
          <FiCalendar size={14} />
          {summary.transactionCount} transações
        </TransactionCount>
        <LastUpdate>
          {classData.description && (
            <span style={{ 
              maxWidth: '120px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              {classData.description}
            </span>
          )}
        </LastUpdate>
      </FooterInfo>
    </Card>
  );
};

export default ClassCard;
