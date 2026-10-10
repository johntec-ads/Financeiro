import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import Summary from './Summary';

test('mostra o total restante de despesas pendentes e permite ocultar o card', () => {
  render(
    <Summary
      transactions={[
        { id: '1', type: 'despesa', value: 500, paid: false },
        { id: '2', type: 'despesa', value: 300, paid: false },
        { id: '3', type: 'despesa', value: 200, paid: true },
        { id: '4', type: 'receita', value: 1500, paid: false },
      ]}
    />
  );

  expect(screen.getByText('Restante a pagar')).toBeInTheDocument();
  expect(screen.getByText('R$ 800,00')).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: /ocultar card/i }));

  expect(screen.queryByText('Restante a pagar')).not.toBeInTheDocument();
});
