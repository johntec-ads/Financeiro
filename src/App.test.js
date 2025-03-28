import { render, screen } from '@testing-library/react';
import App from './App';

test('renders app without crashing', () => {
  render(<App />);
  // Verifica se o componente foi renderizado sem erros
  expect(document.querySelector('.App')).toBeTruthy();
});
