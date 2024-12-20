import { createRoot } from 'react-dom/client';
import { asyncWithLDProvider } from 'launchdarkly-react-client-sdk';
import App from './App.tsx';
import './index.css';

const initializeLaunchDarkly = async () => {
  const LDProvider = await asyncWithLDProvider({
    clientSideID: '60685c73c0d09d0d2bda4d80',
    context: {
      "kind": "user",
      "key": "user-key-123abc",
      "name": "Sandy Smith",
      "email": "sandy@example.com"
    }
  });

  const container = document.getElementById('root');
  if (!container) throw new Error('Root element not found');
  
  const root = createRoot(container);
  root.render(
    <LDProvider>
      <App />
    </LDProvider>
  );
};

initializeLaunchDarkly().catch(console.error);
