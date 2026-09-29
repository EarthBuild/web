import puppeteer from 'puppeteer-core';
import fs from 'node:fs';

export function findChromePath() {
  if (process.env.CHROME_PATH && fs.existsSync(process.env.CHROME_PATH)) {
    return process.env.CHROME_PATH;
  }

  const macPaths = [
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Chromium.app/Contents/MacOS/Chromium',
  ];
  for (const p of macPaths) {
    if (fs.existsSync(p)) return p;
  }

  const linuxPaths = [
    '/usr/bin/chromium-browser',
    '/usr/bin/chromium',
    '/usr/bin/google-chrome-stable',
    '/usr/bin/google-chrome',
  ];
  for (const p of linuxPaths) {
    if (fs.existsSync(p)) return p;
  }

  throw new Error(
    'Could not find a Chrome or Chromium executable. Set the CHROME_PATH environment variable.',
  );
}

export async function launchBrowser() {
  const executablePath = findChromePath();
  return puppeteer.launch({
    headless: true,
    executablePath,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
  });
}
