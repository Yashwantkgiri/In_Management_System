// client/src/context/CustomerContext.js
import React, { createContext, useReducer } from 'react';

// Define initial state
const initialState = {
  customers: [],
  loading: true,
  error: null,
};

// Define reducer
const customerReducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_CUSTOMERS':
      return {
        ...state,
        customers: action.payload,
        loading: false,
      };
    case 'FETCH_CUSTOMERS_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    default:
      return state;
  }
};

// Create context
export const CustomerContext = createContext();

// Provider component
export const CustomerProvider = ({ children }) => {
  const [state, dispatch] = useReducer(customerReducer, initialState);

  return (
    <CustomerContext.Provider value={{ ...state, dispatch }}>
      {children}
    </CustomerContext.Provider>
  );
};
