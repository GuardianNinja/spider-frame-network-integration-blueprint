export type Scale = 'G' | 'N' | 'L'; // Global / National / Local
export type Domain = 'GO' | 'AO' | 'SO'; // Ground / Air / Space
export type OrbitBand = 'LEO' | 'MEO' | 'GEO';

export interface IdentityToken {
  raw: string;

  scale: Scale;          // G / N / L
  state: string;         // FL, CA, TX, etc.
  fullName: string;      // LEIFWILLIAMSOGGE
  domain: Domain;        // GO / AO / SO
  facility: string;      // MCO, VBG, CCC, etc.
  mission: string;       // TRACON, LAUNCHWINDOW, SFN, etc.

  // Optional: derived fields
  isGlobal: boolean;
  isNational: boolean;
  isLocal: boolean;
}
