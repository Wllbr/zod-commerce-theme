# ZOD Commerce v1.6.22 — Existing Product Tabs Rendered

## Result

The existing Salla section keeps its four saved tabs, categories, selected products, and links. The template now reads the saved `groups` field explicitly as `component['groups']`, preventing Salla/Twig from resolving the ambiguous dot-access name incorrectly.

## Verification target

The live preview previously contained `edit-767501571` and `after-767501571` markers with no storefront markup between them. After this change, the switcher section must appear between those markers and render the saved product sources.
