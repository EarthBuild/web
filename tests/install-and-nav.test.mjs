import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { createStaticServer } from './helpers/server.mjs';
import { launchBrowser } from './helpers/browser.mjs';

describe('Install Tabs & Mobile Navigation E2E', () => {
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

  it('switches install command tabs (brew -> curl -> nix)', async () => {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(`${server.baseUrl}/`, { waitUntil: 'networkidle0' });

    // Initially Homebrew snippet is shown
    const initialCode = await page.$eval('#installCodeSnippet', (el) => el.textContent.trim());
    assert.ok(initialCode.includes('brew install'), 'Default snippet should be brew install');

    // Click cURL / Shell tab
    const curlTab = await page.$('.install-tab-btn[data-install-type="curl"]');
    assert.ok(curlTab, 'Curl tab should exist');
    await curlTab.click();

    await page.waitForFunction(() => {
      const code = document.getElementById('installCodeSnippet');
      return code && code.textContent.includes('curl');
    });

    const curlCode = await page.$eval('#installCodeSnippet', (el) => el.textContent.trim());
    assert.ok(curlCode.includes('curl -fsSL'), 'Snippet should update to curl command');

    await page.close();
  });

  it('serves /install.sh referenced in install snippets for download', async () => {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(`${server.baseUrl}/`, { waitUntil: 'networkidle0' });

    const curlTab = await page.$('.install-tab-btn[data-install-type="curl"]');
    assert.ok(curlTab, 'Curl tab should exist');
    await curlTab.click();

    const curlCode = await page.$eval('#installCodeSnippet', (el) => el.textContent.trim());
    const urlMatch = curlCode.match(/https:\/\/www\.earthbuild\.dev(\/\S+)/);
    assert.ok(urlMatch, `Expected earthbuild.dev URL in curl snippet, got: ${curlCode}`);

    const scriptPath = urlMatch[1];
    assert.equal(scriptPath, '/install.sh');

    const result = await page.evaluate(async (path) => {
      const res = await fetch(path);
      const body = await res.text();
      return {
        status: res.status,
        ok: res.ok,
        body,
      };
    }, scriptPath);

    assert.equal(result.status, 200, 'Expected HTTP 200 when downloading /install.sh');
    assert.ok(result.ok, 'Response should be ok');
    assert.ok(
      result.body.startsWith('#!/bin/sh\n'),
      'Downloaded install.sh should start with #!/bin/sh shebang',
    );
    assert.ok(
      result.body.includes('GITHUB_REPO="EarthBuild/earthbuild"'),
      'Downloaded install.sh should reference EarthBuild/earthbuild repository',
    );
    assert.ok(
      result.body.includes('BINARY_NAME="earth"'),
      'Downloaded install.sh should install the earth binary',
    );

    await page.close();
  });

  it('toggles mobile navigation drawer on compact viewport', async () => {
    const page = await browser.newPage();
    await page.setViewport({ width: 390, height: 844 });
    await page.goto(`${server.baseUrl}/`, { waitUntil: 'networkidle0' });

    const toggleBtn = await page.$('#mobileMenuToggle');
    assert.ok(toggleBtn, 'Mobile hamburger toggle button should exist');

    // Click toggle to open drawer
    await toggleBtn.click();

    await page.waitForFunction(() => {
      const drawer = document.getElementById('mobileNavDrawer');
      return drawer && drawer.classList.contains('open');
    });

    const isOpen = await page.$eval('#mobileNavDrawer', (el) => el.classList.contains('open'));
    assert.ok(isOpen, 'Mobile drawer should have open class');

    // Click a link inside mobile drawer
    const drawerLink = await page.$('#mobileNavDrawer a');
    assert.ok(drawerLink, 'Link in mobile drawer should exist');
    await drawerLink.click();

    await page.waitForFunction(() => {
      const drawer = document.getElementById('mobileNavDrawer');
      return !drawer || !drawer.classList.contains('open');
    });

    const isClosed = await page.$eval('#mobileNavDrawer', (el) => !el.classList.contains('open'));
    assert.ok(isClosed, 'Mobile drawer should close after link click');

    await page.close();
  });
});
