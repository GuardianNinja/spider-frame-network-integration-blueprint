import { Domain, IdentityToken, Scale } from '../model/Identity';

export class IdentityParseError extends Error {}

function assertScale(value: string): Scale {
  if (value === 'G' || value === 'N' || value === 'L') return value;
  throw new IdentityParseError(`Invalid scale: ${value}`);
}

function assertDomain(value: string): Domain {
  if (value === 'GO' || value === 'AO' || value === 'SO') return value;
  throw new IdentityParseError(`Invalid domain: ${value}`);
}

/**
 * Expected format:
 * [SCALE]-[STATE]-[FULLNAME]-[DOMAIN]-[FACILITY]-[MISSION]
 * e.g. G-FL-LEIFWILLIAMSOGGE-AO-MCO-TRACON
 */
export function parseIdentityToken(raw: string): IdentityToken {
  const parts = raw.split('-');
  if (parts.length !== 6) {
    throw new IdentityParseError(
      `Invalid token format. Expected 6 parts, got ${parts.length}`
    );
  }

  const [scaleRaw, state, fullName, domainRaw, facility, mission] = parts;

  const scale = assertScale(scaleRaw);
  const domain = assertDomain(domainRaw);

  return {
    raw,
    scale,
    state,
    fullName,
    domain,
    facility,
    mission,
    isGlobal: scale === 'G',
    isNational: scale === 'N',
    isLocal: scale === 'L'
  };
}
