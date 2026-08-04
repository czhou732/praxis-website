import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'

const page = (path) => fileURLToPath(new URL(path, import.meta.url))

// Every page must be listed here. Vite's default build emits only index.html,
// which is why /research, /speakers and /syllabus previously 404'd in production.
export default defineConfig({
  appType: 'mpa',
  build: {
    rollupOptions: {
      input: {
        home: page('./index.html'),
        research: page('./research/index.html'),
        speakers: page('./speakers/index.html'),
        syllabus: page('./syllabus/index.html')
      }
    }
  }
})
