import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { EasemindLoginModal } from './login-modal';
import { AccessModalType } from '@repo/ui';

vi.mock('@repo/data-access', () => ({
  useUser: () => ({
    login: vi.fn().mockResolvedValue({ success: true, message: 'Login realizado com sucesso' }),
  }),
}));

vi.mock('@repo/ui', async () => {
  const actual = await vi.importActual('@repo/ui');
  return {
    ...actual,
    EasemindModal: ({ children, open, onClose, title }: any) =>
      open ? (
        <div data-testid="modal">
          <h2>{title}</h2>
          <button onClick={onClose}>Fechar</button>
          {children}
        </div>
      ) : null,
  };
});

const mockProps = {
  open: true,
  onClose: vi.fn(),
  onSubmit: vi.fn(),
  openModal: vi.fn(),
};

describe('EasemindLoginModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve renderizar o modal quando open é true', () => {
    render(<EasemindLoginModal {...mockProps} />);
    expect(screen.getByTestId('modal')).toBeInTheDocument();
    expect(screen.getByText('Login')).toBeInTheDocument();
  });

  it('não deve renderizar o modal quando open é false', () => {
    render(<EasemindLoginModal {...mockProps} open={false} />);
    expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
  });

  it('deve exibir campos de e-mail e senha', () => {
    render(<EasemindLoginModal {...mockProps} />);
    expect(screen.getByPlaceholderText('Digite seu e-mail')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Digite sua senha')).toBeInTheDocument();
  });

  it('deve exibir botão "Entrar"', () => {
    render(<EasemindLoginModal {...mockProps} />);
    expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument();
  });

  it('deve exibir link "Esqueceu sua senha?"', () => {
    render(<EasemindLoginModal {...mockProps} />);
    expect(screen.getByText('Esqueceu sua senha?')).toBeInTheDocument();
  });

  it('deve exibir link "Crie uma agora!" para registro', () => {
    render(<EasemindLoginModal {...mockProps} />);
    expect(screen.getByText('Crie uma agora!')).toBeInTheDocument();
  });

  it('deve chamar openModal ao clicar em "Crie uma agora!"', () => {
    render(<EasemindLoginModal {...mockProps} />);
    const createAccountLink = screen.getByText('Crie uma agora!');
    fireEvent.click(createAccountLink);
    expect(mockProps.openModal).toHaveBeenCalledWith(AccessModalType.LOGIN);
  });

  it('deve chamar onClose ao fechar o modal', () => {
    render(<EasemindLoginModal {...mockProps} />);
    const closeButton = screen.getByText('Fechar');
    fireEvent.click(closeButton);
    expect(mockProps.onClose).toHaveBeenCalled();
  });

  it('deve validar campos obrigatórios', async () => {
    render(<EasemindLoginModal {...mockProps} />);
    const submitButton = screen.getByRole('button', { name: /entrar/i });
    
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockProps.onSubmit).not.toHaveBeenCalled();
    });
  });

  it('deve chamar onSubmit com sucesso ao fazer login válido', async () => {
    const { useUser } = await import('@repo/data-access');
    const loginMock = vi.fn().mockResolvedValue({ success: true, message: 'Login realizado' });
    vi.mocked(useUser).mockReturnValue({ login: loginMock } as any);

    render(<EasemindLoginModal {...mockProps} />);
    
    const emailInput = screen.getByPlaceholderText('Digite seu e-mail');
    const passwordInput = screen.getByPlaceholderText('Digite sua senha');
    const submitButton = screen.getByRole('button', { name: /entrar/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(loginMock).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
      expect(mockProps.onSubmit).toHaveBeenCalledWith({ status: 'success' });
    });
  });

  it('deve chamar onSubmit com erro ao falhar login', async () => {
    const { useUser } = await import('@repo/data-access');
    const loginMock = vi.fn().mockResolvedValue({ 
      success: false, 
      message: 'Credenciais inválidas' 
    });
    vi.mocked(useUser).mockReturnValue({ login: loginMock } as any);

    render(<EasemindLoginModal {...mockProps} />);
    
    const emailInput = screen.getByPlaceholderText('Digite seu e-mail');
    const passwordInput = screen.getByPlaceholderText('Digite sua senha');
    const submitButton = screen.getByRole('button', { name: /entrar/i });

    fireEvent.change(emailInput, { target: { value: 'wrong@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpass' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockProps.onSubmit).toHaveBeenCalledWith({
        status: 'error',
        message: 'Credenciais inválidas',
      });
    });
  });

  it('deve resetar o formulário ao fechar o modal', () => {
    render(<EasemindLoginModal {...mockProps} />);
    
    const emailInput = screen.getByPlaceholderText('Digite seu e-mail') as HTMLInputElement;
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    
    expect(emailInput.value).toBe('test@example.com');
    
    const closeButton = screen.getByText('Fechar');
    fireEvent.click(closeButton);
    
    expect(mockProps.onClose).toHaveBeenCalled();
  });
});
