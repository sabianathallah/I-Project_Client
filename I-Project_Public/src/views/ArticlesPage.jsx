import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { fetchArticles, filterArticlesByPeriod } from '../store/slices/articlesSlice';
import BackToHomeButton from '../component/BackToHomeButton';
import { logoImage } from '../assets/logo';

export default function ArticlesPage() {
  const dispatch = useDispatch();
  const { filteredArticles, loading, error, articles } = useSelector((state) => state.articles);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const periodId = searchParams.get('periodId');

  // Fetch articles when component mounts
  useEffect(() => {
    dispatch(fetchArticles());
  }, [dispatch]);

  // Filter articles when periodId changes OR when articles are loaded
  useEffect(() => {
    if (articles.length > 0) {
      if (periodId) {
        dispatch(filterArticlesByPeriod(periodId));
      } else {
        dispatch(filterArticlesByPeriod(null));
      }
    }
  }, [periodId, articles.length, dispatch]);

  const handleViewDetail = (articleId) => {
    navigate(`/article/${articleId}`);
  };

  return (
    <div className="articles-page">
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

        <div style={{ marginBottom: '2rem' }}>
          <BackToHomeButton />
          <h2 className="section-title" style={{ marginTop: '1.5rem' }}>Artikel Sejarah</h2>
          <p className="section-subtitle">
            {periodId ? 'Artikel dari periode yang dipilih' : 'Semua artikel sejarah'}
          </p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <p>Memuat artikel...</p>
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <p>Error: {error}</p>
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
