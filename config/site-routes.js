export const SITE_ROUTES = Object.freeze([
  {
    name: 'portfolio',
    source: 'index.html',
    output: 'index.html',
    entry: '/src/entries/home.js',
    kind: 'home'
  },
  {
    name: 'work',
    source: 'work/index.html',
    output: 'work/index.html',
    entry: '/src/entries/work.js',
    kind: 'work'
  },
  {
    name: 'thing',
    source: 'work/thing/index.html',
    output: 'work/thing/index.html',
    entry: '/src/entries/case-study.js',
    kind: 'case-study'
  },
  {
    name: 'aqis',
    source: 'work/aqis/index.html',
    output: 'work/aqis/index.html',
    entry: '/src/entries/case-study.js',
    kind: 'case-study'
  },
  {
    name: 'brainTumorMri',
    source: 'work/brain-tumor-mri/index.html',
    output: 'work/brain-tumor-mri/index.html',
    entry: '/src/entries/case-study.js',
    kind: 'case-study'
  },
  {
    name: 'alkkagi',
    source: 'work/alkkagi/index.html',
    output: 'work/alkkagi/index.html',
    entry: '/src/entries/case-study.js',
    kind: 'case-study'
  },
  {
    name: 'briefit',
    source: 'work/briefit/index.html',
    output: 'work/briefit/index.html',
    entry: '/src/entries/case-study.js',
    kind: 'case-study'
  },
  {
    name: 'projectPromptGenerator',
    source: 'work/project-prompt-generator/index.html',
    output: 'work/project-prompt-generator/index.html',
    entry: '/src/entries/case-study.js',
    kind: 'case-study'
  },
  {
    name: 'about',
    source: 'about/index.html',
    output: 'about/index.html',
    entry: '/src/entries/about.js',
    kind: 'about'
  },
  {
    name: 'resume',
    source: 'resume/index.html',
    output: 'resume/index.html',
    entry: '/src/entries/resume.js',
    kind: 'resume'
  },
  {
    name: 'copyright',
    source: 'copyright/index.html',
    output: 'copyright/index.html',
    entry: '/src/entries/legal.js',
    kind: 'legal'
  }
]);

export const STATIC_DEPLOYMENT_FILES = Object.freeze([
  'favicon.svg',
  'resume/SeMinKong-Resume-page-1.png',
  'resume/SeMinKong-Resume.docx',
  'resume/SeMinKong-Resume.pdf',
  'resume/award-capstone-design.webp',
  'resume/award-it-project-pro-league.webp',
  'resume/award-software-competition.webp',
  'resume/award-ssafy-common-project.webp',
  'server/index.js',
  'social/portfolio-1200x630.jpg',
  'sitemap.xml'
]);

export const EXPECTED_DEPLOYMENT_FILES = Object.freeze([
  ...SITE_ROUTES.map(({ output }) => output),
  ...STATIC_DEPLOYMENT_FILES
]);
