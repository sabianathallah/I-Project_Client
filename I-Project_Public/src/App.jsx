import './App.css'
import { Routes, Route } from 'react-router'
import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './context/ToastContext'
import LandingPage from './views/landingPage'
import ArticlesPage from './views/ArticlesPage'
import ArticleDetailPage from './views/ArticleDetailPage'
import LoginPage from './views/LoginPage'
import RegisterPage from './views/RegisterPage'
import GoogleCallback from './views/GoogleCallback'
import OrderCheckPage from './views/OrderCheckPage'

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/articles" element={<ArticlesPage />} />
          <Route path="/article/:id" element={<ArticleDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/auth/google/callback" element={<GoogleCallback />} />
          <Route path="/order-check" element={<OrderCheckPage />} />
        </Routes>
      </ToastProvider>
    </AuthProvider>
  )
}
