import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { BrowserRouter } from 'react-router-dom';
import Home from './pages/Home';

// Mock the apiSlice module to avoid import.meta.env issues and support injectEndpoints
jest.mock('./app/apiSlice', () => {
  const mockApiSlice = {
    reducerPath: 'api',
    reducer: jest.fn((state = {}) => state), // Mock reducer
    middleware: () => (next) => (action) => next(action), // Mock middleware
    // Mock injectEndpoints to return a mock API slice with hooks
    injectEndpoints: jest.fn(() => ({
      useAddToCartMutation: jest.fn(() => [jest.fn(), { isLoading: false }]), // Mock mutation hook
    })),
  };
  return {
    apiSlice: mockApiSlice,
    useUserHomeCurrentOrdersQuery: jest.fn(),
    useUserHomeTopDealsQuery: jest.fn(),
  };
});

const { useUserHomeCurrentOrdersQuery, useUserHomeTopDealsQuery } = require('./app/apiSlice');

// Mock RTK Query hooks used in NormalHome.jsx
useUserHomeCurrentOrdersQuery.mockReturnValue({
  data: [], error: null, isLoading: false, isError: false,
});
useUserHomeTopDealsQuery.mockReturnValue({
  data: [], isLoading: false,
});

// Create mock store with the mocked reducer
const mockStore = configureStore({
  reducer: {
    searchQuery: (state = { searchQuery: '' }) => state,
    api: (state = {}) => state, // Mock reducer for apiSlice
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

// Mock SearchContextCreate for useContext
const SearchContextCreate = React.createContext({
  searchItems: [],
  setSearchItems: jest.fn(),
  searchItem: '',
  setSearchItem: jest.fn(),
});

test('renders NormalHome with Shop Now text', () => {
  render(
    <Provider store={mockStore}>
      <SearchContextCreate.Provider value={SearchContextCreate._currentValue}>
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      </SearchContextCreate.Provider>
    </Provider>
  );
  expect(screen.getByText(/Shop Now/i)).toBeInTheDocument();
});