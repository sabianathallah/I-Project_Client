import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_ENDPOINTS } from '../../constant/url';

// Async thunks for fetching data
export const fetchArticles = createAsyncThunk(
  'articles/fetchArticles',
  async (_, { rejectWithValue }) => {
    try {
      console.log('Redux: Fetching articles from:', API_ENDPOINTS.ARTICLES);
      const response = await axios.get(API_ENDPOINTS.ARTICLES);
      console.log('Redux: Articles response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Redux: Error fetching articles:', error);
      return rejectWithValue(error.response?.data || 'Failed to fetch articles');
    }
  }
);

export const fetchArticleDetail = createAsyncThunk(
  'articles/fetchArticleDetail',
  async (articleId, { rejectWithValue }) => {
    try {
      console.log('Redux: Fetching article detail for ID:', articleId);
      const response = await axios.get(API_ENDPOINTS.ARTICLE_DETAIL(articleId));
      console.log('Redux: Article detail response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Redux: Error fetching article detail:', error);
      return rejectWithValue(error.response?.data || 'Failed to fetch article detail');
    }
  }
);

const articlesSlice = createSlice({
  name: 'articles',
  initialState: {
    articles: [],
    filteredArticles: [],
    currentArticle: null,
    loading: false,
    detailLoading: false,
    error: null,
    detailError: null,
    selectedPeriodId: null,
  },
  reducers: {
    filterArticlesByPeriod: (state, action) => {
      const periodId = action.payload;
      state.selectedPeriodId = periodId;
      
      if (periodId) {
        state.filteredArticles = state.articles.filter(
          article => article.PeriodId === parseInt(periodId)
        );
      } else {
        state.filteredArticles = state.articles;
      }
      console.log('Redux: Filtered articles by periodId:', periodId);
    },
    clearCurrentArticle: (state) => {
      state.currentArticle = null;
      state.detailError = null;
    },
    clearArticlesError: (state) => {
      state.error = null;
      state.detailError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all articles
      .addCase(fetchArticles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchArticles.fulfilled, (state, action) => {
        state.loading = false;
        state.articles = action.payload;
        // Apply filter if a period is selected
        if (state.selectedPeriodId) {
          state.filteredArticles = action.payload.filter(
            article => article.PeriodId === parseInt(state.selectedPeriodId)
          );
        } else {
          state.filteredArticles = action.payload;
        }
      })
      .addCase(fetchArticles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch article detail
      .addCase(fetchArticleDetail.pending, (state) => {
        state.detailLoading = true;
        state.detailError = null;
      })
      .addCase(fetchArticleDetail.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.currentArticle = action.payload;
      })
      .addCase(fetchArticleDetail.rejected, (state, action) => {
        state.detailLoading = false;
        state.detailError = action.payload;
      });
  },
});

export const { filterArticlesByPeriod, clearCurrentArticle, clearArticlesError } = articlesSlice.actions;

export default articlesSlice.reducer;
