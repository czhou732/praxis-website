export const SITE = {
  name: 'PRAXIS',
  origin: 'https://uscpraxis.org',
  contact: 'czhou732@usc.edu',
  expansion: 'Psychiatry Research, Analytics & eXperimental Innovation Society',
  mission:
    'PRAXIS is an undergraduate research group working at the intersection of machine learning, neuroscience, and clinical mental health. We build, test, and publish — and we train the researchers who will keep doing it.',
  // PRAXIS is not a registered student organization. Nothing on this site may
  // imply institutional affiliation, endorsement, or sponsorship.
  disclaimer:
    'PRAXIS is a student-founded research group and is not a registered student organization. It is not affiliated with, endorsed by, or sponsored by any university.'
}

export const NAV = [
  { href: '/', label: 'Home' },
  { href: '/research/', label: 'Research' },
  { href: '/speakers/', label: 'Speakers' },
  { href: '/syllabus/', label: 'Curriculum' }
]

export const TEAM = [
  {
    name: 'Peter Zhou',
    role: 'Founder',
    photo: '/peter-zhou.jpg',
    href: 'https://www.linkedin.com/in/chengdong-zhou/'
  },
  {
    name: 'Lily Wu',
    role: 'Co-Lead · Research',
    initials: 'LW',
    href: 'https://www.linkedin.com/in/meihui-lily-wu/'
  },
  {
    name: 'Dora Xiang',
    role: 'Co-Lead · Programming',
    initials: 'DX',
    href: 'https://www.linkedin.com/in/yiming-dora-xiang-bbbb4b230/'
  }
]

export const NORTH_STAR = [
  'Peer-reviewed research published with undergraduate members leading the work.',
  'At least one clinical tool built, deployed, and validated on real patient data.',
  'A recognized undergraduate hub for computational psychiatry, with a pipeline that outlasts any single cohort.',
  'Members who go on to top PhD programs, NIH intramural positions, and industry research roles.'
]

export const PILLARS = [
  {
    kicker: 'Projects',
    title: 'Original research',
    body: 'Applying machine learning to clinical populations. Current work covers vocal biomarker extraction and dopaminergic modeling of anhedonia. Members join an existing project or pitch their own.'
  },
  {
    kicker: 'Curriculum',
    title: 'Journal club',
    body: 'A twenty-paper sequence taking undergraduates from reinforcement learning and active inference through to reading and writing primary literature.'
  },
  {
    kicker: 'Series',
    title: 'Speaker series',
    body: 'Biweekly technical talks with principal investigators and postdocs from the NIMH and leading research institutions. Recorded, with consent, as a podcast.'
  }
]

export const PROJECTS = [
  {
    title: 'Dopaminergic Voice — crossbenching anhedonia',
    status: 'Active',
    body: 'Extracting acoustic and semantic biomarkers of anhedonia from spontaneous speech using ClinicalWhisper. By crossbenching anhedonia against computational phenotypes, the next step is integrating large language models with reinforcement learning to model reward-prediction errors in vocal flat affect.',
    tags: ['LLM + RL', 'Audio processing', 'Clinical data']
  },
  {
    title: 'ClinicalWhisper',
    status: 'Preprint → journal',
    body: 'A speech model adapted for clinical interview audio, and the tool the group is furthest along on building. A preprint was posted to bioRxiv in June 2026; the work is being prepared for peer-reviewed submission alongside continued validation.',
    tags: ['Speech models', 'Reproducible pipeline', 'Open source']
  },
  {
    title: 'fMRI benchmark analysis',
    status: 'Ongoing',
    body: 'A parallel analysis track benchmarking computational phenotypes against functional imaging data, run alongside the voice work.',
    tags: ['Neuroimaging', 'Benchmarking']
  }
]

export const MODULES = [
  {
    n: '01',
    title: 'Foundations of RL and active inference',
    body: 'Markov decision processes, Rescorla–Wagner, and the basics of predictive coding.',
    readings: [
      'Sutton & Barto (2018) — Reinforcement Learning: An Introduction, selected chapters',
      'Friston (2010) — The free-energy principle: a unified brain theory?'
    ]
  },
  {
    n: '02',
    title: 'Models of mood and anhedonia',
    body: 'How the brain computes value, and what happens when those computations fail.',
    readings: [
      'Huys et al. (2013) — Decision-theoretic psychiatry',
      'Eldar et al. (2016) — The roles of dopamine in learning and memory'
    ]
  },
  {
    n: '03',
    title: 'Phenotyping and biomarkers',
    body: 'Moving from subjective clinical interviews to objective computational phenotyping.',
    readings: [
      'Montague et al. (2012) — Computational and categorical formalisms in psychiatry',
      'Low et al. (2020) — Automated vocal analysis of depression'
    ]
  }
]

export const REPOS = [
  {
    kicker: 'Organization',
    title: '@comp-psych',
    body: 'Open-source computational psychiatry resources and reference implementations.',
    href: 'https://github.com/comp-psych'
  },
  {
    kicker: 'Repository',
    title: 'comp-psych-syllabus',
    body: 'The twenty-paper undergraduate curriculum: foundations of RL, active inference, and computational models of mood.',
    href: 'https://github.com/comp-psych/comp-psych-syllabus'
  }
]
