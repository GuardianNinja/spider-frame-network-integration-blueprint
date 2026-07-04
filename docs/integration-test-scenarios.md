# Integration Test Scenarios

Text-only scenarios for current integration flow.

## Scenario 1 — End-to-end SFN Success

- **Given** token `L-FL-LEIFWILLIAMSOGGE-SO-CCC-SFN`
- **And** valid unexpired credential with `ACCESS_SFN_SANDBOX`
- **When** policy + gateway create project is executed
- **Then** authorization is allowed
- **And** SFN project is created and listable for the same owner/state/facility

## Scenario 2 — Credential Signature Tampering

- **Given** a valid token and credential
- **When** credential signature is changed
- **Then** credential verification fails closed
- **And** request is denied with an integrity reason

## Scenario 3 — Expired Credential

- **Given** an issued credential token past `exp`/`expiresAt`
- **When** request is authorized
- **Then** request is denied as expired

## Scenario 4 — Scope Missing

- **Given** a credential without requested permission scope
- **When** request asks for that permission
- **Then** request is denied before policy engine allow-path is reached

## Scenario 5 — Token/Credential Identity Mismatch

- **Given** credential bound to token A
- **When** presented with token B
- **Then** request is denied due to identity binding mismatch

## Scenario 6 — Route/Policy Mismatch

- **Given** token `N-CA-JANEDOE-SO-VBG-LAUNCHWINDOW`
- **When** requesting `ACCESS_SFN_SANDBOX`
- **Then** policy engine denies with SFN route constraint reason

## Scenario 7 — Unsupported Permission

- **Given** valid identity and credential
- **When** permission not recognized by policy module is requested
- **Then** decision is denied with unknown permission reason

## Scenario 8 — Invalid Token Rejected During Credential Token Issuance

- **Given** malformed identity token input (wrong segment count)
- **When** `issueCredentialToken(...)` is called
- **Then** issuance fails by propagating parse error
- **And** no credential token is produced

## Scenario 9 — Duplicate Scope Inputs Are Canonicalized

- **Given** a valid identity token and duplicated input scopes
- **When** `issueCredentialToken(...)` creates a payload
- **Then** payload scopes include each permission once only
- **And** resulting token remains verifiable with shared secret
