/**
 * ROI & CI Compute Cost Calculator
 * Supports dynamic URL synchronization so customized calculations can be shared and bookmarked.
 */

import { showCopyToast } from './anchor-links';
import { copyTextToClipboard } from './clipboard';

interface RoiParams {
  team?: number;
  builds?: number;
  mins?: number;
}

function parseUrlParams(): RoiParams {
  const searchParams = new URLSearchParams(window.location.search);
  let team = searchParams.get('team') || searchParams.get('teamSize');
  let builds = searchParams.get('builds') || searchParams.get('buildsPerDay');
  let mins = searchParams.get('mins') || searchParams.get('minutesSaved');

  // Also check query string inside hash if someone copied an in-hash query
  if ((!team || !builds || !mins) && window.location.hash.includes('?')) {
    const hashQuery = window.location.hash.split('?')[1];
    const hashParams = new URLSearchParams(hashQuery);
    if (!team) team = hashParams.get('team') || hashParams.get('teamSize');
    if (!builds) builds = hashParams.get('builds') || hashParams.get('buildsPerDay');
    if (!mins) mins = hashParams.get('mins') || hashParams.get('minutesSaved');
  }

  const parseNum = (v: string | null): number | undefined => {
    if (!v) return undefined;
    const n = parseInt(v, 10);
    return isNaN(n) ? undefined : n;
  };

  return {
    team: parseNum(team),
    builds: parseNum(builds),
    mins: parseNum(mins),
  };
}

function buildShareUrl(team: number, builds: number, minsSaved: number): string {
  const url = new URL(window.location.href);
  url.searchParams.set('team', String(team));
  url.searchParams.set('builds', String(builds));
  url.searchParams.set('mins', String(minsSaved));
  url.hash = 'calculator';
  return url.toString();
}

