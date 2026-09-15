import { StrictMode } from 'react'
import { hydrateRoot, createRoot } from 'react-dom/client'
import '../styles/app.css'
import Syllabus from '../pages/Syllabus'

const root = document.getElementById('root')
if (import.meta.env.DEV) {
  createRoot(root).render(<StrictMode><Syllabus /></StrictMode>)
} else {
  hydrateRoot(root, <StrictMode><Syllabus /></StrictMode>)
}
