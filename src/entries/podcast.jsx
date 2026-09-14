import { StrictMode } from 'react'
import { hydrateRoot } from 'react-dom/client'
import '../styles/app.css'
import Podcast from '../pages/Podcast'

hydrateRoot(
  document.getElementById('root'),
  <StrictMode>
    <Podcast />
  </StrictMode>
)
