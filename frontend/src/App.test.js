import { render, screen } from '@testing-library/react';
import App from './App';

test('renders welcome message', () => {
  render(<App />);
  const welcomeElement = screen.getByText(/Bem-vindo ao SIPM/i);
  expect(welcomeElement).toBeInTheDocument();
});
