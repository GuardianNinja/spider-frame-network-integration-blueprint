import { parseIdentityToken } from '../parser/identityParser';
import { resolveOperationalContext } from '../auth/contextResolver';
import { evaluatePermission } from '../auth/policyEngine';
import { createSfnProject, listSfnProjectsForUser } from '../sfn/sfnGateway';

function demo() {
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


---

`src/index.ts`

export * from './model/Identity';
export * from './parser/identityParser';
export * from './auth/contextResolver';
export * from './auth/policyEngine';
export * from './sfn/sfnGateway';


---
