import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';
import { heroImages } from '../assets/foto_landingPage';
import { timelineBackground } from '../assets/timelineImages';
import { API_ENDPOINTS } from '../constant/url';
import Navbar from '../component/navbar';
import Footer from '../component/footer';
import MapLeaflet from '../component/MapLeaflet';
import ChatModal from '../component/ChatModal';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function LandingPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [periods, setPeriods] = useState([]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();

  // Auto slide every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  // Fetch periods data from API
  useEffect(() => {
    const fetchPeriods = async () => {
      try {
        console.log('Fetching periods from:', API_ENDPOINTS.PERIODS);
        const response = await axios.get(API_ENDPOINTS.PERIODS);
        console.log('Periods response:', response.data);
        setPeriods(response.data);
      } catch (error) {
        console.error('Error fetching periods:', error);
        console.error('Error details:', error.response);
      }
    };

    fetchPeriods();
  }, []);

  const handleSmoothScroll = (e, targetId) => {
    e.preventDefault();
    const target = document.querySelector(targetId);
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const handleBuyTicket = () => {
    if (!isAuthenticated()) {
      showToast('Harap login terlebih dahulu', 'warning');
      setTimeout(() => {
        navigate('/login');
      }, 1500);
      return;
    }
    // TODO: Integrate with Midtrans
    alert('Fitur pembelian tiket akan terintegrasi dengan Midtrans');
  };

  const handleOpenChatbot = () => {
    if (!isAuthenticated()) {
      showToast('Harap login terlebih dahulu', 'warning');
      setTimeout(() => {
        navigate('/login');
      }, 1500);
      return;
    }
    setIsChatOpen(true);
  };

  const handleOpenChat = () => {
    if (!isAuthenticated()) {
      showToast('Harap login terlebih dahulu', 'warning');
      setTimeout(() => {
        navigate('/login');
      }, 1500);
      return;
    }
    setIsChatOpen(true);
  };

  const handleViewArticles = (periodId) => {
    navigate(`/articles?periodId=${periodId}`);
  };

  return (
    <div className="landing-page">
      {/* Navbar Component */}
      <Navbar onBuyTicket={handleBuyTicket} onOpenChat={handleOpenChat} />

      {/* Chat Modal */}
      <ChatModal isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />

      {/* Hero Section with Image Slider */}
      <section className="hero" id="beranda">
        {/* Image Slider Background */}
        <div className="hero-slider-container">
          {heroImages.map((image, index) => (
            <div
              key={index}
              className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
              style={{ backgroundImage: `url(${image})` }}
            />
          ))}
          
          {/* Overlay */}
          <div className="hero-overlay"></div>
          
          {/* Slider Indicators */}
          <div className="slider-indicators">
            {heroImages.map((_, index) => (
              <button
                key={index}
                className={`indicator ${index === currentSlide ? 'active' : ''}`}
                onClick={() => setCurrentSlide(index)}
                aria-label={`Slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Hero Content */}
        <div className="hero-content">
          <h1>Jelajahi Sejarah Presiden Soeharto</h1>
          <p>Temukan perjalanan kepemimpinan yang membentuk Indonesia modern melalui koleksi arsip, dokumen, dan artefak bersejarah</p>
          <div className="hero-buttons">
            <button className="btn btn-primary" onClick={handleOpenChatbot}>Tanya AI Chatbot</button>
            <button className="btn btn-secondary" onClick={handleBuyTicket}>Beli Tiket Museum</button>
          </div>
        </div>
      </section>

      {/* Info Banner */}
      <div className="info-banner">
        <p><strong>Museum Fisik</strong> · Buka setiap hari: 10.00–17.00 · Beli tiket online dengan Midtrans</p>
      </div>


      {/* Timeline Section */}
      <section 
        className="timeline-section" 
        id="timeline"
        style={{
          backgroundImage: `url(${timelineBackground})`,
          backgroundSize: 'contain', // Menampilkan foto sepenuhnya tanpa terpotong
          backgroundPosition: 'center top',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'scroll', // Smooth scrolling
          position: 'relative',
          backgroundColor: '#1a1a1a', // Background color untuk area yang tidak tertutup foto
          minHeight: '100vh' // Pastikan section cukup tinggi untuk menampilkan foto penuh
        }}
      >
        {/* Gradient overlay untuk readability - lebih halus */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.6) 50%, rgba(0, 0, 0, 0.8) 100%)',
          zIndex: 1
        }}></div>
        
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <h2 className="section-title" style={{ textAlign: 'center', color: 'white' }}>Garis Waktu Sejarah</h2>
          <p className="section-subtitle" style={{ textAlign: 'center', color: 'white' }}>Perjalanan penting dalam kehidupan dan kepemimpinan Presiden Soeharto</p>
        </div>
        
        <div className="timeline" style={{ position: 'relative', zIndex: 2 }}>
          {periods.length > 0 ? (
            periods.map((period, index) => (
              <TimelineItem 
                key={period.id}
                year={period.year || ''}
                title={period.name_ofPeriod || period.name || 'Untitled Period'}
                description={period.description || 'Periode penting dalam sejarah Indonesia'}
                periodId={period.id}
                onViewArticles={handleViewArticles}
              />
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <p style={{ color: 'white' }}>Loading periods...</p>
            </div>
          )}
        </div>
      </section>

      {/* Location Section with Leaflet Map */}
      <section className="container" id="lokasi">
        <h2 className="section-title">Lokasi Museum</h2>
        <p className="section-subtitle">Temukan kami dan rencanakan kunjungan Anda</p>
        
        <div className="location-container">
          <div className="location-info">
            <h3>Museum Sejarah Soeharto</h3>
            <p><strong>Alamat:</strong><br />Dusun, Jl. Kemusuk Lor Jl. Kemusuk - Sawo, Srontakan, Argomulyo, Kec. Sedayu
            <br />Kabupaten Bantul, Daerah Istimewa Yogyakarta 55752</p>
            <p><strong>Jam Operasional:</strong><br />Senin - Minggu: 08.00 - 15.30 WIB<br />(Tutup pada hari libur nasional)</p>
            <p><strong>Kontak:</strong><br />Telepon: (021) 7730703<br />Email: info@museumsoeharto.id</p>
            <button className="btn btn-primary" onClick={handleBuyTicket}>Beli Tiket Sekarang</button>
          </div>
          <div className="map-container">
            {/* Leaflet Map Component */}
            <MapLeaflet />
          </div>
        </div>
      </section>

      {/* Footer Component */}
      <Footer onBuyTicket={handleBuyTicket} onOpenChatbot={handleOpenChatbot} />
    </div>
  );
}

// Feature Card Component
function FeatureCard({ icon, title, description, buttonText, onClick }) {
  return (
    <div className="feature-card">
      <div className="feature-icon">{icon}</div>
      <div className="feature-content">
        <h3>{title}</h3>
        <p>{description}</p>
        <button className="btn btn-feature" onClick={onClick}>{buttonText}</button>
      </div>
    </div>
  );
}

// Timeline Item Component
function TimelineItem({ year, title, description, periodId, onViewArticles }) {
  return (
    <div className="timeline-item">
      <div className="timeline-content">
        <div className="timeline-year">{year}</div>
        <h4>{title}</h4>
        <p>{description}</p>
        {periodId && (
          <button 
            className="btn btn-feature" 
            onClick={() => onViewArticles(periodId)}
            style={{ marginTop: '1rem' }}
          >
            Lihat Artikel
          </button>
        )}
      </div>
      <div className="timeline-dot"></div>
    </div>
  );
}
