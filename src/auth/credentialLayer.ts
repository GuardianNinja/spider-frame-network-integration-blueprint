import { createHmac, timingSafeEqual } from 'crypto';
import { parseIdentityToken } from '../parser/identityParser';
import { resolveOperationalContext } from './contextResolver';
import { evaluatePermission, Permission, PolicyDecision } from './policyEngine';

export interface CredentialEnvelope {
  credentialId: string;
  tokenRaw: string;
  scopes: Permission[];
  issuedAt: string;
  expiresAt: string;
  signature: string;
}

export interface CredentialIssueOptions {
  ttlSeconds?: number;
  now?: Date;
}

export interface CredentialVerificationResult {
  valid: boolean;
  reason?: string;
}

const DEFAULT_TTL_SECONDS = 15 * 60;

function toCanonicalPayload(
  credential: Omit<CredentialEnvelope, 'signature'>
): string {
  return [
    credential.credentialId,
    credential.tokenRaw,
    credential.scopes.join(','),
    credential.issuedAt,
    credential.expiresAt
  ].join('|');
}

function signPayload(payload: string, sharedSecret: string): string {
  return createHmac('sha256', sharedSecret).update(payload).digest('hex');
}

function equalSignatures(left: string, right: string): boolean {
  const leftBuffer = Buffer.from(left, 'hex');
  const rightBuffer = Buffer.from(right, 'hex');
  if (leftBuffer.length !== rightBuffer.length) return false;
  return timingSafeEqual(leftBuffer, rightBuffer);
}

export function issueCredential(
  tokenRaw: string,
  scopes: Permission[],
  sharedSecret: string,
  options: CredentialIssueOptions = {}
): CredentialEnvelope {
  const now = options.now ?? new Date();
  const ttlSeconds = options.ttlSeconds ?? DEFAULT_TTL_SECONDS;
  if (ttlSeconds <= 0) {
    throw new Error(
      `Credential TTL must be greater than zero, received: ${ttlSeconds}`
    );
  }

  const issuedAtMs = now.getTime();
  const expiresAtMs = issuedAtMs + ttlSeconds * 1000;

  const unsignedCredential: Omit<CredentialEnvelope, 'signature'> = {
    credentialId: `cred-${issuedAtMs}`,
    tokenRaw,
    // Deduplicate scopes to keep the canonical payload stable.
    scopes: [...new Set(scopes)],
    issuedAt: new Date(issuedAtMs).toISOString(),
    expiresAt: new Date(expiresAtMs).toISOString()
  };

  return {
    ...unsignedCredential,
    signature: signPayload(
      toCanonicalPayload(unsignedCredential),
      sharedSecret
    )
  };
}

export function verifyCredential(
  credential: CredentialEnvelope,
  sharedSecret: string,
  now: Date = new Date()
): CredentialVerificationResult {
  const { signature, ...unsignedCredential } = credential;
  const expectedSignature = signPayload(
    toCanonicalPayload(unsignedCredential),
    sharedSecret
  );

  if (!equalSignatures(signature, expectedSignature)) {
    return { valid: false, reason: 'Credential signature is invalid.' };
  }

  if (now.getTime() >= Date.parse(credential.expiresAt)) {
    return { valid: false, reason: 'Credential has expired.' };
  }

  return { valid: true };
}

export function authorizeCredentialedRequest(
  rawToken: string,
  credential: CredentialEnvelope,
  requestedPermission: Permission,
  sharedSecret: string,
  now: Date = new Date()
): PolicyDecision {
  const credentialVerification = verifyCredential(
    credential,
    sharedSecret,
    now
  );
  if (!credentialVerification.valid) {
    return {
      allowed: false,
      reason: credentialVerification.reason
    };
  }

  if (credential.tokenRaw !== rawToken) {
    return {
      allowed: false,
      reason: 'Credential token does not match the presented identity token.'
    };
  }

  if (!credential.scopes.includes(requestedPermission)) {
    return {
      allowed: false,
      reason: `Credential is missing scope: ${requestedPermission}.`
    };
  }

  const token = parseIdentityToken(rawToken);
  const context = resolveOperationalContext(token);
  return evaluatePermission(token, context, requestedPermission);
}
