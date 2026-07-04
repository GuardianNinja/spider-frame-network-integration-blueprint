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

## CTS Telemetry Events

`CTSTelemetryEvent` (defined in `src/training/cognitiveTraining.ts`) captures
cognitive performance data emitted during CTS training sessions.

Fields:

- `sessionId` — training session identifier
- `userTier` — participant tier (`civilian`, `cadet`, `industry`)
- `trainingLayer` — active layer at the time of the event (`1`–`4`)
- `phase` — current training phase (`INITIATION`, `CREDENTIAL_RECALL`, etc.)
- `recallAccuracy` (optional) — fraction of correctly recalled credential steps (`0.0`–`1.0`)
- `sequenceTimingMs` (optional) — elapsed time for the sequence execution phase in milliseconds
- `operatorReadinessScore` (optional) — composite operator readiness score (`0`–`100`)
- `result` — evaluation outcome (`PASS`, `FAIL`, `PARTIAL`)

Recommended metric names for CTS telemetry points:

- `cts_recall_accuracy` (gauge, unit: fraction)
- `cts_sequence_timing_ms` (histogram, unit: ms)
- `cts_operator_readiness_score` (gauge, unit: score)
- `cts_session_pass_total` (counter)
- `cts_session_fail_total` (counter)

