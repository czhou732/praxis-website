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
    time: '4:00 PM PT',
    mode: 'In person',
    status: 'confirmed',
    name: 'Dr. Laurent Itti',
    topic: 'Attention and Computational Vision — series kickoff'
  },
  {
    date: 'Sep 24',
    time: 'Evening, time TBC',
    mode: 'In person',
    status: 'confirmed',
    name: 'Phil Newsome',
    topic: 'NIH Postbac and SIP pipeline: how to get in'
  },
  { date: 'Oct 8',  time: '4:00 PM PT', mode: 'In person', status: 'invited' },
  { date: 'Oct 22', time: '1:00 PM PT', mode: 'Remote',    status: 'invited' },
  { date: 'Nov 5',  time: '1:00 PM PT', mode: 'Remote',    status: 'invited' },
  { date: 'Nov 19', time: '4:00 PM PT', mode: 'In person', status: 'invited' },
  { date: 'Dec 3',  time: '1:00 PM PT', mode: 'Remote · capstone', status: 'invited' }
]
