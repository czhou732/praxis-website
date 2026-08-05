/**
 * SSR entry used only at build time by scripts/prerender.mjs.
 * Each page is rendered to static HTML and injected into its shell, so the
 * deployed site is real markup rather than an empty #root waiting on JavaScript.
 */
import Home from './pages/Home'
import Research from './pages/Research'
import Speakers from './pages/Speakers'
import Syllabus from './pages/Syllabus'

export const ROUTES = {
  'index.html': Home,
  'research/index.html': Research,
  'speakers/index.html': Speakers,
  'syllabus/index.html': Syllabus
}
