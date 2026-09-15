import { StrictMode } from 'react'
import { hydrateRoot, createRoot } from 'react-dom/client'
import '../styles/app.css'
import Home from '../pages/Home'

const root = document.getElementById('root')
if (import.meta.env.DEV) {
  createRoot(root).render(<StrictMode><Home /></StrictMode>)
} else {
  hydrateRoot(root, <StrictMode><Home /></StrictMode>)
}
