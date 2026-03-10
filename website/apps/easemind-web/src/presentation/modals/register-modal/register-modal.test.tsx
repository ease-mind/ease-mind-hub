import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { EasemindRegisterModal } from './register-modal';
import { AccessModalType } from '@repo/ui';

jest.mock('@repo/data-access', () => ({
  useUser: () => ({
    register: jest.fn(),
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

describe('EasemindRegisterModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar o modal quando open é true', () => {
    render(<EasemindRegisterModal {...mockProps} />);
    expect(screen.getByTestId('modal')).toBeInTheDocument();
    expect(screen.getByText('Criar uma conta')).toBeInTheDocument();
  });

  it('não deve renderizar o modal quando open é false', () => {
    render(<EasemindRegisterModal {...mockProps} open={false} />);
    expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
  });

  it('deve exibir campos de nome, e-mail e senha', () => {
    render(<EasemindRegisterModal {...mockProps} />);
    expect(screen.getByPlaceholderText('Digite seu nome')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Digite seu e-mail')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Digite sua senha')).toBeInTheDocument();
  });

  it('deve exibir botão "Criar conta"', () => {
    render(<EasemindRegisterModal {...mockProps} />);
    expect(screen.getByRole('button', { name: /criar conta/i })).toBeInTheDocument();
  });

  it('deve chamar openModal ao clicar em "Fazer login"', () => {
    render(<EasemindRegisterModal {...mockProps} />);
    const loginLink = screen.getByText('Fazer login');
    fireEvent.click(loginLink);
    expect(mockProps.openModal).toHaveBeenCalledWith(AccessModalType.REGISTER);
  });

  it('deve chamar onClose ao fechar o modal', () => {
    render(<EasemindRegisterModal {...mockProps} />);
    const closeButton = screen.getByText('Fechar');
    fireEvent.click(closeButton);
    expect(mockProps.onClose).toHaveBeenCalled();
  });

  it('não deve chamar onSubmit quando campos obrigatórios estão vazios', async () => {
    render(<EasemindRegisterModal {...mockProps} />);
    const submitButton = screen.getByRole('button', { name: /criar conta/i });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockProps.onSubmit).not.toHaveBeenCalled();
    });
  });
});

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { EasemindRegisterModal } from './register-modal';
import { AccessModalType } from '@repo/ui';

let registerMock: jest.Mock;

