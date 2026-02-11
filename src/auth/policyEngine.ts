import { IdentityToken } from '../model/Identity';
import { OperationalContext } from './contextResolver';

export type Permission =
  | 'READ_LOCAL_SYSTEMS'
  | 'WRITE_LOCAL_SYSTEMS'
  | 'ACCESS_NATIONAL_SYSTEMS'
  | 'ACCESS_GLOBAL_SYSTEMS'
  | 'ACCESS_SFN_SANDBOX'
  | 'MANAGE_LAUNCH_WINDOWS'
  | 'MANAGE_TRACON';

export interface PolicyDecision {
  allowed: boolean;
  reason?: string;
}

/**
 * Very simple policy engine stub.
 * In a real system, this would query policy stores, RBAC, ABAC, etc.
 */
export function evaluatePermission(
  token: IdentityToken,
  context: OperationalContext,
  permission: Permission
): PolicyDecision {
  // Example: SFN sandbox is only accessible for Local + SO + mission=SFN
  if (permission === 'ACCESS_SFN_SANDBOX') {
    if (token.isLocal && token.domain === 'SO' && token.mission === 'SFN') {
      return { allowed: true };
    }
    return {
      allowed: false,
      reason: 'SFN sandbox requires L-*-*-SO-*-SFN identity token.'
    };
  }

  // Example: Global systems require G-scale
  if (permission === 'ACCESS_GLOBAL_SYSTEMS') {
    if (token.isGlobal) return { allowed: true };
    return { allowed: false, reason: 'Global systems require G-* token.' };
  }

  // Example: National systems require N or G
  if (permission === 'ACCESS_NATIONAL_SYSTEMS') {
    if (token.isNational || token.isGlobal) return { allowed: true };
    return {
      allowed: false,
      reason: 'National systems require N-* or G-* token.'
    };
  }

  // Example: TRACON management requires AO + mission TRACON
  if (permission === 'MANAGE_TRACON') {
    if (token.domain === 'AO' && token.mission === 'TRACON') {
      return { allowed: true };
    }
    return {
      allowed: false,
      reason: 'TRACON management requires AO-*-TRACON mission.'
    };
  }

  // Example: Launch window management requires SO + mission LAUNCHWINDOW
  if (permission === 'MANAGE_LAUNCH_WINDOWS') {
    if (token.domain === 'SO' && token.mission === 'LAUNCHWINDOW') {
      return { allowed: true };
    }
    return {
      allowed: false,
      reason: 'Launch window management requires SO-*-LAUNCHWINDOW mission.'
    };
  }

  // Local read/write examples
  if (permission === 'READ_LOCAL_SYSTEMS') {
    if (token.isLocal) return { allowed: true };
    return {
      allowed: false,
      reason: 'Local read requires L-* token.'
    };
  }

  if (permission === 'WRITE_LOCAL_SYSTEMS') {
    if (token.isLocal) {
      // You could add role/clearance checks here
      return { allowed: true };
    }
    return {
      allowed: false,
      reason: 'Local write requires L-* token.'
    };
  }

  return { allowed: false, reason: 'Unknown or unsupported permission.' };
}


---
