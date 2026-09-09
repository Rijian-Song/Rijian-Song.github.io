# Rijian Song personal academic website

This repository is `Rijian-Song/Rijian-Song.github.io`, a customized personal site using pinned al-folio/Jekyll gems. It is not the upstream starter. Deploy at the domain root: keep `baseurl` empty. Run `bundle exec jekyll build` without `/al-folio`.

## Maintenance boundaries

- Preserve the current light system-font design, teal accents, spacing, image proportions, navigation and interactions. Do not redesign or upgrade the framework during maintenance.
- Preserve original publication images, bibliography metadata, author markings and sorting. Verify scholarly changes against authoritative sources.
- Local `_layouts/`, `_includes/`, `_sass/` and asset overrides are intentional and supported. Review upstream differences and maintain `.al-folio-overrides.yml` when changing them.
- Keep changes within the user's request. Route, content, navigation and feature changes need corresponding authorization. Preserve `legacy/`, `/cv/` and `/projects/` unless their behaviour is explicitly in scope.
- A local modification does not authorize pushing, merging or publishing. Never use the force-push manual deployment script without explicit authorization.
- Upstream documentation in `docs/` describes the framework; this file and README describe this site's actual setup. Do not apply upstream starter-only prohibitions to this personal site.

## Verification

```sh
npm ci
bundle exec jekyll build
npm run build:purge
npm run lint:style-contract
npm run test:visual
bundle exec al-folio upgrade audit
bundle exec al-folio upgrade overrides audit
git diff --check
```

The visual suite compares two complete builds in the same browser/OS/font environment at 390, 576, 768, 1024 and 1440 px. Prepare the approved baseline as documented in `test/visual/README.md`. Do not update the baseline to conceal a failure. Review and obtain approval for intentional visual changes before advancing its commit.

Run Prettier on changed supported files. Do not reformat unrelated source. Check Publications and homepage together after changing bibliography rendering. Keep image dimensions in `_data/publication_image_dimensions.json` consistent with original images; review the eager first-cover key in `_layouts/bib.liquid` when adding a newer publication.
