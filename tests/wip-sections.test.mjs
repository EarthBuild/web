import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { createStaticServer } from './helpers/server.mjs';
import { launchBrowser } from './helpers/browser.mjs';

describe('WIP / Under-Construction Build Packaging E2E', () => {
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

  it('completely excludes comparison, testimonials, and migration from production build', async () => {
    const page = await browser.newPage();
    await page.goto(`${server.baseUrl}/`, { waitUntil: 'networkidle0' });

    const comparisonExists = await page.evaluate(() =>
      Boolean(document.getElementById('comparison')),
    );
    const testimonialsExists = await page.evaluate(() =>
      Boolean(document.getElementById('testimonials')),
    );
    const migrationExists = await page.evaluate(() =>
      Boolean(document.getElementById('migration')),
    );
    const footerCompareExists = await page.evaluate(() =>
      Boolean(document.querySelector('li[data-wip-section="comparison"]')),
    );
    const toastExists = await page.evaluate(() =>
      Boolean(document.getElementById('wipPreviewToast')),
    );
    const endBannerExists = await page.evaluate(() =>
      Boolean(document.querySelector('.under-construction-end-banner')),
    );

    assert.equal(
      comparisonExists,
      false,
      'Comparison section must NOT be packaged in production build',
    );
    assert.equal(
      testimonialsExists,
      false,
      'Testimonials section must NOT be packaged in production build',
    );
    assert.equal(
      migrationExists,
      false,
      'Migration section must NOT be packaged in production build',
    );
    assert.equal(
      footerCompareExists,
      false,
      'Footer comparison link must NOT be packaged in production build',
    );
    assert.equal(toastExists, false, 'Preview toast should not exist in production build');
    assert.equal(
      endBannerExists,
      false,
      'End banners should not exist when sections are excluded from production build',
    );

    await page.close();
  });

  it('does not reveal excluded sections in production even if query params are passed', async () => {
    const page = await browser.newPage();
    await page.goto(`${server.baseUrl}/?preview=all#comparison`, { waitUntil: 'networkidle0' });

    const comparisonExists = await page.evaluate(() =>
      Boolean(document.getElementById('comparison')),
    );
    const testimonialsExists = await page.evaluate(() =>
      Boolean(document.getElementById('testimonials')),
    );
    const migrationExists = await page.evaluate(() =>
      Boolean(document.getElementById('migration')),
    );

    assert.equal(
      comparisonExists,
      false,
      'Query param should not expose comparison when excluded from production HTML',
    );
    assert.equal(
      testimonialsExists,
      false,
      'Query param should not expose testimonials when excluded from production HTML',
    );
    assert.equal(
      migrationExists,
      false,
      'Query param should not expose migration when excluded from production HTML',
    );

    await page.close();
  });
});