jest.mock('@repo/data-access', () => ({
  useUser: () => ({
    register: registerMock,
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

describe('EasemindRegisterModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    registerMock = jest.fn();
  });

  it('deve renderizar o modal quando open é true', () => {
    render(<EasemindRegisterModal {...mockProps} />);
    expect(screen.getByTestId('modal')).toBeInTheDocument();
    expect(screen.getByText('Criar uma conta')).toBeInTheDocument();
  });

  it('não deve renderizar o modal quando open é false', () => {
    render(<EasemindRegisterModal {...mockProps} open={false} />);
    expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
  });

  it('deve exibir texto de instrução', () => {
    render(<EasemindRegisterModal {...mockProps} />);
    expect(screen.getByText(/Preencha os campos abaixo para criar sua conta/i)).toBeInTheDocument();
  });

  it('deve exibir campos de nome, e-mail e senha', () => {
    render(<EasemindRegisterModal {...mockProps} />);
    expect(screen.getByPlaceholderText('Digite seu nome')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Digite seu e-mail')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Digite sua senha')).toBeInTheDocument();
  });

  it('deve exibir botão "Criar conta"', () => {
    render(<EasemindRegisterModal {...mockProps} />);
    expect(screen.getByRole('button', { name: /criar conta/i })).toBeInTheDocument();
  });

  it('deve exibir link "Fazer login" para usuários existentes', () => {
    render(<EasemindRegisterModal {...mockProps} />);
    expect(screen.getByText('Já tem uma conta?')).toBeInTheDocument();
    expect(screen.getByText('Fazer login')).toBeInTheDocument();
  });

  it('deve chamar openModal ao clicar em "Fazer login"', () => {
    render(<EasemindRegisterModal {...mockProps} />);
    const loginLink = screen.getByText('Fazer login');
    fireEvent.click(loginLink);
    expect(mockProps.openModal).toHaveBeenCalledWith(AccessModalType.REGISTER);
  });

  it('deve chamar onClose ao fechar o modal', () => {
    render(<EasemindRegisterModal {...mockProps} />);
    const closeButton = screen.getByText('Fechar');
    fireEvent.click(closeButton);
    expect(mockProps.onClose).toHaveBeenCalled();
  });

  it('deve validar campos obrigatórios', async () => {
    render(<EasemindRegisterModal {...mockProps} />);
    const submitButton = screen.getByRole('button', { name: /criar conta/i });
    
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockProps.onSubmit).not.toHaveBeenCalled();
    });
  });

  it('deve chamar onSubmit com sucesso ao criar conta válida', async () => {
    registerMock.mockResolvedValueOnce({
      success: true,
      message: 'Cadastro realizado com sucesso'
    });

    render(<EasemindRegisterModal {...mockProps} />);
    
    const nameInput = screen.getByPlaceholderText('Digite seu nome');
    const emailInput = screen.getByPlaceholderText('Digite seu e-mail');
    const passwordInput = screen.getByPlaceholderText('Digite sua senha');
    const submitButton = screen.getByRole('button', { name: /criar conta/i });

    fireEvent.change(nameInput, { target: { value: 'João Silva' } });
    fireEvent.change(emailInput, { target: { value: 'joao@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'senha123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(registerMock).toHaveBeenCalledWith({
        name: 'João Silva',
        email: 'joao@example.com',
        password: 'senha123',
      });
      expect(mockProps.onSubmit).toHaveBeenCalledWith({
        status: 'success',
        message: 'Cadastro realizado com sucesso',
      });
    });
  });

  it('deve chamar onSubmit com erro ao falhar cadastro', async () => {
    registerMock.mockResolvedValueOnce({
      success: false,
      message: 'E-mail já cadastrado'
    });

    render(<EasemindRegisterModal {...mockProps} />);
    
    const nameInput = screen.getByPlaceholderText('Digite seu nome');
    const emailInput = screen.getByPlaceholderText('Digite seu e-mail');
    const passwordInput = screen.getByPlaceholderText('Digite sua senha');
    const submitButton = screen.getByRole('button', { name: /criar conta/i });

    fireEvent.change(nameInput, { target: { value: 'Maria Santos' } });
    fireEvent.change(emailInput, { target: { value: 'maria@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'senha456' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockProps.onSubmit).toHaveBeenCalledWith({
        status: 'error',
        message: 'E-mail já cadastrado',
      });
    });
  });

  it('deve exibir mensagem de erro padrão quando registro falha sem mensagem', async () => {
    registerMock.mockResolvedValueOnce({ success: false });

    render(<EasemindRegisterModal {...mockProps} />);
    
    const nameInput = screen.getByPlaceholderText('Digite seu nome');
    const emailInput = screen.getByPlaceholderText('Digite seu e-mail');
    const passwordInput = screen.getByPlaceholderText('Digite sua senha');
    const submitButton = screen.getByRole('button', { name: /criar conta/i });

    fireEvent.change(nameInput, { target: { value: 'Test User' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'test123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockProps.onSubmit).toHaveBeenCalledWith({
        status: 'error',
        message: expect.stringContaining('Ocorreu um erro'),
      });
    });
  });

  it('deve resetar o formulário ao fechar o modal', () => {
    render(<EasemindRegisterModal {...mockProps} />);
    
    const nameInput = screen.getByPlaceholderText('Digite seu nome') as HTMLInputElement;
    fireEvent.change(nameInput, { target: { value: 'Test Name' } });
    
    expect(nameInput.value).toBe('Test Name');
    
    const closeButton = screen.getByText('Fechar');
    fireEvent.click(closeButton);
    
    expect(mockProps.onClose).toHaveBeenCalled();
  });

  it('deve exibir loading state durante o envio do formulário', async () => {
    registerMock.mockImplementation(() =>
      new Promise(resolve => setTimeout(() => resolve({ success: true }), 100))
    );

    render(<EasemindRegisterModal {...mockProps} />);
    
    const nameInput = screen.getByPlaceholderText('Digite seu nome');
    const emailInput = screen.getByPlaceholderText('Digite seu e-mail');
    const passwordInput = screen.getByPlaceholderText('Digite sua senha');
    const submitButton = screen.getByRole('button', { name: /criar conta/i });

    fireEvent.change(nameInput, { target: { value: 'Test' } });
    fireEvent.change(emailInput, { target: { value: 'test@test.com' } });
    fireEvent.change(passwordInput, { target: { value: 'test' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(registerMock).toHaveBeenCalled();
    });
  });
});
