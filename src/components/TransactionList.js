import React from 'react';
import styled from 'styled-components';

const TableContainer = styled.div`
  background-color: var(--card-bg);
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: auto;

  @media (max-width: 768px) {
    margin: 0 -1rem;
    border-radius: 0;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  min-width: 600px;

  @media (max-width: 768px) {
    font-size: 0.875rem;
    min-width: auto;
  }
`;

const Th = styled.th`
  background-color: var(--background);
  padding: 1rem;
  text-align: left;
  font-weight: 500;
  color: var(--text);
  border-bottom: 2px solid var(--border);

  @media (max-width: 768px) {
    padding: 0.75rem 0.5rem;
    &:nth-child(4), &:nth-child(5) { // esconde colunas data e descrição
      display: none;
    }
  }
`;

const Td = styled.td`
  padding: 1rem;
  border-bottom: 1px solid var(--border);
  color: var(--text);
  text-decoration: ${props => props.paid ? 'line-through' : 'none'};
  opacity: ${props => props.paid ? 0.7 : 1};

  @media (max-width: 768px) {
    padding: 0.75rem 0.5rem;
    &:nth-child(4), &:nth-child(5) { 
      display: none;
    }
  }
`;

const DeleteButton = styled.button`
  background-color: var(--danger);
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
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

const ValueText = styled.span`
  color: ${props => props.type === 'receita' ? 'var(--success)' : 'var(--danger)'};
  font-weight: 500;
`;

const LoadingContainer = styled.div`
  padding: 2rem;
  text-align: center;
  background-color: var(--card-bg);
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const ErrorContainer = styled(LoadingContainer)`
  color: var(--danger);
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 2rem;
  background: var(--card-bg);
  border-radius: 8px;
  margin: 1rem 0;
  font-size: 1.25rem; /* Melhorar visibilidade */
  color: var(--primary); /* Cor mais amigável */
`;

const ErrorMessage = styled(LoadingMessage)`
  color: var(--danger);
  font-weight: bold; /* Destacar mensagem de erro */
`;

const TransactionList = ({ transactions, deleteTransaction, updateTransaction, loading, error }) => {
  console.log('TransactionList - transactions recebidas:', transactions); // Debug

  const handleDelete = async (id) => {
    try {
      if (window.confirm('Tem certeza que deseja excluir esta transação?')) {
        await deleteTransaction(id);
      }
    } catch (error) {
      // Melhor tratamento de erro para o usuário
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
          {transactions.map(transaction => {
            console.log('Renderizando transação:', transaction); // Debug por item
            return (
              <tr key={transaction.id}>
                <Td>
                  <PaidButton
                    paid={transaction.paid}
                    onClick={() => handleTogglePaid(transaction)}
                    title={transaction.paid ? "Marcado como pago" : "Marcar como pago"}
                  >
                    {transaction.paid ? "💲✓" : "💲"}
                  </PaidButton>
                </Td>
                <Td paid={transaction.paid}>{transaction.type}</Td>
                <Td paid={transaction.paid}>{transaction.category}</Td>
                <Td paid={transaction.paid}>
                  <ValueText type={transaction.type}>
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    }).format(transaction.value)}
                  </ValueText>
                </Td>
                <Td paid={transaction.paid}>{new Date(transaction.date).toLocaleDateString('pt-BR')}</Td>
                <Td paid={transaction.paid}>{transaction.description}</Td>
                <Td>
                  <DeleteButton 
                    onClick={() => handleDelete(transaction.id)}
                    aria-label={`Excluir transação ${transaction.description}`}
                  >
                    Excluir
                  </DeleteButton>
                </Td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </TableContainer>
  );
};

export default TransactionList;
