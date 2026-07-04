import { parseIdentityToken } from '../parser/identityParser';
import { resolveOperationalContext } from '../auth/contextResolver';
import { evaluatePermission } from '../auth/policyEngine';
import {
  authorizeCredentialedRequest,
  issueCredential
} from '../auth/credentialLayer';
import { createSfnProject, listSfnProjectsForUser } from '../sfn/sfnGateway';

function demo() {
  // WARNING: Demo-only fallback. Use managed secrets in production.
  const sharedSecret = process.env.DEMO_SHARED_SECRET ?? 'demo-shared-secret';
  const tokens = [
    'G-FL-LEIFWILLIAMSOGGE-AO-MCO-TRACON',
    'N-CA-JANEDOE-SO-VBG-LAUNCHWINDOW',
    'L-FL-LEIFWILLIAMSOGGE-SO-CCC-SFN'
  ];

  for (const raw of tokens) {
    console.log('\n=== TOKEN:', raw, '===');
    const token = parseIdentityToken(raw);
    const ctx = resolveOperationalContext(token);
    console.log('Context:', ctx);

    const globalDecision = evaluatePermission(
      token,
      ctx,
      'ACCESS_GLOBAL_SYSTEMS'
    );
    console.log('ACCESS_GLOBAL_SYSTEMS:', globalDecision);

    const nationalDecision = evaluatePermission(
      token,
      ctx,
      'ACCESS_NATIONAL_SYSTEMS'
    );
    console.log('ACCESS_NATIONAL_SYSTEMS:', nationalDecision);

    const sfnDecision = evaluatePermission(
      token,
      ctx,
      'ACCESS_SFN_SANDBOX'
    );
    console.log('ACCESS_SFN_SANDBOX:', sfnDecision);

    if (sfnDecision.allowed) {
      const credential = issueCredential(
        raw,
        ['ACCESS_SFN_SANDBOX', 'READ_LOCAL_SYSTEMS'],
        sharedSecret,
        { ttlSeconds: 600 }
      );
      console.log('Issued credential:', credential);

      const credentialDecision = authorizeCredentialedRequest(
        raw,
        credential,
        'ACCESS_SFN_SANDBOX',
        sharedSecret
      );
      console.log('Credential decision (ACCESS_SFN_SANDBOX):', credentialDecision);

      const project = createSfnProject(
        token,
        ctx,
        `project-${Date.now()}`
      );
      console.log('Created SFN project:', project);

      const mine = listSfnProjectsForUser(token);
      console.log('My SFN projects:', mine);
    }
  }
}

demo();
