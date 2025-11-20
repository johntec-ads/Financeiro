import React, { useState } from 'react';
import styled from 'styled-components';
import { FaTrash, FaEdit, FaCheck } from 'react-icons/fa';
import Modal from './Modal';

const TableContainer = styled.div`
  background-color: var(--card-bg);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  overflow: hidden; // Importante para bordas arredondadas
  border: 1px solid var(--border);

  @media (max-width: 768px) {
    display: none;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 600px;
`;

const Th = styled.th`
  background-color: var(--bg-secondary);
  padding: 1rem 1.5rem;
  text-align: left;
  font-weight: 600;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-secondary);
  border-bottom: 1px solid var(--border);
`;

const Td = styled.td`
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--border);
  color: var(--text);
  font-size: 0.9rem;
  vertical-align: middle;
  
  ${props => props.paid && `
    color: var(--text-secondary);
  `}
`;

const PaidButton = styled.button`
  background: none;
  border: 2px solid ${props => props.paid ? 'var(--success)' : 'var(--border)'};
  border-radius: 50%;
  width: 24px;
  height: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  color: ${props => props.paid ? 'var(--success)' : 'transparent'};
  
  &:hover {
    border-color: var(--success);
    background-color: var(--success-light);
  }
`;

const ValueContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  justify-content: flex-end;
`;

const ValueText = styled.span`
  color: ${props => props.type === 'receita' ? 'var(--success)' : 'var(--text)'};
  font-weight: 600;
  font-family: 'Inter', monospace; // Números monoespaçados ficam melhores
`;

const DueTag = styled.span`
  padding: 0.25rem 0.6rem;
  border-radius: 999px;
  font-size: 0.7rem;
  font-weight: 600;
  background-color: ${props => {
    if (props.overdue) return 'var(--danger-light)';
    if (props.dueSoon) return 'var(--warning)'; // Warning geralmente não tem light definido no global, mas ok
    return 'var(--success-light)';
  }};
  color: ${props => {
    if (props.overdue) return 'var(--danger)';
    if (props.dueSoon) return '#fff';
    return 'var(--success)';
  }};
  white-space: nowrap;
`;

const MobileCard = styled.div`
  background: var(--card-bg);
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border);
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

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
  color: var(--text);
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid var(--border);
  border-radius: 4px;
  font-size: 1rem;
  color: var(--text);
  background-color: var(--background);
`;

const ModalBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

// Ajustar a renderização da data para garantir que o fuso horário local seja usado
const formatDate = (dateString) => {
  const [year, month, day] = dateString.split('-');
  return new Date(year, month - 1, day).toLocaleDateString('pt-BR');
};

const TransactionList = ({ transactions, deleteTransaction, updateTransaction, loading, error }) => {
  console.log('TransactionList - transactions recebidas:', transactions);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState(null);

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
    setCurrentTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (currentTransaction) {
      updateTransaction(currentTransaction.id, currentTransaction);
    }
    setIsModalOpen(false);
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
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Editar Transação"
        onSave={handleSave}
      >
        <ModalBody>
          <Label>
            Valor:
            <Input
              type="number"
              value={currentTransaction?.value || ''}
              onChange={(e) =>
                setCurrentTransaction({ ...currentTransaction, value: parseFloat(e.target.value) })
              }
            />
          </Label>
          <Label>
            Data de Vencimento:
            <Input
              type="date"
              value={currentTransaction?.date || ''}
              onChange={(e) =>
                setCurrentTransaction({ ...currentTransaction, date: e.target.value })
              }
            />
          </Label>
          <Label>
            Descrição:
            <Input
              type="text"
              value={currentTransaction?.description || ''}
              onChange={(e) =>
                setCurrentTransaction({ ...currentTransaction, description: e.target.value })
              }
            />
          </Label>
        </ModalBody>
      </Modal>

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
              return (
                <tr key={transaction.id}>
                  <Td>
                    <PaidButton
                      paid={transaction.paid}
                      onClick={() => handleTogglePaid(transaction)}
                      title={transaction.paid ? "Marcado como pago" : "Marcar como pago"}
                    >
                      {transaction.paid && <FaCheck size={14} />}
                    </PaidButton>
                  </Td>
                  <Td paid={transaction.paid} style={{ textTransform: 'capitalize' }}>{transaction.type}</Td>
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
                  <Td paid={transaction.paid}>{formatDate(transaction.date)}</Td>
                  <Td paid={transaction.paid}>{transaction.description}</Td>
                  <Td>
                    <TableButtonsContainer>
                      <ActionButton onClick={() => handleEdit(transaction)} title="Editar" color="var(--primary)">
                        <FaEdit size={18} />
                      </ActionButton>
                      <ActionButton onClick={() => handleDelete(transaction.id)} title="Excluir" color="var(--danger)">
                        <FaTrash size={18} />
                      </ActionButton>
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
                {transaction.paid && <FaCheck size={14} />}
              </PaidButton>
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
                <span>{formatDate(transaction.date)}</span>
              </MobileInfo>

              <MobileActions>
                <ActionButton onClick={() => handleEdit(transaction)} title="Editar" color="var(--primary)">
                  <FaEdit size={18} />
                </ActionButton>
                <ActionButton onClick={() => handleDelete(transaction.id)} title="Excluir" color="var(--danger)">
                  <FaTrash size={18} />
                </ActionButton>
              </MobileActions>
            </MobileContentContainer>
          </MobileCard>
        ))}
      </MobileContainer>
    </>
  );
};

const ActionButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: background-color 0.2s;
  color: var(--text-secondary);

  &:hover {
    background-color: var(--bg-secondary);
    color: ${props => props.color || 'var(--text)'};
  }
`;

export default TransactionList;
