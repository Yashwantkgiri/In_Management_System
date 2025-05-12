// client/src/context/ProductContext.js
import React, { createContext, useReducer, useEffect, useCallback } from 'react';
import { productsAPI } from '../utils/api';

// Create context
export const ProductContext = createContext();

// Initial state
const initialState = {
  products: [],
  currentProduct: null,
  loading: true,
  error: null,
  filtered: null,
  categoryOptions: []
};

// Actions
const FETCH_PRODUCTS = 'FETCH_PRODUCTS';
const FETCH_PRODUCTS_ERROR = 'FETCH_PRODUCTS_ERROR';
const SET_LOADING = 'SET_LOADING';
const ADD_PRODUCT = 'ADD_PRODUCT';
const UPDATE_PRODUCT = 'UPDATE_PRODUCT';
const DELETE_PRODUCT = 'DELETE_PRODUCT';
const SET_CURRENT_PRODUCT = 'SET_CURRENT_PRODUCT';
const CLEAR_CURRENT_PRODUCT = 'CLEAR_CURRENT_PRODUCT';
const FILTER_PRODUCTS = 'FILTER_PRODUCTS';
const CLEAR_FILTER = 'CLEAR_FILTER';
const UPDATE_CATEGORY_OPTIONS = 'UPDATE_CATEGORY_OPTIONS';

// Reducer
const productReducer = (state, action) => {
  switch (action.type) {
    case FETCH_PRODUCTS:
      return {
        ...state,
        products: action.payload,
        loading: false,
        error: null
      };
    case FETCH_PRODUCTS_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    case SET_LOADING:
      return {
        ...state,
        loading: true
      };
    case ADD_PRODUCT:
      return {
        ...state,
        products: [...state.products, action.payload],
        loading: false
      };
    case UPDATE_PRODUCT:
      return {
        ...state,
        products: state.products.map(product =>
          product._id === action.payload._id ? action.payload : product
        ),
        loading: false
      };
    case DELETE_PRODUCT:
      return {
        ...state,
        products: state.products.filter(product => product._id !== action.payload),
        loading: false
      };
    case SET_CURRENT_PRODUCT:
      return {
        ...state,
        currentProduct: action.payload
      };
    case CLEAR_CURRENT_PRODUCT:
      return {
        ...state,
        currentProduct: null
      };
    case FILTER_PRODUCTS:
      return {
        ...state,
        filtered: state.products.filter(product => {
          const regex = new RegExp(`${action.payload}`, 'gi');
          return (
            product.name.match(regex) ||
            product.sku.match(regex) ||
            product.category.match(regex)
          );
        })
      };
    case CLEAR_FILTER:
      return {
        ...state,
        filtered: null
      };
    case UPDATE_CATEGORY_OPTIONS:
      return {
        ...state,
        categoryOptions: action.payload
      };
    default:
      return state;
  }
};

// Provider Component
export const ProductProvider = ({ children }) => {
  const [state, dispatch] = useReducer(productReducer, initialState);

  // Fetch products
  const fetchProducts = useCallback(async () => {
    try {
      dispatch({ type: SET_LOADING });
      const res = await productsAPI.getAll();
      dispatch({ type: FETCH_PRODUCTS, payload: res.data });
      
      // Update category options
      const categories = [...new Set(res.data.map(product => product.category))];
      dispatch({ type: UPDATE_CATEGORY_OPTIONS, payload: categories });
    } catch (err) {
      dispatch({
        type: FETCH_PRODUCTS_ERROR,
        payload: err.response?.data?.msg || 'Failed to fetch products'
      });
    }
  }, []);

  // Add product
  const addProduct = async (product) => {
    try {
      dispatch({ type: SET_LOADING });
      const res = await productsAPI.create(product);
      dispatch({ type: ADD_PRODUCT, payload: res.data });
      return res.data;
    } catch (err) {
      dispatch({
        type: FETCH_PRODUCTS_ERROR,
        payload: err.response?.data?.msg || 'Failed to add product'
      });
      throw err;
    }
  };

  // Update product
  const updateProduct = async (product) => {
    try {
      dispatch({ type: SET_LOADING });
      const res = await productsAPI.update(product._id, product);
      dispatch({ type: UPDATE_PRODUCT, payload: res.data });
      return res.data;
    } catch (err) {
      dispatch({
        type: FETCH_PRODUCTS_ERROR,
        payload: err.response?.data?.msg || 'Failed to update product'
      });
      throw err;
    }
  };

  // Delete product
  const deleteProduct = async (id) => {
    try {
      dispatch({ type: SET_LOADING });
      await productsAPI.delete(id);
      dispatch({ type: DELETE_PRODUCT, payload: id });
    } catch (err) {
      dispatch({
        type: FETCH_PRODUCTS_ERROR,
        payload: err.response?.data?.msg || 'Failed to delete product'
      });
      throw err;
    }
  };

  // Set current product
  const setCurrentProduct = (product) => {
    dispatch({ type: SET_CURRENT_PRODUCT, payload: product });
  };

  // Clear current product
  const clearCurrentProduct = () => {
    dispatch({ type: CLEAR_CURRENT_PRODUCT });
  };

  // Filter products
  const filterProducts = (text) => {
    dispatch({ type: FILTER_PRODUCTS, payload: text });
  };

  // Clear filter
  const clearFilter = () => {
    dispatch({ type: CLEAR_FILTER });
  };

  // Load products on mount
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <ProductContext.Provider
      value={{
        products: state.products,
        currentProduct: state.currentProduct,
        loading: state.loading,
        error: state.error,
        filtered: state.filtered,
        categoryOptions: state.categoryOptions,
        fetchProducts,
        addProduct,
        updateProduct,
        deleteProduct,
        setCurrentProduct,
        clearCurrentProduct,
        filterProducts,
        clearFilter
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export default ProductContext;