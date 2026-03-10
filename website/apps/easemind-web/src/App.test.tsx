import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

jest.mock('react-router-dom');

test('deve montar o App sem crash', () => {
  render(<App />);
});
