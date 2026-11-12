# Symbol Tag Direct Edit

**Goal:** Open the existing shared edit dialog directly from the row action in Agent and Platform, matching the supplied dialog. Reuse `MmIcon` `square-pen` at 14px; never duplicate SVG paths in the component.

**Architecture:** Both hosts already consume `MmSymbolTagManager`. Change its shared action label/icon/handler, preserving the current edit/delete/translation drafts and APIs. Users with update or delete permissions enter the dialog directly; fully read-only users retain the existing details drawer. No database changes or new host-specific dialogs.

**Verification:** Update shared interaction tests for direct edit, form values, saving, deletion confirmation/failures, translation drafts and read-only permissions. Run Vitest and library typecheck/build. Build local packages for both current consumers without publishing or changing their pinned dependency versions. Preserve pre-existing source edits and permissions.
