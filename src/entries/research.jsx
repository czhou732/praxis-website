import { StrictMode } from 'react'
import { hydrateRoot, createRoot } from 'react-dom/client'
import '../styles/app.css'
import Research from '../pages/Research'

const root = document.getElementById('root')
if (import.meta.env.DEV) {
  createRoot(root).render(<StrictMode><Research /></StrictMode>)
} else {
  hydrateRoot(root, <StrictMode><Research /></StrictMode>)
}
