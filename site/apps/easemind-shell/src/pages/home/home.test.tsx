import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import EaseMindHome from './home';

describe('<EaseMindHome />', () => {
  test('it should mount', () => {
    render(<EaseMindHome />);

    const pagesHome = screen.getByTestId('Home');

    expect(pagesHome).toBeInTheDocument();
  });
});