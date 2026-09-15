import { StrictMode } from 'react'
import { hydrateRoot } from 'react-dom/client'
import '../styles/app.css'
import NotFound from '../pages/404'

hydrateRoot(
  document.getElementById('root'),
  <StrictMode>
    <NotFound />
  </StrictMode>
)
