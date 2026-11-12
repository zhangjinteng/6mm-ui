# Tag translation settings button

Use the existing `settings-2` icon (15px) in the shared tag translation dialog instead of `sliders-horizontal`. Keep the provider status dot and the existing settings action/visibility rules.

The Chinese label is `翻译设置`; English is `Translation settings`. Align the label and trailing icon with a local inline-flex rule, without changing global button or icon styles. Agent and Platform continue to consume the same component. No release or dependency upgrade is included.

Verify icon geometry, labels, vertical alignment, click emission and conditional visibility in the shared adapter test, then run related component tests and TypeScript checks.
