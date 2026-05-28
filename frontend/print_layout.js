import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:5173/axonive');
  await page.waitForTimeout(1000);
  const html = await page.evaluate(() => document.getElementById('root').innerHTML);
  console.log(html);
  await browser.close();
})();
