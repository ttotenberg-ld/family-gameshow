import { createRoot } from 'react-dom/client';
import { asyncWithLDProvider } from 'launchdarkly-react-client-sdk';
import App from './App.tsx';
import './index.css';

const initializeLaunchDarkly = async () => {
  const LDProvider = await asyncWithLDProvider({
    clientSideID: '609ead905193530d7c28647b',
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
