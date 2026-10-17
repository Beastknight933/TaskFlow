import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const SCREENSHOT_DIR = path.resolve('./screenshots');
if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

async function capture() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 850 });

  console.log('Navigating to TaskFlow preview at http://localhost:4173/...');
  await page.goto('http://localhost:4173/', { waitUntil: 'networkidle0' });

  // 1. Click "Load Demo Tasks" using page.evaluate
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const demoBtn = buttons.find((b) => b.textContent.includes('Load Demo Tasks'));
    if (demoBtn) demoBtn.click();
  });
  await new Promise((r) => setTimeout(r, 800));

  // 1. Dashboard Screenshot
  console.log('Capturing 01-dashboard.png...');
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '01-dashboard.png') });

  // 2. Task List Screenshot
  console.log('Capturing 02-task-list.png...');
  await page.evaluate(() => {
    const navItems = Array.from(document.querySelectorAll('.nav-item'));
    const tasksNav = navItems.find((n) => n.textContent.includes('All Tasks'));
    if (tasksNav) tasksNav.click();
  });
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '02-task-list.png') });

  // 3. Search and Filter Screenshot
  console.log('Capturing 03-search-filter.png...');
  await page.type('.toolbar-search input', 'Architecture');
  await new Promise((r) => setTimeout(r, 600));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '03-search-filter.png') });

  // Clear search
  await page.evaluate(() => {
    const clearBtn = document.querySelector('.toolbar-search .header-search-clear');
    if (clearBtn) clearBtn.click();
  });
  await new Promise((r) => setTimeout(r, 400));

  // 4. Task Creation Modal Screenshot
  console.log('Capturing 04-task-modal.png...');
  await page.evaluate(() => {
    const newBtn = Array.from(document.querySelectorAll('button')).find((b) =>
      b.textContent.includes('New Task')
    );
    if (newBtn) newBtn.click();
  });
  await new Promise((r) => setTimeout(r, 600));
  await page.type('#task-form-title', 'Implement Prometheus Observability Exporter');
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '04-task-modal.png') });

  // Close modal
  await page.evaluate(() => {
    const cancelBtn = Array.from(document.querySelectorAll('.modal-footer button')).find((b) =>
      b.textContent.includes('Cancel')
    );
    if (cancelBtn) cancelBtn.click();
  });
  await new Promise((r) => setTimeout(r, 400));

  // 5. Settings View Screenshot
  console.log('Capturing 06-settings-view.png...');
  await page.evaluate(() => {
    const settingsNav = Array.from(document.querySelectorAll('.nav-item')).find((n) =>
      n.textContent.includes('Settings')
    );
    if (settingsNav) settingsNav.click();
  });
  await new Promise((r) => setTimeout(r, 600));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '06-settings-view.png') });

  // 6. Mobile View Screenshot (iPhone 14 / modern viewport)
  console.log('Capturing 05-mobile-view.png...');
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.evaluate(() => {
    const dashNav = Array.from(document.querySelectorAll('.nav-item')).find((n) =>
      n.textContent.includes('Dashboard')
    );
    if (dashNav) dashNav.click();
  });
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '05-mobile-view.png') });

  await browser.close();
  console.log('All screenshots captured successfully in ./screenshots!');
}

capture().catch((err) => {
  console.error('Error capturing screenshots:', err);
  process.exit(1);
});
