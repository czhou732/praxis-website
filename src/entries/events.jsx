import { StrictMode } from 'react'
import { hydrateRoot } from 'react-dom/client'
import '../styles/app.css'
import Events from '../pages/Events'

hydrateRoot(
  document.getElementById('root'),
  <StrictMode>
    <Events />
  </StrictMode>
)