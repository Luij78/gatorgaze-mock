import { spawn } from "node:child_process";
import { writeFileSync } from "node:fs";

const PORT = 9333;
const chrome = spawn("google-chrome", [
  "--headless=new",
  "--no-sandbox",
  "--disable-gpu",
  "--hide-scrollbars",
  `--remote-debugging-port=${PORT}`,
  "--user-data-dir=/tmp/chrome-walk",
  "--window-size=1280,900"
], { stdio: "ignore" });

function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }

async function waitFor(url) {
  for (let i = 0; i < 40; i++) {
    try {
      const res = await fetch(url);
      if (res.ok) return;
    } catch (err) {}
    await sleep(150);
  }
  throw new Error("chrome did not start");
}

let id = 0;
function cdp(ws) {
  const pending = new Map();
  ws.addEventListener("message", (ev) => {
    const msg = JSON.parse(ev.data);
    if (msg.id && pending.has(msg.id)) {
      const { resolve, reject } = pending.get(msg.id);
      pending.delete(msg.id);
      if (msg.error) reject(new Error(JSON.stringify(msg.error)));
      else resolve(msg.result);
    }
  });
  return function send(method, params = {}) {
    const msgId = ++id;
    ws.send(JSON.stringify({ id: msgId, method, params }));
    return new Promise((resolve, reject) => pending.set(msgId, { resolve, reject }));
  };
}

async function main() {
  await waitFor(`http://127.0.0.1:${PORT}/json/version`);
  const created = await fetch(`http://127.0.0.1:${PORT}/json/new?http://127.0.0.1:4173/order/index.html?active_step=1`, { method: "PUT" });
  let target = await created.json();
  if (!target.webSocketDebuggerUrl) {
    const list = await fetch(`http://127.0.0.1:${PORT}/json`).then((r) => r.json());
    target = list.find((t) => t.type === "page") || list[0];
  }
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    ws.addEventListener("open", resolve);
    ws.addEventListener("error", reject);
  });
  const send = cdp(ws);
  await send("Page.enable");
  await send("Runtime.enable");
  await send("Page.navigate", { url: "http://127.0.0.1:4173/" });
  await sleep(900);
  await shot("/tmp/home-desktop.png");
  await send("Page.navigate", { url: "http://127.0.0.1:4173/order/index.html?active_step=1" });
  await sleep(1200);

  async function evalJs(expression) {
    const result = await send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
    if (result.exceptionDetails) {
      throw new Error(JSON.stringify(result.exceptionDetails));
    }
    return result.result.value;
  }

  async function shot(path) {
    const { data } = await send("Page.captureScreenshot", { format: "png", captureBeyondViewport: true });
    writeFileSync(path, Buffer.from(data, "base64"));
  }

  const errors = [];
  ws.addEventListener("message", (ev) => {
    const msg = JSON.parse(ev.data);
    if (msg.method === "Runtime.exceptionThrown") errors.push(msg.params.exceptionDetails.text);
    if (msg.method === "Runtime.consoleAPICalled" && msg.params.type === "error") {
      errors.push(msg.params.args.map((a) => a.value || a.description).join(" "));
    }
  });

  await evalJs(`
    document.getElementById('streetNumber').value = '100';
    document.getElementById('streetNumber').dispatchEvent(new Event('input', {bubbles:true}));
    document.getElementById('streetName').value = 'Demo Street';
    document.getElementById('streetName').dispatchEvent(new Event('input', {bubbles:true}));
    document.getElementById('city').value = 'Tampa';
    document.getElementById('city').dispatchEvent(new Event('input', {bubbles:true}));
    document.getElementById('state').value = 'FL';
    document.getElementById('state').dispatchEvent(new Event('input', {bubbles:true}));
    document.getElementById('postal').value = '33602';
    document.getElementById('postal').dispatchEvent(new Event('input', {bubbles:true}));
    document.getElementById('sqft').value = '2200';
    document.getElementById('sqft').dispatchEvent(new Event('input', {bubbles:true}));
    document.getElementById('next').click();
  `);
  await sleep(500);
  const onServices = await evalJs(`location.search + '|' + document.body.innerText.includes('Standard Package')`);
  await evalJs(`document.querySelector('#product-standard .btn-add').click()`);
  await sleep(300);
  const total = await evalJs(`document.querySelector('.cartbar strong').textContent`);
  const stdPrice = await evalJs(`document.querySelector('#product-standard .price').innerText`);
  await shot("/tmp/step2-cart.png");
  await evalJs(`document.getElementById('next').click()`);
  await sleep(300);
  const day = await evalJs(`
    const days = [...document.querySelectorAll('.day:not([disabled])')];
    days[Math.min(3, days.length-1)].click();
    document.querySelector('[data-time="10:00 AM"]').click();
    'ok';
  `);
  await sleep(200);
  await evalJs(`document.getElementById('next').click()`);
  await sleep(200);
  await evalJs(`
    const set = (id, v) => { const el = document.getElementById(id); el.value = v; el.dispatchEvent(new Event('input', {bubbles:true})); };
    set('name', 'Demo Agent');
    set('email', 'demo@example.com');
    set('phone', '(813) 555-0100');
    document.getElementById('next').click();
  `);
  await sleep(300);
  const summary = await evalJs(`document.querySelector('.summary') ? document.querySelector('.summary').innerText : document.body.innerText.slice(0,500)`);
  await shot("/tmp/step5.png");
  await evalJs(`document.getElementById('agree').click(); document.getElementById('place').click();`);
  await sleep(300);
  const done = await evalJs(`document.querySelector('.success') ? document.querySelector('.success').innerText : 'NO SUCCESS'`);
  await shot("/tmp/step5-done.png");

  await send("Page.navigate", { url: "http://127.0.0.1:4173/contact.html" });
  await sleep(800);
  await shot("/tmp/contact.png");
  await send("Emulation.setDeviceMetricsOverride", { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
  await send("Page.navigate", { url: "http://127.0.0.1:4173/" });
  await sleep(800);
  await shot("/tmp/home-mobile.png");

  console.log(JSON.stringify({ onServices, total, stdPrice, day, summary, done, errors }, null, 2));
  ws.close();
  chrome.kill("SIGKILL");
}

main().catch((err) => {
  console.error(err);
  chrome.kill("SIGKILL");
  process.exit(1);
});
