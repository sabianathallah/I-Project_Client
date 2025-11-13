import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router"
import axios from 'axios'
import baseUrl from "../constant/url"
import { toast } from 'react-toastify'
import Button from '../component/button-reusable.jsx'

export default function ArticleDetail() {
  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const { id } = useParams()

  useEffect(() => {
    fetchArticleDetail()
  }, [id])

  async function fetchArticleDetail() {
    try {
      setLoading(true)
      const token = localStorage.getItem("access_token")
      const { data } = await axios.get(`${baseUrl}/articles/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      setArticle(data)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching article detail:", error)
      toast.error("Gagal memuat detail artikel.")
      setLoading(false)
      
      // If unauthorized, redirect to login
      if (error.response?.status === 401) {
        localStorage.clear()
        navigate("/")
      } else {
        navigate("/articles")
      }
    }
  }

  function formatDate(dateString) {
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-amber-600 mx-auto mb-4"></div>
          <p className="text-amber-700 font-semibold">Memuat detail artikel...</p>
        </div>
      </div>
    )
  }

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
        <div className="text-center">
          <p className="text-amber-700 font-semibold mb-4">Artikel tidak ditemukan</p>
          <Button 
            nameProp="Kembali ke Daftar Artikel"
            onClick={() => navigate("/articles")}
            variant="primary"
            fullWidth={false}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      <main className="flex-grow container mx-auto px-4 py-10">
        <div className="max-w-5xl mx-auto">
          {/* Back Button */}
          <div className="mb-8">
            <button
              onClick={() => navigate("/articles")}
              className="inline-flex items-center gap-2 text-amber-700 hover:text-amber-900 font-semibold mb-4"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Kembali ke Daftar Artikel
            </button>
            <h1 className="text-4xl font-extrabold text-amber-900 mb-2">Detail Artikel</h1>
            <p className="text-amber-700">Informasi lengkap artikel museum</p>
          </div>

          {/* Article Detail Card */}
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border-2 border-amber-200">
            {/* Article Image */}
            {article.imageUrl && (
              <div className="w-full h-96 overflow-hidden bg-amber-100">
                <img 
                  src={article.imageUrl} 
                  alt={article.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none'
                    e.target.parentElement.innerHTML = '<div class="flex items-center justify-center h-full"><span class="text-amber-400 text-6xl">🖼️</span></div>'
                  }}
                />
              </div>
            )}

            {/* Article Content */}
            <div className="p-8">
              {/* Title */}
              <h2 className="text-3xl font-bold text-amber-900 mb-4">
                {article.title}
              </h2>

              {/* Meta Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
                <div>
                  <p className="text-sm text-amber-600 font-semibold mb-1">Penulis</p>
                  <p className="text-amber-900 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                    {article.User?.fullName || 'Unknown'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-amber-600 font-semibold mb-1">Email Penulis</p>
                  <p className="text-amber-900 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    {article.User?.email || 'Unknown'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-amber-600 font-semibold mb-1">Periode</p>
                  <p className="text-amber-900 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                    {article.Period?.name_ofPeriod || 'Unknown'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-amber-600 font-semibold mb-1">Tanggal Dibuat</p>
                  <p className="text-amber-900 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    {formatDate(article.createdAt)}
                  </p>
                </div>
                {article.updatedAt && article.updatedAt !== article.createdAt && (
                  <div>
                    <p className="text-sm text-amber-600 font-semibold mb-1">Terakhir Diupdate</p>
                    <p className="text-amber-900 flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                      </svg>
                      {formatDate(article.updatedAt)}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-amber-600 font-semibold mb-1">ID Artikel</p>
                  <p className="text-amber-900 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                    </svg>
                    #{article.id}
                  </p>
                </div>
              </div>

              {/* Summary */}
              {article.summary && (
                <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-amber-500 rounded-r-lg">
                  <p className="text-sm text-amber-600 font-semibold mb-2">Ringkasan</p>
                  <p className="text-amber-900 leading-relaxed">{article.summary}</p>
                </div>
              )}

              {/* Content */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-amber-900 mb-4 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M2 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 002 2H4a2 2 0 01-2-2V5zm3 1h6v4H5V6zm6 6H5v2h6v-2z" clipRule="evenodd" />
                    <path d="M15 7h1a2 2 0 012 2v5.5a1.5 1.5 0 01-3 0V7z" />
                  </svg>
                  Konten Artikel
                </h3>
                <div className="prose prose-amber max-w-none">
                  <p className="text-amber-900 leading-relaxed whitespace-pre-line text-justify">
                    {article.content}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-6 border-t-2 border-amber-200">
                <Button 
                  nameProp="Kembali"
                  type="button"
                  onClick={() => navigate("/articles")}
                  variant="secondary"
                  fullWidth={false}
                  className="px-8"
                />
                <Button 
                  nameProp="Edit Artikel"
                  type="button"
                  onClick={() => navigate(`/editArticle/${article.id}`)}
                  variant="primary"
                  fullWidth={false}
                  className="px-8"
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-auto bg-transparent py-4">
        <p className="text-center text-amber-800 text-sm">© 2025 Museum Soeharto. All rights reserved.</p>
      </footer>
    </div>
  )
}
