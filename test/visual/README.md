# Personal-site visual and interaction checks

The approved source baseline is `9bf1cbed44bd46ad597c9d06206a7a8c4493e8be`. Build it independently, then purge its CSS with the same locked PurgeCSS executable as the candidate. Keep its generated output outside the site source. The deployment workflow provides an executable example.

Locally, put that output at `../baseline-site`, or set `BASELINE_DIR` to its absolute path. Build and purge the candidate in `_site`, then run:

```sh
npm ci
npx playwright install chromium webkit
npm run lint:style-contract
npm run test:visual
```

The server serves baseline on 4100 and candidate on 4101. Both use the same installed Playwright browsers, OS, system fonts, locale, time zone, DPR 1 and viewport. External resources load normally on both sides; a required image or interactive dependency failing to load fails its check. There is no synthesized replacement of third-party scripts. This is a local complete-build comparison, not production network timing or physical Safari/iOS testing.

Coverage: 13 routes × 5 widths × Chromium/WebKit, plus expanded menu, Escape, filtering/clearing, image zoom/close, bottom scroll and return to top. Each complete-page comparison demands zero changed pixels, including antialiasing. Screenshots must stabilize across consecutive captures; the suite does not force-disable animations because this altered WebKit image rasterization during validation. The bottom-scroll comparison captures the visible viewport, where the fixed navigation and return-to-top control are actually displayed. Before screenshots, images are decoded even below the fold. Initial image loading is checked separately in the site contract.

The baseline is a fixed source commit, built in the same environment as the candidate on every run. No screenshot-update command is provided. To intentionally change appearance/content, obtain review of the difference and then advance the baseline explicitly. Do not use a moving branch as the baseline.

To demonstrate that the comparator catches a deliberate appearance change:

```sh
VISUAL_NEGATIVE_CONTROL=1 npm run test:visual -- --project=chromium --grep '390 /$'
```

This must fail. It injects magenta only into the candidate browser; no source or baseline files are changed. Remove the environment variable for the real run.
