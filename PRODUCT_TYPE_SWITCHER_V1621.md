# ZOD Commerce v1.6.21 — Superseded Investigation

## Cause

Salla kept the editor rows for the switcher but ambiguous dot access returned the generic `groups` collection as empty to the Twig storefront renderer. The page contained the component's editor markers with no section between them.

## Fix

- Renaming the field did not migrate existing component instances, so this approach was superseded by v1.6.22.
- v1.6.22 preserves `groups` and reads it with explicit Twig bracket access.

No component recreation or migration is required after v1.6.22.
