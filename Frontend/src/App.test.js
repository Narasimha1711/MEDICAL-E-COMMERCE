// app.tests.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { BrowserRouter } from 'react-router-dom';
import Home from './pages/Home';
import NormalHome from './components/NormalHome';
const { useUserHomeCurrentOrdersQuery, useUserHomeTopDealsQuery } = require('./app/addCartSlice');

// Mock apiSlice
jest.mock('./app/apiSlice', () => {
  const mockApiSlice = {
    reducerPath: 'api',
    reducer: jest.fn((state = {}) => state),
    middleware: () => (next) => (action) => next(action),
    injectEndpoints: jest.fn(() => ({
      useAddToCartMutation: jest.fn(() => [jest.fn(), { isLoading: false }]),
    })),
  };
  return {
    apiSlice: mockApiSlice,
    useUserHomeCurrentOrdersQuery: jest.fn(),
    useUserHomeTopDealsQuery: jest.fn(),
  };
});

jest.mock('./app/addCartSlice', () => ({
    ...jest.requireActual('./app/addCartSlice'),
    useUserHomeCurrentOrdersQuery: jest.fn(),
    useUserHomeTopDealsQuery: jest.fn(),
  }));

  // Mock data for testing
const mockCurrentOrders = {
    data: { currentItems: [] }, // Mock data for current orders
    error: null,
    isLoading: false,
    isError: false,
  };
  
  const mockTopDeals = {
    data: { items: [] }, // Mock data for top deals
    isLoading: false,
  };

  useUserHomeCurrentOrdersQuery.mockReturnValue(mockCurrentOrders);
    useUserHomeTopDealsQuery.mockReturnValue(mockTopDeals);

    // Set up a mock store for Redux
const mockStore = configureStore({
    reducer: {
      searchQuery: (state = { searchQuery: '' }) => state, // Mock reducer for search query
      api: (state = {}) => state, // Mock the api reducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
  });
  
  
  
  
  // Mock data for testing
  useUserHomeCurrentOrdersQuery.mockReturnValue({
    data: { currentItems: [] }, // Return mock data
    error: null,
    isLoading: false,
    isError: false,
  });
  
  useUserHomeTopDealsQuery.mockReturnValue({
    data: { items: [] },
    isLoading: false,
  });
  



useUserHomeCurrentOrdersQuery.mockReturnValue({
  data: [],
  error: null,
  isLoading: false,
  isError: false,
});
useUserHomeTopDealsQuery.mockReturnValue({
  data: [],
  isLoading: false,
});


const SearchContextCreate = React.createContext({
  searchItems: [],
  setSearchItems: jest.fn(),
  searchItem: '',
  setSearchItem: jest.fn(),
});

test('renders NormalHome with Shop Now text', () => {
    render(
      <Provider store={mockStore}>
        <SearchContextCreate.Provider value={{
          searchItems: [],
          setSearchItems: jest.fn(),
          searchItem: '',
          setSearchItem: jest.fn(),
        }}>
          <BrowserRouter>
            <NormalHome /> {/* Ensure you're rendering the correct component */}
          </BrowserRouter>
        </SearchContextCreate.Provider>
      </Provider>
    );
  
    // Check if "Shop Now" text is in the document
    expect(screen.getByText(/Shop Now/i)).toBeInTheDocument();
  });

// import React from 'react';
// import { render, screen } from '@testing-library/react';
// import { Provider } from 'react-redux';
// import { configureStore } from '@reduxjs/toolkit';
// import { BrowserRouter } from 'react-router-dom';
// import Home from './pages/Home';

// // Mock the apiSlice module to avoid import.meta.env issues and support injectEndpoints
// jest.mock('./app/apiSlice', () => {
//   const mockApiSlice = {
//     reducerPath: 'api',
//     reducer: jest.fn((state = {}) => state), // Mock reducer
//     middleware: () => (next) => (action) => next(action), // Mock middleware
//     // Mock injectEndpoints to return a mock API slice with hooks
//     injectEndpoints: jest.fn(() => ({
//       useAddToCartMutation: jest.fn(() => [jest.fn(), { isLoading: false }]), // Mock mutation hook
//     })),
//   };
//   return {
//     apiSlice: mockApiSlice,
//     useUserHomeCurrentOrdersQuery: jest.fn(),
//     useUserHomeTopDealsQuery: jest.fn(),
//   };
// });

// const { useUserHomeCurrentOrdersQuery, useUserHomeTopDealsQuery } = require('./app/apiSlice');

// // Mock RTK Query hooks used in NormalHome.jsx
// useUserHomeCurrentOrdersQuery.mockReturnValue({
//   data: [], error: null, isLoading: false, isError: false,
// });
// useUserHomeTopDealsQuery.mockReturnValue({
//   data: [], isLoading: false,
// });

// // Create mock store with the mocked reducer
// const mockStore = configureStore({
//   reducer: {
//     searchQuery: (state = { searchQuery: '' }) => state,
//     api: (state = {}) => state, // Mock reducer for apiSlice
//   },
//   middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
// });

// // Mock SearchContextCreate for useContext
// const SearchContextCreate = React.createContext({
//   searchItems: [],
//   setSearchItems: jest.fn(),
//   searchItem: '',
//   setSearchItem: jest.fn(),
// });

// test('renders NormalHome with Shop Now text', () => {
//   render(
//     <Provider store={mockStore}>
//       <SearchContextCreate.Provider value={SearchContextCreate._currentValue}>
//         <BrowserRouter>
//           <Home />
//         </BrowserRouter>
//       </SearchContextCreate.Provider>
//     </Provider>
//   );
//   expect(screen.getByText(/Shop Now/i)).toBeInTheDocument();
// });