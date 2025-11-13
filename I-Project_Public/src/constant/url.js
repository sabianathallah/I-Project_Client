const baseUrl = 'http://localhost:3000'

// API Endpoints
export const API_ENDPOINTS = {
  // Public Endpoints (No Auth Required)
  PERIODS: `${baseUrl}/pub/periods`,
  ARTICLES: `${baseUrl}/pub/articles`,
  ARTICLE_DETAIL: (id) => `${baseUrl}/pub/articles/${id}`,
  
  // Authentication Endpoints
  LOGIN: `${baseUrl}/login`,
  REGISTER: `${baseUrl}/register`,
  GOOGLE_LOGIN: `${baseUrl}/google-login`,
  
  // User Endpoints (Auth Required)
  CHAT: `${baseUrl}/chat`,
  ORDERS: `${baseUrl}/orders`,
  ORDER_STATUS: (id) => `${baseUrl}/orders/${id}/status`,
  
  // Admin Endpoints (Auth + Admin Role Required)
  ADMIN_ARTICLES: `${baseUrl}/articles`,
  ADMIN_ARTICLE_DETAIL: (id) => `${baseUrl}/articles/${id}`,
  ADMIN_ARTICLE_UPLOAD: (id) => `${baseUrl}/articles/upload/${id}`,
  ADMIN_PERIODS: `${baseUrl}/periods`,
  ADMIN_PERIOD_DETAIL: (id) => `${baseUrl}/periods/${id}`
}

export default baseUrl