import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import EaseMindDashboard from './dashboard';

describe('<EaseMindDashboard />', () => {
  test('it should mount', () => {
    render(<EaseMindDashboard />);

    const pagesDashboard = screen.getByTestId('dashboard');

    expect(pagesDashboard).toBeInTheDocument();
  });
});