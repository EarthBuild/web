import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { createStaticServer } from './helpers/server.mjs';
import { launchBrowser } from './helpers/browser.mjs';

describe('Heading Anchor Links & Geometry E2E', () => {
  let server;
  let browser;

  before(async () => {
    server = await createStaticServer();
    browser = await launchBrowser();
  });

  after(async () => {
    if (browser) await browser.close();
    if (server) await server.close();
  });

  it('ensures anchor buttons do not overflow on mobile viewport (390px)', async () => {
    const page = await browser.newPage();
    await page.setViewport({ width: 390, height: 844 });
    await page.goto(`${server.baseUrl}/`, { waitUntil: 'networkidle0' });

    const mobileGeom = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('.heading-anchor-btn')).map((b) => {
        const r = b.getBoundingClientRect();
        return {
          href: b.getAttribute('href'),
          right: Math.round(r.x + r.width),
          windowWidth: window.innerWidth,
          isOffscreen: r.x + r.width > window.innerWidth,
        };
      });
    });

    assert.ok(mobileGeom.length >= 7, 'Should have heading anchor buttons across main sections');
    const offscreenButtons = mobileGeom.filter((b) => b.isOffscreen);
    assert.equal(
      offscreenButtons.length,
      0,
      `No buttons should be offscreen on mobile: ${JSON.stringify(offscreenButtons)}`,
    );
    await page.close();
  });

  it('copies URL to clipboard and triggers toast on click', async () => {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(`${server.baseUrl}/`, { waitUntil: 'networkidle0' });

    try {
      const context = browser.defaultBrowserContext();
      await context.overridePermissions(server.baseUrl, ['clipboard-read', 'clipboard-write']);
    } catch {
      // Permission API may vary in headless
    }

    const targetSection = '#problem-solution';
    const btn = await page.$(`a.heading-anchor-btn[href="${targetSection}"]`);
    assert.ok(btn, `Button for ${targetSection} should exist`);

    await btn.click();

    await page.waitForFunction(
      (target) => {
        const b = document.querySelector(`a.heading-anchor-btn[href="${target}"]`);
        const toast = document.getElementById('copyToast');
        return b?.classList.contains('copied') || toast?.classList.contains('show');
      },
      {},
      targetSection,
    );

    const isCopied = await page.$eval(`a.heading-anchor-btn[href="${targetSection}"]`, (el) =>
      el.classList.contains('copied'),
    );
    assert.ok(isCopied, "Button should have 'copied' class after click");

    await page.close();
  });
});
