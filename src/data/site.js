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

// Advisors back the group; they do not run it, so they are listed apart from
// the team. No affiliation lines, no photos. Rows link only where a personal
// page is known.
export const ADVISORS = [
  {
    name: 'Dr. Laurent Itti',
    role: 'Faculty sponsor',
    href: 'https://ilab.usc.edu/'
  },
  {
    name: 'Phil Newsome',
    role: 'Graduate advisor',
    href: null
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
    title: 'Vocal Biomarkers — crossbenching anhedonia',
    status: 'Active',
    stage: 1,
    body: 'Extracting acoustic and semantic biomarkers of anhedonia from spontaneous speech using ClinicalWhisper. By crossbenching anhedonia against computational phenotypes, the next step is integrating large language models with reinforcement learning to model reward-prediction errors in vocal flat affect.',
    tags: ['LLM + RL', 'Audio processing', 'Clinical data']
  },
  {
    title: 'ClinicalWhisper',
    status: 'Preprint → journal',
    stage: 2,
    body: 'A speech model adapted for clinical interview audio, and the tool the group is furthest along on building. A preprint was posted to bioRxiv in June 2026; the work is being prepared for peer-reviewed submission alongside continued validation.',
    tags: ['Speech models', 'Reproducible pipeline', 'Open source'],
    links: [
      { label: 'bioRxiv preprint', href: 'https://www.biorxiv.org/content/10.64898/2026.06.08.728970v1' },
      { label: 'Pipeline on GitHub', href: 'https://github.com/czhou732/Clinical-Whisper-Pipeline' }
    ],
    citation:
      'Zhou, C., Wu, M., Xiang, Y., & Itti, L. (2026). Cross-modal benchmarking of acoustic prosody and ventral striatal BOLD for depression-related anhedonia classification: A pre-registered study with the ClinicalWhisper pipeline. bioRxiv. doi:10.64898/2026.06.08.728970'
  },
  {
    title: 'fMRI benchmark analysis',
    status: 'Ongoing',
    stage: 1,
    body: 'A parallel analysis track benchmarking computational phenotypes against functional imaging data, run alongside the voice work.',
    tags: ['Neuroimaging', 'Benchmarking']
  }
]

export const NEWS = {
  kicker: 'New · Jun 2026',
  text: 'ClinicalWhisper is on bioRxiv — a pre-registered study benchmarking vocal biomarkers against task-based fMRI.',
  linkLabel: 'Read the preprint',
  href: 'https://www.biorxiv.org/content/10.64898/2026.06.08.728970v1'
}

export const MAILING_LIST_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLSfIxRajDCBTmRSF4xkpg-AjgoUEXio6m9TmP9s6A4_7Zob3lg/viewform'

export const JOIN = [
  {
    k: 'Who',
    v: 'Undergraduates interested in computational psychiatry — machine learning, neuroscience, or clinical mental health.'
  },
  {
    k: 'What',
    v: 'The journal club first, then a seat on a live project — or a pitch of your own at the monthly session.'
  },
  {
    k: 'How',
    v: 'Email czhou732@usc.edu with a sentence about what you want to work on.'
  }
]

/* Journal-club curriculum. Mirrors comp-psych/comp-psych-syllabus:
   five modules, four papers each. Keep the two in step — the repo, the
   Zenodo record and this file all state twenty. */
