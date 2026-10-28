import { SupportedLanguage } from './types';
import { codeSamples } from './samples-data';

export class TripleExecutionRaceEngine {
  private deckEl: HTMLElement | null;

  // Cold Terminal Elements
  private coldWindow: HTMLElement | null;
  private coldLinesEl: HTMLElement | null;
  private coldScreenEl: HTMLElement | null;
  private coldCursorEl: HTMLElement | null;

  // Edit Terminal Elements
  private editWindow: HTMLElement | null;
  private editLinesEl: HTMLElement | null;
  private editScreenEl: HTMLElement | null;
  private editCursorEl: HTMLElement | null;

  // Cached (Zero-Work) Terminal Elements
  private cachedWindow: HTMLElement | null;
  private cachedLinesEl: HTMLElement | null;
  private cachedScreenEl: HTMLElement | null;
  private cachedCursorEl: HTMLElement | null;

  // Parallel Comparison Bar Elements
  private parallelColdFill: HTMLElement | null;
  private parallelColdVal: HTMLElement | null;

  private parallelEditFill: HTMLElement | null;
  private parallelEditVal: HTMLElement | null;
  private parallelEditTime: HTMLElement | null;
  private parallelEditSpeedupBadge: HTMLElement | null;

  private parallelCachedFill: HTMLElement | null;
  private parallelCachedTime: HTMLElement | null;
  private parallelSpeedupBadge: HTMLElement | null;

  // Summary Metrics Elements
  private summarySavedVal: HTMLElement | null;
  private summaryCiVal: HTMLElement | null;
  private summaryCo2Val: HTMLElement | null;

  private isPlaying: boolean = false;
  private timeouts: number[] = [];
  private rafId: number | null = null;

  constructor() {
    this.deckEl = document.getElementById('stackedWindowsDeck');

    this.coldWindow = document.getElementById('coldWindow');
    this.coldLinesEl = document.getElementById('coldLines');
    this.coldScreenEl = document.getElementById('coldScreen');
    this.coldCursorEl = document.getElementById('coldCursor');

    this.editWindow = document.getElementById('editWindow');
    this.editLinesEl = document.getElementById('editLines');
    this.editScreenEl = document.getElementById('editScreen');
    this.editCursorEl = document.getElementById('editCursor');

    this.cachedWindow = document.getElementById('cachedWindow');
    this.cachedLinesEl = document.getElementById('cachedLines');
    this.cachedScreenEl = document.getElementById('cachedScreen');
    this.cachedCursorEl = document.getElementById('cachedCursor');

    this.parallelColdFill = document.getElementById('parallelColdFill');
    this.parallelColdVal = document.getElementById('parallelColdVal');

    this.parallelEditFill = document.getElementById('parallelEditFill');
    this.parallelEditVal = document.getElementById('parallelEditVal');
    this.parallelEditTime = document.getElementById('parallelEditTime');
    this.parallelEditSpeedupBadge = document.getElementById('parallelEditSpeedupBadge');

    this.parallelCachedFill = document.getElementById('parallelCachedFill');
    this.parallelCachedTime = document.getElementById('parallelCachedTime');
    this.parallelSpeedupBadge = document.getElementById('parallelSpeedupBadge');

    this.summarySavedVal = document.getElementById('summarySavedVal');
    this.summaryCiVal = document.getElementById('summaryCiVal');
    this.summaryCo2Val = document.getElementById('summaryCo2Val');
  }

  public clear(): void {
    this.timeouts.forEach((t) => clearTimeout(t));
    this.timeouts = [];
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }

    if (this.coldLinesEl) this.coldLinesEl.innerHTML = '';
    if (this.editLinesEl) this.editLinesEl.innerHTML = '';
    if (this.cachedLinesEl) this.cachedLinesEl.innerHTML = '';

    if (this.parallelColdFill) this.parallelColdFill.style.width = '0%';
    if (this.parallelEditFill) this.parallelEditFill.style.width = '0%';
    if (this.parallelCachedFill) this.parallelCachedFill.style.width = '0%';

