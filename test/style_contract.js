const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const read = (p) => fs.readFileSync(p, "utf8");
const config = read("_config.yml");
assert.match(config, /^baseurl:\s*(?:#.*)?$/m, "root-domain baseurl must remain empty");
assert.match(config, /^theme: al_folio_core$/m);
assert.match(config, /^bib_search: true/m);
const workflow = read(".github/workflows/deploy.yml");
assert.equal((workflow.match(/paths-ignore:/g) || []).length, 2);
assert(!/^\s+paths:/m.test(workflow), "avoid build-input allowlist omissions");
assert(!workflow.includes("npm install -g purgecss"));
assert(workflow.indexOf("npm run test:visual") < workflow.indexOf("- name: Deploy 🚀"));
for (const p of ["_includes/header.liquid", "_includes/footer.liquid", "_layouts/bib.liquid", "_sass/_layout.scss"]) assert(fs.existsSync(p));
const pub = read("_site/publications/index.html");
const covers = [...pub.matchAll(/<img\b[^>]*class="preview[^>]*>/g)].map((m) => m[0]);
assert.equal(covers.length, 29);
assert.equal(covers.filter((s) => s.includes('loading="eager"')).length, 1);
assert.equal(covers.filter((s) => s.includes('loading="lazy"')).length, 28);
assert(covers[0].includes('loading="eager"'), "first cover should be eager");
for (const s of covers) {
  assert.match(s, /width="[1-9]\d*"/);
  assert.match(s, /height="[1-9]\d*"/);
  assert(s.includes("data-zoomable"));
}
assert(!read("_site/index.html").match(/<img\b[^>]*class="preview[^>]*loading="lazy"/));
assert(pub.includes("bibsearch.js"));
assert(read("assets/js/bibsearch.js").includes("setTimeout(() => filterItems(searchTerm), 300)"));
const walk = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]));
const htmlFiles = walk("_site").filter((p) => p.endsWith(".html"));
let links = 0;
for (const file of htmlFiles) {
  const html = read(file);
  if (!file.startsWith("_site/legacy/")) {
    assert(!/src="[^"]*(?:masonry|imagesloaded|badge\.dimensions|cloudfront.net\/assets\/embed)/i.test(html), file + ": unused script");
    assert(!/class="[^"]*\bgrid\b/.test(html), file + ": Masonry container requires re-evaluation");
  }
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]);
  assert.equal(new Set(ids).size, ids.length, file + ": duplicate IDs");
  for (const m of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
    const raw = m[1];
    if (/^(?:[a-z]+:|\/\/)/i.test(raw) && !raw.startsWith("https://rijian-song.github.io/")) continue;
    const here = "/" + path.relative("_site", file).replace(/index\.html$/, "");
    const url = new URL(raw, "https://rijian-song.github.io" + here);
    let target = path.join("_site", decodeURIComponent(url.pathname));
    if (fs.existsSync(target) && fs.statSync(target).isDirectory()) target = path.join(target, "index.html");
    assert(fs.existsSync(target), `${file}: missing ${raw}`);
    if (url.hash && target.endsWith(".html") && url.hash !== "#") {
      const fragment = decodeURIComponent(url.hash.slice(1));
      // Publications supports search terms in URL hashes, in addition to real entry IDs.
      if (!target.endsWith("publications/index.html"))
        assert(read(target).includes(`id="${fragment}"`) || read(target).includes(`name="${fragment}"`), `${file}: missing fragment ${raw}`);
    }
    links++;
  }
}
console.log(`Site contract passed: ${htmlFiles.length} HTML files, ${links} local references, 29 original covers (1 eager / 28 lazy).`);
