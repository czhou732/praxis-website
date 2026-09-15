import { StrictMode } from 'react'
import { hydrateRoot, createRoot } from 'react-dom/client'
import '../styles/app.css'
import NotFound from '../pages/404'

const root = document.getElementById('root')
if (import.meta.env.DEV) {
  createRoot(root).render(<StrictMode><NotFound /></StrictMode>)
} else {
  hydrateRoot(root, <StrictMode><NotFound /></StrictMode>)
}
