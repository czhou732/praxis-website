const fs = require('fs')

let syllabus = fs.readFileSync('src/pages/Syllabus.jsx', 'utf8')
let events = fs.readFileSync('src/pages/Events.jsx', 'utf8')

// 1. In Syllabus, add the imports
if (!syllabus.includes('JOURNAL_CLUB')) {
  syllabus = syllabus.replace(
    "import { BIB, MODULES } from '../data/site'",
    "import { BIB, MODULES } from '../data/site'\nimport { JOURNAL_CLUB } from '../data/events'\nimport { Pill } from '../components/ui'"
  )
}

// 2. Extract Journal Club section from Events
const jcStart = events.indexOf('<Band>\n        <Reveal>\n          <SectionHead num="02" title="Journal club"')
const jcEnd = events.indexOf('</Reveal>\n      </Band>', jcStart) + '</Reveal>\n      </Band>'.length
const jcSection = events.substring(jcStart, jcEnd)

// 3. Remove Journal Club section from Events and renumber
let newEvents = events.replace(jcSection, '')
newEvents = newEvents.replace('num="03"', 'num="02"')
newEvents = newEvents.replace('num="04"', 'num="03"')
newEvents = newEvents.replace('num="05"', 'num="04"')

// Remove JOURNAL_CLUB import from Events
newEvents = newEvents.replace(/, JOURNAL_CLUB /g, ' ')

// 4. Inject JC Section into Syllabus
// Let's add it right after the first Band (ModuleGraph)
const firstBandEnd = syllabus.indexOf('</Band>') + '</Band>'.length
const protocolSection = `
      <Band>
        <Reveal>
          <SectionHead num="02" title="The Protocol" id="protocol" />
          <div className="relative rounded-sm border border-ink/13 border-l-2 border-l-cool bg-surface p-8">
            <h3 className="mb-4 font-serif text-[1.2rem] leading-[1.2] tracking-[-0.012em]">
              Rules of Engagement
            </h3>
            <ol className="space-y-4 font-mono text-[0.8rem] text-muted list-decimal list-inside">
              <li>
                <strong className="text-cool">No Summaries:</strong> Assume everyone has read the paper. Do not read the abstract. Start with the friction point.
              </li>
              <li>
                <strong className="text-cool">The Pivot Rule:</strong> If you critique a methodology, you must propose an actionable alternative implementation for our lab.
              </li>
              <li>
                <strong className="text-cool">Show the Math:</strong> For computational models (e.g., TDE, Free Energy), the presenter must derive the core equations. Concepts are not enough.
              </li>
            </ol>
            <div className="mt-6 border-t border-ink/13 pt-4">
              <p className="font-mono text-[0.65rem] uppercase tracking-widest text-cool">
                [ Capstone Requirement ]
              </p>
              <p className="mt-2 text-[0.85rem] text-muted">
                To graduate from the curriculum to Core Research, members must select one foundational paper and replicate a core figure in Python/PyTorch, submitting it as a PR to our open-source repository.
              </p>
            </div>
          </div>
        </Reveal>
      </Band>
`

let jcSectionForSyllabus = jcSection.replace('num="02"', 'num="03"')
// The existing Bibliography is section 02. Let's make Protocol 02, JC 03, Biblio 04.
syllabus = syllabus.replace('num="02" title="Bibliography"', 'num="04" title="Bibliography"')

// Insert protocol and JC after the first band
syllabus = syllabus.slice(0, firstBandEnd) + '\n' + protocolSection + '\n' + jcSectionForSyllabus + syllabus.slice(firstBandEnd)

fs.writeFileSync('src/pages/Syllabus.jsx', syllabus)
fs.writeFileSync('src/pages/Events.jsx', newEvents)
console.log('Successfully patched Syllabus and Events.')
