import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import EasemindHome from './home';

jest.mock('@repo/ui', () => ({
  EasemindCard: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="mock-card">{children}</div>
  ),
}));

jest.mock('@repo/utils', () => ({
  useTheme: () => ({
    isDarkMode: false,
    colors: {
      'coral.50': '#fff5f5',
      'coral.100': '#ffe4e1',
      'coral.400': '#fb7185',
      'coral.900': '#7f1d1d',
      'coral.contrast': '#ffffff',
      'background.gradient': '#000000',
    },
  }),
}));

describe('<EasemindHome />', () => {
  test('it should mount', () => {
    render(<EasemindHome />);

    const heading = screen.getByText(/Gerencie suas tarefas/i);

    expect(heading).toBeInTheDocument();
  });
});