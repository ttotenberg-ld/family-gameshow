import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Remove StrictMode to prevent double audio playing in development
createRoot(document.getElementById('root')!).render(<App />);
