/**
 * Podcast data — episodes and show metadata.
 *
 * Episodes are reverse-chronological. Each episode maps 1:1 to a speaker
 * series session that was recorded. The `spotify` field is the episode URL;
 * `showUrl` is the show-level page for subscribe links.
 *
 * Upcoming sessions that will become episodes live in `UPCOMING_EPISODES`
 * so the page shows trajectory even with one published episode.
 */

export const SHOW = {
  name: 'The PRAXIS Podcast',
  tagline:
    'Conversations at the intersection of neuroscience, computation, and clinical care — recorded live from the PRAXIS speaker series at USC.',
  showUrl: 'https://open.spotify.com/show/4xtHHlHBndKBfQCqX5c91K',
  host: {
    name: 'Lily Wu',
    role: 'Co-Lead · Research',
    bio: 'Lily produces and hosts the podcast, drawing on each speaker session to build a public archive of the ideas shaping computational psychiatry — from saliency models to clinical machine learning.',
    href: 'https://www.linkedin.com/in/meihui-lily-wu/'
  }
}

export const EPISODES = [
  {
    ep: 1,
    date: 'Sep 10, 2026',
    title: 'Attention and Computational Vision with Dr. Laurent Itti',
    description:
      'Dr. Laurent Itti opens the Fall 2026 series with two decades of work on visual saliency and its route into clinical eye-tracking — including a 15-minute video that separates ADHD from Fetal Alcohol Spectrum Disorder at 77\u0025 accuracy.',
    spotify: 'https://open.spotify.com/episode/7jeJFdw3lv2kkd5WgHCygf'
  }
]

/**
 * Upcoming speaker series sessions that will become podcast episodes.
 * Gives the page trajectory — visitors see what's landing next, not a
 * single lonely episode.
 */
export const UPCOMING_EPISODES = [
  { date: 'Sep 25', name: 'Phil Newsome', topic: 'The NIH Postbac path to a PhD' },
  { date: 'Oct 8', name: 'Dr. Stephen J. Read', topic: 'Neural-network models of depression' },
  {
    date: 'Oct 22',
    name: 'Dr. Mark Kvarta',
    topic: 'E/I balance and cortical gamma in treatment-resistant depression'
  },
  {
    date: 'Nov 5',
    name: 'Dr. Samika Kumar',
    topic: 'Sleep, depression, and suicidality — and the path from undergrad to a PhD in the NIH Graduate Partnerships Program'
  },
  { date: 'Dec 3', name: 'PRAXIS Research Showcase', topic: 'Member presentations · Fall 2026 capstone' }
]
