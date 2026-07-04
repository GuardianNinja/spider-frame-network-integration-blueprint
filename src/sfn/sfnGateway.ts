import { IdentityToken } from '../model/Identity';
import { OperationalContext } from '../auth/contextResolver';
import { evaluatePermission } from '../auth/policyEngine';

export interface SfnProject {
  id: string;
  ownerFullName: string;
  state: string;
  facility: string;
  mission: string; // typically "SFN"
  isApprovedForPublicRelease: boolean;
}

/**
 * In-memory SFN project store (placeholder).
 */
const sfnProjects: SfnProject[] = [];

export function createSfnProject(
  token: IdentityToken,
  context: OperationalContext,
  projectId: string
): SfnProject {
  const decision = evaluatePermission(
    token,
    context,
    'ACCESS_SFN_SANDBOX'
  );

  if (!decision.allowed) {
    throw new Error(
      `SFN access denied for ${token.raw}: ${decision.reason}`
    );
  }

  const project: SfnProject = {
    id: projectId,
    ownerFullName: token.fullName,
    state: token.state,
    facility: token.facility,
    mission: token.mission,
    isApprovedForPublicRelease: false
  };

  sfnProjects.push(project);
  return project;
}

export function listSfnProjectsForUser(
  token: IdentityToken
): SfnProject[] {
  return sfnProjects.filter(
    p =>
      p.ownerFullName === token.fullName &&
      p.state === token.state &&
      p.facility === token.facility
  );
}
