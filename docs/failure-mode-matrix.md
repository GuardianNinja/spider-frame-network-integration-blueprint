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
