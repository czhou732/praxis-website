/**
 * Fall 2026 speaker series.
 *
 * Peter's Fall 2026 Class/Blocker Schedule:
 * - Mon/Wed: 10:00–11:50 AM (PSYC 450)
 * - Mon/Wed: 12:00–2:00 PM (Sacred block / workout)
 * - Mon/Wed: 2:00–3:00 PM (GEOL 107L)
 * - Mon/Wed: 3:30–4:50 PM (HIST 266)
 * - Mon/Wed: 5:30–7:20 PM (THTR 205)
 * - Wed: 8:00–9:00 AM (GEOL 107L lab)
 * - Fri: 9:00–10:00 AM (PHED 144)
 * - Tue/Thu: Free
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
    bio: 'Professor of computer science, psychology, and neuroscience at USC, where he directs the iLab — work spanning visual attention, computational neuroscience, and machine vision.',
    rsvp: 'https://luma.com/rmqa5kmd'
  },
  {
    date: 'Sep 25',
    iso: '2026-09-25',
    time: '1:00 PM PT',
    mode: 'In person',
    status: 'confirmed',
    name: 'Phil Newsome',
    topic: 'The NIH Postbac path to a PhD',
    rsvp: 'https://luma.com/29agjygx'
  },
  {
    date: 'Oct 8',
    iso: '2026-10-08',
    time: '4:00 PM PT',
    mode: 'In person',
    status: 'confirmed',
    name: 'Dr. Stephen J. Read',
    topic: 'Neural-network models of depression',
    bio: 'Mendel B. Silberberg Professor of Social Psychology in the Department of Psychology at USC — work on neural-network models of personality and depression.',
    rsvp: 'https://luma.com/zxl3tv59'
  },
  {
    date: 'Oct 22',
    iso: '2026-10-22',
    time: '12:00 PM PT',
    mode: 'Remote',
    status: 'confirmed',
    name: 'Dr. Mark Kvarta',
    topic: 'E/I balance and cortical gamma in treatment-resistant depression',
    bio: 'Medical Director and Director of Molecular and Cellular Biomarkers Research in the Experimental Therapeutics and Pathophysiology Branch at the National Institute of Mental Health.',
    rsvp: 'https://luma.com/afsnb6lx'
  },
  {
    date: 'Nov 5',
    iso: '2026-11-05',
    time: '1:00 PM PT',
    mode: 'Remote',
    status: 'confirmed',
    name: 'Dr. Samika Kumar',
    topic: 'Sleep, depression, and suicidality — and the path from undergrad to a PhD in the NIH Graduate Partnerships Program',
    bio: 'Postbaccalaureate fellow at the National Institute of Mental Health, where she works on sleep and depression/suicidality using MEG. Talk covers the science and her route from undergrad to a PhD through the NIH Graduate Partnerships Program.',
    rsvp: 'https://luma.com/9n1yfsz7'
  },
  { date: 'Nov 19', iso: '2026-11-19', time: '1:00 PM PT', mode: 'In person', status: 'invited' },
  { date: 'Dec 3', iso: '2026-12-03', time: '1:00 PM PT', mode: 'Remote · capstone', status: 'invited' }
]
