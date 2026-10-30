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
    topic: 'Attention and Computational Vision (series kickoff)',
    bio: 'Professor of computer science, psychology, and neuroscience at USC, where he directs the iLab. His work spans visual attention, computational neuroscience, and machine vision.',
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
  { date: 'Oct 29', iso: '2026-10-29', time: '4:00 PM PT', mode: 'In person', status: 'invited' },
  {
    date: 'Nov 5',
    iso: '2026-11-05',
    time: '1:00 PM PT',
    mode: 'Remote',
    status: 'confirmed',
    name: 'Dr. Samika Kumar',
    topic: 'From Undergrad to Postdoc: A Career in the Neuroscience of Depression',
    bio: 'Dr. Samika Kumar is a postdoctoral fellow in the Experimental Therapeutics and Pathophysiology Branch at the National Institute of Mental Health (NIMH). Her research examines the brain and biological processes involved in depression. She received a PhD in Psychology from the University of Cambridge and a BA in Cognitive Science from the University of California, Berkeley.',
    rsvp: 'https://luma.com/9n1yfsz7'
  },
  {
    date: 'Nov 12',
    iso: '2026-11-12',
    time: '9:00 AM PT',
    mode: 'Remote',
    status: 'confirmed',
    name: 'Dr. Mark Kvarta',
    topic: 'E/I balance and cortical gamma in treatment-resistant depression',
    bio: 'Medical Director and Director of Molecular and Cellular Biomarkers Research in the Experimental Therapeutics and Pathophysiology Branch at the National Institute of Mental Health.',
    rsvp: 'https://luma.com/afsnb6lx'
  },
  { date: 'Nov 19', iso: '2026-11-19', time: '1:00 PM PT', mode: 'In person', status: 'invited' },
  {
    date: 'Dec 3',
    iso: '2026-12-03',
    time: '6:30 PM PT',
    mode: 'In person · USC',
    status: 'confirmed',
    name: 'PRAXIS Research Showcase',
    topic: 'Member presentations · Fall 2026 capstone',
    bio: 'Core team members present the projects they have built this semester, spanning auditory biomarkers, computational models of depression, and clinical AI tools. The capstone event of the Fall 2026 series.',
    rsvp: 'https://luma.com/0q7t86v1'
  }
]
