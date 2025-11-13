export default function Footer({ onBuyTicket, onOpenChatbot }) {
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

  return (
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
  );
}
