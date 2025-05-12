// client/src/context/TransactionContext.js
import React, { createContext, useReducer } from 'react';

// Define initial state
const initialState = {
  transactions: [],
  loading: true,
  error: null,
};

// Define reducer
const transactionReducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_TRANSACTIONS':
      return {
        ...state,
        transactions: action.payload,
        loading: false,
      };
    case 'FETCH_TRANSACTIONS_ERROR':
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
export const TransactionContext = createContext();

// Provider component
export const TransactionProvider = ({ children }) => {
  const [state, dispatch] = useReducer(transactionReducer, initialState);

  return (
    <TransactionContext.Provider value={{ ...state, dispatch }}>
      {children}
    </TransactionContext.Provider>
  );
};
