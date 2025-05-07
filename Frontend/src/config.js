// // src/config.js
// export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// src/config.js

// src/config.js

export const API_BASE_URL =
  typeof process !== 'undefined' && process.env.VITE_API_BASE_URL
    ? process.env.VITE_API_BASE_URL
    : 'http://localhost:9001'; // fallback for browser if needed

