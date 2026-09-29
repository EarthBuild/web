/**
 * EarthBuild Main Application Entrypoint
 * Compiled via Hugo Pipes & ESBuild natively with Strict TypeScript
 */

import { initNavbar, initSmoothScroll } from './nav';
import { initClipboard } from './clipboard';
import { initInstallTabs } from './install-tabs';
import { TripleExecutionRaceEngine } from './race-runner';
import { initCodeExplorer } from './accordion';
import { initRoiCalculator } from './roi';
import { initComparisonFilters, initMigrationTabs } from './comparison';
import { initDigitalEarth } from './digital-earth';
import { initHeadingAnchorLinks } from './anchor-links';

function scheduleDigitalEarth(): void {
  const canvas = document.getElementById('digitalEarthCanvas');
  const backdrop = document.getElementById('heroEarthBackdrop');
  if (!canvas) return;

  // If user opens a deep link with a hash (e.g. #calculator, #features, #comparison),
  // disable Earth animation so it never intrudes on deep-linked sections or consumes GPU.
  const hasHash = Boolean(
    typeof window !== 'undefined' &&
    window.location.hash &&
    window.location.hash !== '#' &&
    window.location.hash !== '#hero',
  );

  let initialized = false;
  const startEarth = () => {
    if (initialized) return;
    initialized = true;
    if (backdrop) backdrop.style.display = '';
    canvas.style.display = '';
    initDigitalEarth();
  };

  if (hasHash) {
    if (backdrop) backdrop.style.display = 'none';
    canvas.style.display = 'none';

    // Only activate if the user explicitly scrolls back up into the hero section
    const onScroll = () => {
      if (window.scrollY < 200) {
        window.removeEventListener('scroll', onScroll);
        startEarth();
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return;
  }

  startEarth();
}

function runInit(): void {
  initNavbar();
  initClipboard();
  initHeadingAnchorLinks();
  initInstallTabs();
  scheduleDigitalEarth();

  const raceEngine = new TripleExecutionRaceEngine();
  initCodeExplorer(raceEngine);

  initRoiCalculator();
  initComparisonFilters();
  initMigrationTabs();
  initSmoothScroll();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', runInit);
} else {
  runInit();
}
