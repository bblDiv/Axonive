import { chromium } from 'playwright';
import path from 'path';

(async () => {
  console.log("Launching browser...");
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  // Set viewport size for high-res screenshots
  await page.setViewportSize({ width: 1440, height: 900 });
  
  // Log page console errors and logs
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));
  
  const url = 'http://localhost:5173/axonive';
  console.log(`Navigating to ${url}...`);
  await page.goto(url);
  await page.waitForTimeout(3000); // Wait for page assets and animation paths
  
  console.log("Clicking 'Load Sample Brain'...");
  const loadButton = page.locator('button:has-text("Load Sample Brain")').first();
  await loadButton.click();
  
  console.log("Waiting for brain mesh to load and render...");
  await page.waitForTimeout(4000); // Allow time for loading, decimation/cache and Three.js render
  
  const loadedScreenshotPath = 'C:\\Users\\dabdi\\.gemini\\antigravity\\brain\\85178619-7c21-412e-86ed-cd48b957fa00\\screenshot_loaded.png';
  console.log(`Taking screenshot of loaded brain: ${loadedScreenshotPath}`);
  await page.screenshot({ path: loadedScreenshotPath });
  
  console.log("Clicking 'Remove Tumor & Simulate'...");
  const simulateButton = page.locator('button:has-text("Remove Tumor & Simulate")').first();
  await simulateButton.click();
  
  console.log("Waiting for FEA simulation & Gemini insights...");
  await page.waitForTimeout(5000); // Allow time for simulation deformation and Gemini API call
  
  const simulatedScreenshotPath = 'C:\\Users\\dabdi\\.gemini\\antigravity\\brain\\85178619-7c21-412e-86ed-cd48b957fa00\\screenshot_simulated.png';
  console.log(`Taking screenshot of simulated result: ${simulatedScreenshotPath}`);
  await page.screenshot({ path: simulatedScreenshotPath });
  
  await browser.close();
  console.log("Playwright run finished successfully!");
})();
