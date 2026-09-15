import fs from 'fs';

let content = fs.readFileSync('src/pages/Home.jsx', 'utf8');

if (!content.includes('useTypewriter')) {
  content = content.replace(
    "import { ADVISORS", 
    "import { useTypewriter } from '../hooks/useTypewriter'\nimport { ADVISORS"
  );
}

const typeWriterHook = `  const bgRef = useRef(null)
  const fgRef = useRef(null)
  const { displayed, done } = useTypewriter('From theory into tools that reach patients.', 35, 800)
`;

content = content.replace(
  "  const bgRef = useRef(null)\n  const fgRef = useRef(null)",
  typeWriterHook
);

const newHero = `          <div data-boot className="pointer-events-none mb-5 select-none sm:mb-6" style={{ filter: 'blur(3.5px)' }}>
            <p className="text-[clamp(15px,2vw,20px)] font-mono font-medium leading-[1.3] text-cool/80">
              {SITE.expansion.split('&')[0]}<br />&amp;{SITE.expansion.split('&')[1]}
            </p>
          </div>
          
          <h1 data-boot className="mt-6 max-w-[17ch] min-h-[3em] font-serif text-[clamp(2.6rem,7vw,5.1rem)] leading-[1.02] tracking-[-0.025em] text-white">
            {displayed}
            {!done && <span className="ml-[2px] inline-block h-[0.9em] w-[4px] bg-cool align-middle animate-pulse" />}
          </h1>
          <p data-boot className="measure mt-7 text-[1.15rem] leading-[1.6] text-ink-2">{SITE.mission}</p>`;

content = content.replace(
  /<div data-boot>[\s\S]*?<\/h1>\n          <p data-boot className="measure mt-7 text-\[1\.15rem\] leading-\[1\.6\] text-ink-2">\{SITE\.mission\}<\/p>/,
  newHero
);

fs.writeFileSync('src/pages/Home.jsx', content);
