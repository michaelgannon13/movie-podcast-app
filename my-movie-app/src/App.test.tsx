import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import './App.css';


test('renders without crashing', () => {
  render(<App />);
  const linkElement = screen.getByText(/Search for movies.../i);
  expect(linkElement).toBeInTheDocument();
});
