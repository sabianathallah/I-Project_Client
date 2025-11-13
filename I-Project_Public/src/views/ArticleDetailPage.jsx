import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import axios from 'axios';
import { API_ENDPOINTS } from '../constant/url';
import BackButton from '../component/BackButton';
import BackToHomeButton from '../component/BackToHomeButton';
import { logoImage } from '../assets/logo';

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

  if (loading) {
    return (
      <div className="article-detail-page">
        <div className="container" style={{ marginTop: '2rem', textAlign: 'center', padding: '3rem' }}>
          {/* Logo Section */}
          <div style={{ marginBottom: '1.5rem', textAlign: 'left' }}>
            <img 
              src={logoImage} 
              alt="Museum Soeharto Logo" 
              style={{ 
                width: '120px', 
                height: 'auto',
                display: 'block',
                cursor: 'pointer'
              }}
              onClick={() => navigate('/')}
            />
          </div>
          <p>Memuat artikel...</p>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="article-detail-page">
        <div className="container" style={{ marginTop: '2rem', textAlign: 'center', padding: '3rem' }}>
          {/* Logo Section */}
          <div style={{ marginBottom: '1.5rem', textAlign: 'left' }}>
            <img 
              src={logoImage} 
              alt="Museum Soeharto Logo" 
              style={{ 
                width: '120px', 
                height: 'auto',
                display: 'block',
                cursor: 'pointer'
              }}
              onClick={() => navigate('/')}
            />
          </div>
          <p>{error || 'Artikel tidak ditemukan'}</p>
          <div style={{ marginTop: '1rem' }}>
            <BackToHomeButton />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="article-detail-page">
      <section className="container" style={{ marginTop: '2rem', marginBottom: '4rem' }}>
        {/* Logo Section */}
        <div style={{ marginBottom: '1.5rem' }}>
          <img 
            src={logoImage} 
            alt="Museum Soeharto Logo" 
            style={{ 
              width: '120px', 
              height: 'auto',
              display: 'block',
              cursor: 'pointer'
            }}
            onClick={() => navigate('/')}
          />
        </div>

        <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <BackButton />
          <BackToHomeButton />
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
    </div>
  );
}
