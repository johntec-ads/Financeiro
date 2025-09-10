import React, { useState } from 'react';
import styled from 'styled-components';
import { useClasses } from '../context/ClassContext';
import { useAuth } from '../context/AuthContext';
import NavBar from '../components/NavBar';
import UserHeader from '../components/UserHeader';
import ClassCard from '../components/ClassCard';
import ClassManager from '../components/ClassManager';
import { FiPlus, FiGrid, FiBarChart2 } from 'react-icons/fi';

const DashboardContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const HeaderSection = styled.div`
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  color: var(--primary);
  margin-bottom: 1rem;
  font-size: 2rem;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const StatsOverview = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background-color: var(--card-bg);
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const StatItem = styled.div`
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary);
  margin-bottom: 0.25rem;
`;

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: var(--text-secondary);
`;

const ActionsBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding: 1rem;
  background-color: var(--card-bg);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const ActionTitle = styled.h2`
  margin: 0;
  color: var(--text);
  font-size: 1.25rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
  }
`;

const ActionButton = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  background-color: var(--primary);
  color: white;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background-color: var(--primary-hover);
  }

  &:focus {
    outline: 2px solid var(--primary);
  }

  &.secondary {
    background-color: transparent;
    color: var(--primary);
    border: 1px solid var(--primary);

    &:hover {
      background-color: var(--primary-light);
    }
  }
`;

const ClassesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  color: var(--text-secondary);
`;

const EmptyStateIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.5;
`;

const EmptyStateTitle = styled.h3`
  margin: 0 0 0.5rem 0;
  color: var(--text);
`;

const EmptyStateDescription = styled.p`
  margin: 0 0 2rem 0;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.5;
