/**
 * Comparison Table Filters & Migration Guide Tabs
 */

import { SupportedLanguage } from './types';
import { migrationData, MigrationTools } from './migration-data';

let currentLang: SupportedLanguage = 'go';
let currentTool: MigrationTools = 'dockerfile';
const activeFileIndexPerTool: Record<string, number> = {};

export function updateMigrationDisplay(lang: SupportedLanguage, tool: MigrationTools): void {
  const sample = migrationData[lang]?.[tool];
  if (!sample) return;

  const targetId = `mig-${tool}`;
  const panel = document.getElementById(targetId);
  if (!panel) return;

  const legacyTitle = panel.querySelector<HTMLElement>('.mig-legacy-title');
  const legacyCode = panel.querySelector<HTMLElement>('.mig-legacy-code');
  const earthfileTitle = panel.querySelector<HTMLElement>('.mig-earthfile-title');
  const earthfileCode = panel.querySelector<HTMLElement>('.mig-earthfile-code');
  const tabsContainer = panel.querySelector<HTMLElement>('.mig-legacy-file-tabs');

  if (legacyTitle) legacyTitle.textContent = sample.legacyTitle;
  if (earthfileTitle) earthfileTitle.textContent = sample.earthfileTitle;
  if (earthfileCode) earthfileCode.innerHTML = sample.earthfileCode;

  // Handle multi-file tooling (e.g. docker-bake.hcl + Dockerfile, Makefile + Dockerfile)
  if (sample.legacyFiles && sample.legacyFiles.length > 1) {
    let fileIdx = activeFileIndexPerTool[tool] ?? 0;
    if (fileIdx >= sample.legacyFiles.length) {
      fileIdx = 0;
      activeFileIndexPerTool[tool] = 0;
    }

    if (tabsContainer) {
      tabsContainer.style.display = 'inline-flex';
      tabsContainer.innerHTML = sample.legacyFiles
        .map(
          (file, idx) => `
          <button class="window-file-tab-btn ${idx === fileIdx ? 'active' : ''}" data-file-idx="${idx}" role="tab" aria-selected="${idx === fileIdx ? 'true' : 'false'}">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
            </svg>
            <span>${file.name}</span>
          </button>
        `,
        )
        .join('');

      const btns = tabsContainer.querySelectorAll<HTMLButtonElement>('.window-file-tab-btn');
      btns.forEach((btn) => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const idx = parseInt(btn.getAttribute('data-file-idx') || '0', 10);
          activeFileIndexPerTool[tool] = idx;
          btns.forEach((b, bIdx) => {
            const isActive = bIdx === idx;
            b.classList.toggle('active', isActive);
            b.setAttribute('aria-selected', isActive ? 'true' : 'false');
          });
          if (legacyCode && sample.legacyFiles && sample.legacyFiles[idx]) {
            legacyCode.innerHTML = sample.legacyFiles[idx].code;
          }
        });
      });
    }

    if (legacyCode) {
      legacyCode.innerHTML = sample.legacyFiles[fileIdx].code;
    }
  } else {
    if (tabsContainer) {
      tabsContainer.style.display = 'none';
      tabsContainer.innerHTML = '';
    }
    if (legacyCode) {
      legacyCode.innerHTML = sample.legacyCode;
    }
  }
}

export function setMigrationLanguage(lang: SupportedLanguage): void {
  currentLang = lang;

  const migLangTabs = document.querySelectorAll<HTMLButtonElement>('#migLangTabs .race-tab-btn');
  migLangTabs.forEach((tab) => {
    tab.classList.toggle('active', tab.getAttribute('data-lang') === lang);
  });

  updateMigrationDisplay(currentLang, currentTool);
}

export function initComparisonFilters(): void {
  const filterBtns = document.querySelectorAll<HTMLButtonElement>('.matrix-filter-btn');
  const tableRows = document.querySelectorAll<HTMLTableRowElement>('.comparison-table tbody tr');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const cat = btn.getAttribute('data-filter') || btn.getAttribute('data-category');

      tableRows.forEach((row) => {
        const rowCat = row.getAttribute('data-category');
        if (cat === 'all' || rowCat === cat) {
          row.style.display = '';
        } else {
          row.style.display = 'none';
        }
      });
    });
  });
}

export function initMigrationTabs(): void {
  const migLangTabs = document.querySelectorAll<HTMLButtonElement>('#migLangTabs .race-tab-btn');
  const migToolTabs = document.querySelectorAll<HTMLButtonElement>('.migration-tab-btn');
  const container = document.querySelector<HTMLElement>('.migration-container');

  // Language Tabs in Migration Section
  migLangTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      migLangTabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');

      const lang = tab.getAttribute('data-lang') as SupportedLanguage | null;
      if (!lang || !migrationData[lang]) return;

      currentLang = lang;
      updateMigrationDisplay(currentLang, currentTool);
    });
  });

  // Tool Tabs in Migration Section (Dockerfile, Bake, Makefile, Dagger, GHA)
  migToolTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      migToolTabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');

      const targetId = tab.getAttribute('data-target');
      if (!targetId) return;

      currentTool = targetId.replace('mig-', '') as MigrationTools;

      // Lazy-mount panel from template if not yet present in DOM
      if (!document.getElementById(targetId) && container) {
        const tmpl = document.getElementById(`tmpl-${targetId}`) as HTMLTemplateElement | null;
        if (tmpl) {
          const clone = tmpl.content.cloneNode(true);
          container.appendChild(clone);
        }
      }

      // Hide all panels, show target panel
      const migPanels = document.querySelectorAll<HTMLElement>('.migration-panel');
      migPanels.forEach((panel) => {
        if (panel.id === targetId) {
          panel.style.display = 'grid';
        } else {
          panel.style.display = 'none';
        }
      });

      // Update code contents for active language in this tool panel
      updateMigrationDisplay(currentLang, currentTool);
    });
  });

  // Initial render with currentLang & currentTool
  updateMigrationDisplay(currentLang, currentTool);
}
