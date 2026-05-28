import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto('http://localhost:5173/axonive');
  await page.waitForTimeout(1000);
  
  console.log('Clicking "Load Sample Brain"...');
  await page.click('button:has-text("Load Sample Brain")');
  await page.waitForTimeout(3000);
  
  const stats = await page.evaluate(() => {
    const data = window.debugMeshData;
    if (!data) return { error: 'No meshData exposed on window.debugMeshData' };
    
    const verts = data.vertices || [];
    const faces = data.faces || [];
    
    let minX = Infinity, maxX = -Infinity;
    let minY = Infinity, maxY = -Infinity;
    let minZ = Infinity, maxZ = -Infinity;
    
    verts.forEach(v => {
      if (v[0] < minX) minX = v[0];
      if (v[0] > maxX) maxX = v[0];
      if (v[1] < minY) minY = v[1];
      if (v[1] > maxY) maxY = v[1];
      if (v[2] < minZ) minZ = v[2];
      if (v[2] > maxZ) maxZ = v[2];
    });
    
    let minIdx = Infinity, maxIdx = -Infinity;
    faces.forEach(f => {
      f.forEach(idx => {
        if (idx < minIdx) minIdx = idx;
        if (idx > maxIdx) maxIdx = idx;
      });
    });
    
    return {
      verticesCount: verts.length,
      facesCount: faces.length,
      bounds: { minX, maxX, minY, maxY, minZ, maxZ },
      faceIndexBounds: { minIdx, maxIdx },
      firstVertices: verts.slice(0, 5),
      firstFaces: faces.slice(0, 5),
    };
  });
  
  console.log('MESH STATS:', JSON.stringify(stats, null, 2));
  await browser.close();
})();
