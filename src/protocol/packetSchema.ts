import { Permission } from '../auth/policyEngine';
import { OrbitBand } from '../model/Identity';

export type PacketVersion = '1.0';

export type PacketType =
  | 'AUTHN_REQUEST'
  | 'AUTHN_RESPONSE'
  | 'POLICY_DECISION'
  | 'SFN_OPERATION_REQUEST'
  | 'SFN_OPERATION_RESPONSE'
  | 'HEARTBEAT'
  | 'CTS_MEMORY_CHALLENGE'
  | 'CTS_SEQUENCE_VALIDATION'
  | 'CTS_OPERATOR_READINESS';

export interface PacketRoute {
  scale: 'G' | 'N' | 'L';
  orbit: OrbitBand;
  state: string;
  domain: 'GO' | 'AO' | 'SO';
  facility: string;
  mission: string;
}

export interface PacketAuthContext {
  credentialToken: string;
  scopes: Permission[];
  requiredOrbit?: OrbitBand;
  compatibleOrbits?: OrbitBand[];
}

export interface IntegrationPacket<TPayload = Record<string, unknown>> {
  version: PacketVersion;
  packetId: string;
  packetType: PacketType;
  createdAt: string;
  route: PacketRoute;
  auth: PacketAuthContext;
  payload: TPayload;
}

export interface BinaryPacketHeader {
  version: number;
  packetType: number;
  payloadLengthBytes: number;
  flags: number;
}

export const integrationPacketJsonSchema = {
  $schema: 'https://json-schema.org/draft/2020-12/schema',
  $id: 'https://guardian.ninja/schemas/integration-packet.v1.json',
  type: 'object',
  required: [
    'version',
    'packetId',
    'packetType',
    'createdAt',
    'route',
    'auth',
    'payload'
  ],
  properties: {
    version: { const: '1.0' },
    packetId: { type: 'string', minLength: 1 },
    packetType: {
      type: 'string',
      enum: [
        'AUTHN_REQUEST',
        'AUTHN_RESPONSE',
        'POLICY_DECISION',
        'SFN_OPERATION_REQUEST',
        'SFN_OPERATION_RESPONSE',
        'HEARTBEAT',
        'CTS_MEMORY_CHALLENGE',
        'CTS_SEQUENCE_VALIDATION',
        'CTS_OPERATOR_READINESS'
      ]
    },
    createdAt: { type: 'string', format: 'date-time' },
    route: {
      type: 'object',
      required: ['scale', 'orbit', 'state', 'domain', 'facility', 'mission'],
      properties: {
        scale: { type: 'string', enum: ['G', 'N', 'L'] },
        orbit: { type: 'string', enum: ['LEO', 'MEO', 'GEO'] },
        state: { type: 'string', minLength: 2 },
        domain: { type: 'string', enum: ['GO', 'AO', 'SO'] },
        facility: { type: 'string', minLength: 1 },
        mission: { type: 'string', minLength: 1 }
      }
    },
    auth: {
      type: 'object',
      required: ['credentialToken', 'scopes'],
      properties: {
        credentialToken: { type: 'string', minLength: 16 },
        scopes: {
          type: 'array',
          items: { type: 'string' },
          minItems: 1
        },
        requiredOrbit: { type: 'string', enum: ['LEO', 'MEO', 'GEO'] },
        compatibleOrbits: {
          type: 'array',
          items: { type: 'string', enum: ['LEO', 'MEO', 'GEO'] },
          minItems: 1
        }
      }
    },
    payload: {
      type: 'object',
      additionalProperties: true
    }
  },
  additionalProperties: false
} as const;
