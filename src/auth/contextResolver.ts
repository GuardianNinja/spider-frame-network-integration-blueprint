import { IdentityToken, OrbitBand, Scale } from '../model/Identity';

export interface OperationalContext {
  scalePartition: string;   // e.g. "GLOBAL", "NATIONAL-US", "LOCAL-FL-CCC"
  statePartition: string;   // e.g. "FL"
  domainPartition: string;  // e.g. "AO", "SO"
  facilityPartition: string;// e.g. "MCO", "CCC"
  missionKey: string;       // e.g. "TRACON", "LAUNCHWINDOW", "SFN"
  orbitPartition: string;   // e.g. "ORBIT-LEO", "ORBIT-MEO", "ORBIT-GEO"
  orbitBand: OrbitBand;
}

export function resolveOrbitBandFromScale(scale: Scale): OrbitBand {
  if (scale === 'L') return 'LEO';
  if (scale === 'N') return 'MEO';
  return 'GEO';
}

/**
 * Maps an IdentityToken into routing/partition hints.
 * This is where you’d wire in DB shards, message buses, etc.
 */
export function resolveOperationalContext(
  token: IdentityToken
): OperationalContext {
  const scalePartition =
    token.scale === 'G'
      ? 'GLOBAL'
      : token.scale === 'N'
      ? 'NATIONAL-US'
      : `LOCAL-${token.state}-${token.facility}`;

  const orbitBand = resolveOrbitBandFromScale(token.scale);

  return {
    scalePartition,
    statePartition: token.state,
    domainPartition: token.domain,
    facilityPartition: token.facility,
    missionKey: token.mission,
    orbitPartition: `ORBIT-${orbitBand}`,
    orbitBand
  };
}
