import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';
import NotFoundPage from './not-found';

vi.mock('@repo/utils', () => ({
  useTheme: () => ({
    colors: {
      background: '#ffffff',
      text: '#000000',
      'coral.500': '#ff4353',
      'coral.800': '#666666',
    },
    isDarkMode: false,
  }),
}));

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('NotFoundPage', () => {
  it('deve renderizar sem erros', () => {
    renderWithRouter(<NotFoundPage />);
  });

  it('deve exibir código de erro 404', () => {
    renderWithRouter(<NotFoundPage />);
    expect(screen.getByText('404')).toBeInTheDocument();
  });

  it('deve exibir título "Página não encontrada"', () => {
    renderWithRouter(<NotFoundPage />);
    expect(screen.getByText('Página não encontrada')).toBeInTheDocument();
  });

  it('deve exibir mensagem descritiva', () => {
    renderWithRouter(<NotFoundPage />);
    expect(
      screen.getByText(/A página que você está procurando não existe ou foi removida/i)
    ).toBeInTheDocument();
  });

  it('deve exibir botão "Voltar para Home"', () => {
    renderWithRouter(<NotFoundPage />);
    expect(screen.getByRole('button', { name: /voltar para home/i })).toBeInTheDocument();
  });

  it('deve ter link para a página inicial', () => {
    renderWithRouter(<NotFoundPage />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/');
  });

  it('deve renderizar ícone de erro', () => {
    renderWithRouter(<NotFoundPage />);
    const icon = document.querySelector('svg');
    expect(icon).toBeInTheDocument();
  });
});
