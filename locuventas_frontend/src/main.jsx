import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/index.css'
import App from '@/App.jsx'
console.log("Pero solo si sale esto");
import { AuthProvider } from "@context/AuthProvider";  // Importa el AuthProvider
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
    <App />
    </AuthProvider>
  </StrictMode>,
)
