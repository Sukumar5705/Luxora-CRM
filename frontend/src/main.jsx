import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: {
              background: '#0d1b2a',
              color: '#f8f5f0',
              border: '1px solid rgba(201,168,76,0.2)',
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '0.9rem',
              borderRadius: '8px',
              boxShadow: '0 16px 48px rgba(13,27,42,0.25)',
            },
            success: {
              iconTheme: { primary: '#c9a84c', secondary: '#0d1b2a' },
            },
            error: {
              iconTheme: { primary: '#b91c1c', secondary: '#fff' },
            }
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
