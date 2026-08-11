import { spawn } from "node:child_process";
import { createServer } from "node:net";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

const targetUrl = process.argv[2] || "http://127.0.0.1:3000/home";
const viewportWidth = Number(process.argv[3] || 390);
const screenshotPath = process.argv[4];
const requiredSelector = process.argv[5];
const viewportHeight = 844;
const adminUsername = process.env.LAYOUT_ADMIN_USERNAME;
const adminPassword = process.env.LAYOUT_ADMIN_PASSWORD;

const edgeCandidates = [
  process.env.EDGE_PATH,
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe"
].filter(Boolean);

function getFreePort() {
  return new Promise((resolve, reject) => {
    const server = createServer();
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      server.close(() => resolve(address.port));
    });
  });
}

async function waitForJson(url, timeoutMs = 10_000) {
  const deadline = Date.now() + timeoutMs;
  let lastError;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(url);
      if (response.ok) return response.json();
      lastError = new Error(`HTTP ${response.status}`);
    } catch (error) {
      lastError = error;
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error(`Edge CDP did not become ready: ${lastError?.message || "timeout"}`);
}

function createCdpClient(webSocketUrl) {
  const socket = new WebSocket(webSocketUrl);
  const pending = new Map();
  let nextId = 0;

  const ready = new Promise((resolve, reject) => {
    socket.addEventListener("open", resolve, { once: true });
    socket.addEventListener("error", reject, { once: true });
  });

  socket.addEventListener("message", (event) => {
    const message = JSON.parse(event.data);
    if (!message.id || !pending.has(message.id)) return;
    const handler = pending.get(message.id);
    pending.delete(message.id);
    if (message.error) handler.reject(new Error(JSON.stringify(message.error)));
    else handler.resolve(message.result);
  });

  return {
    ready,
    close: () => socket.close(),
    send(method, params = {}) {
      return new Promise((resolve, reject) => {
        const id = ++nextId;
        pending.set(id, { resolve, reject });
        socket.send(JSON.stringify({ id, method, params }));
      });
    }
  };
}

