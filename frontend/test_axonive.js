import { chromium } from 'playwright';

(async () => {
  console.log('Starting Playwright validation...');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  // Set viewport size
  await page.setViewportSize({ width: 1440, height: 900 });

  // Listen to page events
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));

  try {
    console.log('Navigating to http://localhost:5173/axonive ...');
    await page.goto('http://localhost:5173/axonive');
    await page.waitForTimeout(3000);
    
    // Take a screenshot of the initial page state
    await page.screenshot({ path: 'C:/Users/dabdi/.gemini/antigravity/brain/85178619-7c21-412e-86ed-cd48b957fa00/screenshot_initial.png' });
    console.log('Initial page screenshot taken.');

    // Click "Load Sample Brain"
    console.log('Clicking "Load Sample Brain" button...');
    const loadBtn = page.getByRole('button', { name: 'Load Sample Brain' }).first();
    await loadBtn.click();
    
    // Wait for the brain to segment and load
    console.log('Waiting for segmentation and 3D mesh...');
    await page.waitForTimeout(6000);
    
    // Take a screenshot of the loaded brain
    await page.screenshot({ path: 'C:/Users/dabdi/.gemini/antigravity/brain/85178619-7c21-412e-86ed-cd48b957fa00/screenshot_loaded_brain.png' });
    console.log('Loaded brain screenshot taken.');

    // Verify Brain Structures list is visible
    const structuresHeader = page.locator('text=Brain Structures');
    const isStructuresVisible = await structuresHeader.isVisible();
    console.log('Brain Structures list header is visible:', isStructuresVisible);

    // Verify first structure is present
    const firstStructureText = 'Left Thalamus';
    const firstStructure = page.locator(`text=${firstStructureText}`);
    const isFirstStructureVisible = await firstStructure.isVisible();
    console.log('First structure is visible in checklist:', isFirstStructureVisible);

    // Print unique labels on the frontend
    const labelsInfo = await page.evaluate(() => {
      const labels = window.debugMeshData.labels || [];
      const counts = {};
      labels.forEach(l => counts[l] = (counts[l] || 0) + 1);
      return counts;
    });
    console.log('Frontend labels counts:', labelsInfo);

    // Select the first structure (click it) to highlight it in Orange
    console.log('Clicking first structure to select it...');
    await firstStructure.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'C:/Users/dabdi/.gemini/antigravity/brain/85178619-7c21-412e-86ed-cd48b957fa00/screenshot_selected_structure.png' });
    console.log('Selected structure screenshot taken.');

    // Click "Remove Tumor & Simulate"
    console.log('Clicking "Remove Tumor & Simulate" button...');
    const simulateBtn = page.getByRole('button', { name: 'Remove Tumor & Simulate' }).first();
    await simulateBtn.click();
    
    // Wait for simulation to complete and render the heatmap
    console.log('Waiting for biomechanical simulation...');
    await page.waitForTimeout(7000);
    
    // Take a screenshot of the simulated results with heatmap
    await page.screenshot({ path: 'C:/Users/dabdi/.gemini/antigravity/brain/85178619-7c21-412e-86ed-cd48b957fa00/screenshot_simulated_heatmap.png' });
    console.log('Simulated heatmap screenshot taken.');
    
    // Verify metrics are visible
    const metricsHeader = page.locator('text=Simulation Metrics');
    const isMetricsVisible = await metricsHeader.isVisible();
    console.log('Simulation Metrics header is visible:', isMetricsVisible);

    // Click "Show Comparison" to view side-by-side comparison
    console.log('Clicking "Show Comparison" button...');
    const comparisonBtn = page.getByRole('button', { name: 'Show Comparison' }).first();
    await comparisonBtn.click();
    await page.waitForTimeout(2000);
    
    // Take a screenshot of the side-by-side comparison
    await page.screenshot({ path: 'C:/Users/dabdi/.gemini/antigravity/brain/85178619-7c21-412e-86ed-cd48b957fa00/screenshot_comparison.png' });
    console.log('Comparison screenshot taken.');

  } catch (err) {
    console.error('Test execution failed:', err);
  } finally {
    await browser.close();
    console.log('Playwright browser closed.');
  }
})();
