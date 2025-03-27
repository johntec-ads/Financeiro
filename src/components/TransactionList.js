import React from 'react';
import styled from 'styled-components';

const TableContainer = styled.div`
  background-color: var(--card-bg);
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: auto;
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

const TransactionList = ({ transactions, deleteTransaction, updateTransaction }) => {
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
          {transactions.map(transaction => (
            <tr key={transaction.id}>
              <Td>{transaction.type}</Td>
              <Td>{transaction.category}</Td>
              <Td><ValueText type={transaction.type}>{transaction.value}</ValueText></Td>
              <Td>{transaction.date}</Td>
              <Td>{transaction.description}</Td>
              <Td>
                <DeleteButton onClick={() => deleteTransaction(transaction.id)}>Excluir</DeleteButton>
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>
    </TableContainer>
  );
};

export default TransactionList;
