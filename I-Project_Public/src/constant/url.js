const baseUrl = 'http://localhost:3000'

// API Endpoints
export const API_ENDPOINTS = {
  PERIODS: `${baseUrl}/pub/periods`,
  ARTICLES: `${baseUrl}/pub/articles`,
  ARTICLE_DETAIL: (id) => `${baseUrl}/pub/articles/${id}`
}

export default baseUrl