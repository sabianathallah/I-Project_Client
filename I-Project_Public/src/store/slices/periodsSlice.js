import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_ENDPOINTS } from '../../constant/url';

// Async thunk for fetching periods
export const fetchPeriods = createAsyncThunk(
  'periods/fetchPeriods',
  async (_, { rejectWithValue }) => {
    try {
      console.log('Redux: Fetching periods from:', API_ENDPOINTS.PERIODS);
      const response = await axios.get(API_ENDPOINTS.PERIODS);
      console.log('Redux: Periods response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Redux: Error fetching periods:', error);
      return rejectWithValue(error.response?.data || 'Failed to fetch periods');
    }
  }
);

const periodsSlice = createSlice({
  name: 'periods',
  initialState: {
    periods: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearPeriodsError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPeriods.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPeriods.fulfilled, (state, action) => {
        state.loading = false;
        state.periods = action.payload;
      })
      .addCase(fetchPeriods.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearPeriodsError } = periodsSlice.actions;

export default periodsSlice.reducer;
