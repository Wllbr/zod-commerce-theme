// Include controls inside Salla's open shadow roots in keyboard order.
export function containDialogFocus(event, dialog) {
  if (event.key !== 'Tab') return;
  const controls = [];
  const visit = root => Array.from(root.children || []).forEach(element => {
    if (element.hidden || element.inert || getComputedStyle(element).display === 'none') return;
    if (element.matches('button, a[href], input, select, textarea, [tabindex]') && element.tabIndex >= 0 && !element.disabled && element.getClientRects().length) controls.push(element);
    if (element.shadowRoot) visit(element.shadowRoot);
    visit(element);
  });
  visit(dialog);
  let active = document.activeElement;
  while (active?.shadowRoot?.activeElement) active = active.shadowRoot.activeElement;
  const index = controls.indexOf(active);
  if (!controls.length) { event.preventDefault(); dialog.focus(); return; }
  if (index < 0 || (event.shiftKey ? index === 0 : index === controls.length - 1)) {
    event.preventDefault();
    controls[event.shiftKey ? controls.length - 1 : 0].focus();
  }
}
