import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { createStaticServer } from './helpers/server.mjs';
import { launchBrowser } from './helpers/browser.mjs';

describe('Race Runner 3-Way Terminal E2E', () => {
  let server;
  let browser;
  let page;

  before(async () => {
    server = await createStaticServer();
    browser = await launchBrowser();
    page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(`${server.baseUrl}/#code-explorer`, { waitUntil: 'networkidle0' });
  });

  after(async () => {
    if (page) await page.close();
    if (browser) await browser.close();
    if (server) await server.close();
  });

  it('renders all language tabs in the race runner', async () => {
    const langs = await page.$$eval('#raceLangTabs .race-tab-btn', (els) =>
      els.map((e) => e.dataset.lang),
    );
    assert.deepEqual(langs, ['python', 'js', 'typescript', 'java', 'cpp', 'go', 'rust', 'zig']);
  });

  it('updates metrics and Earthfile preview when switching language tab', async () => {
    // Select Rust
    await page.click('#raceLangTabs .race-tab-btn[data-lang="rust"]');

    await page.waitForFunction(() => {
      const activeTab = document.querySelector('#raceLangTabs .race-tab-btn.active');
      return activeTab && activeTab.getAttribute('data-lang') === 'rust';
    });

    const rustTabActive = await page.$eval('#raceLangTabs .race-tab-btn[data-lang="rust"]', (el) =>
      el.classList.contains('active'),
    );
    assert.ok(rustTabActive, 'Rust tab should be active');

    // Verify Earthfile code preview updates to Rust
    await page.waitForFunction(() => {
      const code = document.getElementById('raceCodePane');
      return code && code.textContent.includes('rust');
    });

    const codeText = await page.$eval('#raceCodePane', (el) => el.textContent);
    assert.ok(codeText.includes('rust:1.85-alpine'), 'Should display Rust Earthfile snippet');
  });

  it('renders the 3 execution windows (clean, incremental, zero-work)', async () => {
    const windows = await page.$$('.cr-feature-card');
    assert.equal(windows.length, 3, 'Should render 3 parallel terminal windows');

    const hasCold = await page.$('#coldWindow');
    const hasEdit = await page.$('#editWindow');
    const hasCached = await page.$('#cachedWindow');
    assert.ok(hasCold && hasEdit && hasCached, 'All three execution windows must exist');
  });
});
