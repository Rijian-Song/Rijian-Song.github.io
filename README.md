# Rijian Song — Personal Academic Homepage

[Rijian Song’s personal academic website](https://rijian-song.github.io/) uses al-folio/Jekyll and GitHub Pages at the domain root.

## Site structure

- **About** — `_pages/about.md`, current profile and selected publications.
- **Research** — `_pages/research.md` and four detail pages in `_projects/`.
- **Publications** — `_bibliography/papers.bib` and `_layouts/bib.liquid`.
- **News** — `_pages/news.md` and `_news/`.
- **Notes** — `_pages/notes.md`, personal writing.
- **Contact** — `_pages/contact.md`, professional links.

`/cv/` remains a placeholder. `/projects/` is a compatibility entry to Research; `/projects/<slug>/` contains research details. The legacy site is retained pending a separate decision about its public URL.

## Build and preview

Use the pinned gems in `Gemfile.lock` and JavaScript dependencies in `package-lock.json`.

```sh
bundle install
npm ci
bundle exec jekyll build
npm run build:purge
bundle exec jekyll serve
```

Open `http://localhost:4000/`. The existing light visual design uses system sans-serif fonts, teal accents, and custom Sass overrides. Preserve it during maintenance.

## Verification and deployment

See [AGENTS.md](AGENTS.md) for maintenance boundaries and [visual testing](test/visual/README.md) for baseline preparation. The deployment workflow builds, purges CSS using the locked project dependency, and runs the site contract and visual/interaction checks before deployment. Pull requests run checks without deploying.

Source baseline for this maintenance: `3abfe8a97addec69ddad464a46d1679b1847adda`. YAML update Action is pinned to the exact revision recorded by that deployment. PurgeCSS is pinned to 8.0.0, the registry's latest release since January 2026; the September build log did not print its resolved version, so exact historical equivalence is not asserted. Framework and Ruby gem versions remain unchanged.

The publication-approved Research content is captured in `a2263b84183e33e00169baf09b574ef75c5a291c`, which is now the visual baseline. This preserves the approved content changes while checking the maintenance changes against them.
