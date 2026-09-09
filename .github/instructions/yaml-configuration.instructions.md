> Personal-site context: this repository is Rijian Song’s customized root-domain website. Follow `AGENTS.md`; local template, Sass and asset overrides are supported and tracked. Starter-only routing restrictions below describe the upstream framework, not this site.

# YAML Configuration Instructions (v1.x)

Scope: `_config.yml`, `_data/**/*.yml`

## Ownership

- `_config.yml` in starter wires plugins and feature flags.
- Plugin-specific runtime semantics are owned by plugin repos.

## Guidance

- Keep plugin list and config keys aligned with v1 boundaries.
- When adding featured plugins, update `_data/featured_plugins.yml`.
- Validate YAML syntax and avoid stale monolith keys.

## Validation

Use the validated command set in `AGENTS.md`.
