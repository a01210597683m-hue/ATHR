# Specialist Brain Registry

The private registry stores ATHR's specialist brain definitions and operational state. It is not a model runtime or an LLM connection.

## Controls
- All seven brains are seeded as disabled, including the central coordinator. The central coordinator cannot be disabled through the owner API; it must first be enabled by an authorized owner.
- Registry is in the non-exposed `athr_private` schema; browser roles have no table privileges.
- `athr-specialist-brains` requires a valid JWT and an active, non-revoked `owner` role.
- GET returns the catalogue metadata only.
- POST can change only a brain's status among enabled, disabled, and maintenance. It cannot edit prompts, secrets, model provider keys, or access private conversations.
- Each list and status change is written to `athr_private.admin_action_log`.
- Enabling a brain here is an administrative state change only. It does not claim that an inference provider, prompt orchestration, or production brain runtime is connected.

## Future integration
Connect each enabled specialist to a separately tested inference adapter, capability policy, rate limits, budget controls, and evaluations before routing real user requests to it.

## Website build
A GitHub Actions workflow at `.github/workflows/deploy-pages.yml` now builds the static root page and deploys it to GitHub Pages on pushes to `main`. The repository's Pages setting must permit GitHub Actions deployment. A successful workflow run and a live page load are still required before asking the owner to test the site.
