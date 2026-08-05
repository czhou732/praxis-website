import { StrictMode } from 'react'
import { hydrateRoot } from 'react-dom/client'
import '../styles/app.css'
import Home from '../pages/Home'

hydrateRoot(
  document.getElementById('root'),
  <StrictMode>
    <Home />
  </StrictMode>
)
