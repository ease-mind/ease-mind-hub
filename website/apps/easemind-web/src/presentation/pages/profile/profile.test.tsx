import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import EasemindProfilePage from './profile';

vi.mock('@repo/utils', () => ({
  useTheme: () => ({
    colors: {
      background: '#ffffff',
      text: '#000000',
      'coral.100': '#ffe4e1',
      'coral.200': '#ffb4ab',
      'coral.500': '#ff4353',
      'coral.800': '#666666',
      'coral.highcontrast': '#333333',
    },
    isDarkMode: false,
  }),
  formatCPF: (value: string) => value,
  validateCPF: () => true,
}));

vi.mock('@repo/data-access', () => ({
  useUser: () => ({
    user: {
      _id: '1',
      name: 'Daniela Farias',
      email: 'daniela@test.com',
      image: null,
      document: '12345678900',
    },
    setUser: vi.fn(),
  }),
  getUserAddress: vi.fn().mockResolvedValue({
    data: {
      address: 'Rua Teste, 123',
      city: 'São Paulo',
      state: 'São Paulo',
      complement: 'Apto 10',
    },
  }),
  updateUser: vi.fn().mockResolvedValue({
    status: 200,
    data: {
      name: 'Daniela Farias',
      email: 'daniela@test.com',
    },
  }),
  updateUserProfileImage: vi.fn().mockResolvedValue({
    name: 'Daniela Farias',
    image: 'http://image.com/photo.jpg',
  }),
  STATES_LIST: [
    { name: 'São Paulo', acronym: 'SP' },
    { name: 'Rio de Janeiro', acronym: 'RJ' },
  ],
}));

describe('EasemindProfilePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve renderizar sem erros', () => {
    render(<EasemindProfilePage />);
  });

  it('deve exibir título "Meu perfil"', () => {
    render(<EasemindProfilePage />);
    expect(screen.getByText('Meu perfil')).toBeInTheDocument();
  });

  it('deve exibir texto de instrução', () => {
    render(<EasemindProfilePage />);
    expect(screen.getByText(/Edite seus dados pessoais ou altere sua foto de perfil/i)).toBeInTheDocument();
  });

  it('deve exibir nome do usuário', () => {
    render(<EasemindProfilePage />);
    expect(screen.getByText('Daniela Farias')).toBeInTheDocument();
  });

  it('deve exibir ícone de câmera quando não há foto de perfil', () => {
    render(<EasemindProfilePage />);
    const cameraIcon = document.querySelector('svg[data-testid="CameraEnhanceRoundedIcon"]');
    expect(cameraIcon).toBeInTheDocument();
  });

  it('deve exibir botão "Editar foto"', () => {
    render(<EasemindProfilePage />);
    expect(screen.getByRole('button', { name: /editar foto/i })).toBeInTheDocument();
  });

  it('deve exibir seção "Dados pessoais"', () => {
    render(<EasemindProfilePage />);
    expect(screen.getByText('Dados pessoais')).toBeInTheDocument();
  });

  it('deve exibir campos do formulário', () => {
    render(<EasemindProfilePage />);
    expect(screen.getByPlaceholderText('Digite seu nome')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Digite seu e‑mail')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Digite seu CPF')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Rua, número, etc.')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Digite sua cidade')).toBeInTheDocument();
  });

  it('deve exibir seção "Atualizar senha"', () => {
    render(<EasemindProfilePage />);
    expect(screen.getByText('Atualizar senha')).toBeInTheDocument();
  });

  it('deve exibir campos de senha', () => {
    render(<EasemindProfilePage />);
    const passwordInputs = screen.getAllByPlaceholderText(/Digite.*senha/i);
    expect(passwordInputs.length).toBeGreaterThanOrEqual(2);
  });

  it('deve exibir botão "Alterar dados"', () => {
    render(<EasemindProfilePage />);
    expect(screen.getByRole('button', { name: /alterar dados/i })).toBeInTheDocument();
  });

  it('deve acionar input de arquivo ao clicar em "Editar foto"', () => {
    render(<EasemindProfilePage />);
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    const clickSpy = vi.spyOn(fileInput, 'click');
    
    const editButton = screen.getByRole('button', { name: /editar foto/i });
    fireEvent.click(editButton);
    
    expect(clickSpy).toHaveBeenCalled();
  });

  it('deve carregar dados do usuário no formulário', async () => {
    render(<EasemindProfilePage />);
    
    await waitFor(() => {
      const nameInput = screen.getByPlaceholderText('Digite seu nome') as HTMLInputElement;
      expect(nameInput.value).toBe('Daniela Farias');
    });
  });

  it('deve submeter formulário com dados válidos', async () => {
    const { updateUser } = await import('@repo/data-access');
    render(<EasemindProfilePage />);
    
    const submitButton = screen.getByRole('button', { name: /alterar dados/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(updateUser).toHaveBeenCalled();
    });
  });

  it('deve exibir snackbar de sucesso após atualização', async () => {
    render(<EasemindProfilePage />);
    
    const submitButton = screen.getByRole('button', { name: /alterar dados/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Dados atualizados com sucesso')).toBeInTheDocument();
    });
  });

  it('deve exibir snackbar de erro quando atualização falha', async () => {
    const { updateUser } = await import('@repo/data-access');
    vi.mocked(updateUser).mockResolvedValueOnce({
      status: 400,
      data: { message: 'Erro ao atualizar dados' },
    } as any);

    render(<EasemindProfilePage />);
    
    const submitButton = screen.getByRole('button', { name: /alterar dados/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Erro ao atualizar dados')).toBeInTheDocument();
    });
  });

  it('deve atualizar imagem de perfil ao selecionar arquivo', async () => {
    const { updateUserProfileImage } = await import('@repo/data-access');
    render(<EasemindProfilePage />);
    
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(['image'], 'photo.png', { type: 'image/png' });
    
    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(updateUserProfileImage).toHaveBeenCalledWith('1', file);
    });
  });

  it('deve exibir mensagem de sucesso após atualizar foto', async () => {
    render(<EasemindProfilePage />);
    
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(['image'], 'photo.png', { type: 'image/png' });
    
    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByText('Foto de perfil atualizada com sucesso')).toBeInTheDocument();
    });
  });

  it('deve validar e-mail inválido', async () => {
    render(<EasemindProfilePage />);
    
    const emailInput = screen.getByPlaceholderText('Digite seu e‑mail');
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    
    const submitButton = screen.getByRole('button', { name: /alterar dados/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('E-mail inválido')).toBeInTheDocument();
    });
  });

  it('deve formatar CPF ao perder foco', async () => {
    render(<EasemindProfilePage />);
    
    const cpfInput = screen.getByPlaceholderText('Digite seu CPF');
    fireEvent.change(cpfInput, { target: { value: '12345678900' } });
    fireEvent.blur(cpfInput);

    await waitFor(() => {
      const { formatCPF } = require('@repo/utils');
      expect(formatCPF).toHaveBeenCalledWith('12345678900');
    });
  });

  it('deve exibir campo de complemento', () => {
    render(<EasemindProfilePage />);
    expect(screen.getByPlaceholderText('Casa, apto...')).toBeInTheDocument();
  });

  it('deve exibir loading state durante submissão', async () => {
    const { updateUser } = await import('@repo/data-access');
    vi.mocked(updateUser).mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve({ status: 200, data: {} } as any), 100))
    );

    render(<EasemindProfilePage />);
    
    const submitButton = screen.getByRole('button', { name: /alterar dados/i });
    fireEvent.click(submitButton);

    expect(submitButton).toBeDisabled();
  });
});
