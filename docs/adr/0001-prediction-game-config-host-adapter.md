# ADR 0001: Prediction game config uses host adapters

## Status

Accepted.

## Context

Platform Admin and Agent Admin need the same prediction-game configuration page, but they use different API routes, authorization rules, request field names, and symbol icon assets. Copying the page would make its validation and interaction behavior drift. Hard-coding either host application into `6mm-ui` would make the component unusable by the other host.

## Decision

`MmPredictionGameConfig` owns the complete interface, local editing state, validation, dialogs, and loading behavior. Host applications provide four integration points:

- `request` loads the current template;
- `save` persists one symbol's rules;
- `canPublish` exposes the host's authorization result;
- `resolveSymbolIcon` resolves host-owned symbol assets.

The component uses the neutral save field `enabled`. Each host maps that field to its backend contract, such as Platform Admin's `platform_enabled`.

## Consequences

The page has one visual and interaction implementation. Platform Admin and Agent Admin retain ownership of transport, authentication, permissions, and assets. Adding the page to a new host requires a small adapter rather than a copied view.
