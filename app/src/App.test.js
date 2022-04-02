import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

it('Test test', () => {
  render(<App />);
  expect(screen.getByText('Hi')).toBeInTheDocument();
});