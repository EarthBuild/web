import { SupportedLanguage, WindowKey } from './types';
import { codeSamples } from './samples-data';
import { TripleExecutionRaceEngine } from './race-runner';
import { setMigrationLanguage } from './comparison';

export function initCodeExplorer(raceEngine: TripleExecutionRaceEngine): void {
  const tabs = document.querySelectorAll<HTMLButtonElement>('#raceLangTabs .race-tab-btn');
  const codePane = document.getElementById('raceCodePane');
  const fileLink = document.getElementById('raceFileLink');

  // Sticky Language Navbar scale-up observer
  const sentinel = document.getElementById('langNavSentinel');
  const langNavbar = document.getElementById('raceLangNavbar');

  if (sentinel && langNavbar) {
    const updateStuck = () => {
      const rect = sentinel.getBoundingClientRect();
      const isStuck = rect.top <= 20;
      langNavbar.classList.toggle('is-stuck', isStuck);
    };

    window.addEventListener('scroll', updateStuck, { passive: true });
    window.addEventListener('resize', updateStuck, { passive: true });
    updateStuck();
  }

  // Deck Elements (CodeRabbit-style horizontal cards)
  const deck = document.getElementById('stackedWindowsDeck');
  const cards = document.querySelectorAll<HTMLElement>(
    '.cr-feature-card, .stacked-terminal-window',
  );

  // Function to activate and expand a specific window card
  function bringToFront(targetKey: WindowKey | string): void {
    if (!deck) return;
    deck.setAttribute('data-front', targetKey);

    cards.forEach((card) => {
      const isFront = card.getAttribute('data-window') === targetKey;
      card.classList.toggle('is-front', isFront);
      card.setAttribute('data-active', isFront ? 'true' : 'false');
      card.setAttribute('aria-selected', isFront ? 'true' : 'false');
      const windowContent = card.querySelector<HTMLElement>('.cr-card-window-content');
      if (windowContent) {
        windowContent.setAttribute('aria-hidden', isFront ? 'false' : 'true');
      }
    });
  }

  // Click & focus interaction for each window card & header tab
  cards.forEach((card) => {
    const winKey = card.getAttribute('data-window') as WindowKey | null;
    if (!winKey) return;

    const header = card.querySelector<HTMLElement>('.cr-card-tab-header, .stacked-window-header');

    card.addEventListener('click', () => {
      bringToFront(winKey);
    });

    if (header) {
      header.addEventListener('click', (e) => {
        e.stopPropagation();
        bringToFront(winKey);
      });
    }

    card.addEventListener('focus', () => {
      bringToFront(winKey);
    });
  });

  // Language Tabs
  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');

      const lang = tab.getAttribute('data-lang') as SupportedLanguage | null;
      if (!lang || !codeSamples[lang]) return;

      if (fileLink) {
        fileLink.innerHTML = `<a id="exampleRepoLink" href="${codeSamples[lang].repoUrl}" target="_blank" rel="noopener noreferrer">view code ↗</a>`;
      }
      if (codePane) {
        codePane.innerHTML = `<code>${codeSamples[lang].code}</code>`;
      }
      raceEngine.startRace(lang);
      setMigrationLanguage(lang);
    });
  });

  // Initial Load (Render pre-computed static results across all 3 windows on initial load)
  bringToFront('repeat');
  raceEngine.showStatic('python');
}