    if (this.coldWindow) this.coldWindow.classList.remove('cold-pulse');
    if (this.editWindow) this.editWindow.classList.remove('edit-pulse');
    if (this.cachedWindow) this.cachedWindow.classList.remove('winner-pulse');
    this.isPlaying = false;
  }

  public showStatic(lang: SupportedLanguage): void {
    const sample = codeSamples[lang] || codeSamples.python;
    this.clear();

    const coldTimeSec = parseFloat(sample.metrics.coldTime) || 6.2;
    const editTimeSec = parseFloat(sample.metrics.editTime) || 1.8;
    const cachedTimeSec = parseFloat(sample.metrics.cachedTime) || 1.1;

    const editSpeedupFactor = (coldTimeSec / editTimeSec).toFixed(1);
    const cachedSpeedupFactor = (coldTimeSec / cachedTimeSec).toFixed(1);
    const computedEditSpeedup = `${editSpeedupFactor}x Faster`;
    const computedCachedSpeedup = `${cachedSpeedupFactor}x Faster`;

    const savedSec = Math.max(0, coldTimeSec - cachedTimeSec);
    const savedPct = Math.round((savedSec / coldTimeSec) * 100);
    const computedSaved = `${savedPct}% Saved (${savedSec.toFixed(1)}s)`;
    const computedCiSaved = `${savedPct}% Fewer Runner Mins`;
    const computedCo2Saved = `~${(savedSec * 0.25).toFixed(1)}g CO₂e / build`;

    const proportionalEditTargetPct = (editTimeSec / coldTimeSec) * 100;
    const proportionalCachedTargetPct = (cachedTimeSec / coldTimeSec) * 100;

    if (this.summarySavedVal) this.summarySavedVal.textContent = computedSaved;
    if (this.summaryCiVal) this.summaryCiVal.textContent = computedCiSaved;
    if (this.summaryCo2Val) this.summaryCo2Val.textContent = computedCo2Saved;

    if (this.parallelColdVal) this.parallelColdVal.textContent = sample.metrics.coldTime;
    if (this.parallelColdFill) this.parallelColdFill.style.width = '100%';

    if (this.parallelEditTime) this.parallelEditTime.textContent = sample.metrics.editTime;
    if (this.parallelEditFill)
      this.parallelEditFill.style.width = `${proportionalEditTargetPct.toFixed(2)}%`;
    if (this.parallelEditSpeedupBadge)
      this.parallelEditSpeedupBadge.textContent = computedEditSpeedup;

    if (this.parallelCachedTime) this.parallelCachedTime.textContent = sample.metrics.cachedTime;
    if (this.parallelCachedFill)
      this.parallelCachedFill.style.width = `${proportionalCachedTargetPct.toFixed(2)}%`;
    if (this.parallelSpeedupBadge) this.parallelSpeedupBadge.textContent = computedCachedSpeedup;

    const coldPill = document.getElementById('coldTimePill');
    const editPill = document.getElementById('editTimePill');
    const cachedPill = document.getElementById('cachedTimePill');
    if (coldPill) coldPill.textContent = sample.metrics.coldTime;
    if (editPill) editPill.textContent = sample.metrics.editTime;
    if (cachedPill) cachedPill.textContent = sample.metrics.cachedTime;

    const appendLines = (
      linesEl: HTMLElement | null,
      screenEl: HTMLElement | null,
      lines: Array<{ text: string; class?: string }>,
    ) => {
      if (!linesEl) return;
      const frag = document.createDocumentFragment();
      lines.forEach((item) => {
        const line = document.createElement('div');
        line.className = `player-terminal-line ${item.class || ''}`;
        line.textContent = item.text;
        frag.appendChild(line);
      });
      linesEl.appendChild(frag);
      if (screenEl) {
        screenEl.scrollTop = screenEl.scrollHeight;
      }
    };

    appendLines(this.coldLinesEl, this.coldScreenEl, sample.cold);
    appendLines(this.editLinesEl, this.editScreenEl, sample.edit);
    appendLines(this.cachedLinesEl, this.cachedScreenEl, sample.cached);

    if (this.coldWindow) this.coldWindow.classList.add('cold-pulse');
    if (this.editWindow) this.editWindow.classList.add('edit-pulse');
    if (this.cachedWindow) this.cachedWindow.classList.add('winner-pulse');
  }

  public startRace(lang: SupportedLanguage): void {
    const sample = codeSamples[lang] || codeSamples.python;
    this.clear();

    const coldTimeSec = parseFloat(sample.metrics.coldTime) || 6.2;
    const editTimeSec = parseFloat(sample.metrics.editTime) || 1.8;
    const cachedTimeSec = parseFloat(sample.metrics.cachedTime) || 1.1;

    // Dynamically compute speedups & ROI impact metrics directly from measured execution times
    const editSpeedupFactor = (coldTimeSec / editTimeSec).toFixed(1);
    const cachedSpeedupFactor = (coldTimeSec / cachedTimeSec).toFixed(1);
    const computedEditSpeedup = `${editSpeedupFactor}x Faster`;
    const computedCachedSpeedup = `${cachedSpeedupFactor}x Faster`;

    const savedSec = Math.max(0, coldTimeSec - cachedTimeSec);
    const savedPct = Math.round((savedSec / coldTimeSec) * 100);
    const computedSaved = `${savedPct}% Saved (${savedSec.toFixed(1)}s)`;
    const computedCiSaved = `${savedPct}% Fewer Runner Mins`;
    const computedCo2Saved = `~${(savedSec * 0.25).toFixed(1)}g CO₂e / build`;

    const coldDurationMs = coldTimeSec * 1000;
    const editDurationMs = editTimeSec * 1000;
    const cachedDurationMs = cachedTimeSec * 1000;

    const proportionalEditTargetPct = (editTimeSec / coldTimeSec) * 100;
    const proportionalCachedTargetPct = (cachedTimeSec / coldTimeSec) * 100;

    // Update Summary Metric Values dynamically computed
    if (this.summarySavedVal) this.summarySavedVal.textContent = computedSaved;
    if (this.summaryCiVal) this.summaryCiVal.textContent = computedCiSaved;
    if (this.summaryCo2Val) this.summaryCo2Val.textContent = computedCo2Saved;

    if (this.parallelColdVal)
      this.parallelColdVal.textContent = `0.0s / ${sample.metrics.coldTime}`;
    if (this.parallelEditTime) this.parallelEditTime.textContent = '0.0s';
    if (this.parallelEditSpeedupBadge)
      this.parallelEditSpeedupBadge.textContent = computedEditSpeedup;
    if (this.parallelCachedTime) this.parallelCachedTime.textContent = '0.0s';
    if (this.parallelSpeedupBadge) this.parallelSpeedupBadge.textContent = computedCachedSpeedup;

    // Update Header Time Pills in Horizontal Cards
    const coldPill = document.getElementById('coldTimePill');
    const editPill = document.getElementById('editTimePill');
    const cachedPill = document.getElementById('cachedTimePill');
    if (coldPill) coldPill.textContent = sample.metrics.coldTime;
    if (editPill) editPill.textContent = sample.metrics.editTime;
    if (cachedPill) cachedPill.textContent = sample.metrics.cachedTime;

    this.isPlaying = true;
    const startTime = performance.now();

    // High fidelity real-time frame loop for all 3 parallel progress timelines on shared scale
    const updateProgress = () => {
      if (!this.isPlaying) return;
      const now = performance.now();
      const elapsed = now - startTime;

      // 1. Update Zero-Work Rebuild (Repeat/Cached) Progress
      if (elapsed <= cachedDurationMs) {
        const cachedFraction = elapsed / cachedDurationMs;
        const currentCachedPct = cachedFraction * proportionalCachedTargetPct;
        if (this.parallelCachedFill)
          this.parallelCachedFill.style.width = `${currentCachedPct.toFixed(2)}%`;
        const currentCachedSec = (cachedFraction * cachedTimeSec).toFixed(1);
        if (this.parallelCachedTime) this.parallelCachedTime.textContent = `${currentCachedSec}s`;
      } else {
        if (this.parallelCachedFill)
          this.parallelCachedFill.style.width = `${proportionalCachedTargetPct.toFixed(2)}%`;
        if (this.parallelCachedTime)
          this.parallelCachedTime.textContent = sample.metrics.cachedTime;
        if (this.parallelSpeedupBadge)
          this.parallelSpeedupBadge.textContent = computedCachedSpeedup;
      }

      // 2. Update Incremental Build Progress
      if (elapsed <= editDurationMs) {
        const editFraction = elapsed / editDurationMs;
        const currentEditPct = editFraction * proportionalEditTargetPct;
        if (this.parallelEditFill)
          this.parallelEditFill.style.width = `${currentEditPct.toFixed(2)}%`;
        const currentEditSec = (editFraction * editTimeSec).toFixed(1);
        if (this.parallelEditTime) this.parallelEditTime.textContent = `${currentEditSec}s`;
      } else {
        if (this.parallelEditFill)
          this.parallelEditFill.style.width = `${proportionalEditTargetPct.toFixed(2)}%`;
        if (this.parallelEditTime) this.parallelEditTime.textContent = sample.metrics.editTime;
        if (this.parallelEditSpeedupBadge)
          this.parallelEditSpeedupBadge.textContent = computedEditSpeedup;
      }

      // 3. Update Clean Build Progress
      if (elapsed <= coldDurationMs) {
        const coldFraction = elapsed / coldDurationMs;
        const coldPct = Math.min(100, coldFraction * 100);
        if (this.parallelColdFill) this.parallelColdFill.style.width = `${coldPct.toFixed(2)}%`;
        const currentColdSec = (coldFraction * coldTimeSec).toFixed(1);
        if (this.parallelColdVal)
          this.parallelColdVal.textContent = `${currentColdSec}s / ${sample.metrics.coldTime}`;
        this.rafId = requestAnimationFrame(updateProgress);
      } else {
        this.isPlaying = false;
        if (this.parallelColdFill) this.parallelColdFill.style.width = '100%';
        if (this.parallelColdVal) this.parallelColdVal.textContent = sample.metrics.coldTime;
      }
    };
    this.rafId = requestAnimationFrame(updateProgress);

    // Stream Zero-Work Rebuild Logs in Real Time
    sample.cached.forEach((item, index) => {
      const delay = item.delay;
      const timer = window.setTimeout(() => {
        const line = document.createElement('div');
        line.className = `player-terminal-line ${item.class || ''}`;
        line.textContent = item.text;
        if (this.cachedLinesEl) {
          this.cachedLinesEl.appendChild(line);
          if (this.cachedScreenEl) this.cachedScreenEl.scrollTop = this.cachedScreenEl.scrollHeight;
        }

        // Zero-Work Finishes
        if (index === sample.cached.length - 1) {
          if (this.cachedWindow) this.cachedWindow.classList.add('winner-pulse');
        }
      }, delay);
      this.timeouts.push(timer);
    });

    // Stream Incremental Build Logs in Real Time
    sample.edit.forEach((item, index) => {
      const delay = item.delay;
      const timer = window.setTimeout(() => {
        const line = document.createElement('div');
        line.className = `player-terminal-line ${item.class || ''}`;
        line.textContent = item.text;
        if (this.editLinesEl) {
          this.editLinesEl.appendChild(line);
          if (this.editScreenEl) this.editScreenEl.scrollTop = this.editScreenEl.scrollHeight;
        }

        // Incremental Finishes
        if (index === sample.edit.length - 1) {
          if (this.editWindow) this.editWindow.classList.add('edit-pulse');
        }
      }, delay);
      this.timeouts.push(timer);
    });

    // Stream Clean Build Logs in Real Time
    sample.cold.forEach((item, index) => {
      const delay = item.delay;
      const timer = window.setTimeout(() => {
        const line = document.createElement('div');
        line.className = `player-terminal-line ${item.class || ''}`;
        line.textContent = item.text;
        if (this.coldLinesEl) {
          this.coldLinesEl.appendChild(line);
          if (this.coldScreenEl) this.coldScreenEl.scrollTop = this.coldScreenEl.scrollHeight;
        }

        // Clean Build Finishes
        if (index === sample.cold.length - 1) {
          this.isPlaying = false;
          if (this.coldWindow) this.coldWindow.classList.add('cold-pulse');
          if (this.parallelColdFill) this.parallelColdFill.style.width = '100%';
          if (this.parallelColdVal) this.parallelColdVal.textContent = sample.metrics.coldTime;
        }
      }, delay);
      this.timeouts.push(timer);
    });
  }
}
