import { StrictMode } from 'react'
import { hydrateRoot, createRoot } from 'react-dom/client'
import '../styles/app.css'
import People from '../pages/People'

const root = document.getElementById('root')
if (import.meta.env.DEV) {
  createRoot(root).render(<StrictMode><People /></StrictMode>)
} else {
  hydrateRoot(root, <StrictMode><People /></StrictMode>)
}
