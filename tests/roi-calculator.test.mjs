import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { createStaticServer } from './helpers/server.mjs';
import { launchBrowser } from './helpers/browser.mjs';

describe('ROI Calculator E2E', () => {
  let server;
  let browser;
  let page;

  before(async () => {
    server = await createStaticServer();
    browser = await launchBrowser();
    page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });
  });

  after(async () => {
    if (page) await page.close();
    if (browser) await browser.close();
    if (server) await server.close();
  });

  it('renders default values and recalculates on input changes', async () => {
    await page.goto(`${server.baseUrl}/#calculator`, { waitUntil: 'networkidle0' });

    const initialHours = await page.$eval('#roiHoursSaved', (el) => el.textContent.trim());
    const initialRunnerMins = await page.$eval('#roiRunnerMinutesSaved', (el) =>
      el.textContent.trim(),
    );
    assert.ok(initialHours.includes('hrs'), 'Hours saved should be displayed');
    assert.ok(initialRunnerMins.includes('mins'), 'Runner minutes saved should be displayed');

    // Change slider values to team=40, builds=15, mins=25
    await page.$eval('#roiTeamSize', (el) => {
      el.value = '40';
      el.dispatchEvent(new Event('input', { bubbles: true }));
    });
    await page.$eval('#roiBuildsPerDay', (el) => {
      el.value = '15';
      el.dispatchEvent(new Event('input', { bubbles: true }));
    });
    await page.$eval('#roiMinutesSaved', (el) => {
      el.value = '25';
      el.dispatchEvent(new Event('input', { bubbles: true }));
    });

    // Wait for DOM update
    await page.waitForFunction(
      (oldHours, oldMins) => {
        const h = document.getElementById('roiHoursSaved')?.textContent?.trim();
        const m = document.getElementById('roiRunnerMinutesSaved')?.textContent?.trim();
        return h !== oldHours && m !== oldMins;
      },
      {},
      initialHours,
      initialRunnerMins,
    );

    const updatedHours = await page.$eval('#roiHoursSaved', (el) => el.textContent.trim());
    const updatedRunnerMins = await page.$eval('#roiRunnerMinutesSaved', (el) =>
      el.textContent.trim(),
    );
    assert.notEqual(updatedHours, initialHours, 'Hours should change');
    assert.notEqual(updatedRunnerMins, initialRunnerMins, 'Runner minutes should change');
  });

  it('populates inputs when navigated with URL query parameters', async () => {
    await page.goto(`${server.baseUrl}/?team=60&builds=10&mins=20#calculator`, {
      waitUntil: 'networkidle0',
    });

    const teamVal = await page.$eval('#roiTeamSize', (el) => el.value);
    const buildsVal = await page.$eval('#roiBuildsPerDay', (el) => el.value);
    const minsVal = await page.$eval('#roiMinutesSaved', (el) => el.value);

    assert.equal(teamVal, '60');
    assert.equal(buildsVal, '10');
    assert.equal(minsVal, '20');
  });

  it('triggers copy and shows toast when clicking Share Calculations', async () => {
    await page.goto(`${server.baseUrl}/#calculator`, { waitUntil: 'networkidle0' });

    // Grant clipboard permissions in browser context
    try {
      const context = browser.defaultBrowserContext();
      await context.overridePermissions(server.baseUrl, ['clipboard-read', 'clipboard-write']);
    } catch {
      // Permission API may vary across headless environments
    }

    await page.click('#roiCopyShareBtn');

    await page.waitForFunction(() => {
      const btn = document.getElementById('roiCopyShareBtn');
      return btn && btn.classList.contains('copied');
    });

    const btnHasCopiedClass = await page.$eval('#roiCopyShareBtn', (el) =>
      el.classList.contains('copied'),
    );
    assert.ok(btnHasCopiedClass, "Share button should have 'copied' class");
  });
});
