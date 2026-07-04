# Failure Mode Matrix

| Module | Failure mode | Detection | Expected behavior |
|---|---|---|---|
| `identityParser` | Token has wrong number of segments or invalid scale/domain | Throws `IdentityParseError` | Fail request immediately; do not continue with routing/policy. |
| `contextResolver` | Missing/invalid token fields | Type-level guard + upstream parse guarantees | Fail closed if token parse fails; resolver is not called with invalid input. |
| `credentialLayer` | Invalid signature | `verifyCredential(...).valid === false` | Deny request with integrity reason. |
| `credentialLayer` | Expired credential | `now >= expiresAt` | Deny request with expiry reason. |
| `credentialLayer` | Token binding mismatch | `credential.tokenRaw !== rawToken` | Deny request and log identity mismatch event. |
| `credentialLayer` | Missing required scope | `!credential.scopes.includes(permission)` | Deny request before policy evaluation. |
| `credentialToken` | Malformed compact token | Not 3 segments / decode exception | Deny request with malformed token reason. |
| `credentialToken` | Signature mismatch | Recomputed HMAC mismatch | Deny request with invalid signature reason. |
| `policyEngine` | Permission constraint unmet | `allowed: false` + reason | Deny request with explicit reason; no side effects. |
| `policyEngine` | Orbit compatibility mismatch (`requiredOrbit`/`compatibleOrbits`) | Orbit hook result in `evaluatePermission(...)` | Deny request before permission-specific allow logic. |
| `policyEngine` | Unknown permission | Fallback branch | Deny request (`Unknown or unsupported permission.`). |
| `sfnGateway` | Unauthorized project create | Policy decision denied | Throw error; do not mutate project store. |
| `telemetry` | Heartbeat time skew/backward clock | `createHeartbeat` clamps uptime | Emit uptime floor `0`, preserving valid heartbeat format. |
| `cognitiveTraining` | Recall failure — user cannot reproduce credential sequence | `CTSEvaluationResult === 'FAIL'` in `CTSSequenceValidationPayload` | Mark phase result `FAIL`; emit `CTSTelemetryEvent` with `recallAccuracy`; allow retry per layer policy. |
| `cognitiveTraining` | Sequence error — submitted sequence does not match challenge | Sequence comparison in `CTS_SEQUENCE_VALIDATION` packet handler | Return `PARTIAL` or `FAIL` result; do not advance training layer until threshold is met. |
| `cognitiveTraining` | Timing violation — sequence execution exceeds `timeLimitMs` | `elapsedMs > timeLimitMs` in `CTSMemoryChallengePayload` | Mark result `FAIL`; log `sequenceTimingMs` via `CTSTelemetryEvent`; Layer 4 stress mode may apply penalty. |
| `cognitiveTraining` | Operator stress overload — Layer 4 readiness score below threshold | `operatorReadinessScore` below defined floor in `CTSOperatorReadinessPayload` | Mark `OPERATOR_CONDITIONING` phase `FAIL`; emit telemetry; block FAAO-tier advancement until remediation. |
