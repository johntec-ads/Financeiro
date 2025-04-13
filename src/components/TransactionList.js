import React from 'react';
import styled from 'styled-components';
import { FaTrash, FaEdit } from 'react-icons/fa';

const TableContainer = styled.div`
  background-color: var(--card-bg);
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: auto;

  @media (max-width: 768px) {
    display: none; // Esconde a tabela em dispositivos móveis
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  min-width: 600px;
`;

const Th = styled.th`
  background-color: var(--background);
  padding: 1rem;
  text-align: left;
  font-weight: 500;
  color: var(--text);
  border-bottom: 2px solid var(--border);
`;

const Td = styled.td`
  padding: 1rem;
  border-bottom: 1px solid var(--border);
  color: var(--text);
  text-decoration: ${props => props.paid ? 'line-through' : 'none'};
  opacity: ${props => props.paid ? 0.7 : 1};
`;

const PaidButton = styled.button`
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0.3rem;
  margin-right: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s;
  color: ${props => props.paid ? 'var(--success)' : 'var(--text)'};

  &:hover {
    transform: scale(1.1);
  }
`;

const ValueContainer = styled.div`
  display: grid;
  grid-template-columns: 120px auto; // Largura fixa para o valor, espaço automático para a tag
  align-items: center;
  gap: 0.5rem;
`;

const ValueText = styled.span`
  color: ${props => props.type === 'receita' ? 'var(--success)' : 'var(--danger)'};
  font-weight: 500;
  text-align: right; // Alinha os valores à direita
  white-space: nowrap;
`;

const DueTag = styled.span`
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  background-color: ${props => {
    if (props.overdue) return 'var(--danger)';
    if (props.dueSoon) return 'var(--warning)';
    return 'var(--success)';
  }};
  color: white;
  white-space: nowrap;
  justify-self: start; // Alinha a tag à esquerda do seu espaço
`;

const MobileCard = styled.div`
  background: var(--card-bg);
  padding: 1rem;
  border-bottom: 1px solid var(--border);
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 1rem;
`;

const MobileStatusContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.3rem;
`;

const StatusLegend = styled.span`
  font-size: 0.7rem;
  color: var(--text-secondary);
  text-align: center;
`;

const MobileContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const MobileContainer = styled.div`
  display: none;
  
  @media (max-width: 768px) {
    display: block;
  }
`;

const MobileHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const MobileHeaderTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const MobileDescription = styled.div`
  font-weight: 500;
  color: var(--text);
  text-decoration: ${props => props.paid ? 'line-through' : 'none'};
  opacity: ${props => props.paid ? 0.7 : 1};
`;

const MobileValue = styled(ValueText)`
  font-size: 1.1rem;
`;

const MobileInfo = styled.div`
  display: flex;
  justify-content: space-between;
  color: var(--text-secondary);
  font-size: 0.9rem;
`;

const MobileActions = styled.div`
  display: flex;
  justify-content: flex-end; // Alinhar os botões à direita
  gap: 1rem; // Espaçamento entre os botões
  margin-top: 0.5rem;
`;

const TableButtonsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.5rem;

  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const TableStatusContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.3rem;
`;

const MobileValueSection = styled.div`
  display: grid;
  grid-template-columns: auto 120px; // Coluna flexível para tag, fixa para valor
  align-items: center;
  gap: 1rem;
`;

const MobileTagContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  justify-self: flex-start; // Alinha as tags à esquerda
`;

const MobileValueWrapper = styled.div`
  text-align: right; // Alinha valores à direita
  justify-self: flex-end; // Garante alinhamento à direita no grid
`;

const MobileDueTag = styled(DueTag)`
  padding: 0.2rem 0.4rem;
  font-size: 0.7rem;
  margin: 0; // Remove margem padrão
`;

const getDueStatus = (date, paid) => {
  if (paid) return null;
  
  const today = new Date();
  const dueDate = new Date(date);
  const threeDaysFromNow = new Date();
  threeDaysFromNow.setDate(today.getDate() + 3);

  if (dueDate < today) return { type: 'overdue', text: 'Vencido' };
  if (dueDate <= threeDaysFromNow) return { type: 'dueSoon', text: 'Próximo' };
  return null;
};

const LoadingMessage = styled.div`
  text-align: center;
  padding: 2rem;
  background: var(--card-bg);
  border-radius: 8px;
  margin: 1rem 0;
  font-size: 1.25rem;
  color: var(--primary);
`;

const ErrorMessage = styled(LoadingMessage)`
  color: var(--danger);
  font-weight: bold;
