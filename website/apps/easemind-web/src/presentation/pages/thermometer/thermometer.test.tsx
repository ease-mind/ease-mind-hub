import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import EasemindThermometerPage from './thermometer';

jest.mock('@repo/data-access', () => ({
  ...jest.requireActual('@repo/data-access'),
  AuthRepository: jest.fn().mockImplementation(() => ({
    login: jest.fn(),
  })),
}));

const mockUseTheme = {
  colors: {
    'coral.500': '#FF4353',
    'coral.600': '#E63946',
    'grey.200': '#eeeeee',
    'grey.400': '#aaaaaa',
    'grey.500': '#9e9e9e',
  },
  isDarkMode: false,
};

jest.mock('@repo/utils', () => ({
  useTheme: () => mockUseTheme,
}));

jest.mock('@repo/ui', () => ({
  EasemindCard: ({ children }: { children: React.ReactNode }) => <div data-testid="easemind-card">{children}</div>,
}));

describe('<EasemindThermometerPage />', () => {
  test('deve renderizar o componente corretamente', () => {
    render(<EasemindThermometerPage />);

    expect(screen.getByText('Termômetro Sensorial')).toBeInTheDocument();
    expect(screen.getByText(/Identifique sinais de sobrecarga/i)).toBeInTheDocument();
  });

  test('deve exibir o alerta de atenção inicialmente', () => {
    render(<EasemindThermometerPage />);

    expect(screen.getByText('Atenção: Sinais de Alerta')).toBeInTheDocument();
    expect(screen.getByText(/Você está entrando na fase de alerta/i)).toBeInTheDocument();
  });

  test('deve fechar o alerta ao clicar no botão de fechar', () => {
    render(<EasemindThermometerPage />);

    const closeButton = screen.getByLabelText(/close/i);
    fireEvent.click(closeButton);

    expect(screen.queryByText('Atenção: Sinais de Alerta')).not.toBeInTheDocument();
  });

  test('deve exibir as três categorias de sintomas', () => {
    render(<EasemindThermometerPage />);

    expect(screen.getByText('Falha na Comunicação')).toBeInTheDocument();
    expect(screen.getByText('Sintomas Físicos')).toBeInTheDocument();
    expect(screen.getByText('Aumento de Estereotipias')).toBeInTheDocument();
  });

  test('deve exibir todos os sintomas de comunicação', () => {
    render(<EasemindThermometerPage />);

    expect(screen.getByText('Dificuldade para encontrar palavras')).toBeInTheDocument();
    expect(screen.getByText('Fala mais rápida ou lenta')).toBeInTheDocument();
    expect(screen.getByText('Evitar contato visual')).toBeInTheDocument();
    expect(screen.getByText('Respostas curtas ou monossilábicas')).toBeInTheDocument();
  });

  test('deve exibir todos os sintomas físicos', () => {
    render(<EasemindThermometerPage />);

    expect(screen.getByText('Tensão muscular')).toBeInTheDocument();
    expect(screen.getByText('Respiração acelerada')).toBeInTheDocument();
    expect(screen.getByText('Suor nas mãos')).toBeInTheDocument();
    expect(screen.getByText('Dor de cabeça')).toBeInTheDocument();
  });

  test('deve exibir todos os sintomas de estereotipias', () => {
    render(<EasemindThermometerPage />);

    expect(screen.getByText('Balançar o corpo')).toBeInTheDocument();
    expect(screen.getByText('Bater ou esfregar as mãos')).toBeInTheDocument();
    expect(screen.getByText('Movimentos repetitivos')).toBeInTheDocument();
    expect(screen.getByText('Inquietação constante')).toBeInTheDocument();
  });

  test('deve selecionar um sintoma ao clicar', () => {
    render(<EasemindThermometerPage />);

    const symptom = screen.getByText('Tensão muscular').closest('div');
    if (symptom) {
      fireEvent.click(symptom);
    }

    expect(screen.getByText('Sintomas identificados: 1')).toBeInTheDocument();
  });

  test('deve aumentar o contador ao selecionar múltiplos sintomas', () => {
    render(<EasemindThermometerPage />);

    const symptom1 = screen.getByText('Tensão muscular').closest('div');
    const symptom2 = screen.getByText('Dor de cabeça').closest('div');
    const symptom3 = screen.getByText('Balançar o corpo').closest('div');

    if (symptom1) fireEvent.click(symptom1);
    if (symptom2) fireEvent.click(symptom2);
    if (symptom3) fireEvent.click(symptom3);

    expect(screen.getByText('Sintomas identificados: 3')).toBeInTheDocument();
  });

  test('deve desselecionar um sintoma ao clicar novamente', () => {
    render(<EasemindThermometerPage />);

    const symptom = screen.getByText('Tensão muscular').closest('div');
    
    if (symptom) {
      fireEvent.click(symptom);
      expect(screen.getByText('Sintomas identificados: 1')).toBeInTheDocument();
      
      fireEvent.click(symptom);
      expect(screen.getByText('Sintomas identificados: 0')).toBeInTheDocument();
    }
  });

  test('deve atualizar a contagem por categoria', () => {
    render(<EasemindThermometerPage />);

    const symptom1 = screen.getByText('Tensão muscular').closest('div');
    const symptom2 = screen.getByText('Dor de cabeça').closest('div');

    if (symptom1) fireEvent.click(symptom1);
    if (symptom2) fireEvent.click(symptom2);

    const physicalCategory = screen.getAllByText('Físicos')[0].closest('div');
    if (physicalCategory) {
      expect(within(physicalCategory).getByText('2')).toBeInTheDocument();
    }
  });

  test('deve resetar todas as seleções ao clicar em Resetar', () => {
    render(<EasemindThermometerPage />);

    const symptom1 = screen.getByText('Tensão muscular').closest('div');
    const symptom2 = screen.getByText('Dor de cabeça').closest('div');

    if (symptom1) fireEvent.click(symptom1);
    if (symptom2) fireEvent.click(symptom2);

    expect(screen.getByText('Sintomas identificados: 2')).toBeInTheDocument();

    const resetButton = screen.getByRole('button', { name: /resetar/i });
    fireEvent.click(resetButton);

    expect(screen.getByText('Sintomas identificados: 0')).toBeInTheDocument();
  });

  test('deve exibir o emoji correto baseado no nível de sintomas', () => {
    render(<EasemindThermometerPage />);

    expect(screen.getByText('😊')).toBeInTheDocument();

    const symptom1 = screen.getByText('Tensão muscular').closest('div');
    const symptom2 = screen.getByText('Dor de cabeça').closest('div');
    const symptom3 = screen.getByText('Balançar o corpo').closest('div');
    const symptom4 = screen.getByText('Inquietação constante').closest('div');

    if (symptom1) fireEvent.click(symptom1);
    if (symptom2) fireEvent.click(symptom2);
    if (symptom3) fireEvent.click(symptom3);
    if (symptom4) fireEvent.click(symptom4);

    expect(screen.getByText('😐')).toBeInTheDocument();
  });

  test('deve exibir o nível de temperatura correto', () => {
    render(<EasemindThermometerPage />);

    const symptom1 = screen.getByText('Tensão muscular').closest('div');
    const symptom2 = screen.getByText('Dor de cabeça').closest('div');

    if (symptom1) fireEvent.click(symptom1);
    if (symptom2) fireEvent.click(symptom2);

    expect(screen.getByText('Calmo')).toBeInTheDocument();
  });

  test('deve renderizar os botões de ação no alerta', () => {
    render(<EasemindThermometerPage />);

    expect(screen.getByRole('button', { name: /técnicas de calma/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /buscar ajuda/i })).toBeInTheDocument();
  });

  test('deve exibir o contador inicial como 0', () => {
    render(<EasemindThermometerPage />);

    expect(screen.getByText('Sintomas identificados: 0')).toBeInTheDocument();
  });

  test('deve renderizar os cards de categorias', () => {
    render(<EasemindThermometerPage />);

    const cards = screen.getAllByTestId('easemind-card');
    expect(cards.length).toBeGreaterThan(0);
  });
});