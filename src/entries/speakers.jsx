import { StrictMode } from 'react'
import { hydrateRoot } from 'react-dom/client'
import '../styles/app.css'
import Speakers from '../pages/Speakers'

hydrateRoot(
  document.getElementById('root'),
  <StrictMode>
    <Speakers />
  </StrictMode>
)
