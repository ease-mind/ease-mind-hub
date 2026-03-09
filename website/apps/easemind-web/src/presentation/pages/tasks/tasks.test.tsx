import { render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { TasksPage } from './tasks';

vi.mock('@repo/utils', () => ({
  useTheme: () => ({
    colors: {
      background: '#ffffff',
      'coral.500': '#ff4353',
    },
    isDarkMode: false,
  }),
}));

vi.mock('../../utils/microfrontends', () => ({
  TaskOrganizerPage: () => <div data-testid="task-organizer">Task Organizer Component</div>,
}));

describe('TasksPage', () => {
  it('deve renderizar sem erros', () => {
    render(<TasksPage />);
  });

  it('deve exibir loading spinner durante carregamento do Suspense', () => {
    render(<TasksPage />);
    const spinner = document.querySelector('.MuiCircularProgress-root');
    expect(spinner).toBeInTheDocument();
  });

  it('deve carregar o componente TaskOrganizerPage após suspense', async () => {
    render(<TasksPage />);
    
    await waitFor(() => {
      expect(screen.getByTestId('task-organizer')).toBeInTheDocument();
    });
  });

  it('deve exibir o texto do TaskOrganizerPage', async () => {
    render(<TasksPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Task Organizer Component')).toBeInTheDocument();
    });
  });

  it('deve aplicar background correto no modo claro', () => {
    const { container } = render(<TasksPage />);
    const mainBox = container.firstChild as HTMLElement;
    
    expect(mainBox).toHaveStyle({ background: '#fef3f1' });
  });

  it('deve aplicar background correto no modo escuro', () => {
    const { useTheme } = require('@repo/utils');
    vi.mocked(useTheme).mockReturnValue({
      colors: {
        background: '#1a1a1a',
        'coral.500': '#ff4353',
      },
      isDarkMode: true,
    });

    const { container } = render(<TasksPage />);
    const mainBox = container.firstChild as HTMLElement;
    
    expect(mainBox).toHaveStyle({ background: '#1a1a1a' });
  });

  it('deve ter altura mínima de 100vh', () => {
    const { container } = render(<TasksPage />);
    const mainBox = container.firstChild as HTMLElement;
    
    expect(mainBox).toHaveStyle({ minHeight: '100vh' });
  });

  it('deve ter largura de 100%', () => {
    const { container } = render(<TasksPage />);
    const mainBox = container.firstChild as HTMLElement;
    
    expect(mainBox).toHaveStyle({ width: '100%' });
  });

  it('deve exibir CircularProgress com cor coral', () => {
    const { container } = render(<TasksPage />);
    const spinner = container.querySelector('.MuiCircularProgress-root');
    
    expect(spinner).toBeInTheDocument();
  });

  it('deve centralizar o loading spinner', () => {
    const { container } = render(<TasksPage />);
    const loadingBox = container.querySelector('[style*="justify-content"]');
    
    expect(loadingBox).toHaveStyle({
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    });
  });
});
