# Integration Flow Spec

This blueprint follows a deterministic integration flow for FAAO identity-routing and SFN operations.

## 1. Inbound Identity Token

Input format:

`[SCALE]-[STATE]-[FULLNAME]-[DOMAIN]-[FACILITY]-[MISSION]`

Example:

`L-FL-LEIFWILLIAMSOGGE-SO-CCC-SFN`

## 2. Parse and Normalize

- Parse with `parseIdentityToken(...)`.
- Validate scale (`G`, `N`, `L`) and domain (`GO`, `AO`, `SO`).
- Derive convenience flags (`isGlobal`, `isNational`, `isLocal`).

## 3. Resolve Operational Context

- Resolve routing partitions with `resolveOperationalContext(...)`.
- Output determines scale/state/domain/facility/mission partitions used by downstream services.

## 4. Credential Validation Layer

- Verify credential signature and expiration with `verifyCredential(...)`.
- Ensure credential is bound to the presented token (`credential.tokenRaw` match).
- Confirm requested operation exists in credential scopes.

## 5. Policy Evaluation

- Evaluate permission with `evaluatePermission(...)`.
- Current policy model enforces mission/domain/scale restrictions (e.g., SFN requires `L-*` + `SO` + `SFN`).

## 6. Service Action

- If authorized, execute integration operation (for example `createSfnProject(...)`).
- If denied, return a structured reason for auditability.

## Related expansion artifacts

- Module contracts: `/docs/module-contracts.md`
- Packet schema: `/docs/packet-schema.md`
- Credential token format: `/docs/credential-token-format.md`
- Integration test scenarios: `/docs/integration-test-scenarios.md`
- Failure mode matrix: `/docs/failure-mode-matrix.md`
- Operational telemetry layer: `/docs/operational-telemetry-layer.md`