export const MODULES = [
  {
    n: '01',
    title: 'Foundations — What Is Computational Psychiatry?',
    body: 'Before you model a disorder, you need to understand what "computational" means in this context — and why psychiatry needs it.',
    readings: [
      {
        topic: 'The Founding Vision',
        cite: 'Montague et al. (2012)',
        doi: '10.1016/j.tics.2011.11.018'
      },
      {
        topic: 'The Bridge to Clinical Applications',
        cite: 'Huys et al. (2016)',
        doi: '10.1038/nn.4238'
      },
      {
        topic: 'A Mathematical Framework',
        cite: 'Adams et al. (2016)',
        doi: '10.1136/jnnp-2015-310737'
      },
      {
        topic: 'Computational Assays for Psychiatry',
        cite: 'Stephan & Mathys (2014)',
        doi: '10.1016/j.conb.2013.12.007'
      }
    ]
  },
  {
    n: '02',
    title: 'Reinforcement Learning in Psychiatry',
    body: 'RL is the workhorse of computational psychiatry. These papers show how reward, punishment, and learning from experience go wrong in depression, addiction, and schizophrenia.',
    readings: [
      {
        topic: 'Reward, Happiness, and the Dopamine Connection',
        cite: 'Rutledge et al. (2014)',
        doi: '10.1073/pnas.1407535111'
      },
      {
        topic: 'Anhedonia and Reward Processing',
        cite: 'Pizzagalli (2014)',
        doi: '10.1146/annurev-clinpsy-050212-185606'
      },
      {
        topic: 'RL Models of Decision-Making in Clinical Populations',
        cite: 'Maia & Frank (2011)',
        doi: '10.1038/nn.2723'
      },
      {
        topic: 'Effort, Motivation, and Computational Models of Apathy',
        cite: 'Husain & Roiser (2018)',
        doi: '10.1038/s41583-018-0029-9'
      }
    ]
  },
  {
    n: '03',
    title: 'The Bayesian Brain and Psychosis',
    body: 'The "predictive brain" framework offers a radically different explanation for hallucinations, delusions, and psychotic symptoms. These papers lay out the theory and evidence.',
    readings: [
      {
        topic: 'The Predictive Brain',
        cite: 'Clark (2013)',
        doi: '10.1017/S0140525X12000477'
      },
      {
        topic: 'Aberrant Precision and Hallucinations',
        cite: 'Corlett et al. (2019)',
        doi: '10.1016/j.tics.2018.12.001'
      },
      {
        topic: 'Computational Models of Delusions',
        cite: 'Corlett et al. (2010)',
        doi: '10.1016/j.pneurobio.2010.06.007'
      },
      {
        topic: 'Computational Phenotyping in Psychosis',
        cite: 'Powers et al. (2017)',
        doi: '10.1126/science.aan3458'
      }
    ]
  },
  {
    n: '04',
    title: 'Biomarkers and Classification',
    body: 'Can we use brain data + computational models to diagnose, predict, or stratify patients? These papers tackle the promise and pitfalls of neuroimaging-based biomarkers.',
    readings: [
      {
        topic: 'Building Brain-Based Biomarkers',
        cite: 'Woo et al. (2017)',
        doi: '10.1038/nn.4478'
      },
      {
        topic: 'Neuroimaging-Based Subtypes of Depression',
        cite: 'Drysdale et al. (2017)',
        doi: '10.1038/nm.4246'
      },
      {
        topic: 'Machine Learning in Psychiatry — Promise and Pitfalls',
        cite: 'Dwyer et al. (2018)',
        doi: '10.1146/annurev-clinpsy-032816-045037'
      },
      {
        topic: 'Digital Phenotyping — Smartphones as Sensors',
        cite: 'Torous et al. (2016)',
        doi: '10.2196/mental.5165'
      }
    ]
  },
  {
    n: '05',
    title: 'Ethics, Equity, and Clinical Translation',
    body: 'The field\'s hardest questions. Computational psychiatry can\'t succeed without confronting bias, consent, access, and the limits of algorithmic medicine.',
    readings: [
      {
        topic: 'The Clinical Translation Gap',
        cite: 'Paulus et al. (2016)',
        doi: '10.1016/j.bpsc.2016.05.001'
      },
      {
        topic: 'Ethics of Algorithmic Psychiatry',
        cite: 'Starke et al. (2020)',
        doi: '10.1017/S0033291720001683'
      },
      {
        topic: 'Bias, Fairness, and Representation',
        cite: 'Obermeyer et al. (2019)',
        doi: '10.1126/science.aax2342'
      },
      {
        topic: 'The Future: Invasive Computational Psychiatry',
        cite: 'Saez & Gu (2023)',
        doi: '10.1016/j.biopsych.2022.09.032'
      }
    ]
  }
]

/* BibTeX for every reading, taken from the publisher record via DOI
   content negotiation rather than hand-entered. All twenty verified. */
