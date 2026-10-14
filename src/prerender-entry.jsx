/**
 * SSR entry used only at build time by scripts/prerender.mjs.
 * Each page is rendered to static HTML and injected into its shell, so the
 * deployed site is real markup rather than an empty #root waiting on JavaScript.
 */
import Home from './pages/Home'
import Research from './pages/Research'
import Speakers from './pages/Speakers'
import Syllabus from './pages/Syllabus'
import Events from './pages/Events'
import Podcast from './pages/Podcast'
import NotFound from './pages/404'

/* Every page whose entry calls hydrateRoot must be listed here; an entry that
   hydrates an empty #root fails with React #418 on every load. */
export const ROUTES = {
  'index.html': Home,
  'research/index.html': Research,
  'speakers/index.html': Speakers,
  'syllabus/index.html': Syllabus,
  'events/index.html': Events,
  'podcast/index.html': Podcast,
  '404.html': NotFound
}
