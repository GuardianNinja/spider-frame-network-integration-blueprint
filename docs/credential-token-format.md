# Credential Token Format

Credential token format is implemented in `src/auth/credentialToken.ts`.

## Format

Custom JWT-like compact token:

`base64url(header).base64url(payload).hex_signature`

- Header + payload are UTF-8 JSON.
- Signature is `HMAC-SHA256(signingInput, sharedSecret)` in hex.
- `signingInput = encodedHeader + "." + encodedPayload`.

## Header (v1)

```json
{
  "alg": "HS256",
  "typ": "FAAO-CRED",
  "ver": "1"
}
```

## Payload (v1)

```json
{
  "iss": "spider-frame-network",
  "aud": "integration-layer",
  "jti": "ct-1720112400-FL-CCC",
  "tokenRaw": "L-FL-LEIFWILLIAMSOGGE-SO-CCC-SFN",
  "scale": "L",
  "state": "FL",
  "domain": "SO",
  "facility": "CCC",
  "mission": "SFN",
  "scopes": ["ACCESS_SFN_SANDBOX"],
  "iat": 1720112400,
  "exp": 1720113300
}
```

## FAAO Routing Alignment

The token includes `scale/state/domain/facility/mission` so consumers can
validate credential route scope against operational context before action.

