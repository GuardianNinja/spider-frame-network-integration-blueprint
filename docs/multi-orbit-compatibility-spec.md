# Multi-Orbit Compatibility Spec

This blueprint supports orbit-aware integration across:

- `LEO` (Low Earth Orbit)
- `MEO` (Medium Earth Orbit)
- `GEO` (Geostationary Orbit)

## Scope

Orbit compatibility is integrated into existing flow layers rather than as a separate subsystem:

- Routing/context resolution (`resolveOperationalContext`)
- Packet contracts (`IntegrationPacket`)
- Policy evaluation hooks (`evaluatePermission`)
- Credential token payload (`issueCredentialToken`)

## Baseline Mapping

Current implementation derives orbit from FAAO `scale` as a minimal compatibility baseline:

- `L` (Local) -> `LEO`
- `N` (National) -> `MEO`
- `G` (Global) -> `GEO`

This mapping is intentionally explicit and can be replaced by mission/facility-specific orbit rules later.

## Packet Contract Additions

`PacketRoute` now includes:

- `orbit: 'LEO' | 'MEO' | 'GEO'`

`PacketAuthContext` now supports optional compatibility constraints:

- `requiredOrbit?: OrbitBand`
- `compatibleOrbits?: OrbitBand[]`

## Policy Hook

`evaluatePermission(...)` accepts optional `OrbitCompatibilityConstraint`:

- `requiredOrbit` denies when context orbit does not match.
- `compatibleOrbits` denies when context orbit is outside the allowed set.

When no orbit constraints are provided, behavior is unchanged.

## Integration Flow Placement

1. Parse identity token.
2. Resolve operational context (includes derived `orbitBand`).
3. Verify credential/token scope gates.
4. Apply policy checks with optional orbit compatibility constraints.
5. Execute service action on allow.

