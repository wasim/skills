// deck.html -> deck.pdf, 16:9, vector text, backgrounds on.
// Drives installed Chrome over CDP. No npm deps.
import { spawn } from 'node:child_process';
import { writeFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const SRC = process.argv[2];
const OUT = process.argv[3];
const PORT = 9333;
const W = 1280, H = 720; // CSS px == 13.333in x 7.5in @96dpi

const profile = mkdtempSync(join(tmpdir(), 'deckpdf-'));
const chrome = spawn(CHROME, [
  '--headless=new',
  `--remote-debugging-port=${PORT}`,
  `--user-data-dir=${profile}`,
  `--window-size=${W},${H}`,
  '--force-device-scale-factor=1',
  '--hide-scrollbars',
  '--no-first-run', '--no-default-browser-check',
  '--allow-file-access-from-files',
  '--disable-lcd-text',
], { stdio: ['ignore', 'ignore', 'pipe'] });

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function wsUrl() {
  for (let i = 0; i < 60; i++) {
    try {
      const r = await fetch(`http://127.0.0.1:${PORT}/json/version`);
      const j = await r.json();
      if (j.webSocketDebuggerUrl) return j.webSocketDebuggerUrl;
    } catch {}
    await sleep(200);
  }
  throw new Error('Chrome did not expose a debugging endpoint');
}

const ws = new WebSocket(await wsUrl());
await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });

let id = 0;
const pending = new Map();
const events = [];
ws.onmessage = e => {
  const m = JSON.parse(e.data);
  if (m.id && pending.has(m.id)) {
    const { res, rej } = pending.get(m.id);
    pending.delete(m.id);
    m.error ? rej(new Error(JSON.stringify(m.error))) : res(m.result);
  } else if (m.method) events.push(m);
};
const send = (method, params = {}, sessionId) =>
  new Promise((res, rej) => {
    const msg = { id: ++id, method, params };
    if (sessionId) msg.sessionId = sessionId;
    pending.set(msg.id, { res, rej });
    ws.send(JSON.stringify(msg));
  });

// attach to a fresh page target
const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true });
const S = (m, p) => send(m, p, sessionId);

await S('Page.enable');
await S('Runtime.enable');
await S('Emulation.setDeviceMetricsOverride', {
  width: W, height: H, deviceScaleFactor: 1, mobile: false,
});

const loaded = (async () => {
  for (let i = 0; i < 150; i++) {
    if (events.some(e => e.method === 'Page.loadEventFired')) return true;
    await sleep(100);
  }
  return false;
})();
await S('Page.navigate', { url: 'file://' + SRC });
await loaded;
await sleep(1200); // let the deck's layout JS settle

// print overrides: exact 16:9 pages, on-screen palette, no orphan blank page
const PRINT_CSS = `
@page { size: ${W}px ${H}px; margin: 0; }
html, body { width:${W}px; background:#faf9f5 !important; }
* { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
@media print {
  .slide {
    width:${W}px !important; height:${H - 1}px !important;
    overflow:hidden !important;
    break-after:page; page-break-after:always;
    break-inside:avoid; page-break-inside:avoid;
  }
  .slide:last-of-type { break-after:auto; page-break-after:auto; }
}
`;

await S('Runtime.evaluate', {
  expression: `(() => {
    const s = document.createElement('style');
    s.id = '__pdf_overrides';
    s.textContent = ${JSON.stringify(PRINT_CSS)};
    document.head.appendChild(s);
    document.querySelectorAll('.fragment').forEach(el => el.classList.add('revealed'));
    document.querySelectorAll('.slide').forEach(el => el.classList.add('active'));
    if (window.deckSync) window.deckSync();
    return document.querySelectorAll('.slide').length;
  })()`,
  returnByValue: true,
}).then(r => console.log('slides:', r.result.value));

await S('Emulation.setEmulatedMedia', { media: 'print' });
await S('Runtime.evaluate', { expression: 'window.deckSync && window.deckSync()' });
await sleep(600);

const { data } = await S('Page.printToPDF', {
  paperWidth: W / 96,
  paperHeight: H / 96,
  marginTop: 0, marginBottom: 0, marginLeft: 0, marginRight: 0,
  printBackground: true,
  preferCSSPageSize: false,
  scale: 1,
  displayHeaderFooter: false,
  transferMode: 'ReturnAsBase64',
});
writeFileSync(OUT, Buffer.from(data, 'base64'));
console.log('wrote', OUT);

ws.close();
chrome.kill();
process.exit(0);
