import { BrowserRouter, Routes, Route, Navigate } from 'react-router'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// Auth Pages
import Login from './views/login.jsx'

// Article Pages
import ArticleTable from './views/ArticleTable.jsx'
import AddArticle from './views/AddArticle.jsx'
import EditArticle from './views/EditArticle.jsx'
import ArticleDetail from './views/ArticleDetail.jsx'

// Period Pages
import PeriodTable from './views/PeriodTable.jsx'

// Components
import Navbar from './component/navbar.jsx'

// Protected Route Component
function ProtectedRoute({ children }) {
  const token = localStorage.getItem('access_token')
  
  if (!token) {
    return <Navigate to="/" replace />
  }
  
  return (
    <>
      <Navbar />
      {children}
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        
        {/* Protected Routes */}
        <Route path="/articles" element={
          <ProtectedRoute>
            <ArticleTable />
          </ProtectedRoute>
        } />
        
        <Route path="/addArticle" element={
          <ProtectedRoute>
            <AddArticle />
          </ProtectedRoute>
        } />
        
        <Route path="/articleDetail/:id" element={
          <ProtectedRoute>
            <ArticleDetail />
          </ProtectedRoute>
        } />
        
        <Route path="/editArticle/:id" element={
          <ProtectedRoute>
            <EditArticle />
          </ProtectedRoute>
        } />
        
        <Route path="/periods" element={
          <ProtectedRoute>
            <PeriodTable />
          </ProtectedRoute>
        } />
        
        {/* Redirect unknown routes to login */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
