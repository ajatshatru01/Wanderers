import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import './index.css'
import App from './App.jsx'
import Authorization from './auth/Authorization.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Authorization>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Authorization>
  </StrictMode>,
)