`;

const FilterSection = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  justify-content: center;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 1px solid var(--border);
  border-radius: 8px;
  background-color: var(--card-bg);
  color: var(--text);
  min-width: 150px;
  font-size: 1rem;
  
  &:focus {
    outline: 2px solid var(--primary);
    border-color: transparent;
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const ClassesDashboard = () => {
  // Hooks sempre no topo
  const [yearSummary, setYearSummary] = useState({ receitas: 0, despesas: 0, saldo: 0 });
  const [allTransactions, setAllTransactions] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [showClassManager, setShowClassManager] = useState(false);
  const { currentUser } = useAuth();
  const { classes, activeClass, switchActiveClass } = useClasses();

  // Buscar todas as transações do usuário no ano selecionado
  React.useEffect(() => {
    if (!currentUser) return;
    // Importação dinâmica do Firestore
    import('../services/firebase').then(({ db }) => {
      import('firebase/firestore').then(firestore => {
        const { collection, query, where, getDocs } = firestore;
        const transactionsRef = collection(db, 'transactions');
        const q = query(transactionsRef, where('userId', '==', currentUser.uid));
        getDocs(q).then(snapshot => {
          const transactions = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
            .filter(t => {
              let transactionYear = null;
              if (t.year) transactionYear = t.year;
              else if (t.date) transactionYear = new Date(t.date).getFullYear();
              else if (t.createdAt) {
                const dateObj = t.createdAt.toDate ? t.createdAt.toDate() : new Date(t.createdAt);
                transactionYear = dateObj.getFullYear();
              }
              return transactionYear === selectedYear;
            });
          setAllTransactions(transactions);
        });
      });
    });
  }, [currentUser, selectedYear]);

  // Calcular resumo anual para 'Contabilidade Geral'
  React.useEffect(() => {
    const contabilidadeClasses = classes.filter(cls => cls.name === 'Contabilidade Geral');
    const contabilidadeIds = contabilidadeClasses.map(cls => cls.id);
    const filtered = allTransactions.filter(t => t.classId && contabilidadeIds.includes(t.classId));
    const receitas = filtered.filter(t => t.type === 'receita').reduce((sum, t) => sum + t.value, 0);
    const despesas = filtered.filter(t => t.type === 'despesa').reduce((sum, t) => sum + t.value, 0);
    setYearSummary({ receitas, despesas, saldo: receitas - despesas });
  }, [allTransactions, classes, selectedYear]);

  // Calcular estatísticas gerais
  // Função mock, substitua por lógica real se necessário
  // Calcula o resumo da classe usando transações reais do mês/ano selecionado
  const getClassSummary = (classItem) => {
    // Filtra transações do usuário para a classe e mês/ano selecionados
    const transacoesClasse = allTransactions.filter(t => {
      if (!t.classId || t.classId !== classItem.id) return false;
      let transactionMonth = null;
      let transactionYear = null;
      if (t.month && t.year) {
        transactionMonth = t.month;
        transactionYear = t.year;
      } else if (t.date) {
        const dateObj = new Date(t.date);
        transactionMonth = dateObj.getMonth() + 1;
        transactionYear = dateObj.getFullYear();
      } else if (t.createdAt) {
        const dateObj = t.createdAt.toDate ? t.createdAt.toDate() : new Date(t.createdAt);
        transactionMonth = dateObj.getMonth() + 1;
        transactionYear = dateObj.getFullYear();
      }
      return transactionMonth === selectedMonth && transactionYear === selectedYear;
    });

    const receitas = transacoesClasse.filter(t => t.type === 'receita').reduce((sum, t) => sum + t.value, 0);
    const despesas = transacoesClasse.filter(t => t.type === 'despesa').reduce((sum, t) => sum + t.value, 0);
    const total = receitas - despesas;
    return {
      receitas,
      despesas,
      total,
      transactionCount: transacoesClasse.length
    };
  } 

  const totalClasses = classes.length;
  const totalReceitas = classes.reduce((sum, cls) => sum + getClassSummary(cls).receitas, 0);
  const totalDespesas = classes.reduce((sum, cls) => sum + getClassSummary(cls).despesas, 0);
  const saldoGeral = totalReceitas - totalDespesas;

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril',
    'Maio', 'Junho', 'Julho', 'Agosto',
    'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const years = [2023, 2024, 2025, 2026];

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const handleClassClick = (classItem) => {
    switchActiveClass(classItem);
    // Navegar para o dashboard principal ou mostrar detalhes
  };

  if (!currentUser) {
    return <div>Carregando...</div>;
  }

  return (
    <DashboardContainer>
      <UserHeader onManageClasses={() => setShowClassManager(true)} />
      <NavBar />
      
      <HeaderSection>
        <Title>Todas as Classes Financeiras</Title>
        <StatsOverview>
          {/* Card resumo geral do ano (todas as classes) */}
          {(() => {
            // Filtra todas as transações do ano selecionado
            const transacoesAno = allTransactions.filter(t => {
              let transactionYear = null;
              if (t.year) transactionYear = t.year;
              else if (t.date) transactionYear = new Date(t.date).getFullYear();
              else if (t.createdAt) {
                const dateObj = t.createdAt.toDate ? t.createdAt.toDate() : new Date(t.createdAt);
                transactionYear = dateObj.getFullYear();
              }
              return transactionYear === selectedYear;
            });
            const receitasAno = transacoesAno.filter(t => t.type === 'receita').reduce((sum, t) => sum + t.value, 0);
            const despesasAno = transacoesAno.filter(t => t.type === 'despesa').reduce((sum, t) => sum + t.value, 0);
            const saldoAno = receitasAno - despesasAno;
            return (
              <>
                <StatItem>
                  <StatValue>{formatCurrency(receitasAno)}</StatValue>
                  <StatLabel>Receitas (Ano)</StatLabel>
                </StatItem>
                <StatItem>
                  <StatValue>{formatCurrency(despesasAno)}</StatValue>
                  <StatLabel>Despesas (Ano)</StatLabel>
                </StatItem>
                <StatItem>
                  <StatValue style={{ color: saldoAno >= 0 ? 'var(--success)' : 'var(--danger)' }}>
                    {formatCurrency(saldoAno)}
                  </StatValue>
                  <StatLabel>Saldo Geral (Ano)</StatLabel>
                </StatItem>
              </>
            );
          })()}
        </StatsOverview>
      </HeaderSection>

      <ActionsBar>
        <ActionTitle>
          <FiGrid />
          Minhas Classes ({classes.length})
        </ActionTitle>
        <ActionButtons>
          <ActionButton 
            className="secondary"
            onClick={() => setShowClassManager(true)}
          >
            <FiBarChart2 />
            Gerenciar
          </ActionButton>
          <ActionButton onClick={() => setShowClassManager(true)}>
            <FiPlus />
            Nova Classe
          </ActionButton>
        </ActionButtons>
      </ActionsBar>

      <FilterSection>
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
      </FilterSection>

      {classes.length === 0 ? (
        <EmptyState>
          <EmptyStateIcon>📊</EmptyStateIcon>
          <EmptyStateTitle>Nenhuma classe encontrada</EmptyStateTitle>
          <EmptyStateDescription>
            Crie sua primeira classe financeira para começar a organizar 
            suas receitas e despesas por categoria ou projeto.
          </EmptyStateDescription>
          <ActionButton onClick={() => setShowClassManager(true)}>
            <FiPlus />
            Criar Primeira Classe
          </ActionButton>
        </EmptyState>
      ) : (
        <ClassesGrid>
          {/* Mostrar apenas classes criadas no mês/ano selecionado */}
          {/* Agrupar classes por nome */}
          {/* Card especial para Contabilidade Geral (agrupado) */}
          {(() => {
            const contClasses = classes.filter(cls => cls.name === 'Contabilidade Geral');
            if (contClasses.length === 0) return null;
            const classIds = contClasses.map(c => c.id);
            const color = contClasses[0].color;
            const description = contClasses[0].description;
            const budget = contClasses[0].budget;
            const transacoesClasse = allTransactions.filter(t => {
              // Inclui transações sem classId ou com classId de qualquer instância agrupada
              const pertenceClasse = (!t.classId) || (t.classId && classIds.includes(t.classId));
              if (!pertenceClasse) return false;
              let transactionMonth = null;
              let transactionYear = null;
              if (t.month && t.year) {
                transactionMonth = t.month;
                transactionYear = t.year;
              } else if (t.date) {
                const dateObj = new Date(t.date);
                transactionMonth = dateObj.getMonth() + 1;
                transactionYear = dateObj.getFullYear();
              } else if (t.createdAt) {
                const dateObj = t.createdAt.toDate ? t.createdAt.toDate() : new Date(t.createdAt);
                transactionMonth = dateObj.getMonth() + 1;
                transactionYear = dateObj.getFullYear();
              }
              return transactionMonth === selectedMonth && transactionYear === selectedYear;
            });
            const receitas = transacoesClasse.filter(t => t.type === 'receita').reduce((sum, t) => sum + t.value, 0);
            const despesas = transacoesClasse.filter(t => t.type === 'despesa').reduce((sum, t) => sum + t.value, 0);
            const total = receitas - despesas;
            return (
              <ClassCard
                key={'Contabilidade Geral'}
                classData={{
                  name: `Contabilidade Geral - ${monthNames[selectedMonth - 1]} ${selectedYear}`,
                  color,
                  description,
                  budget
                }}
                summary={{ receitas, despesas, total, transactionCount: transacoesClasse.length }}
                onClick={() => handleClassClick(contClasses[0])}
                isActive={activeClass?.name === 'Contabilidade Geral'}
              />
            );
          })()}

          {/* Cards das demais classes (por instância) */}
          {classes.filter(cls => {
            if (cls.name === 'Contabilidade Geral') return false;
            const dateObj = cls.createdAt?.toDate ? cls.createdAt.toDate() : new Date(cls.createdAt);
            return dateObj.getMonth() + 1 === selectedMonth && dateObj.getFullYear() === selectedYear;
          }).map(cls => {
            const color = cls.color;
            const description = cls.description;
            const budget = cls.budget;
            const transacoesClasse = allTransactions.filter(t => {
              if (!t.classId || t.classId !== cls.id) return false;
              let transactionMonth = null;
              let transactionYear = null;
              if (t.month && t.year) {
                transactionMonth = t.month;
                transactionYear = t.year;
              } else if (t.date) {
                const dateObj = new Date(t.date);
                transactionMonth = dateObj.getMonth() + 1;
                transactionYear = dateObj.getFullYear();
              } else if (t.createdAt) {
                const dateObj = t.createdAt.toDate ? t.createdAt.toDate() : new Date(t.createdAt);
                transactionMonth = dateObj.getMonth() + 1;
                transactionYear = dateObj.getFullYear();
              }
              return transactionMonth === selectedMonth && transactionYear === selectedYear;
            });
            const receitas = transacoesClasse.filter(t => t.type === 'receita').reduce((sum, t) => sum + t.value, 0);
            const despesas = transacoesClasse.filter(t => t.type === 'despesa').reduce((sum, t) => sum + t.value, 0);
            const total = receitas - despesas;
            return (
              <ClassCard
                key={cls.id}
                classData={{
                  name: `${cls.name} - ${monthNames[selectedMonth - 1]} ${selectedYear}`,
                  color,
                  description,
                  budget
                }}
                summary={{ receitas, despesas, total, transactionCount: transacoesClasse.length }}
                onClick={() => handleClassClick(cls)}
                isActive={activeClass?.id === cls.id}
              />
            );
          })}
        </ClassesGrid>
      )}

      <ClassManager 
        isOpen={showClassManager}
        onClose={() => setShowClassManager(false)}
      />
    </DashboardContainer>
  );
};

export default ClassesDashboard;
