import { useState, useEffect } from 'react';
import { heroImages } from '../assets/foto_landingPage';
import Navbar from '../component/navbar';
import Footer from '../component/footer';
import MapLeaflet from '../component/MapLeaflet';

export default function LandingPage() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto slide every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);

    return () => clearInterval(timer);
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
    // TODO: Integrate with Midtrans
    alert('Fitur pembelian tiket akan terintegrasi dengan Midtrans');
  };

  const handleOpenChatbot = () => {
    // TODO: Open AI Chatbot
    alert('Chatbot AI akan dibuka untuk bertanya tentang sejarah Soeharto');
  };

  return (
    <div className="landing-page">
      {/* Navbar Component */}
      <Navbar onBuyTicket={handleBuyTicket} />

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
      <section className="timeline-section" id="timeline">
        <div className="container">
          <h2 className="section-title" style={{ textAlign: 'center' }}>Garis Waktu Sejarah</h2>
          <p className="section-subtitle" style={{ textAlign: 'center' }}>Perjalanan penting dalam kehidupan dan kepemimpinan Presiden Soeharto</p>
        </div>
        
        <div className="timeline">
          <TimelineItem 
            year="1921"
            title="Kelahiran"
            description="Lahir di Kemusuk, Argomulyo, Yogyakarta pada 8 Juni 1921. Masa kecil yang sederhana membentuk karakter dan kepemimpinannya di masa depan."
          />
          
          <TimelineItem 
            year="1945"
            title="Perjuangan Kemerdekaan"
            description="Bergabung dengan tentara Indonesia dan berperan aktif dalam perjuangan mempertahankan kemerdekaan dari agresi militer Belanda."
          />
          
          <TimelineItem 
            year="1965"
            title="Gerakan 30 September"
            description="Memimpin penumpasan G30S/PKI dan memulai stabilisasi situasi keamanan nasional yang kacau."
          />
          
          <TimelineItem 
            year="1966"
            title="Supersemar"
            description="Menerima Surat Perintah Sebelas Maret yang menandai dimulainya era kepemimpinan baru dalam sejarah Indonesia."
          />
          
          <TimelineItem 
            year="1968"
            title="Presiden RI ke-2"
            description="Dilantik sebagai Presiden Republik Indonesia yang kedua oleh MPRS, memulai era Orde Baru dengan fokus pada pembangunan ekonomi."
          />
          
          <TimelineItem 
            year="1998"
            title="Masa Akhir Kepemimpinan"
            description="Mengakhiri masa kepemimpinan setelah 32 tahun memimpin Indonesia, meninggalkan warisan pembangunan yang kompleks dan kontroversial."
          />
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
function TimelineItem({ year, title, description }) {
  return (
    <div className="timeline-item">
      <div className="timeline-content">
        <div className="timeline-year">{year}</div>
        <h4>{title}</h4>
        <p>{description}</p>
      </div>
      <div className="timeline-dot"></div>
    </div>
  );
}
