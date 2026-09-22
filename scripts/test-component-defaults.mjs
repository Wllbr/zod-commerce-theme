import fs from 'node:fs';
import assert from 'node:assert/strict';

// Salla's reference twilight.json stores collection defaults using each
// child field's full ID (for example, "links.title", not "title").
const theme = JSON.parse(fs.readFileSync(new URL('../twilight.json', import.meta.url)));
let collections = 0;
for (const component of theme.components) {
  for (const field of component.fields ?? []) {
    if (field.type !== 'collection' || !field.value?.length) continue;
    collections++;
    const definitions = new Map(field.fields.map(child => [child.id, child]));
    assert(field.value.length <= field.maxLength, `${component.path}: too many default groups`);
    for (const row of field.value) {
      for (const [key, value] of Object.entries(row)) {
        assert(definitions.has(key), `${component.path}: default ${key} has no matching editor field`);
        const definition = definitions.get(key);
        if (definition.type === 'items') {
          assert(Array.isArray(value), `${component.path}/${key}: item selections must be arrays`);
          assert(value.length <= definition.maxLength, `${component.path}/${key}: too many selections`);
        }
      }
    }
  }
}
const departments = theme.components.filter(component => component.path.startsWith('home.department-'));
assert.equal(departments.length, 1, 'the editor exposes one reusable department');
assert.equal(departments[0].key, '63ab1172-e60b-4531-b90e-eb3f83cd5ca5', 'existing saved department key is retained');
assert.equal(departments[0].fields.find(field => field.id === 'groups').maxLength, 12);
assert.equal(theme.components.find(component => component.path === 'home.laser-showcase').fields.find(field => field.id === 'items').maxLength, 35);
console.log(`PASS: ${collections} department collections match native editor field IDs and selection limits.`);
