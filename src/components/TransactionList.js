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

  @media (max-width: 768px) {
    padding: 0.75rem 0.5rem;
    &:nth-child(4), &:nth-child(5) { // esconde colunas data e descrição
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

const TransactionList = ({ transactions, deleteTransaction, loading, error }) => {
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
                <Td>{transaction.type}</Td>
                <Td>{transaction.category}</Td>
                <Td>
                  <ValueText type={transaction.type}>
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    }).format(transaction.value)}
                  </ValueText>
                </Td>
                <Td>{new Date(transaction.date).toLocaleDateString('pt-BR')}</Td>
                <Td>{transaction.description}</Td>
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
