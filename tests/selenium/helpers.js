const fs = require('fs');
const http = require('http');
const path = require('path');
const { spawn } = require('child_process');
const { Builder, By, until, Key } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

const repoRoot = path.resolve(__dirname, '..', '..');
const port = process.env.PORT || '3000';
const baseUrl = process.env.APP_URL || `http://127.0.0.1:${port}`;

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForApp(url = `${baseUrl}/login`, timeoutMs = 60000) {
  const startedAt = Date.now();

  while (Date.now() - startedAt < timeoutMs) {
    const isReady = await new Promise((resolve) => {
      const request = http.get(url, (response) => {
        response.resume();
        resolve(response.statusCode < 500);
      });

      request.on('error', () => resolve(false));
      request.setTimeout(2000, () => {
        request.destroy();
        resolve(false);
      });
    });

    if (isReady) {
      return;
    }

    await delay(1000);
  }

  throw new Error(`Aplicacao nao respondeu em ${url}`);
}

async function startApp() {
  if (process.env.START_APP === 'false' || process.env.APP_URL) {
    await waitForApp();
    return null;
  }

  const nextBin = path.join(repoRoot, 'node_modules', 'next', 'dist', 'bin', 'next');
  const child = spawn(process.execPath, [nextBin, 'dev', '-p', port], {
    cwd: repoRoot,
    env: {
      ...process.env,
      BROWSER: 'none',
      NEXT_TELEMETRY_DISABLED: '1',
    },
    shell: false,
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  child.stdout.on('data', (chunk) => process.stdout.write(`[next] ${chunk}`));
  child.stderr.on('data', (chunk) => process.stderr.write(`[next] ${chunk}`));

  await waitForApp();
  return child;
}

async function stopApp(child) {
  if (!child) {
    return;
  }

  child.kill('SIGTERM');
  await delay(1000);
}

function findChromeBinary() {
  const candidates = [
    process.env.CHROME_BIN,
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  ].filter(Boolean);

  return candidates.find((candidate) => fs.existsSync(candidate));
}

async function createDriver() {
  const options = new chrome.Options();
  const chromeBinary = findChromeBinary();

  if (chromeBinary) {
    options.setChromeBinaryPath(chromeBinary);
  }

  if (process.env.HEADLESS !== 'false') {
    options.addArguments('--headless=new');
  }

  options.addArguments(
    '--window-size=1366,900',
    '--disable-gpu',
    '--no-sandbox',
    '--disable-dev-shm-usage'
  );

  const driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();

  await driver.manage().setTimeouts({
    implicit: 2000,
    pageLoad: 30000,
    script: 10000,
  });

  return driver;
}

async function takeScreenshot(driver, folder, name) {
  fs.mkdirSync(folder, { recursive: true });
  const fileName = `${name.replace(/[^a-z0-9_-]/gi, '_')}.png`;
  const filePath = path.join(folder, fileName);
  const image = await driver.takeScreenshot();
  fs.writeFileSync(filePath, image, 'base64');
  return filePath;
}

async function waitVisible(driver, locator, timeoutMs = 20000) {
  const element = await driver.wait(until.elementLocated(locator), timeoutMs);
  await driver.wait(until.elementIsVisible(element), timeoutMs);
  return element;
}

async function waitForPageReady(driver) {
  await driver.wait(async () => {
    return driver.executeScript('return document.readyState === "complete"');
  }, 10000);
  await delay(500);
}

async function setInputValue(driver, element, value) {
  await driver.executeScript(`
    const element = arguments[0];
    const value = arguments[1];
    const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
    setter.call(element, value);
    element.dispatchEvent(new Event('input', { bubbles: true }));
    element.dispatchEvent(new Event('change', { bubbles: true }));
  `, element, value);
}

module.exports = {
  By,
  Key,
  until,
  baseUrl,
  createDriver,
  repoRoot,
  setInputValue,
  startApp,
  stopApp,
  takeScreenshot,
  waitForPageReady,
  waitVisible,
};
