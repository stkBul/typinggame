import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import App from './App.tsx';

describe('App', () => {
  it('renders the home hero heading', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    );
    expect(
      screen.getByRole('heading', { name: /10 fingre/i }),
    ).toBeInTheDocument();
  });
});
