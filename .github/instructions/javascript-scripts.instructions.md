> Personal-site context: this repository is Rijian Song’s customized root-domain website. Follow `AGENTS.md`; local template, Sass and asset overrides are supported and tracked. Starter-only routing restrictions below describe the upstream framework, not this site.

# JavaScript Instructions (v1.x)

Scope: starter JS and related setup scripts

## Ownership

- Starter JS should be limited to orchestration/integration behavior.
- Feature runtime JS belongs in owning plugin repos.

## Guidance

- Do not copy plugin-owned search/icon/math/image runtime code into starter.
- Keep starter scripts framework-agnostic and compatible with plugin contracts.
- Prefer deterministic behavior suitable for integration/visual tests.

## Validation

Use the validated command set in `AGENTS.md`.
