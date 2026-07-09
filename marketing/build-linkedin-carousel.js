const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

(async () => {
  const dir = __dirname;
  const outDir = path.join(dir, 'linkedin-carousel-slides');
  fs.mkdirSync(outDir, { recursive: true });
  for (const f of fs.readdirSync(outDir)) {
    if (/^slide-\d+\.png$/i.test(f)) fs.unlinkSync(path.join(outDir, f));
  }
  const fileUrl = 'file:///' + path.join(dir, 'challenge-tre3-linkedin-carousel.html').replace(/\\/g, '/');
  const pdfPath = path.join(dir, 'challenge-tre3-linkedin-carousel.pdf');

  const browser = await puppeteer.launch({
    headless: 'new',
    protocolTimeout: 240000,
    args: ['--no-sandbox', '--disable-dev-shm-usage'],
  });

  // pass 0: caption-free phone shots from the storyboard (the TikTok caption
  // bands duplicate the slide headlines, so hide them for the carousel)
  const phonesDir = path.join(outDir, 'phones');
  fs.mkdirSync(phonesDir, { recursive: true });
  {
    const sb = await browser.newPage();
    await sb.setViewport({ width: 800, height: 600, deviceScaleFactor: 8 });
    await sb.goto('file:///' + path.join(dir, 'challenge-tre3-tiktok-storyboard.html').replace(/\\/g, '/'), { waitUntil: 'networkidle0' });
    await sb.addStyleTag({ content: '.anno{display:none!important}' });
    try { await sb.evaluate(() => document.fonts.ready); } catch (e) {}
    await new Promise(r => setTimeout(r, 1500));
    const tiles = await sb.$$('.tile');
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
        await scr.screenshot({ path: path.join(phonesDir, name) });
      } catch (e) {
        await new Promise(r => setTimeout(r, 1200));
        await scr.screenshot({ path: path.join(phonesDir, name) });
      }
    }
    await sb.close();
    console.log('captured caption-free phones in', phonesDir);
  }

  const page = await browser.newPage();
  await page.setViewport({ width: 1080, height: 1080, deviceScaleFactor: 2 });
  await page.goto(fileUrl, { waitUntil: 'networkidle0' });
  try { await page.evaluate(() => document.fonts.ready); } catch (e) {}
  await new Promise(r => setTimeout(r, 1500));

  // per-slide PNGs for review
  const slides = await page.$$('.slide');
  for (let i = 0; i < slides.length; i++) {
    await slides[i].evaluate(el => el.scrollIntoView({ block: 'center' }));
    await new Promise(r => setTimeout(r, 120));
    const name = `slide-${String(i + 1).padStart(2, '0')}.png`;
    try {
      await slides[i].screenshot({ path: path.join(outDir, name) });
    } catch (e) {
      console.log('retrying', name, '-', String(e.message).split('\n')[0]);
      await new Promise(r => setTimeout(r, 1200));
      await slides[i].screenshot({ path: path.join(outDir, name) });
    }
    console.log('saved', name);
  }

  // the PDF LinkedIn actually takes (one 1080x1080 page per slide)
  await page.emulateMediaType('screen');
  await page.pdf({
    path: pdfPath,
    width: '1080px',
    height: '1080px',
    printBackground: true,
    margin: { top: '0', right: '0', bottom: '0', left: '0' },
  });

  await browser.close();
  console.log('DONE:', slides.length, 'slides ·', pdfPath);
})().catch(e => { console.error('ERROR', e); process.exit(1); });
