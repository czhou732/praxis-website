import { StrictMode } from 'react'
import { hydrateRoot } from 'react-dom/client'
import '../styles/app.css'
import Syllabus from '../pages/Syllabus'

hydrateRoot(
  document.getElementById('root'),
  <StrictMode>
    <Syllabus />
  </StrictMode>
)
