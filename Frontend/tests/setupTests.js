// Frontend/tests/setupTests.js
import fetchMock from 'jest-fetch-mock';
import '@testing-library/jest-dom';

// Mock fetch for RTK Query
fetchMock.enableMocks();
fetchMock.mockResponse(JSON.stringify({}));

// Mock import.meta.env for Vite
globalThis.import = {
  meta: {
    env: {
        VITE_API_BASE_URL: 'https://medical-e-commerce-41jw.vercel.app', // Mocked API base URL for tests
    },
  },
};