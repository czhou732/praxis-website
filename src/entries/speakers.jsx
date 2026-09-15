import { StrictMode } from 'react'
import { hydrateRoot, createRoot } from 'react-dom/client'
import '../styles/app.css'
import Speakers from '../pages/Speakers'

const root = document.getElementById('root')
if (import.meta.env.DEV) {
  createRoot(root).render(<StrictMode><Speakers /></StrictMode>)
} else {
  hydrateRoot(root, <StrictMode><Speakers /></StrictMode>)
}