export const BIB = [
  {
    label: 'Montague et al. (2012)',
    doi: '10.1016/j.tics.2011.11.018',
    bib: `@article{Montague_2012, title={Computational psychiatry}, volume={16}, ISSN={1364-6613}, url={http://dx.doi.org/10.1016/j.tics.2011.11.018}, DOI={10.1016/j.tics.2011.11.018}, number={1}, journal={Trends in Cognitive Sciences}, publisher={Elsevier BV}, author={Montague, P. Read and Dolan, Raymond J. and Friston, Karl J. and Dayan, Peter}, year={2012}, month=Jan, pages={72–80} }`
  },
  {
    label: 'Huys et al. (2016)',
    doi: '10.1038/nn.4238',
    bib: `@article{Huys_2016, title={Computational psychiatry as a bridge from neuroscience to clinical applications}, volume={19}, ISSN={1546-1726}, url={http://dx.doi.org/10.1038/nn.4238}, DOI={10.1038/nn.4238}, number={3}, journal={Nature Neuroscience}, publisher={Springer Science and Business Media LLC}, author={Huys, Quentin J M and Maia, Tiago V and Frank, Michael J}, year={2016}, month=Feb, pages={404–413} }`
  },
  {
    label: 'Adams et al. (2016)',
    doi: '10.1136/jnnp-2015-310737',
    bib: `@article{Adams_2015, title={Computational Psychiatry: towards a mathematically informed understanding of mental illness}, ISSN={1468-330X}, url={http://dx.doi.org/10.1136/jnnp-2015-310737}, DOI={10.1136/jnnp-2015-310737}, journal={Journal of Neurology, Neurosurgery &amp; Psychiatry}, publisher={BMJ}, author={Adams, Rick A and Huys, Quentin J M and Roiser, Jonathan P}, year={2015}, month=July, pages={jnnp–2015–310737} }`
  },
  {
    label: 'Stephan & Mathys (2014)',
    doi: '10.1016/j.conb.2013.12.007',
    bib: `@article{Stephan_2014, title={Computational approaches to psychiatry}, volume={25}, ISSN={0959-4388}, url={http://dx.doi.org/10.1016/j.conb.2013.12.007}, DOI={10.1016/j.conb.2013.12.007}, journal={Current Opinion in Neurobiology}, publisher={Elsevier BV}, author={Stephan, Klaas Enno and Mathys, Christoph}, year={2014}, month=Apr, pages={85–92} }`
  },
  {
    label: 'Rutledge et al. (2014)',
    doi: '10.1073/pnas.1407535111',
    bib: `@article{Rutledge_2014, title={A computational and neural model of momentary subjective well-being}, volume={111}, ISSN={1091-6490}, url={http://dx.doi.org/10.1073/pnas.1407535111}, DOI={10.1073/pnas.1407535111}, number={33}, journal={Proceedings of the National Academy of Sciences}, publisher={National Academy of Sciences}, author={Rutledge, Robb B. and Skandali, Nikolina and Dayan, Peter and Dolan, Raymond J.}, year={2014}, month=Aug, pages={12252–12257} }`
  },
  {
    label: 'Pizzagalli (2014)',
    doi: '10.1146/annurev-clinpsy-050212-185606',
    bib: `@article{Pizzagalli_2014, title={Depression, Stress, and Anhedonia: Toward a Synthesis and Integrated Model}, volume={10}, ISSN={1548-5951}, url={http://dx.doi.org/10.1146/annurev-clinpsy-050212-185606}, DOI={10.1146/annurev-clinpsy-050212-185606}, number={1}, journal={Annual Review of Clinical Psychology}, publisher={Annual Reviews}, author={Pizzagalli, Diego A.}, year={2014}, month=Mar, pages={393–423} }`
  },
  {
    label: 'Maia & Frank (2011)',
    doi: '10.1038/nn.2723',
    bib: `@article{Maia_2011, title={From reinforcement learning models to psychiatric and neurological disorders}, volume={14}, ISSN={1546-1726}, url={http://dx.doi.org/10.1038/nn.2723}, DOI={10.1038/nn.2723}, number={2}, journal={Nature Neuroscience}, publisher={Springer Science and Business Media LLC}, author={Maia, Tiago V and Frank, Michael J}, year={2011}, month=Jan, pages={154–162} }`
  },
  {
    label: 'Husain & Roiser (2018)',
    doi: '10.1038/s41583-018-0029-9',
    bib: `@article{Husain_2018, title={Neuroscience of apathy and anhedonia: a transdiagnostic approach}, volume={19}, ISSN={1471-0048}, url={http://dx.doi.org/10.1038/s41583-018-0029-9}, DOI={10.1038/s41583-018-0029-9}, number={8}, journal={Nature Reviews Neuroscience}, publisher={Springer Science and Business Media LLC}, author={Husain, Masud and Roiser, Jonathan P.}, year={2018}, month=June, pages={470–484} }`
  },
  {
    label: 'Clark (2013)',
    doi: '10.1017/S0140525X12000477',
    bib: `@article{Clark_2013, title={Whatever next? Predictive brains, situated agents, and the future of cognitive science}, volume={36}, ISSN={1469-1825}, url={http://dx.doi.org/10.1017/S0140525X12000477}, DOI={10.1017/s0140525x12000477}, number={3}, journal={Behavioral and Brain Sciences}, publisher={Cambridge University Press (CUP)}, author={Clark, Andy}, year={2013}, month=May, pages={181–204} }`
  },
  {
    label: 'Corlett et al. (2019)',
    doi: '10.1016/j.tics.2018.12.001',
    bib: `@article{Corlett_2019, title={Hallucinations and Strong Priors}, volume={23}, ISSN={1364-6613}, url={http://dx.doi.org/10.1016/j.tics.2018.12.001}, DOI={10.1016/j.tics.2018.12.001}, number={2}, journal={Trends in Cognitive Sciences}, publisher={Elsevier BV}, author={Corlett, Philip R. and Horga, Guillermo and Fletcher, Paul C. and Alderson-Day, Ben and Schmack, Katharina and Powers, Albert R.}, year={2019}, month=Feb, pages={114–127} }`
  },
  {
    label: 'Corlett et al. (2010)',
    doi: '10.1016/j.pneurobio.2010.06.007',
    bib: `@article{Corlett_2010, title={Toward a neurobiology of delusions}, volume={92}, ISSN={0301-0082}, url={http://dx.doi.org/10.1016/j.pneurobio.2010.06.007}, DOI={10.1016/j.pneurobio.2010.06.007}, number={3}, journal={Progress in Neurobiology}, publisher={Elsevier BV}, author={Corlett, P.R. and Taylor, J.R. and Wang, X.-J. and Fletcher, P.C. and Krystal, J.H.}, year={2010}, month=Nov, pages={345–369} }`
  },
  {
    label: 'Powers et al. (2017)',
    doi: '10.1126/science.aan3458',
    bib: `@article{Powers_2017, title={Pavlovian conditioning–induced hallucinations result from overweighting of perceptual priors}, volume={357}, ISSN={1095-9203}, url={http://dx.doi.org/10.1126/science.aan3458}, DOI={10.1126/science.aan3458}, number={6351}, journal={Science}, publisher={American Association for the Advancement of Science (AAAS)}, author={Powers, A. R. and Mathys, C. and Corlett, P. R.}, year={2017}, month=Aug, pages={596–600} }`
  },
  {
    label: 'Woo et al. (2017)',
    doi: '10.1038/nn.4478',
    bib: `@article{Woo_2017, title={Building better biomarkers: brain models in translational neuroimaging}, volume={20}, ISSN={1546-1726}, url={http://dx.doi.org/10.1038/nn.4478}, DOI={10.1038/nn.4478}, number={3}, journal={Nature Neuroscience}, publisher={Springer Science and Business Media LLC}, author={Woo, Choong-Wan and Chang, Luke J and Lindquist, Martin A and Wager, Tor D}, year={2017}, month=Feb, pages={365–377} }`
  },
  {
    label: 'Drysdale et al. (2017)',
    doi: '10.1038/nm.4246',
    bib: `@article{Drysdale_2016, title={Resting-state connectivity biomarkers define neurophysiological subtypes of depression}, volume={23}, ISSN={1546-170X}, url={http://dx.doi.org/10.1038/nm.4246}, DOI={10.1038/nm.4246}, number={1}, journal={Nature Medicine}, publisher={Springer Science and Business Media LLC}, author={Drysdale, Andrew T and Grosenick, Logan and Downar, Jonathan and Dunlop, Katharine and Mansouri, Farrokh and Meng, Yue and Fetcho, Robert N and Zebley, Benjamin and Oathes, Desmond J and Etkin, Amit and Schatzberg, Alan F and Sudheimer, Keith and Keller, Jennifer and Mayberg, Helen S and Gunning, Faith M and Alexopoulos, George S and Fox, Michael D and Pascual-Leone, Alvaro and Voss, Henning U and Casey, BJ and Dubin, Marc J and Liston, Conor}, year={2016}, month=Dec, pages={28–38} }`
  },
  {
    label: 'Dwyer et al. (2018)',
    doi: '10.1146/annurev-clinpsy-032816-045037',
    bib: `@article{Dwyer_2018, title={Machine Learning Approaches for Clinical Psychology and Psychiatry}, volume={14}, ISSN={1548-5951}, url={http://dx.doi.org/10.1146/annurev-clinpsy-032816-045037}, DOI={10.1146/annurev-clinpsy-032816-045037}, number={1}, journal={Annual Review of Clinical Psychology}, publisher={Annual Reviews}, author={Dwyer, Dominic B. and Falkai, Peter and Koutsouleris, Nikolaos}, year={2018}, month=May, pages={91–118} }`
  },
  {
    label: 'Torous et al. (2016)',
    doi: '10.2196/mental.5165',
    bib: `@article{Torous_2016, title={New Tools for New Research in Psychiatry: A Scalable and Customizable Platform to Empower Data Driven Smartphone Research}, volume={3}, ISSN={2368-7959}, url={http://dx.doi.org/10.2196/mental.5165}, DOI={10.2196/mental.5165}, number={2}, journal={JMIR Mental Health}, publisher={JMIR Publications Inc.}, author={Torous, John and Kiang, Mathew V and Lorme, Jeanette and Onnela, Jukka-Pekka}, year={2016}, month=May, pages={e16} }`
  },
  {
    label: 'Paulus et al. (2016)',
    doi: '10.1016/j.bpsc.2016.05.001',
    bib: `@article{Paulus_2016, title={A Roadmap for the Development of Applied Computational Psychiatry}, volume={1}, ISSN={2451-9022}, url={http://dx.doi.org/10.1016/j.bpsc.2016.05.001}, DOI={10.1016/j.bpsc.2016.05.001}, number={5}, journal={Biological Psychiatry: Cognitive Neuroscience and Neuroimaging}, publisher={Elsevier BV}, author={Paulus, Martin P. and Huys, Quentin J.M. and Maia, Tiago V.}, year={2016}, month=Sept, pages={386–392} }`
  },
  {
    label: 'Starke et al. (2020)',
    doi: '10.1017/S0033291720001683',
    bib: `@article{Starke_2020, title={Computing schizophrenia: ethical challenges for machine learning in psychiatry}, volume={51}, ISSN={1469-8978}, url={http://dx.doi.org/10.1017/S0033291720001683}, DOI={10.1017/s0033291720001683}, number={15}, journal={Psychological Medicine}, publisher={Cambridge University Press (CUP)}, author={Starke, Georg and De Clercq, Eva and Borgwardt, Stefan and Elger, Bernice Simone}, year={2020}, month=June, pages={2515–2521} }`
  },
  {
    label: 'Obermeyer et al. (2019)',
    doi: '10.1126/science.aax2342',
    bib: `@article{Obermeyer_2019, title={Dissecting racial bias in an algorithm used to manage the health of populations}, volume={366}, ISSN={1095-9203}, url={http://dx.doi.org/10.1126/science.aax2342}, DOI={10.1126/science.aax2342}, number={6464}, journal={Science}, publisher={American Association for the Advancement of Science (AAAS)}, author={Obermeyer, Ziad and Powers, Brian and Vogeli, Christine and Mullainathan, Sendhil}, year={2019}, month=Oct, pages={447–453} }`
  },
  {
    label: 'Saez & Gu (2023)',
    doi: '10.1016/j.biopsych.2022.09.032',
    bib: `@article{Saez_2023, title={Invasive Computational Psychiatry}, volume={93}, ISSN={0006-3223}, url={http://dx.doi.org/10.1016/j.biopsych.2022.09.032}, DOI={10.1016/j.biopsych.2022.09.032}, number={8}, journal={Biological Psychiatry}, publisher={Elsevier BV}, author={Saez, Ignacio and Gu, Xiaosi}, year={2023}, month=Apr, pages={661–670} }`
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
  },
  {
    kicker: 'Repository',
    title: 'Clinical-Whisper-Pipeline',
    body: 'The code behind ClinicalWhisper — the speech model adapted for clinical interview audio.',
    href: 'https://github.com/czhou732/Clinical-Whisper-Pipeline'
  }
]
