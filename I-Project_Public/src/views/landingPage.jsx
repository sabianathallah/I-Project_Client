import { useState, useEffect } from 'react';

export default function LandingPage() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Array foto-foto Presiden Soeharto
  const heroImages = [
    'https://img.antarafoto.com/cache/1200x841/1978/08/16/pidato-kenegaraan-presiden-soeharto-16bv3-dom.webp',
    'https://img.antarafoto.com/cache/1200x828/1978/10/28/pidato-kenegaraan-presiden-soeharto-16bw0-dom.jpg',
    'https://img.antarafoto.com/cache/1200x658/1983/08/16/pidato-kenegaraan-presiden-soeharto-16c6l-dom.webp',
    'https://img.antarafoto.com/cache/1200x803/1987/10/05/presiden-soeharto-hadiri-hut-abri-16cdf-dom.jpg',
    'https://img.antarafoto.com/cache/400x300/1966/10/23/pelantikan-akabri-di-istana-merdeka-16bn0-dom.jpg',
    'https://upload.wikimedia.org/wikipedia/id/thumb/1/19/Panglima_Mandala_Mayjen_Soeharto.jpg/250px-Panglima_Mandala_Mayjen_Soeharto.jpg'
  ];

  // Auto slide every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [heroImages.length]);

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
      {/* Header & Navigation */}
      <header>
        <nav>
          <a href="#" className="logo">Museum Soeharto</a>
          <ul className="nav-links">
            <li><a href="#beranda" onClick={(e) => handleSmoothScroll(e, '#beranda')}>Beranda</a></li>
            <li><a href="#fitur" onClick={(e) => handleSmoothScroll(e, '#fitur')}>Fitur</a></li>
            <li><a href="#timeline" onClick={(e) => handleSmoothScroll(e, '#timeline')}>Timeline</a></li>
            <li><a href="#lokasi" onClick={(e) => handleSmoothScroll(e, '#lokasi')}>Lokasi</a></li>
            <li><a href="#tentang" onClick={(e) => handleSmoothScroll(e, '#tentang')}>Tentang</a></li>
            <li><button className="nav-cta" onClick={handleBuyTicket}>Beli Tiket</button></li>
          </ul>
        </nav>
      </header>

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

      {/* Features Section */}
      <section className="container" id="fitur">
        <h2 className="section-title">Fitur Kami</h2>
        <p className="section-subtitle">Nikmati pengalaman digital dan kunjungan museum yang interaktif</p>
        
        <div className="features-grid">
          <FeatureCard 
            icon="💳"
            title="Beli Tiket Online"
            description="Beli tiket masuk museum fisik dengan mudah dan aman menggunakan Midtrans. Berbagai metode pembayaran tersedia untuk kemudahan Anda."
            buttonText="Beli Tiket Sekarang"
            onClick={handleBuyTicket}
          />
          
          <FeatureCard 
            icon="🤖"
            title="AI Chatbot Sejarah"
            description="Tanya apapun tentang sejarah Presiden Soeharto kepada AI Chatbot kami. Dapatkan informasi lengkap dan akurat secara real-time."
            buttonText="Mulai Bertanya"
            onClick={handleOpenChatbot}
          />
          
          <FeatureCard 
            icon="🗺️"
            title="Peta Lokasi Museum"
            description="Temukan lokasi museum fisik dengan mudah menggunakan peta interaktif Leaflet. Dapatkan petunjuk arah dan informasi aksesibilitas."
            buttonText="Lihat Peta"
            onClick={(e) => handleSmoothScroll(e, '#lokasi')}
          />
        </div>
      </section>

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
            <p><strong>Alamat:</strong><br />Jl. Contoh Museum No. 123<br />Jakarta Pusat, DKI Jakarta 10110</p>
            <p><strong>Jam Operasional:</strong><br />Senin - Minggu: 10.00 - 17.00 WIB<br />(Tutup pada hari libur nasional)</p>
            <p><strong>Kontak:</strong><br />Telepon: (021) 1234-5678<br />Email: info@museumsoeharto.id</p>
            <button className="btn btn-primary" onClick={handleBuyTicket}>Beli Tiket Sekarang</button>
          </div>
          <div className="map-container">
            <div id="map" style={{ width: '100%', height: '400px', borderRadius: '8px', background: '#e0e0e0' }}>
              {/* Leaflet Map will be integrated here */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#666' }}>
                <p>📍 Peta Leaflet akan diintegrasikan di sini</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="tentang">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Museum Soeharto</h3>
            <p style={{ color: 'rgba(255,255,255,0.8)', lineHeight: '1.7' }}>
              Museum digital yang didedikasikan untuk mendokumentasikan dan mempelajari sejarah kepemimpinan Presiden Soeharto dan era Orde Baru Indonesia.
            </p>
            <div className="social-links">
              <a href="#" title="Facebook">f</a>
              <a href="#" title="Twitter">𝕏</a>
              <a href="#" title="Instagram">📷</a>
              <a href="#" title="YouTube">▶</a>
            </div>
          </div>

          <div className="footer-section">
            <h3>Fitur</h3>
            <ul>
              <li><a href="#" onClick={handleBuyTicket}>Beli Tiket (Midtrans)</a></li>
              <li><a href="#" onClick={handleOpenChatbot}>AI Chatbot</a></li>
              <li><a href="#" onClick={(e) => handleSmoothScroll(e, '#lokasi')}>Peta Lokasi</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Informasi</h3>
            <ul>
              <li><a href="#" onClick={(e) => handleSmoothScroll(e, '#timeline')}>Timeline Sejarah</a></li>
              <li><a href="#" onClick={(e) => handleSmoothScroll(e, '#lokasi')}>Jam Operasional</a></li>
              <li><a href="#">FAQ</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Kontak</h3>
            <ul>
              <li>Jl. Contoh Museum No. 123</li>
              <li>Jakarta Pusat, 10110</li>
              <li>Tel: (021) 1234-5678</li>
              <li>Email: info@museumsoeharto.id</li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2025 Museum Soeharto. Semua hak cipta dilindungi.</p>
        </div>
      </footer>
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
