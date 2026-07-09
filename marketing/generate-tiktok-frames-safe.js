const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

(async () => {
  const dir = __dirname;
  const outDir = path.join(dir, 'tiktok-frames-1080x1920');
  fs.mkdirSync(outDir, { recursive: true });
  for (const f of fs.readdirSync(outDir)) {
    if (/^frame-\d+.*\.png$/i.test(f)) fs.unlinkSync(path.join(outDir, f));
  }
  const fileUrl = 'file:///' + path.join(dir, 'challenge-tre3-tiktok-storyboard.html').replace(/\\/g, '/');

  const browser = await puppeteer.launch({
    headless: 'new',
    protocolTimeout: 240000,
    args: ['--no-sandbox', '--disable-dev-shm-usage'],
  });

  // pass 1: capture each mock screen at high resolution
  const page = await browser.newPage();
  await page.setViewport({ width: 800, height: 600, deviceScaleFactor: 8 });
  await page.goto(fileUrl, { waitUntil: 'networkidle0' });
  try { await page.evaluate(() => document.fonts.ready); } catch (e) {}
  await new Promise(r => setTimeout(r, 1500));

  const tiles = await page.$$('.tile');
  const shots = [];
  for (let i = 0; i < tiles.length; i++) {
    const scr = await tiles[i].$('.scr');
    let slug = 'frame';
    try {
      const label = await tiles[i].$eval('.lab', el => el.textContent);
      slug = label.split('·').pop().trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    } catch (e) {}
    await scr.evaluate(el => el.scrollIntoView({ block: 'center' }));
    await new Promise(r => setTimeout(r, 120));
    let b64;
    try {
      b64 = await scr.screenshot({ encoding: 'base64' });
    } catch (e) {
      console.log('retrying capture', slug, '-', String(e.message).split('\n')[0]);
      await new Promise(r => setTimeout(r, 1200));
      b64 = await scr.screenshot({ encoding: 'base64' });
    }
    shots.push({ slug, b64 });
    console.log('captured', i + 1, slug);
  }
  await page.close();

  // pass 2: composite onto a 1080x1920 canvas inside TikTok safe zones
  // safe margins (1080x1920 basis): top 240 (Following/For You tabs),
  // bottom 360 (caption + music), right rail cleared by centering at x=500
  const comp = await browser.newPage();
  await comp.setViewport({ width: 1080, height: 1920, deviceScaleFactor: 2 });
  let n = 0;
  for (let i = 0; i < shots.length; i++) {
    const { slug, b64 } = shots[i];
    const html = `<!doctype html><html><head><meta charset="utf-8"><style>
      * { margin:0; padding:0 }
      body { width:1080px; height:1920px; position:relative; overflow:hidden;
             background: linear-gradient(168deg, #1f4a37 0%, #0c261a 100%); }
      #glow  { position:absolute; top:-140px; right:-140px; width:520px; height:520px; border-radius:50%;
               background: radial-gradient(circle, rgba(200,149,42,0.22), transparent 70%); }
      #glow2 { position:absolute; bottom:-160px; left:-160px; width:560px; height:560px; border-radius:50%;
               background: radial-gradient(circle, rgba(82,183,136,0.16), transparent 70%); }
      #card { position:absolute; left:125px; top:240px; width:750px; height:1320px;
              border-radius:70px; overflow:hidden;
              box-shadow: 0 48px 110px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.06); }
      #card img { width:100%; height:100%; display:block }
    </style></head><body>
      <div id="glow"></div><div id="glow2"></div>
      <div id="card"><img src="data:image/png;base64,${b64}"></div>
    </body></html>`;
    await comp.setContent(html, { waitUntil: 'load' });
    await new Promise(r => setTimeout(r, 150));
    const name = `frame-${String(i + 1).padStart(2, '0')}-${slug || 'frame'}.png`;
    try {
      await comp.screenshot({ path: path.join(outDir, name) });
    } catch (e) {
      console.log('retrying composite', name, '-', String(e.message).split('\n')[0]);
      await new Promise(r => setTimeout(r, 1200));
      await comp.screenshot({ path: path.join(outDir, name) });
    }
    n++;
    console.log('saved', name);
  }
  await browser.close();
  console.log('DONE:', n, 'safe frames in', outDir);
})().catch(e => { console.error('ERROR', e); process.exit(1); });
