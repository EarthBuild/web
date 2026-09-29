import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { createStaticServer } from './helpers/server.mjs';
import { launchBrowser } from './helpers/browser.mjs';

describe('Migration Guide & Comparison Tabs E2E', () => {
  let server;
  let browser;
  let page;

  before(async () => {
    server = await createStaticServer();
    browser = await launchBrowser();
    page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(`${server.baseUrl}/#migration`, { waitUntil: 'networkidle0' });
  });

  after(async () => {
    if (page) await page.close();
    if (browser) await browser.close();
    if (server) await server.close();
  });

  it('renders migration section with all language and tool tabs', async () => {
    const langTabs = await page.$$eval('#migLangTabs .race-tab-btn', (els) =>
      els.map((e) => e.dataset.lang),
    );
    assert.deepEqual(langTabs, ['python', 'js', 'typescript', 'java', 'cpp', 'go', 'rust', 'zig']);

    const toolTabs = await page.$$eval('.migration-tab-btn', (els) =>
      els.map((e) => e.dataset.target),
    );
    assert.deepEqual(toolTabs, [
      'mig-dockerfile',
      'mig-bake',
      'mig-makefile',
      'mig-dagger',
      'mig-gha',
    ]);
  });

  it('updates title and code when selecting Rust + From Dagger', async () => {
    // Select Rust
    await page.click('#migLangTabs .race-tab-btn[data-lang="rust"]');
    // Select Dagger tool tab
    await page.click('.migration-tab-btn[data-target="mig-dagger"]');

    await page.waitForFunction(() => {
      const title = document.querySelector('#mig-dagger .mig-legacy-title');
      return title && title.textContent.includes('Dagger (Go SDK)');
    });

    const legacyTitle = await page.$eval('#mig-dagger .mig-legacy-title', (el) =>
      el.textContent.trim(),
    );
    const legacyCode = await page.$eval('#mig-dagger .mig-legacy-code', (el) => el.textContent);
    const earthfileCode = await page.$eval(
      '#mig-dagger .mig-earthfile-code',
      (el) => el.textContent,
    );

    assert.equal(legacyTitle, 'Dagger (Go SDK)');
    assert.ok(legacyCode.includes('cargo'), 'Dagger code should orchestrate cargo');
    assert.ok(legacyCode.includes('rust:1.85-alpine3.24'), 'Should pin rust:1.85-alpine3.24');
    assert.ok(legacyCode.includes('Test('), 'Should expose Test target');
    assert.ok(legacyCode.includes('Build('), 'Should expose Build target');
    assert.ok(legacyCode.includes('Publish('), 'Should expose Publish target');
    assert.ok(earthfileCode.includes('VERSION 0.8'), 'Earthfile should use VERSION 0.8');
    assert.ok(
      earthfileCode.includes('rust:1.85-alpine3.24'),
      'Earthfile should pin rust:1.85-alpine3.24',
    );
  });

  it('updates title when selecting Zig + From Dagger', async () => {
    await page.click('#migLangTabs .race-tab-btn[data-lang="zig"]');

    await page.waitForFunction(() => {
      const title = document.querySelector('#mig-dagger .mig-legacy-title');
      return title && title.textContent.includes('Zig');
    });

    const legacyTitle = await page.$eval('#mig-dagger .mig-legacy-title', (el) =>
      el.textContent.trim(),
    );
    assert.ok(legacyTitle.includes('No Native Zig SDK'), 'Should note absence of native Zig SDK');
  });

  it('supports multi-file tab switching in Docker Bake', async () => {
    await page.click('#migLangTabs .race-tab-btn[data-lang="go"]');
    await page.click('.migration-tab-btn[data-target="mig-bake"]');

    // Wait for multi-file tab container to become visible
    await page.waitForSelector('#mig-bake .mig-legacy-file-tabs .window-file-tab-btn');

    const fileTabs = await page.$$eval(
      '#mig-bake .mig-legacy-file-tabs .window-file-tab-btn',
      (els) => els.map((e) => e.textContent.trim()),
    );
    assert.ok(fileTabs.length >= 2, 'Should have at least 2 file tabs');
    assert.ok(fileTabs.includes('docker-bake.hcl'), 'Should include docker-bake.hcl');
    assert.ok(fileTabs.includes('Dockerfile'), 'Should include Dockerfile');

    // Initially docker-bake.hcl is active
    let activeCode = await page.$eval('#mig-bake .mig-legacy-code', (el) => el.textContent);
    assert.ok(
      activeCode.includes('target') || activeCode.includes('group'),
      'Should show HCL code',
    );

    // Click the second file tab (Dockerfile)
    const secondTab = (await page.$$('#mig-bake .mig-legacy-file-tabs .window-file-tab-btn'))[1];
    await secondTab.click();

    await page.waitForFunction(() => {
      const code = document.querySelector('#mig-bake .mig-legacy-code');
      return code && code.textContent.includes('FROM');
    });

    activeCode = await page.$eval('#mig-bake .mig-legacy-code', (el) => el.textContent);
    assert.ok(activeCode.includes('FROM'), 'Switched code should show Dockerfile');
  });
});
