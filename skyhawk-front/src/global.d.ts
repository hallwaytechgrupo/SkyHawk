// Allow importing plain CSS files in TypeScript
declare module '*.css';

// Specific declaration for mapbox-gl css path (some projects import this directly)
declare module 'mapbox-gl/dist/mapbox-gl.css';
