/**
 * Podcast data — episodes and show metadata.
 *
 * Episodes are reverse-chronological. Each episode maps 1:1 to a speaker
 * series session that was recorded. The `spotify` field is the episode URL;
 * `showUrl` is the show-level page for subscribe links.
 *
 * Only released episodes are listed: not every talk is recorded, and
 * speakers are named only once their episode is out.
 */

export const SHOW = {
  name: 'The PRAXIS Podcast',
  tagline:
    'Conversations at the intersection of neuroscience, computation, and clinical care, recorded live from the PRAXIS speaker series at USC.',
  showUrl: 'https://open.spotify.com/show/4xtHHlHBndKBfQCqX5c91K',
  host: {
    name: 'Meihui (Lily) Wu',
    role: 'Host · Vice President',
    bio: 'Lily produces and hosts the podcast, drawing on each speaker session to build a public archive of the ideas shaping computational psychiatry, from saliency models to clinical machine learning.',
    href: 'https://www.linkedin.com/in/meihui-lily-wu/'
  }
}

export const EPISODES = [
  {
    ep: 1,
    date: 'Sep 10, 2026',
    title: 'Attention and Computational Vision with Dr. Laurent Itti',
    description:
      'Dr. Laurent Itti opens the Fall 2026 series with two decades of work on visual saliency and its route into clinical eye-tracking, including a 15-minute video that separates ADHD from Fetal Alcohol Spectrum Disorder at 77\u0025 accuracy.',
    spotify: 'https://open.spotify.com/episode/7jeJFdw3lv2kkd5WgHCygf'
  }
]
