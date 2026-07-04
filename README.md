# Spider Frame Network Integration Blueprint

This repository defines a reference blueprint for FAAO-style identity and routing:

- Multi-scale identity: `G` (Global), `N` (National), `L` (Local)
- State-scoped identity: `FL`, `CA`, `TX`, etc.
- Domain separation: `GO` (Ground), `AO` (Air), `SO` (Space)
- Facility and mission routing: `MCO-TRACON`, `VBG-LAUNCHWINDOW`, `CCC-SFN`
- Local Spider Frame Network (SFN) sandbox access for secure private projects.

Identity format:

`[SCALE]-[STATE]-[FULLNAME]-[DOMAIN]-[FACILITY]-[MISSION]`

Example:

- `G-FL-LEIFWILLIAMSOGGE-AO-MCO-TRACON`
- `N-CA-JANEDOE-SO-VBG-LAUNCHWINDOW`
- `L-FL-LEIFWILLIAMSOGGE-SO-CCC-SFN`

Run the demo:

```bash
npm install
npm run start
```

## New integration artifacts

- Integration flow spec: `/docs/integration-flow-spec.md`
- Security & credential layer spec: `/docs/security-credential-layer.md`
- Module contracts: `/docs/module-contracts.md`
- Packet schema: `/docs/packet-schema.md`
- Credential token format: `/docs/credential-token-format.md`
- Multi-orbit compatibility spec: `/docs/multi-orbit-compatibility-spec.md`
- Integration test scenarios: `/docs/integration-test-scenarios.md`
- Failure mode matrix: `/docs/failure-mode-matrix.md`
- Operational telemetry layer: `/docs/operational-telemetry-layer.md`

Credential utilities are implemented in:

- `src/auth/credentialLayer.ts`
- `src/auth/credentialToken.ts`

Schema and telemetry scaffolding are implemented in:

- `src/protocol/packetSchema.ts`
- `src/telemetry/operationalTelemetry.ts`