async function waitForPageReady(cdp, timeoutMs = 15_000, selector) {
  const deadline = Date.now() + timeoutMs;
  const selectorCheck = selector
    ? ` && Boolean(document.querySelector(${JSON.stringify(selector)}))`
    : "";
  while (Date.now() < deadline) {
    const state = await cdp.send("Runtime.evaluate", {
      expression: `document.readyState === 'complete' && Boolean(document.querySelector('.page, .admin-login-page, .admin-console'))${selectorCheck}`,
      returnByValue: true
    });
    if (state.result.value) return;
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error(`Page did not become ready within ${timeoutMs}ms`);
}

const profileDirectory = await mkdtemp(join(tmpdir(), "neko-layout-"));
const port = await getFreePort();
let edgeProcess;

try {
  let launchError;
  for (const edgePath of edgeCandidates) {
    try {
      edgeProcess = spawn(edgePath, [
        "--headless=new",
        "--disable-gpu",
        `--remote-debugging-port=${port}`,
        `--user-data-dir=${profileDirectory}`,
        "--no-first-run",
        "--no-default-browser-check",
        "about:blank"
      ], { stdio: "ignore", windowsHide: true });
      edgeProcess.once("error", (error) => { launchError = error; });
      await waitForJson(`http://127.0.0.1:${port}/json/version`);
      launchError = undefined;
      break;
    } catch (error) {
      launchError = error;
      edgeProcess?.kill();
      edgeProcess = undefined;
    }
  }
  if (!edgeProcess) throw launchError || new Error("Microsoft Edge was not found");

  const targets = await waitForJson(`http://127.0.0.1:${port}/json/list`);
  const target = targets.find((item) => item.type === "page");
  if (!target) throw new Error("No Edge page target was created");

  const cdp = createCdpClient(target.webSocketDebuggerUrl);
  await cdp.ready;
  await cdp.send("Page.enable");
  await cdp.send("Runtime.enable");
  await cdp.send("Emulation.setDeviceMetricsOverride", {
    width: viewportWidth,
    height: viewportHeight,
    screenWidth: viewportWidth,
    screenHeight: viewportHeight,
    deviceScaleFactor: 1,
    mobile: viewportWidth <= 768
  });

  if (adminUsername && adminPassword) {
    const loginUrl = new URL("/admin/login", targetUrl).href;
    await cdp.send("Page.navigate", { url: loginUrl });
    await waitForPageReady(cdp);
    const credentials = JSON.stringify({ username: adminUsername, password: adminPassword });
    const login = await cdp.send("Runtime.evaluate", {
      expression: `fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        credentials: "include",
        body: JSON.stringify(${credentials})
      }).then(async (response) => ({ status: response.status, ok: response.ok }))`,
      awaitPromise: true,
      returnByValue: true
    });
    if (!login.result.value?.ok) throw new Error(`Admin login failed with HTTP ${login.result.value?.status || "unknown"}`);
  }

  await cdp.send("Page.navigate", { url: targetUrl });
  await waitForPageReady(cdp, 15_000, requiredSelector);

  await cdp.send("Runtime.evaluate", {
    expression: "document.fonts?.ready",
    awaitPromise: true,
    returnByValue: true
  });
  await new Promise((resolve) => setTimeout(resolve, 300));

  const evaluated = await cdp.send("Runtime.evaluate", {
    expression: `(() => {
      const checkedSelectors = [
        ".page",
        ".page-title",
        ".page-title .lead",
        ".application-shell",
        ".commission-board",
        ".commission-form",
        ".admin-login-page",
        ".admin-login-panel",
        ".admin-console",
        ".admin-main",
        ".admin-content",
        ".admin-word-editor",
        ".admin-word-editor__workbench",
        ".admin-word-paper-wrap",
        ".admin-word-paper",
        ".home-weekly",
        ".weekly-event",
        ".weekly-event > .n-card-content",
        ".weekly-event__content",
        ".weekly-event__description",
        ".event-facts"
      ];
      const describe = (element) => {
        if (!element) return null;
        const rect = element.getBoundingClientRect();
        const style = getComputedStyle(element);
        return {
          tag: element.tagName.toLowerCase(),
          className: String(element.className || ""),
          left: Number(rect.left.toFixed(2)),
          right: Number(rect.right.toFixed(2)),
          width: Number(rect.width.toFixed(2)),
          clientWidth: element.clientWidth,
          scrollWidth: element.scrollWidth,
          cssWidth: style.width,
          minWidth: style.minWidth,
          maxWidth: style.maxWidth,
          padding: style.padding,
          display: style.display,
          gridTemplateColumns: style.gridTemplateColumns,
          overflowX: style.overflowX,
          boxSizing: style.boxSizing
        };
      };
      const elements = Object.fromEntries(
        checkedSelectors.map((selector) => [selector, describe(document.querySelector(selector))])
      );
      const failures = Object.entries(elements)
        .filter(([, item]) => item && (item.left < -0.5 || item.right > innerWidth + 0.5))
        .map(([selector, item]) => ({ selector, ...item }));
      const outsideViewport = [...document.querySelectorAll("*")]
        .filter((element) => !element.closest(".nav-scroll, .admin-word-toolbar"))
        .filter((element) => !(innerWidth <= 900 && element.closest(".admin-sidebar:not(.is-open)")))
        .map((element) => ({ element, rect: element.getBoundingClientRect() }))
        .filter(({ rect }) => rect.width > 0 && rect.height > 0 &&
          (rect.left < -0.5 || rect.right > innerWidth + 0.5))
        .sort((a, b) => b.rect.right - a.rect.right)
        .slice(0, 30)
        .map(({ element }) => ({
          ...describe(element),
          text: (element.textContent || "").trim().replace(/\\s+/g, " ").slice(0, 100)
        }));
      return {
        url: location.href,
        viewport: {
          innerWidth,
          documentClientWidth: document.documentElement.clientWidth,
          documentScrollWidth: document.documentElement.scrollWidth,
          bodyClientWidth: document.body.clientWidth,
          bodyScrollWidth: document.body.scrollWidth
        },
        elements,
        failures,
        outsideViewport
      };
    })()`,
    returnByValue: true
  });

  const report = evaluated.result.value;
  if (screenshotPath) {
    const screenshot = await cdp.send("Page.captureScreenshot", {
      format: "png",
      fromSurface: true,
      captureBeyondViewport: true
    });
    await writeFile(screenshotPath, Buffer.from(screenshot.data, "base64"));
  }

  console.log(JSON.stringify(report, null, 2));
  const documentOverflows = report.viewport.documentScrollWidth > report.viewport.documentClientWidth;
  if (documentOverflows || report.failures.length > 0 || report.outsideViewport.length > 0) process.exitCode = 1;
  cdp.close();
} finally {
  if (edgeProcess && edgeProcess.exitCode === null) {
    edgeProcess.kill();
    await Promise.race([
      new Promise((resolve) => edgeProcess.once("exit", resolve)),
      new Promise((resolve) => setTimeout(resolve, 2_000))
    ]);
  }
  await rm(profileDirectory, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 });
}