export function initRoiCalculator(): void {
  const teamSizeInput = document.getElementById('roiTeamSize') as HTMLInputElement | null;
  const buildsPerDayInput = document.getElementById('roiBuildsPerDay') as HTMLInputElement | null;
  const minutesSavedInput = document.getElementById('roiMinutesSaved') as HTMLInputElement | null;

  const teamSizeVal = document.getElementById('roiTeamSizeVal');
  const buildsPerDayVal = document.getElementById('roiBuildsPerDayVal');
  const minutesSavedVal = document.getElementById('roiMinutesSavedVal');

  const hoursSavedResult = document.getElementById('roiHoursSaved');
  const hoursPerDevResult = document.getElementById('roiHoursPerDev');
  const runnerMinutesResult = document.getElementById('roiRunnerMinutesSaved');
  const vcpuHoursResult = document.getElementById('roiVcpuHours');
  const co2SavedResult = document.getElementById('roiCo2Saved');
  const co2EquivalentResult = document.getElementById('roiCo2Equivalent');

  const shareBtn = document.getElementById('roiCopyShareBtn');

  // 1. Initialize from URL params if provided
  const initialParams = parseUrlParams();
  if (teamSizeInput && initialParams.team !== undefined) {
    const clampedTeam = Math.max(1, Math.min(100, initialParams.team));
    teamSizeInput.value = String(clampedTeam);
  }
  if (buildsPerDayInput && initialParams.builds !== undefined) {
    const clampedBuilds = Math.max(1, Math.min(25, initialParams.builds));
    buildsPerDayInput.value = String(clampedBuilds);
  }
  if (minutesSavedInput && initialParams.mins !== undefined) {
    const clampedMins = Math.max(2, Math.min(30, initialParams.mins));
    minutesSavedInput.value = String(clampedMins);
  }

  let updateUrlTimeout: number | null = null;

  function calculate(syncUrl = true): void {
    const team = parseInt(teamSizeInput?.value || '20', 10);
    const builds = parseInt(buildsPerDayInput?.value || '8', 10);
    const minsSaved = parseInt(minutesSavedInput?.value || '12', 10);

    if (teamSizeVal) teamSizeVal.innerText = `${team} devs`;
    if (buildsPerDayVal) buildsPerDayVal.innerText = `${builds} builds/day`;
    if (minutesSavedVal) minutesSavedVal.innerText = `${minsSaved} mins`;

    // Monthly math: 21 working days per month
    const totalBuildsPerMonth = team * builds * 21;
    const totalMinutesSaved = totalBuildsPerMonth * minsSaved;
    const totalHoursSaved = Math.round(totalMinutesSaved / 60);
    const hoursPerDev = team > 0 ? Math.round(totalHoursSaved / team) : 0;

    // CI Runner Capacity: Standard 2-vCPU runner baseline (e.g. GitHub Actions ubuntu-latest)
    const vcpuHours = Math.round((totalMinutesSaved * 2) / 60);

    // Environmental Impact: ~15g CO2e per active cloud runner minute
    // Data center grid carbon intensity: ~450-500g CO2e / kWh with cooling PUE
    const totalKgCo2 = Math.round((totalMinutesSaved * 15) / 1000);
    const totalKwh = Math.round(totalKgCo2 * 2); // ~1 kWh per 500g CO2e

    if (hoursSavedResult) {
      hoursSavedResult.innerText = `${totalHoursSaved.toLocaleString()} hrs`;
    }
    if (hoursPerDevResult) {
      hoursPerDevResult.innerText = `≈ ~${hoursPerDev.toLocaleString()} hrs saved / dev / month`;
    }
    if (runnerMinutesResult) {
      runnerMinutesResult.innerText = `${totalMinutesSaved.toLocaleString()} mins`;
    }
    if (vcpuHoursResult) {
      vcpuHoursResult.innerText = `≈ ${vcpuHours.toLocaleString()} vCPU-hrs (2-vCPU runner baseline)`;
    }
    if (co2SavedResult) {
      if (totalKgCo2 >= 1000) {
        co2SavedResult.innerText = `${(totalKgCo2 / 1000).toFixed(1)} t CO₂e`;
      } else {
        co2SavedResult.innerText = `${totalKgCo2.toLocaleString()} kg CO₂e`;
      }
    }
    if (co2EquivalentResult) {
      if (totalKwh >= 1000) {
        co2EquivalentResult.innerText = `≈ ~${(totalKwh / 1000).toFixed(1)} MWh data center energy spared`;
      } else {
        co2EquivalentResult.innerText = `≈ ~${totalKwh.toLocaleString()} kWh data center energy spared`;
      }
    }

    // Debounce URL replacement so dragging sliders is butter-smooth
    if (syncUrl) {
      if (updateUrlTimeout !== null) {
        window.clearTimeout(updateUrlTimeout);
      }
      updateUrlTimeout = window.setTimeout(() => {
        const shareUrl = buildShareUrl(team, builds, minsSaved);
        window.history.replaceState(null, '', shareUrl);
      }, 100);
    }
  }

  // 2. Wire up input listeners
  [teamSizeInput, buildsPerDayInput, minutesSavedInput].forEach((input) => {
    input?.addEventListener('input', () => calculate(true));
  });

  // 3. Share / Copy Link Button at the end of calculator
  if (shareBtn) {
    shareBtn.addEventListener('click', async () => {
      const team = parseInt(teamSizeInput?.value || '20', 10);
      const builds = parseInt(buildsPerDayInput?.value || '8', 10);
      const minsSaved = parseInt(minutesSavedInput?.value || '12', 10);
      const shareUrl = buildShareUrl(team, builds, minsSaved);

      try {
        window.history.replaceState(null, '', shareUrl);
      } catch {
        // ignore
      }

      await copyTextToClipboard(shareUrl);

      // Visual feedback on button
      const textSpan = shareBtn.querySelector<HTMLElement>('.roi-copy-btn-text');
      const linkIcon = shareBtn.querySelector<HTMLElement>('.roi-btn-link-icon');
      const checkIcon = shareBtn.querySelector<HTMLElement>('.roi-btn-check-icon');

      shareBtn.classList.add('copied');
      if (textSpan) textSpan.textContent = 'Link Copied!';
      if (linkIcon) linkIcon.style.display = 'none';
      if (checkIcon) checkIcon.style.display = 'inline-block';

      showCopyToast(`Calculator link (${team} devs, ${minsSaved}m saved) copied!`);

      setTimeout(() => {
        shareBtn.classList.remove('copied');
        if (textSpan) textSpan.textContent = 'Share Calculations';
        if (linkIcon) linkIcon.style.display = 'inline-block';
        if (checkIcon) checkIcon.style.display = 'none';
      }, 2200);
    });
  }

  // Run initial calculation without polluting history if no params in URL
  calculate(Boolean(initialParams.team || initialParams.builds || initialParams.mins));
}
