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

    assert.ok(mobileGeom.length >= 5, 'Should have heading anchor buttons across main sections');
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

  it('animates title text shimmer gradients and respects prefers-reduced-motion', async () => {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'no-preference' }]);
    await page.goto(`${server.baseUrl}/`, { waitUntil: 'networkidle0' });

    const initial = await page.evaluate(() => {
      const textEls = Array.from(document.querySelectorAll('.hero-text-shimmer'));
      const accentEls = Array.from(document.querySelectorAll('.hero-accent-shimmer'));
      const inspect = (el) => {
        const cs = window.getComputedStyle(el);
        const anims = el.getAnimations();
        return {
          animationName: cs.animationName,
          animationPlayState: cs.animationPlayState,
          backgroundSize: cs.backgroundSize,
          backgroundClip: cs.backgroundClip || cs.webkitBackgroundClip,
          activeAnimations: anims.map((a) => ({
            name: a.animationName,
            playState: a.playState,
          })),
          bgPosX: cs.backgroundPositionX,
        };
      };
      return {
        textCount: textEls.length,
        accentCount: accentEls.length,
        heroText: inspect(textEls[0]),
        heroAccent: inspect(accentEls[0]),
      };
    });

    assert.ok(initial.textCount >= 6, 'Should have .hero-text-shimmer spans across titles');
    assert.ok(initial.accentCount >= 6, 'Should have .hero-accent-shimmer spans across titles');

    for (const [label, state] of [
      ['heroText', initial.heroText],
      ['heroAccent', initial.heroAccent],
    ]) {
      assert.equal(state.animationName, 'textShimmer', `${label} should use textShimmer animation`);
      assert.equal(state.animationPlayState, 'running', `${label} animation should be running`);
      assert.equal(
        state.backgroundSize,
        '200% auto',
        `${label} should have 200% auto background-size`,
      );
      assert.equal(state.backgroundClip, 'text', `${label} should clip background to text`);
      assert.equal(state.activeAnimations.length, 1, `${label} should have 1 active Web Animation`);
      assert.equal(state.activeAnimations[0].playState, 'running');
    }

    // Advance the animation timeline and verify computed background-position changes
    const progressed = await page.evaluate(() => {
      const textEl = document.querySelector('.hero-text-shimmer');
      const accentEl = document.querySelector('.hero-accent-shimmer');
      const textAnim = textEl.getAnimations()[0];
      const accentAnim = accentEl.getAnimations()[0];
      textAnim.currentTime = 2000;
      accentAnim.currentTime = 1500;
      return {
        textBgPosX: window.getComputedStyle(textEl).backgroundPositionX,
        accentBgPosX: window.getComputedStyle(accentEl).backgroundPositionX,
      };
    });

    assert.notEqual(
      progressed.textBgPosX,
      initial.heroText.bgPosX,
      'Hero text backgroundPositionX should change as animation progresses',
    );
    assert.notEqual(
      progressed.accentBgPosX,
      initial.heroAccent.bgPosX,
      'Hero accent backgroundPositionX should change as animation progresses',
    );

    // Emulate prefers-reduced-motion: reduce and verify animation is disabled
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
    const reduced = await page.evaluate(() => {
      const el = document.querySelector('.hero-text-shimmer');
      const cs = window.getComputedStyle(el);
      return {
        animationName: cs.animationName,
        animationsCount: el.getAnimations().length,
      };
    });

    assert.equal(
      reduced.animationName,
      'none',
      'Animation should be disabled under reduced motion',
    );
    assert.equal(reduced.animationsCount, 0, 'No active animations under reduced motion');

    await page.close();
  });
});
