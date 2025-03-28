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

const TransactionList = ({ transactions, deleteTransaction, updateTransaction, loading, error }) => {
  const handleDelete = (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta transação?')) {
      deleteTransaction(id);
    }
  };

  if (loading) {
    return (
      <LoadingMessage role="status" aria-live="polite">
        Carregando transações, por favor aguarde...
      </LoadingMessage>
    );
  }

  if (error) {
    return (
      <ErrorMessage role="alert">
        <h3>Erro ao carregar transações</h3>
        <p>Por favor, recarregue a página ou tente novamente mais tarde.</p>
      </ErrorMessage>
    );
  }

  return (
    <TableContainer>
      <Table>
        <thead>
          <tr>
            <Th scope="col">Tipo</Th>
            <Th scope="col">Categoria</Th>
            <Th scope="col">Valor</Th>
            <Th scope="col">Data</Th>
            <Th scope="col">Descrição</Th>
            <Th scope="col">Ações</Th>
          </tr>
        </thead>
        <tbody>
          {transactions && transactions.length > 0 ? (
            transactions.map(transaction => (
              <tr key={transaction.id}>
                <Td>{transaction.type}</Td>
                <Td>{transaction.category}</Td>
                <Td>
                  <ValueText type={transaction.type}>
                    {typeof transaction.value === 'number' 
                      ? new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL'
                        }).format(transaction.value)
                      : transaction.value}
                  </ValueText>
                </Td>
                <Td>{transaction.date}</Td>
                <Td>{transaction.description}</Td>
                <Td>
                  <DeleteButton 
                    onClick={() => handleDelete(transaction.id)} 
                    aria-label={`Excluir transação de ${transaction.category} no valor de ${transaction.value}`}
                  >
                    Excluir
                  </DeleteButton>
                </Td>
              </tr>
            ))
          ) : (
            <tr>
              <Td colSpan="6" style={{ textAlign: 'center' }}>
                Nenhuma transação encontrada
              </Td>
            </tr>
          )}
        </tbody>
      </Table>
    </TableContainer>
  );
};

export default TransactionList;
