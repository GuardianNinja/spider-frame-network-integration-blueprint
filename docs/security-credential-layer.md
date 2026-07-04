# Security & Credential Layer

`src/auth/credentialLayer.ts` adds a minimal credential envelope flow for integration calls.

## Credential Model

`CredentialEnvelope` contains:

- `credentialId`
- `tokenRaw` (identity binding)
- `scopes` (allowed permissions)
- `issuedAt`
- `expiresAt`
- `signature`

## Issuance

Use `issueCredential(tokenRaw, scopes, sharedSecret, options)`:

- Signs canonical credential payload with HMAC-SHA256.
- De-duplicates scopes.
- Applies TTL (default 15 minutes).

## Verification

Use `verifyCredential(credential, sharedSecret, now?)`:

- Recomputes and compares signature using timing-safe comparison.
- Fails closed on invalid signature.
- Rejects expired credentials.

## Authorization Path

Use `authorizeCredentialedRequest(rawToken, credential, requestedPermission, sharedSecret)`:

1. Verify credential integrity and expiry.
2. Ensure credential identity binding (`tokenRaw`).
3. Ensure requested permission is in credential scopes.
4. Parse token, resolve context, and apply policy engine rules.

This keeps credential checks and policy decisions layered, explicit, and reusable.

## Tokenized Credential Format

In addition to `CredentialEnvelope`, the repository now includes a compact
JWT-like credential token format in `src/auth/credentialToken.ts`.

- Issuance: `issueCredentialToken(...)`
- Verification: `verifyCredentialToken(...)`

The token encodes FAAO route attributes (`scale`, `state`, `domain`,
`facility`, `mission`) plus scopes and expiry, and signs the header/payload
with HMAC-SHA256.
