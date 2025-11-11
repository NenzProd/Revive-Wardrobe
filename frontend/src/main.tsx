import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { HelmetProvider } from 'react-helmet-async'

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID

createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <GoogleOAuthProvider clientId={clientId}>
      <App />
    </GoogleOAuthProvider>
  </HelmetProvider>
);
