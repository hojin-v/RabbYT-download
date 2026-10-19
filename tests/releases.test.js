const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const handler = require("../api/latest-apk.js");

function release(tag, extra = {}) {
  return { tag_name: tag, name: `RabbYT Android ${tag}`, assets: [{
    name: `RabbYT-Android-${tag}.apk`, size: 1024,
    browser_download_url: `https://github.com/hojin-v/RabbYT-download/releases/download/${tag}/RabbYT-Android-${tag}.apk`,
  }], ...extra };
}
const candidates = [release("v2.2.0"), release("v9.0.0", { prerelease: true }),
  release("v8.0.0", { draft: true }), release("v2.2.1"), release("v2.1.99")];

async function server(t, fetcher, method = "GET") {
  t.mock.method(global, "fetch", fetcher);
  const response = { headers: {}, setHeader(key, value) { this.headers[key] = value; }, end(body) { this.body = body; } };
  await handler({ method }, response);
  return response;
}

test("public stable download works while the source is private and excludes beta/draft releases", async t => {
  const calls = [];
  const response = await server(t, async url => {
    calls.push(url);
    assert.match(url, /\/RabbYT-download\/releases/);
    return { ok: true, json: async () => candidates };
  });
  assert.equal(calls.length, 1);
  assert.equal(response.statusCode, 302);
  assert.equal(response.headers.Location, release("v2.2.1").assets[0].browser_download_url);
});

test("migration fallback accepts RabbYT assets from the previous source address", async t => {
  const response = await server(t, async url => url.includes("/YTET-Android/")
    ? { ok: true, json: async () => candidates } : { ok: false, status: 404 });
  assert.equal(response.headers.Location, release("v2.2.1").assets[0].browser_download_url);
});

test("missing releases never fall back to an old fixed APK or a beta", async t => {
  const response = await server(t, async () => ({ ok: true, json: async () => [release("v9.0.0", { prerelease: true })] }));
  assert.equal(response.headers.Location, "https://github.com/hojin-v/RabbYT-download/releases");
});

test("unsupported methods never query GitHub", async t => {
  const response = await server(t, async () => assert.fail("unexpected request"), "POST");
  assert.equal(response.statusCode, 405);
});

async function browser(fetcher) {
  const link = { dataset: { fallbackDownloadUrl: "https://github.com/hojin-v/RabbYT-download/releases/latest" } };
  const elements = Object.fromEntries(["release-status", "release-version", "release-size", "apk-name"].map(key => [`[data-${key}]`, {}]));
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, "../script.js"), "utf8"), {
    fetch: fetcher,
    document: { querySelector: selector => elements[selector] || null,
      querySelectorAll: selector => selector === "[data-latest-apk-link]" ? [link] : [], addEventListener() {} },
  });
  await new Promise(setImmediate);
  return { link, elements };
}

test("browser shows the actual public RabbYT version, name and size", async () => {
  const result = await browser(async url => {
    assert.match(url, /\/RabbYT-download\/releases/);
    return { ok: true, json: async () => candidates };
  });
  assert.equal(result.elements["[data-release-version]"].textContent, "2.2.1-android");
  assert.equal(result.elements["[data-apk-name]"].textContent, "RabbYT-Android-v2.2.1.apk");
  assert.equal(result.link.href, release("v2.2.1").assets[0].browser_download_url);
});

test("browser keeps the public release list available when GitHub is unreachable", async () => {
  const result = await browser(async () => { throw new Error("offline"); });
  assert.equal(result.link.href, "https://github.com/hojin-v/RabbYT-download/releases/latest");
  assert.match(result.elements["[data-release-status]"].textContent, /정식 릴리즈 목록/);
});
