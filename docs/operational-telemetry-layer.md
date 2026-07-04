# Operational Telemetry Layer

Telemetry contracts are defined in `src/telemetry/operationalTelemetry.ts`.

## Logs

`TelemetryLogEvent` fields:

- `timestamp` (ISO-8601)
- `module`
- `level` (`DEBUG`/`INFO`/`WARN`/`ERROR`)
- `message`
- optional `correlationId` + `metadata`

Recommended integration events:

- credential issued/verified/denied
- policy allow/deny decision
- SFN project create attempt/success/failure

## Metrics

`TelemetryMetricPoint` supports numeric time-series events:

- examples:
  - `integration_authz_denied_total`
  - `integration_authz_allowed_total`
  - `credential_verify_latency_ms`
  - `sfn_projects_created_total`

## Heartbeat

`TelemetryHeartbeat` captures module liveness:

- `status`: `UP`, `DEGRADED`, `DOWN`
- `uptimeSeconds`
- timestamp + module identity

`createHeartbeat(...)` provides a consistent heartbeat payload shape and guards
against negative uptime in clock-skew situations.

