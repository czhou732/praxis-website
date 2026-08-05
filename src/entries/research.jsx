import { StrictMode } from 'react'
import { hydrateRoot } from 'react-dom/client'
import '../styles/app.css'
import Research from '../pages/Research'

hydrateRoot(
  document.getElementById('root'),
  <StrictMode>
    <Research />
  </StrictMode>
)