`;

const TransactionList = ({ transactions, deleteTransaction, updateTransaction, loading, error }) => {
  console.log('TransactionList - transactions recebidas:', transactions);

  const sortTransactions = (transactions) => {
    return [...transactions].sort((a, b) => {
      if (a.type !== b.type) {
        return a.type === 'receita' ? -1 : 1;
      }
      
      if (a.type === 'despesa') {
        if (a.paid !== b.paid) {
          return a.paid ? 1 : -1;
        }
      }
      
      return 0;
    });
  };

  const handleDelete = async (id) => {
    try {
      if (window.confirm('Tem certeza que deseja excluir esta transação?')) {
        await deleteTransaction(id);
      }
    } catch (error) {
      if (error.message === 'Permissão negada') {
        alert('Você não tem permissão para excluir esta transação.');
      } else if (error.message === 'Transação não encontrada') {
        alert('Esta transação já foi excluída.');
      } else {
        alert('Erro ao excluir transação. Por favor, tente novamente.');
      }
      console.error('Erro ao excluir transação:', error);
    }
  };

  const handleTogglePaid = async (transaction) => {
    try {
      await updateTransaction(transaction.id, {
        ...transaction,
        paid: !transaction.paid
      });
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      alert('Erro ao atualizar status do pagamento');
    }
  };

  const handleEdit = (transaction) => {
    const updatedValue = prompt('Edite o valor da transação:', transaction.value);
    if (updatedValue !== null) {
      updateTransaction(transaction.id, { ...transaction, value: parseFloat(updatedValue) });
    }
  };

  if (loading) {
    return <LoadingMessage>Carregando transações...</LoadingMessage>;
  }

  if (error) {
    console.error('Erro na lista de transações:', error);
    return <ErrorMessage>Erro ao carregar transações: {error.message}</ErrorMessage>;
  }

  if (!transactions || transactions.length === 0) {
    return <LoadingMessage>Nenhuma transação encontrada para o período selecionado.</LoadingMessage>;
  }

  return (
    <>
      <TableContainer>
        <Table>
          <thead>
            <tr>
              <Th>Status</Th>
              <Th>Tipo</Th>
              <Th>Categoria</Th>
              <Th>Valor</Th>
              <Th>Data</Th>
              <Th>Descrição</Th>
              <Th>Ações</Th>
            </tr>
          </thead>
          <tbody>
            {sortTransactions(transactions).map(transaction => {
              console.log('Renderizando transação:', transaction);
              return (
                <tr key={transaction.id}>
                  <Td>
                    <TableStatusContainer>
                      <PaidButton
                        paid={transaction.paid}
                        onClick={() => handleTogglePaid(transaction)}
                        title={transaction.paid ? "Marcado como pago" : "Marcar como pago"}
                      >
                        {transaction.paid ? "💲✓" : "💲"}
                      </PaidButton>
                      <StatusLegend>
                        {transaction.paid ? "Pago" : "Pendente"}
                      </StatusLegend>
                    </TableStatusContainer>
                  </Td>
                  <Td paid={transaction.paid}>{transaction.type}</Td>
                  <Td paid={transaction.paid}>{transaction.category}</Td>
                  <Td paid={transaction.paid}>
                    <ValueContainer>
                      <ValueText type={transaction.type}>
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL'
                        }).format(transaction.value)}
                      </ValueText>
                      {transaction.type === 'despesa' && (
                        (() => {
                          const status = getDueStatus(transaction.date, transaction.paid);
                          if (status) {
                            return <DueTag overdue={status.type === 'overdue'} dueSoon={status.type === 'dueSoon'}>
                              {status.text}
                            </DueTag>;
                          }
                          return null;
                        })()
                      )}
                    </ValueContainer>
                  </Td>
                  <Td paid={transaction.paid}>{new Date(transaction.date).toLocaleDateString('pt-BR')}</Td>
                  <Td paid={transaction.paid}>{transaction.description}</Td>
                  <Td>
                    <TableButtonsContainer>
                      <button onClick={() => handleEdit(transaction)} title="Editar">
                        <FaEdit style={{ color: 'blue', fontSize: '1.2rem' }} />
                      </button>
                      <button onClick={() => handleDelete(transaction.id)} title="Excluir">
                        <FaTrash style={{ color: 'red', fontSize: '1.2rem' }} />
                      </button>
                    </TableButtonsContainer>
                  </Td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </TableContainer>

      <MobileContainer>
        {sortTransactions(transactions).map(transaction => (
          <MobileCard key={transaction.id}>
            <MobileStatusContainer>
              <PaidButton
                paid={transaction.paid}
                onClick={() => handleTogglePaid(transaction)}
              >
                {transaction.paid ? "💲✓" : "💲"}
              </PaidButton>
              <StatusLegend>
                {transaction.paid ? "Pago" : "Pendente"}
              </StatusLegend>
            </MobileStatusContainer>

            <MobileContentContainer>
              <MobileHeader>
                <MobileHeaderTop>
                  <MobileDescription paid={transaction.paid}>
                    {transaction.description}
                  </MobileDescription>
                  <MobileValueSection>
                    <MobileTagContainer>
                      {transaction.type === 'despesa' && (
                        (() => {
                          const status = getDueStatus(transaction.date, transaction.paid);
                          if (status) {
                            return <MobileDueTag overdue={status.type === 'overdue'} dueSoon={status.type === 'dueSoon'}>
                              {status.text}
                            </MobileDueTag>;
                          }
                          return null;
                        })()
                      )}
                    </MobileTagContainer>
                    <MobileValueWrapper>
                      <MobileValue type={transaction.type}>
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL'
                        }).format(transaction.value)}
                      </MobileValue>
                    </MobileValueWrapper>
                  </MobileValueSection>
                </MobileHeaderTop>
              </MobileHeader>
              
              <MobileInfo>
                <span>{transaction.category}</span>
                <span>{new Date(transaction.date).toLocaleDateString('pt-BR')}</span>
              </MobileInfo>

              <MobileActions>
                <button onClick={() => handleEdit(transaction)} title="Editar">
                  <FaEdit style={{ color: 'blue', fontSize: '1.2rem' }} />
                </button>
                <button onClick={() => handleDelete(transaction.id)} title="Excluir">
                  <FaTrash style={{ color: 'red', fontSize: '1.2rem' }} />
                </button>
              </MobileActions>
            </MobileContentContainer>
          </MobileCard>
        ))}
      </MobileContainer>
    </>
  );
};

export default TransactionList;
