const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';
export const DISPLAY_NAME = 'Se Min Kong';
const INTRO_WORDMARK_VIEWBOX = '0 0 1000 190';
export const INTRO_WORDMARK_STROKES = [
  {
    letter: 'S',
    strokes: [
      { d: 'M116 39 C96 20 55 23 38 48 C22 72 46 91 78 97 C111 103 126 121 111 145 C94 170 48 168 25 141', weight: 1.25 }
    ]
  },
  {
    letter: 'e',
    strokes: [
      { d: 'M136 108 C157 108 188 103 192 85 C196 67 178 58 159 63 C139 68 130 91 135 114 C141 140 170 153 200 138', weight: 0.85 }
    ]
  },
  {
    letter: 'M',
    strokes: [
      { d: 'M256 155 L259 35 L312 112 L366 34 L369 155', weight: 1.25 }
    ]
  },
  {
    letter: 'i',
    strokes: [
      { d: 'M396 82 L396 155', weight: 0.45 },
      { d: 'M396 49 L396.1 49', weight: 0.25 }
    ]
  },
  {
    letter: 'n',
    strokes: [
      { d: 'M425 155 L425 84 C425 107 441 82 465 82 C486 82 497 97 497 120 L497 155', weight: 0.9 }
    ]
  },
  {
    letter: 'K',
    strokes: [
      { d: 'M566 35 L566 155', weight: 0.65 },
      { d: 'M566 101 L650 35', weight: 0.5 },
      { d: 'M566 101 L657 155', weight: 0.5 }
    ]
  },
  {
    letter: 'o',
    strokes: [
      { d: 'M735 82 C710 82 693 98 693 120 C693 142 710 157 734 157 C759 157 774 140 774 119 C774 96 759 82 735 82 Z', weight: 0.75 }
    ]
  },
  {
    letter: 'n',
    strokes: [
      { d: 'M794 155 L794 84 C794 107 810 82 834 82 C855 82 866 97 866 120 L866 155', weight: 0.9 }
    ]
  },
  {
    letter: 'g',
    strokes: [
      { d: 'M930 83 C906 83 890 99 890 120 C890 142 907 156 930 156 C953 156 966 140 966 119 C966 96 953 83 930 83 Z L966 84 L966 153 C966 178 950 188 928 181', weight: 1.15 }
    ]
  }
];

export const createHandwrittenWordmark = (className, { animated = false } = {}) => {
  const wordmark = document.createElementNS(SVG_NAMESPACE, 'svg');
  wordmark.classList.add('handwritten-wordmark', className);
  wordmark.setAttribute('viewBox', INTRO_WORDMARK_VIEWBOX);
  wordmark.setAttribute('preserveAspectRatio', 'xMidYMid meet');
  wordmark.setAttribute('focusable', 'false');
  wordmark.setAttribute('aria-hidden', 'true');

  const letters = [];
  const strokes = [];
  INTRO_WORDMARK_STROKES.forEach(({ letter: character, strokes: letterStrokes }, letterIndex) => {
    const letter = document.createElementNS(SVG_NAMESPACE, 'g');
    letter.classList.add('handwritten-wordmark__letter');
    if (animated) letter.classList.add('home-intro__writing-letter');
    letter.dataset.letter = character;
    letter.dataset.letterIndex = `${letterIndex}`;

    letterStrokes.forEach(({ d, weight }, strokeIndex) => {
      const path = document.createElementNS(SVG_NAMESPACE, 'path');
      path.classList.add('handwritten-wordmark__stroke');
      path.setAttribute('d', d);
      path.dataset.strokeIndex = `${strokeIndex}`;
      letter.append(path);
      strokes.push({ letter, path, weight });
    });

    letters.push(letter);
    wordmark.append(letter);
  });

  return { wordmark, letters, strokes };
};

export const mountHeroWordmark = (heroName) => {
  if (!heroName) return;

  const heading = heroName.closest('h1');
  heading?.setAttribute('aria-label', DISPLAY_NAME);
  heroName.setAttribute('aria-hidden', 'true');
  heroName.removeAttribute('aria-label');
  if (heroName.hasAttribute('data-handwritten-wordmark')) return;

  const fallback = document.createElement('span');
  const { wordmark } = createHandwrittenWordmark('hero-identity__wordmark');
  fallback.className = 'hero-identity__name-text';
  fallback.textContent = DISPLAY_NAME;
  fallback.setAttribute('aria-hidden', 'true');
  heroName.setAttribute('data-handwritten-wordmark', '');
  heroName.replaceChildren(fallback, wordmark);
};

export const buildWritingWord = (brand) => {
  const measure = document.createElement('span');
  const { wordmark: writing, letters, strokes } = createHandwrittenWordmark(
    'home-intro__writing',
    { animated: true }
  );

  measure.className = 'home-intro__word';
  measure.textContent = DISPLAY_NAME;
  brand.replaceChildren(measure, writing);
  return { writing, letters, strokes };
};
