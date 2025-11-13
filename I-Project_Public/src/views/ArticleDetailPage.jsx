import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import axios from 'axios';
import { API_ENDPOINTS } from '../constant/url';
import Navbar from '../component/navbar';
import Footer from '../component/footer';

export default function ArticleDetailPage() {
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      fetchArticleDetail(id);
    }
  }, [id]);

  const fetchArticleDetail = async (articleId) => {
    try {
      setLoading(true);
      console.log('Fetching article detail for ID:', articleId);
      console.log('API endpoint:', API_ENDPOINTS.ARTICLE_DETAIL(articleId));
      const response = await axios.get(API_ENDPOINTS.ARTICLE_DETAIL(articleId));
      console.log('Article detail response:', response.data);
      setArticle(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching article detail:', error);
      console.error('Error details:', error.response);
      setError('Gagal memuat artikel. Silakan coba lagi.');
      setLoading(false);
    }
  };

  const handleBackToArticles = () => {
    navigate(-1); // Go back to previous page
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className="article-detail-page">
        <Navbar />
        <div className="container" style={{ marginTop: '6rem', textAlign: 'center', padding: '3rem' }}>
          <p>Memuat artikel...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="article-detail-page">
        <Navbar />
        <div className="container" style={{ marginTop: '6rem', textAlign: 'center', padding: '3rem' }}>
          <p>{error || 'Artikel tidak ditemukan'}</p>
          <button onClick={handleBackToHome} className="btn btn-primary" style={{ marginTop: '1rem' }}>
            Kembali ke Beranda
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="article-detail-page">
      <Navbar />

      <section className="container" style={{ marginTop: '6rem', marginBottom: '4rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <button 
            onClick={handleBackToArticles}
            className="btn btn-secondary"
            style={{ marginBottom: '1rem', marginRight: '0.5rem' }}
          >
            ← Kembali
          </button>
          <button 
            onClick={handleBackToHome}
            className="btn btn-secondary"
            style={{ marginBottom: '1rem' }}
          >
            🏠 Beranda
          </button>
        </div>

        <article className="article-detail">
          {article.imageUrl && (
            <div className="article-header-image">
              <img src={article.imageUrl} alt={article.title} />
            </div>
          )}
          
          <div className="article-header">
            <h1>{article.title}</h1>
            
            <div className="article-meta-info">
              {article.author && (
                <p><strong>Penulis:</strong> {article.author}</p>
              )}
              {article.createdAt && (
                <p><strong>Tanggal:</strong> {new Date(article.createdAt).toLocaleDateString('id-ID', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</p>
              )}
            </div>
          </div>

          <div className="article-body">
            {article.summary && (
              <div className="article-summary">
                <h3>Ringkasan</h3>
                <p>{article.summary}</p>
              </div>
            )}
            {article.content ? (
              <div className="article-content-text">
                {article.content.split('\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            ) : (
              <p>Konten artikel tidak tersedia.</p>
            )}
          </div>

          {article.tags && article.tags.length > 0 && (
            <div className="article-tags">
              <strong>Tags:</strong>
              {article.tags.map((tag, index) => (
                <span key={index} className="tag">{tag}</span>
              ))}
            </div>
          )}
        </article>
      </section>

      <Footer />
    </div>
  );
}
