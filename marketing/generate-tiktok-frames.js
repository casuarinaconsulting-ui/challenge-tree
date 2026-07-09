const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

(async () => {
  const dir = __dirname;
  const outDir = path.join(dir, 'tiktok-frames');
  fs.mkdirSync(outDir, { recursive: true });
  // clear stale frames so renumbering never leaves leftovers from old runs
  for (const f of fs.readdirSync(outDir)) {
    if (/^frame-\d+.*\.png$/i.test(f)) fs.unlinkSync(path.join(outDir, f));
  }
  const fileUrl = 'file:///' + path.join(dir, 'challenge-tre3-tiktok-storyboard.html').replace(/\\/g, '/');

  const browser = await puppeteer.launch({
    headless: 'new',
    protocolTimeout: 240000,
    args: ['--no-sandbox', '--disable-dev-shm-usage'],
  });
  const page = await browser.newPage();
  // keep the viewport buffer small; element screenshots scroll as needed
  await page.setViewport({ width: 800, height: 600, deviceScaleFactor: 8 });
  await page.goto(fileUrl, { waitUntil: 'networkidle0' });
  try { await page.evaluate(() => document.fonts.ready); } catch (e) {}
  await new Promise(r => setTimeout(r, 1500));

  const tiles = await page.$$('.tile');
  let n = 0;
  for (let i = 0; i < tiles.length; i++) {
    const scr = await tiles[i].$('.scr');
    let slug = 'frame';
    try {
      const label = await tiles[i].$eval('.lab', el => el.textContent);
      slug = label.split('·').pop().trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    } catch (e) {}
    const name = `frame-${String(i + 1).padStart(2, '0')}-${slug || 'frame'}.png`;
    await scr.evaluate(el => el.scrollIntoView({ block: 'center' }));
    await new Promise(r => setTimeout(r, 120));
    try {
      await scr.screenshot({ path: path.join(outDir, name) });
    } catch (e) {
      console.log('retrying', name, '-', String(e.message).split('\n')[0]);
      await new Promise(r => setTimeout(r, 1200));
      await scr.screenshot({ path: path.join(outDir, name) });
    }
    n++;
    console.log('saved', name);
  }
  await browser.close();
  console.log('DONE:', n, 'frames in', outDir);
})().catch(e => { console.error('ERROR', e); process.exit(1); });
