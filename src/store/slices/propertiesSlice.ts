import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Property } from '../../types/database';

interface PropertiesState {
  properties: Property[];
  loading: boolean;
  error: string | null;
  filters: {
    propertyType: string | null;
    minPrice: number | null;
    maxPrice: number | null;
    bedrooms: number | null;
    bathrooms: number | null;
    country: string | null;
    state: string | null;
  };
}

const initialState: PropertiesState = {
  properties: [],
  loading: false,
  error: null,
  filters: {
    propertyType: null,
    minPrice: null,
    maxPrice: null,
    bedrooms: null,
    bathrooms: null,
    country: null,
    state: null,
  },
};

const propertiesSlice = createSlice({
  name: 'properties',
  initialState,
  reducers: {
    setProperties: (state, action: PayloadAction<Property[]>) => {
      state.properties = action.payload;
      state.loading = false;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    setFilters: (state, action: PayloadAction<Partial<PropertiesState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
  },
});

export const {
  setProperties,
  setLoading,
  setError,
  setFilters,
  clearFilters,
} = propertiesSlice.actions;

export default propertiesSlice.reducer;