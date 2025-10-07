// Helper to create a custom HTML marker element for Mapbox
export function createCustomMarker(color = 'var(--brand-500)', size = 36): HTMLElement {
  const SVG_NS = 'http://www.w3.org/2000/svg';
  const el = document.createElement('div');
  el.className = 'custom-marker';
  el.style.width = `${size}px`;
  el.style.height = `${size}px`;
  el.style.display = 'flex';
  el.style.alignItems = 'center';
  el.style.justifyContent = 'center';
  el.style.cursor = 'pointer';
  el.style.boxShadow = '0 6px 18px rgba(0,0,0,0.22)';
  el.style.borderRadius = '50%';
  el.style.background = 'transparent';
  el.style.padding = '4px';

  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('width', String(size));
  svg.setAttribute('height', String(size));
  svg.setAttribute('viewBox', '0 0 48 48');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');

  // outer ring (subtle)
  const outer = document.createElementNS(SVG_NS, 'circle');
  outer.setAttribute('cx', '24');
  outer.setAttribute('cy', '16');
  outer.setAttribute('r', '10');
  outer.setAttribute('fill', color);
  outer.setAttribute('opacity', '0.14');

  // main circle
  const main = document.createElementNS(SVG_NS, 'circle');
  main.setAttribute('cx', '24');
  main.setAttribute('cy', '16');
  main.setAttribute('r', '7');
  main.setAttribute('fill', color);

  // inner dot
  const dot = document.createElementNS(SVG_NS, 'circle');
  dot.setAttribute('cx', '24');
  dot.setAttribute('cy', '16');
  dot.setAttribute('r', '3');
  dot.setAttribute('fill', '#ffffff');
  dot.setAttribute('opacity', '0.95');

  // tail
  const tail = document.createElementNS(SVG_NS, 'path');
  tail.setAttribute('d', 'M24 23 L24 38');
  tail.setAttribute('stroke', color);
  tail.setAttribute('stroke-width', '2');
  tail.setAttribute('stroke-linecap', 'round');
  tail.setAttribute('opacity', '0.9');

  svg.appendChild(outer);
  svg.appendChild(main);
  svg.appendChild(dot);
  svg.appendChild(tail);

  el.appendChild(svg);

  return el;
}

export default createCustomMarker;
