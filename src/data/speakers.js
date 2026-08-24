/**
 * Fall 2026 speaker series.
 *
 * Only talks with status 'confirmed' publish a speaker name and topic.
 * Everything else renders as a held date with the format only — publishing a
 * real person's name against a date they have not agreed to is not something
 * this site does. Promote a slot by adding `name` / `topic` and flipping
 * `status` to 'confirmed'.
 */
export const SPEAKERS = [
  {
    date: 'Sep 10',
    iso: '2026-09-10',
    time: '4:00 PM PT',
    mode: 'In person',
    status: 'confirmed',
    name: 'Dr. Laurent Itti',
    topic: 'Attention and Computational Vision — series kickoff',
    bio: 'Professor of computer science, psychology, and neuroscience at USC, where he directs the iLab — work spanning visual attention, computational neuroscience, and machine vision.'
  },
  {
    date: 'Sep 24',
    iso: '2026-09-24',
    time: 'Evening, time TBC',
    mode: 'In person',
    status: 'confirmed',
    name: 'Phil Newsome',
    topic: 'NIH Postbac and SIP pipeline: how to get in'
  },
  { date: 'Oct 8', iso: '2026-10-08', time: '4:00 PM PT', mode: 'In person', status: 'invited' },
  {
    date: 'Oct 22',
    iso: '2026-10-22',
    time: '12:00 PM PT',
    mode: 'Remote',
    status: 'confirmed',
    name: 'Dr. Mark Kvarta',
    topic: 'Topic to be announced',
    bio: 'Medical Director and Director of Molecular and Cellular Biomarkers Research in the Experimental Therapeutics and Pathophysiology Branch at the National Institute of Mental Health.'
  },
  { date: 'Nov 5', iso: '2026-11-05', time: '1:00 PM PT', mode: 'Remote', status: 'invited' },
  { date: 'Nov 19', iso: '2026-11-19', time: '4:00 PM PT', mode: 'In person', status: 'invited' },
  { date: 'Dec 3', iso: '2026-12-03', time: '1:00 PM PT', mode: 'Remote · capstone', status: 'invited' }
]
