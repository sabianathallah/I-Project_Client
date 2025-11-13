import { useNavigate } from 'react-router';

export default function Footer({ onBuyTicket, onOpenChatbot }) {
  const navigate = useNavigate();

  const handleSmoothScroll = (e, targetId) => {
    e.preventDefault();
    
    // Check if we're on the landing page
    const currentPath = window.location.pathname;
    
    if (currentPath !== '/') {
      // Navigate to home page first, then scroll
      navigate('/');
      setTimeout(() => {
        const target = document.querySelector(targetId);
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }, 100);
    } else {
      // Already on home page, just scroll
      const target = document.querySelector(targetId);
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
  };

  const handleSocialClick = (e, platform) => {
    e.preventDefault();
    // Placeholder for social media links
    console.log(`Social media link clicked: ${platform}`);
  };

  return (
    <footer id="tentang">
      <div className="footer-content">
        <div className="footer-section">
          <h3>Museum Soeharto</h3>
          <p style={{ color: 'rgba(255,255,255,0.8)', lineHeight: '1.7' }}>
            Museum digital yang didedikasikan untuk mendokumentasikan dan mempelajari sejarah kepemimpinan Presiden Soeharto dan era Orde Baru Indonesia.
          </p>
          <div className="social-links">
            <button onClick={(e) => handleSocialClick(e, 'Facebook')} title="Facebook">f</button>
            <button onClick={(e) => handleSocialClick(e, 'Twitter')} title="Twitter">𝕏</button>
            <button onClick={(e) => handleSocialClick(e, 'Instagram')} title="Instagram">📷</button>
            <button onClick={(e) => handleSocialClick(e, 'YouTube')} title="YouTube">▶</button>
          </div>
        </div>

        <div className="footer-section">
          <h3>Informasi</h3>
          <ul>
            <li><button onClick={(e) => handleSmoothScroll(e, '#timeline')}>Timeline Sejarah</button></li>
            <li><button onClick={(e) => handleSmoothScroll(e, '#lokasi')}>Jam Operasional</button></li>
            <li><button onClick={(e) => { e.preventDefault(); }}>FAQ</button></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Kontak</h3>
          <ul>
            <li>Dusun, Jl. Kemusuk Lor Jl. Kemusuk - Sawo, Srontakan, Argomulyo, Kec. Sedayu</li>
            <li>Kabupaten Bantul, Daerah Istimewa Yogyakarta 55752</li>
            <li>Tel: (021) 7730703</li>
            <li>Email: info@museumsoeharto.id</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2025 Museum Soeharto. Semua hak cipta dilindungi.</p>
      </div>
    </footer>
  );
}
