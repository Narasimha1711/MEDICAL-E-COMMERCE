import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
  reducerPath: 'api',                    // Key in the Redux store for the slice
  baseQuery: fetchBaseQuery({ baseUrl: `${import.meta.env.VITE_API_BASE_URL}`, credentials: 'include', }),  // Base URL for API calls
  endpoints: (builder) => ({
    
  }),          // Initial endpoints left empty
});

export default apiSlice;

