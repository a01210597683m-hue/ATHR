# Specialist Brain Registry

The private registry stores ATHR's specialist brain definitions and operational state. It is not a model runtime or an LLM connection.

## Controls
- All brains are seeded as disabled; the central coordinator is seeded enabled in the registry only after owner approval (currently its seed status is disabled and it must be enabled by an authorized owner).
- Registry is in the non-exposed `athr_private` schema; browser roles have no table privileges.
- `athr-specialist-brains` requires a valid JWT and an active, non-revoked `owner` role.
- GET returns the catalogue metadata only.
- POST can change only a brain's status among enabled, disabled, and maintenance. It cannot edit prompts, secrets, model provider keys, or access private conversations.
- Each list and status change is written to `athr_private.admin_action_log`.
- Enabling a brain here is an administrative state change only. It does not claim that an inference provider, prompt orchestration, or production brain runtime is connected.

## Future integration
Connect each enabled specialist to a separately tested inference adapter, capability policy, rate limits, budget controls, and evaluations before routing real user requests to it.
