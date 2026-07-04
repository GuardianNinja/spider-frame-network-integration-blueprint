# Module Contracts

This document defines module-level guarantees for the integration blueprint.

## `src/parser/identityParser.ts`

- Guarantees strict parsing of FAAO identity token format:
  `[SCALE]-[STATE]-[FULLNAME]-[DOMAIN]-[FACILITY]-[MISSION]`.
- Guarantees validation for supported `scale` (`G`/`N`/`L`) and `domain`
  (`GO`/`AO`/`SO`).
- Guarantees derived flags (`isGlobal`, `isNational`, `isLocal`) are coherent
  with parsed scale.

## `src/auth/contextResolver.ts`

- Guarantees deterministic routing partitions from a valid `IdentityToken`.
- Guarantees context fields required for downstream routing:
  `scalePartition`, `statePartition`, `domainPartition`, `facilityPartition`,
  and `missionKey`.
- Guarantees derived orbit awareness (`orbitBand`, `orbitPartition`) from token scale.

## `src/auth/policyEngine.ts`

- Guarantees a closed-by-default authorization decision (`allowed: false`)
  for unsupported/unknown permissions.
- Guarantees explicit reason strings for denials.
- Guarantees baseline mission/domain constraints for SFN, TRACON, launch
  windows, and local/national/global access checks.
- Guarantees optional orbit compatibility hooks (`requiredOrbit`, `compatibleOrbits`)
  are evaluated before permission-specific allow logic.

## `src/auth/credentialLayer.ts`

- Guarantees credential issuance with deduplicated scopes and bounded TTL.
- Guarantees HMAC-SHA256 credential integrity check and expiry validation.
- Guarantees binding between presented identity token and credential tokenRaw.
- Guarantees scope gate is evaluated before policy resolution.

## `src/auth/credentialToken.ts`

- Guarantees JWT-like compact token format:
  `base64url(header).base64url(payload).hex_signature`.
- Guarantees payload includes FAAO route attributes + scopes + validity window.
- Guarantees payload includes derived `orbit` field for orbit-aware integrations.
- Guarantees token signature verification uses timing-safe comparison.

## `src/protocol/packetSchema.ts`

- Guarantees typed packet contract for integration traffic and route binding.
- Guarantees packet route and auth context support typed orbit compatibility fields.
- Guarantees JSON schema constant for cross-service validation alignment.
- Guarantees binary header contract for future framed transport support.

## `src/sfn/sfnGateway.ts`

- Guarantees SFN project creation only when policy allows
  `ACCESS_SFN_SANDBOX`.
- Guarantees user project listing is restricted to owner+state+facility scope.

## `src/telemetry/operationalTelemetry.ts`

- Guarantees a common contract for logs, metrics, and heartbeat signals.
- Guarantees heartbeat uptime is monotonic and never negative.
- Guarantees in-memory collector preserves emitted telemetry in call order.

## `src/training/cognitiveTraining.ts`

- Guarantees typed CTS participant tier (`CTSUserTier`): `civilian`, `cadet`, `industry`.
- Guarantees typed training layer range (`CTSTrainingLayer`): `1`–`4`.
- Guarantees typed training phase sequence (`CTSTrainingPhase`) matches the CTS flow spec.
- Guarantees typed payload contracts for `CTS_MEMORY_CHALLENGE`, `CTS_SEQUENCE_VALIDATION`,
  and `CTS_OPERATOR_READINESS` packet types.
- Guarantees `CTSTelemetryEvent` shape for cognitive performance metrics emitted by CTS modules.
