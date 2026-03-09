import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import EasemindHome from './home';

describe('<EasemindHome />', () => {
  test('it should mount', () => {
    render(<EasemindHome />);

    const pagesHome = screen.getByTestId('Home');

    expect(pagesHome).toBeInTheDocument();
  });
});