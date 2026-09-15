import { StrictMode } from 'react'
import { hydrateRoot, createRoot } from 'react-dom/client'
import '../styles/app.css'
import Events from '../pages/Events'

const root = document.getElementById('root')
if (import.meta.env.DEV) {
  createRoot(root).render(<StrictMode><Events /></StrictMode>)
} else {
  hydrateRoot(root, <StrictMode><Events /></StrictMode>)
}
