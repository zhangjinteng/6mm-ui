# Shared Prediction Game Configuration

`MmPredictionGameConfig` owns the UP_DOWN, HIGH_LOW and embedded GRID configuration experience for both admin applications. Import it from the isolated entry:

```ts
import '@work-gpt/6mm-ui/style.css'
import {
  MmPredictionGameConfig,
  type PredictionConfigContext,
  type PlatformConfigAdapter,
  type AgentConfigAdapter,
} from '@work-gpt/6mm-ui/prediction-config'
```

The configuration entry needs `element-plus` and `@element-plus/icons-vue`. It explicitly imports its Element Plus component styles. The core entry does not import these optional peers. Existing form disabling, confirmation and decimal-string semantics are preserved; this release is not a replacement of every Element Plus primitive.

## Host Boundary

- Pass an adapter with `role: 'platform'` or `role: 'agent'`, the existing authenticated API functions, and the host symbol component.
- Pass a reactive context containing the authenticated operator ID, permissions and an opaque identity generation. Never pass an access token as `identityKey`. Change the generation on login/logout or identity changes.
- Agent also passes `canManagePredictionConfig` from the authenticated profile. Owner/site protocol selection comes from the backend, not a browser-selected merchant ID.
- Keep route guards, request authentication, permission middleware and server-side merchant/site scope in each host. Frontend visibility is not an authorization boundary.
- Pass `registerBeforeLeave` to register the shared pending-operation guard with the host router. Agent can pass locale and translation functions.

## Behavior

The SDK owns symbol selection, room controls, precision/odds/limit editors, validation, original-request journals, receipt recovery and loading/error states. Internal Platform, Owner and Site variants preserve their genuinely different publish and authorization contracts while sharing one public component and common controls.

Pending storage keys, frozen request bodies and request hashes remain compatible with the old pages. Unknown write results remain pending; retry/recovery uses the original request ID. Changing the operator/session remounts the inner view so stale responses cannot populate the new identity.

GRID keeps its existing workflows. In particular, the Agent adapter retains the merchant initialization endpoint on first grid entry. Do not use a live grid entry as a read-only smoke test unless initialization is explicitly permitted or mocked.

## Verification

```sh
npm run typecheck
npm run test:prediction-config
npm test -- --run
npm run build
```

Node lifecycle/model tests cover owner/site/grid writes and recovery. Runtime tests cover adapter selection, missing identity, child-account denial and stale-session response isolation. Use host integration tests for middleware and data scope; mock writes for UI validation.
