import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import { SettingsProvider } from './settings/SettingsProvider.tsx';
import { ProgressProvider } from './progress/ProgressContext.tsx';
import './index.css';

const rootEl = document.getElementById('root');
if (!rootEl) throw new Error('Root element #root not found');

createRoot(rootEl).render(
  <StrictMode>
    {/* basename keeps routing correct under the GitHub Pages subpath */}
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <SettingsProvider>
        <ProgressProvider>
          <App />
        </ProgressProvider>
      </SettingsProvider>
    </BrowserRouter>
  </StrictMode>,
);
