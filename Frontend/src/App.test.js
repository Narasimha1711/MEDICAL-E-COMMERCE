import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { BrowserRouter } from 'react-router-dom'; // Add BrowserRouter
import { apiSlice } from './app/apiSlice'; // Adjust path if needed
import Home from './pages/Home';

// Create mock store with RTK Query middleware and reducer
const mockStore = configureStore({
  reducer: {
    searchQuery: (state = { searchQuery: '' }) => state,
    [apiSlice.reducerPath]: apiSlice.reducer, // RTK Query reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware), // RTK Query middleware
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