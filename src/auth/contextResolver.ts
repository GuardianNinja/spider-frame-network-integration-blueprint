import { IdentityToken } from '../model/Identity';

export interface OperationalContext {
  scalePartition: string;   // e.g. "GLOBAL", "NATIONAL-US", "LOCAL-FL-CCC"
  statePartition: string;   // e.g. "FL"
  domainPartition: string;  // e.g. "AO", "SO"
  facilityPartition: string;// e.g. "MCO", "CCC"
  missionKey: string;       // e.g. "TRACON", "LAUNCHWINDOW", "SFN"
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

  return {
    scalePartition,
    statePartition: token.state,
    domainPartition: token.domain,
    facilityPartition: token.facility,
    missionKey: token.mission
  };
}
