import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { EasemindLoginModal } from './login-modal';
import { AccessModalType } from '@repo/ui';

jest.mock('@repo/data-access', () => ({
  useUser: () => ({
    login: jest.fn(), // não testamos fluxo de API aqui
  }),
}));

jest.mock('@repo/ui', () => ({
  AccessModalType: {
    LOGIN: 'LOGIN',
    REGISTER: 'REGISTER',
  },
  EasemindModal: ({ children, open, onClose, title }: any) =>
    open ? (
      <div data-testid="modal">
        <h2>{title}</h2>
        <button onClick={onClose}>Fechar</button>
        {children}
      </div>
    ) : null,
}));

const mockProps = {
  open: true,
  onClose: jest.fn(),
  onSubmit: jest.fn(),
  openModal: jest.fn(),
};

describe('EasemindLoginModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
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

  it('não deve chamar onSubmit quando campos obrigatórios estão vazios', async () => {
    render(<EasemindLoginModal {...mockProps} />);
    const submitButton = screen.getByRole('button', { name: /entrar/i });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockProps.onSubmit).not.toHaveBeenCalled();
    });
  });
});

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { EasemindLoginModal } from './login-modal';
import { AccessModalType } from '@repo/ui';

let loginMock: jest.Mock;

jest.mock('@repo/data-access', () => ({
  useUser: () => ({
    login: loginMock,
  }),
}));

jest.mock('@repo/ui', () => ({
  AccessModalType: {
    LOGIN: 'LOGIN',
    REGISTER: 'REGISTER',
  },
  EasemindModal: ({ children, open, onClose, title }: any) =>
    open ? (
      <div data-testid="modal">
        <h2>{title}</h2>
        <button onClick={onClose}>Fechar</button>
        {children}
      </div>
    ) : null,
}));

const mockProps = {
  open: true,
  onClose: jest.fn(),
  onSubmit: jest.fn(),
  openModal: jest.fn(),
};

describe('EasemindLoginModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    loginMock = jest.fn(); // reatribui aqui
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
    loginMock.mockResolvedValueOnce({ success: true, message: 'Login realizado' });

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
    loginMock.mockResolvedValueOnce({
      success: false,
      message: 'Credenciais inválidas'
    });

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
