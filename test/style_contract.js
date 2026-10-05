const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const expected = require("./publication_counts");
const read = (p) => fs.readFileSync(p, "utf8");
const config = read("_config.yml");
// The deployment YAML updater serializes an empty value as null.
assert.match(config, /^baseurl:[ \t]*(?:null|~|""|'')?[ \t]*(?:#.*)?$/m, "root-domain baseurl must remain empty");
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
assert.equal(covers.length, expected.covers);
assert.equal(covers.filter((s) => s.includes('loading="eager"')).length, 1);
assert.equal(covers.filter((s) => s.includes('loading="lazy"')).length, expected.covers - 1);
assert(covers[0].includes('loading="eager"'), "first cover should be eager");
for (const s of covers) {
  assert.match(s, /width="[1-9]\d*"/);
  assert.match(s, /height="[1-9]\d*"/);
  assert(s.includes("data-zoomable"));
}
// Recorded cover dimensions must match the image files, e.g. after a cover is replaced or resized.
const imageSize = (file) => {
  const b = fs.readFileSync(file);
  if (b.toString("ascii", 1, 4) === "PNG") return [b.readUInt32BE(16), b.readUInt32BE(20)];
  if (b.toString("ascii", 0, 3) === "GIF") return [b.readUInt16LE(6), b.readUInt16LE(8)];
  for (let i = 2; i < b.length; ) {
    const marker = b[i + 1];
    if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) return [b.readUInt16BE(i + 7), b.readUInt16BE(i + 5)];
    i += 2 + b.readUInt16BE(i + 2);
  }
  throw new Error(file + ": unknown image format");
};
for (const [name, { width, height }] of Object.entries(JSON.parse(read("_data/publication_image_dimensions.json")))) {
  assert.deepEqual(
    imageSize(path.join("assets/img/publication_preview", name)),
    [width, height],
    name + ": recorded dimensions differ from the file"
  );
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
console.log(
  `Site contract passed: ${htmlFiles.length} HTML files, ${links} local references, ${expected.covers} original covers (1 eager / ${expected.covers - 1} lazy).`
);
