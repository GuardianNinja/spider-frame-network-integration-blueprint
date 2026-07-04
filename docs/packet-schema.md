# Packet Schema

Packet schema is formalized in `src/protocol/packetSchema.ts`.

## JSON Packet Contract (`IntegrationPacket`)

```json
{
  "version": "1.0",
  "packetId": "pkt-001",
  "packetType": "SFN_OPERATION_REQUEST",
  "createdAt": "2026-07-04T17:00:00.000Z",
  "route": {
    "scale": "L",
    "orbit": "LEO",
    "state": "FL",
    "domain": "SO",
    "facility": "CCC",
    "mission": "SFN"
  },
  "auth": {
    "credentialToken": "base64url(header).base64url(payload).signature",
    "scopes": ["ACCESS_SFN_SANDBOX"],
    "requiredOrbit": "LEO",
    "compatibleOrbits": ["LEO", "MEO"]
  },
  "payload": {
    "operation": "createProject",
    "projectId": "project-123"
  }
}
```

## Packet Types

- `AUTHN_REQUEST`
- `AUTHN_RESPONSE`
- `POLICY_DECISION`
- `SFN_OPERATION_REQUEST`
- `SFN_OPERATION_RESPONSE`
- `HEARTBEAT`

## Orbit-Aware Fields

- `route.orbit`: typed orbit context (`LEO`, `MEO`, `GEO`).
- `auth.requiredOrbit` (optional): strict orbit requirement for policy hook.
- `auth.compatibleOrbits` (optional): allowed orbit set for policy hook.

## Binary Header Contract

For framed binary transport, the repository defines a minimal header contract:

- `version` (number)
- `packetType` (number enum mapping)
- `payloadLengthBytes` (number)
- `flags` (bit field)

This enables future binary adapters without changing logical packet semantics.
