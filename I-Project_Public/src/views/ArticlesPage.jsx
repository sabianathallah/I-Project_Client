import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import axios from 'axios';
import { API_ENDPOINTS } from '../constant/url';
import Navbar from '../component/navbar';
import Footer from '../component/footer';

export default function ArticlesPage() {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const periodId = searchParams.get('periodId');

  useEffect(() => {
    fetchArticles(periodId);
  }, [periodId]);

  const fetchArticles = async (periodId) => {
    try {
      setLoading(true);
      console.log('Fetching articles from:', API_ENDPOINTS.ARTICLES);
      const response = await axios.get(API_ENDPOINTS.ARTICLES);
      console.log('Articles response:', response.data);
      const allArticles = response.data;
      
      // Filter articles by periodId if provided
      // Note: API uses PeriodId (capital P) not periodId
      if (periodId) {
        const filtered = allArticles.filter(
          article => article.PeriodId === parseInt(periodId)
        );
        console.log('Filtered articles:', filtered);
        setFilteredArticles(filtered);
      } else {
        setFilteredArticles(allArticles);
      }
      
      setArticles(allArticles);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching articles:', error);
      console.error('Error details:', error.response);
      setLoading(false);
    }
  };

  const handleViewDetail = (articleId) => {
    navigate(`/article/${articleId}`);
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div className="articles-page">
      <Navbar />

      <section className="container" style={{ marginTop: '6rem', marginBottom: '4rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <button 
            onClick={handleBackToHome}
            className="btn btn-secondary"
            style={{ marginBottom: '1rem' }}
          >
            ← Kembali ke Beranda
          </button>
          <h2 className="section-title">Artikel Sejarah</h2>
          <p className="section-subtitle">
            {periodId ? 'Artikel dari periode yang dipilih' : 'Semua artikel sejarah'}
          </p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <p>Memuat artikel...</p>
          </div>
        ) : filteredArticles.length > 0 ? (
          <div className="articles-grid">
            {filteredArticles.map((article) => (
              <ArticleCard 
                key={article.id}
                article={article}
                onViewDetail={handleViewDetail}
              />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <p>Tidak ada artikel yang ditemukan.</p>
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}

// Article Card Component
function ArticleCard({ article, onViewDetail }) {
  return (
    <div className="article-card">
      {article.imageUrl && (
        <div className="article-image">
          <img src={article.imageUrl} alt={article.title} />
        </div>
      )}
      <div className="article-content">
        <h3>{article.title}</h3>
        <p className="article-excerpt">
          {article.summary || article.content ? 
            (article.summary || article.content).substring(0, 150) + '...' : 
            'Tidak ada deskripsi'}
        </p>
        {article.author && (
          <p className="article-meta">
            <strong>Penulis:</strong> {article.author}
          </p>
        )}
        <button 
          className="btn btn-primary" 
          onClick={() => onViewDetail(article.id)}
        >
          Baca Selengkapnya
        </button>
      </div>
    </div>
  );
}
