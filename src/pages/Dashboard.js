import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import TransactionForm from '../components/TransactionForm';
import TransactionList from '../components/TransactionList';
import Summary from '../components/Summary';
import useTransactionsByClass from '../hooks/useTransactionsByClass';
import useLegacyDataMigration from '../hooks/useLegacyDataMigration';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import UserHeader from '../components/UserHeader';
import ClassManager from '../components/ClassManager';

const DashboardContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const Title = styled.h1`
  color: var(--primary);
  margin-bottom: 2rem;
  font-size: 2rem;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 1.3rem;
    margin-bottom: 0.8rem;
  }
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  justify-content: center;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.8rem;
    margin-bottom: 1.5rem;
  }
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 1px solid var(--border);
  border-radius: 8px;
  background-color: var(--card-bg);
  min-width: 150px;
  font-size: 1rem;
  
  &:focus {
    outline: 2px solid var(--primary);
    border-color: transparent;
  }

  @media (max-width: 768px) {
    width: 100%;
    padding: 0.8rem;
    font-size: 0.9rem;
  }
`;

const ContentContainer = styled.div`
  width: 100%;
  
  @media (max-width: 768px) {
    padding: 0;
    overflow-x: hidden;
  }
`;

const LoadingMessage = styled.p`
  text-align: center;
  font-size: 1.5rem;
  color: var(--primary);
`;

const MigrationBanner = styled.div`
  background: linear-gradient(45deg, #FF9800, #FFC107);
  color: white;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 8px rgba(255, 152, 0, 0.3);

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
`;

const MigrationText = styled.div`
  font-weight: 500;
`;

const MigrationButton = styled.button`
  background: white;
  color: #FF9800;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const Dashboard = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [showClassManager, setShowClassManager] = useState(false);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // Hook para migração de dados legados
  const { hasLegacyData, legacyCount, migrateLegacyData, loading: migrationLoading } = useLegacyDataMigration();

  useEffect(() => {
    if (!currentUser) {
      navigate('/');
    }
  }, [currentUser, navigate]);

  const { transactions, loading, error, addTransaction, deleteTransaction, updateTransaction } = useTransactionsByClass(selectedMonth, selectedYear);

  // Função para lidar com migração
  const handleMigration = async () => {
    const result = await migrateLegacyData();
    if (result.success) {
      alert(`✅ ${result.count} transações migradas com sucesso! A página será recarregada.`);
      window.location.reload();
    } else {
      alert(`❌ Erro na migração: ${result.error}`);
    }
  };

  console.log('Dashboard - Estado das transações:', {
    loading,
    error,
    transactionsCount: transactions?.length,
    transactions
  });

  console.log('Dashboard - Estado das transações:', {
    loading,
    error,
    transactionsCount: transactions?.length,
    transactions
  });

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril',
    'Maio', 'Junho', 'Julho', 'Agosto',
    'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const years = [2023, 2024, 2025, 2026];

  return (
    <DashboardContainer>
      {currentUser ? (
        <>
          <UserHeader onManageClasses={() => setShowClassManager(true)} />
          <NavBar />
          <Title>Controle Financeiro</Title>

          {hasLegacyData && (
            <MigrationBanner>
              <MigrationText>
                📦 Encontramos {legacyCount} transações antigas em sua conta. 
                Deseja migrar para o novo sistema de classes?
              </MigrationText>
              <MigrationButton 
                onClick={handleMigration}
                disabled={migrationLoading}
              >
                {migrationLoading ? 'Migrando...' : 'Migrar Dados'}
              </MigrationButton>
            </MigrationBanner>
          )}

          <FilterContainer>
            <Select 
              value={selectedMonth} 
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              aria-label="Selecionar mês"
            >
              {monthNames.map((month, index) => (
                <option key={index + 1} value={index + 1}>
                  {month}
                </option>
              ))}
            </Select>
            <Select 
              value={selectedYear} 
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              aria-label="Selecionar ano"
            >
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </Select>
          </FilterContainer>

          <ContentContainer>
            <Summary transactions={transactions} />
            <TransactionForm addTransaction={addTransaction} selectedMonth={selectedMonth} selectedYear={selectedYear} />
            {loading && <p>Carregando transações...</p>}
            {error && <p>Erro ao carregar transações.</p>}
            <TransactionList 
              transactions={transactions} 
              deleteTransaction={deleteTransaction} 
              updateTransaction={updateTransaction}
              loading={loading}
              error={error}
            />
          </ContentContainer>

          <ClassManager 
            isOpen={showClassManager}
            onClose={() => setShowClassManager(false)}
          />
        </>
      ) : (
        <LoadingMessage role="status" aria-live="polite">
          Carregando...
        </LoadingMessage>
      )}
    </DashboardContainer>
  );
};

export default Dashboard;
