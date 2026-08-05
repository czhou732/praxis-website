import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'

const page = (path) => fileURLToPath(new URL(path, import.meta.url))

// Every page MUST be listed here. Vite's default build emits only index.html,
// which is what made /research, /speakers and /syllabus 404 in production.
// scripts/verify-build.mjs fails the build if any route goes missing again.
export const PAGES = {
  home: './index.html',
  research: './research/index.html',
  speakers: './speakers/index.html',
  syllabus: './syllabus/index.html'
}

export default defineConfig({
  appType: 'mpa',
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      input: Object.fromEntries(
        Object.entries(PAGES).map(([name, path]) => [name, page(path)])
      )
    }
  }
})
