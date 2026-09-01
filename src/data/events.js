/**
 * Past events — talks, demos, and sessions already held. The record PRAXIS
 * points people to. Reverse-chronological. `recording` is a URL once the
 * session is published; null until then so nothing dangles. Anything of note
 * that day (live demo, recording) is named in the body.
 */
export const EVENTS = [
  {
    date: 'Sep 1, 2026',
    venue: 'Live demo · Leavey Library, Room 202L',
    title: 'ClinicalWhisper, live on a real recording',
    body: 'A live demonstration of ClinicalWhisper — the speech model adapted for clinical interview audio — run in session on a real recording: transcription, speaker separation, acoustic features, and the score. Recorded; the recording is embedded below.',
    recording: '/media/cw-live-demo-sep-2026.mp4'
  }
]