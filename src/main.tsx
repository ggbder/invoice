import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // Added for routing
import { StrictMode } from 'react'; // Added for better error handling
import App from './App.tsx';
import './index.css';

// Ensure the root element exists
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}

// Render the app with routing and strict mode
createRoot(rootElement).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);