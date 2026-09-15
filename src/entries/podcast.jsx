import { StrictMode } from 'react'
import { hydrateRoot, createRoot } from 'react-dom/client'
import '../styles/app.css'
import Podcast from '../pages/Podcast'

const root = document.getElementById('root')
if (import.meta.env.DEV) {
  createRoot(root).render(<StrictMode><Podcast /></StrictMode>)
} else {
  hydrateRoot(root, <StrictMode><Podcast /></StrictMode>)
}
