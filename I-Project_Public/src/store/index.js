import { configureStore } from '@reduxjs/toolkit';
import articlesReducer from './slices/articlesSlice';
import periodsReducer from './slices/periodsSlice';

const store = configureStore({
  reducer: {
    articles: articlesReducer,
    periods: periodsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
