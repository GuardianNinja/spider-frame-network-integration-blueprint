import { createHmac, timingSafeEqual } from 'crypto';
import { parseIdentityToken } from '../parser/identityParser';
import { Permission } from './policyEngine';

export interface CredentialTokenHeader {
  alg: 'HS256';
  typ: 'FAAO-CRED';
  ver: '1';
}

export interface CredentialTokenPayload {
  iss: 'spider-frame-network';
  aud: 'integration-layer';
  jti: string;
  tokenRaw: string;
  scale: 'G' | 'N' | 'L';
  state: string;
  domain: 'GO' | 'AO' | 'SO';
  facility: string;
  mission: string;
  scopes: Permission[];
  iat: number;
  exp: number;
}

export interface CredentialTokenIssueOptions {
  ttlSeconds?: number;
  now?: Date;
}

export interface CredentialTokenVerificationResult {
  valid: boolean;
  reason?: string;
  header?: CredentialTokenHeader;
  payload?: CredentialTokenPayload;
}

const DEFAULT_TTL_SECONDS = 15 * 60;

function base64UrlEncode(value: string): string {
  return Buffer.from(value, 'utf8').toString('base64url');
}

function base64UrlDecode(value: string): string {
  return Buffer.from(value, 'base64url').toString('utf8');
}

function signSigningInput(signingInput: string, sharedSecret: string): string {
  return createHmac('sha256', sharedSecret)
    .update(signingInput)
    .digest('hex');
}

function safeEqualSignature(left: string, right: string): boolean {
  if (!/^[a-f0-9]+$/i.test(left) || !/^[a-f0-9]+$/i.test(right)) {
    return false;
  }

  const leftBuffer = Buffer.from(left, 'hex');
  const rightBuffer = Buffer.from(right, 'hex');
  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return timingSafeEqual(leftBuffer, rightBuffer);
}

export function issueCredentialToken(
  rawToken: string,
  scopes: Permission[],
  sharedSecret: string,
  options: CredentialTokenIssueOptions = {}
): string {
  const token = parseIdentityToken(rawToken);
  const now = options.now ?? new Date();
  const ttlSeconds = options.ttlSeconds ?? DEFAULT_TTL_SECONDS;

  if (ttlSeconds <= 0) {
    throw new Error(
      `Credential token TTL must be greater than zero, received: ${ttlSeconds}`
    );
  }

  const iat = Math.floor(now.getTime() / 1000);
  const exp = iat + ttlSeconds;

  const header: CredentialTokenHeader = {
    alg: 'HS256',
    typ: 'FAAO-CRED',
    ver: '1'
  };

  const payload: CredentialTokenPayload = {
    iss: 'spider-frame-network',
    aud: 'integration-layer',
    jti: `ct-${iat}-${token.state}-${token.facility}`,
    tokenRaw: rawToken,
    scale: token.scale,
    state: token.state,
    domain: token.domain,
    facility: token.facility,
    mission: token.mission,
    scopes: [...new Set(scopes)],
    iat,
    exp
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const signingInput = `${encodedHeader}.${encodedPayload}`;
  const signature = signSigningInput(signingInput, sharedSecret);

  return `${signingInput}.${signature}`;
}

export function verifyCredentialToken(
  credentialToken: string,
  sharedSecret: string,
  now: Date = new Date()
): CredentialTokenVerificationResult {
  const tokenParts = credentialToken.split('.');
  if (tokenParts.length !== 3) {
    return { valid: false, reason: 'Credential token must have 3 parts.' };
  }

  const [encodedHeader, encodedPayload, signature] = tokenParts;
  const signingInput = `${encodedHeader}.${encodedPayload}`;
  const expectedSignature = signSigningInput(signingInput, sharedSecret);

  if (!safeEqualSignature(signature, expectedSignature)) {
    return { valid: false, reason: 'Credential token signature is invalid.' };
  }

  try {
    const header = JSON.parse(
      base64UrlDecode(encodedHeader)
    ) as CredentialTokenHeader;
    const payload = JSON.parse(
      base64UrlDecode(encodedPayload)
    ) as CredentialTokenPayload;

    if (header.alg !== 'HS256' || header.typ !== 'FAAO-CRED' || header.ver !== '1') {
      return { valid: false, reason: 'Credential token header is unsupported.' };
    }

    if (Math.floor(now.getTime() / 1000) >= payload.exp) {
      return { valid: false, reason: 'Credential token has expired.' };
    }

    return { valid: true, header, payload };
  } catch {
    return {
      valid: false,
      reason: 'Credential token payload/header could not be decoded.'
    };
  }
}

