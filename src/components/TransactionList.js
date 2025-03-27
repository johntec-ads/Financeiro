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
`;

const ErrorMessage = styled(LoadingMessage)`
  color: var(--danger);
`;

const TransactionList = ({ transactions, deleteTransaction, updateTransaction, loading, error }) => {
  if (loading) {
    return <LoadingMessage>Carregando transações...</LoadingMessage>;
  }

  if (error) {
    return (
      <ErrorMessage>
        <h3>Erro ao carregar transações</h3>
        <p>O índice está sendo criado. Por favor, aguarde alguns minutos e tente novamente.</p>
        <p>Se o erro persistir, recarregue a página.</p>
      </ErrorMessage>
    );
  }

  console.log('Renderizando transações:', transactions); // Debug

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
                  <DeleteButton onClick={() => deleteTransaction(transaction.id)}>
                    Excluir
                  </DeleteButton>
                </Td>
              </tr>
            ))
          ) : (
            <tr>
              <Td colSpan="6" style={{ textAlign: 'center' }}>
                {loading ? 'Carregando...' : 'Nenhuma transação encontrada'}
              </Td>
            </tr>
          )}
        </tbody>
      </Table>
    </TableContainer>
  );
};

export default TransactionList;
