// Expected publication counts, derived from the bibliography so adding a paper needs no test edits.
const fs = require("node:fs");
const path = require("node:path");
const bib = fs.readFileSync(path.resolve(__dirname, "../_bibliography/papers.bib"), "utf8");
module.exports = {
  papers: (bib.match(/^@\w+\{/gm) || []).length,
  covers: (bib.match(/^\s*preview\s*=/gm) || []).length,
};
