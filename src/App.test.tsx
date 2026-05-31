import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import App from './App.tsx';
import { ProgressProvider } from './progress/ProgressContext.tsx';
import { SettingsProvider } from './settings/SettingsProvider.tsx';

describe('App', () => {
  it('renders the home hero heading', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <SettingsProvider>
          <ProgressProvider>
            <App />
          </ProgressProvider>
        </SettingsProvider>
      </MemoryRouter>,
    );
    expect(
      screen.getByRole('heading', { name: /10 fingre/i }),
    ).toBeInTheDocument();
  });
});
