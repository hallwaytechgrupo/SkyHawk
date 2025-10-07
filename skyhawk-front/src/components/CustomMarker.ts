// Helper to create a custom HTML marker element for Mapbox
export function createCustomMarker(color = '#007cbf', size = 40): HTMLElement {
  const el = document.createElement('div');
  el.className = 'custom-marker';
  el.style.width = `${size}px`;
  el.style.height = `${size}px`;
  el.style.display = 'flex';
  el.style.alignItems = 'center';
  el.style.justifyContent = 'center';
  el.style.cursor = 'pointer';
  el.style.boxShadow = '0 6px 18px rgba(0,0,0,0.25)';
  el.style.borderRadius = '50%';
  el.style.background = 'transparent';

  // Futuristic satellite SVG: orbit ring, satellite body and antenna beams with glow
  const svg = `
    <svg width="${size}" height="${size}" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="g1" x1="0" x2="1">
          <stop offset="0%" stop-color="${color}" />
          <stop offset="100%" stop-color="#00a8ff" />
        </linearGradient>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <!-- soft orbit ring -->
      <circle cx="32" cy="20" r="12" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="2" />

      <!-- satellite body rotated -->
      <g transform="translate(32,24) rotate(-25)">
        <rect x="-8" y="-6" width="16" height="12" rx="2" fill="url(#g1)" filter="url(#glow)" />
        <rect x="-14" y="-3" width="6" height="6" rx="1" fill="#ffffff" opacity="0.12" />
        <rect x="8" y="-3" width="6" height="6" rx="1" fill="#ffffff" opacity="0.12" />
        <!-- antenna -->
        <path d="M0 6 L0 12" stroke="#00d1ff" stroke-width="1.6" stroke-linecap="round" />
      </g>

      <!-- center core -->
      <circle cx="32" cy="20" r="3" fill="#ffffff" />

      <!-- subtle beams / signals -->
      <g stroke="#00d1ff" stroke-opacity="0.28" stroke-width="1">
        <path d="M32 4 L32 0" />
        <path d="M45 9 L48 6" />
        <path d="M19 9 L16 6" />
      </g>
    </svg>
  `;

  el.innerHTML = svg;

  // improve hit area slightly by adding padding inside the element
  el.style.padding = '4px';

  return el;
}

export default createCustomMarker;
