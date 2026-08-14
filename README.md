# Rijian Song — Personal Academic Homepage

This repository contains [Rijian Song’s personal academic homepage](https://rijian-song.github.io/), built with [al-folio](https://github.com/alshedivat/al-folio) and deployed through GitHub Pages.

## Site structure

- **Profile** — current affiliation, research focus, and selected work
- **Research** — injectable hydrogels, wet-tissue adhesion, and tissue repair
- **Publications** — publication records maintained in `_bibliography/papers.bib`
- **Applications** — research platforms and translational directions
- **News** — selected research updates
- **CV** — reserved for the full CV that will be added later
- **Contact** — public professional links

Teaching, talks, blog posts, and repository listings are intentionally not included in this version.

## Local preview

The site uses Ruby, Bundler, Jekyll, and the pinned al-folio plugin set in `Gemfile.lock`.

```bash
bundle install
bundle exec jekyll serve
```

Then open `http://localhost:4000`.

## Updating content

- Edit `_pages/about.md` for the homepage profile text.
- Edit `_pages/research.md`, `_projects/`, and `_news/` for research content.
- Add or update publication records in `_bibliography/papers.bib`.
- Add the final CV data to `_data/cv.yml` when ready.
- Keep the light Apple / Anthropic Serif Text-inspired styling in `_sass/` and the site-wide settings in `_config.yml`.

The exact Anthropic Serif Text font is used when it is available on the visitor’s device; the public fallback stack uses Newsreader and system serif fonts.
