import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import TransactionForm from './TransactionForm';

test('inicia a data no mês selecionado e acompanha a troca de período', () => {
  const { container, rerender } = render(
    <TransactionForm
      addTransaction={jest.fn()}
      selectedMonth={2}
      selectedYear={2025}
    />
  );

  const dateInput = container.querySelector('input[type="date"]');

  expect(dateInput).toHaveValue('2025-02-01');

  rerender(
    <TransactionForm
      addTransaction={jest.fn()}
      selectedMonth={9}
      selectedYear={2025}
    />
  );

  expect(dateInput).toHaveValue('2025-09-01');

  fireEvent.change(dateInput, { target: { value: '2025-09-16' } });

  rerender(
    <TransactionForm
      addTransaction={jest.fn()}
      selectedMonth={9}
      selectedYear={2025}
    />
  );

  expect(dateInput).toHaveValue('2025-09-16');
});
