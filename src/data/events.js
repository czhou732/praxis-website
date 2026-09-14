/**
 * Past events — talks, demos, and sessions already held. The record PRAXIS
 * points people to. Reverse-chronological. `recording` is a URL once the
 * session is published; null until then so nothing dangles. Anything of note
 * that day (live demo, recording) is named in the body.
 */
export const EVENTS = [
  {
    date: 'Sep 10, 2026',
    venue: 'Speaker series · Kickoff',
    title: 'Attention and Computational Vision with Dr. Laurent Itti',
    body: 'Dr. Laurent Itti opened the Fall 2026 series with two decades of work on visual saliency and its route into clinical eye-tracking — including a 15-minute video that separates ADHD from Fetal Alcohol Spectrum Disorder at 77% accuracy. Recorded as episode 1 of the PRAXIS podcast.',
    spotify: 'https://open.spotify.com/embed/episode/7jeJFdw3lv2kkd5WgHCygf'
  },
  {
    date: 'Sep 1, 2026',
    venue: 'Live demo · Leavey Library, Room 202L',
    title: 'ClinicalWhisper, live on a real recording',
    body: 'A live demonstration of ClinicalWhisper — the speech model adapted for clinical interview audio — run in session on a real recording: transcription, speaker separation, acoustic features, and the score. Recorded; the recording is embedded below.',
    recording: '/media/cw-live-demo-sep-2026.mp4'
  }
]

/* Journal club sessions. Biweekly member-facing series; each session is tied
   to a specific ClinicalWhisper research question with literature backing.
   `open: true` = public preview (Sep 17 kickoff); everything else defaults
   to members-only RSVP via Slack thumbs-up. Presenter and question fields
   publish only when confirmed — held dates render as "member proposal · TBD"
   the same way Speaker Series held slots work. */
export const JOURNAL_CLUB = [
  {
    date: 'Sep 17',
    iso: '2026-09-17',
    time: '4:00 PM PT',
    mode: 'In person · Leavey Library, 2F',
    status: 'confirmed',
    open: true,
    presenter: 'Lily Wu',
    title: 'Beyond the Transcript: What Can AI Learn from Clinical Audio?',
    question: 'What information is lost in transcripts, and how might audio language models complement — or move beyond — traditional transcription in a clinical setting?',
    rsvp: 'https://luma.com/4hg55zom'
  }
]