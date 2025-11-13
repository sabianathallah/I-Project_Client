import { useState, useEffect } from 'react';

export default function Navbar({ onBuyTicket }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll for navbar transparency
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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

  return (
    <header className={`modern-header ${isScrolled ? 'scrolled' : ''}`}>
      <nav className="modern-nav">
        <div className="nav-container">
          {/* Logo */}
          <a href="#" className="modern-logo">
            <span className="logo-icon">🏛️</span>
            <div className="logo-text">
              <span className="logo-main">Museum Soeharto</span>
              <span className="logo-sub">Sejarah Indonesia</span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <ul className="nav-menu desktop-menu">
            <li><a href="#beranda" onClick={(e) => handleSmoothScroll(e, '#beranda')}>Beranda</a></li>
            <li><a href="#timeline" onClick={(e) => handleSmoothScroll(e, '#timeline')}>Timeline</a></li>
            <li><a href="#lokasi" onClick={(e) => handleSmoothScroll(e, '#lokasi')}>Lokasi</a></li>
            <li><a href="#tentang" onClick={(e) => handleSmoothScroll(e, '#tentang')}>Tentang</a></li>
          </ul>

          {/* Right Side Actions */}
          <div className="nav-actions">
            <button className="icon-btn search-btn" aria-label="Search">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2"/>
                <path d="M12.5 12.5L17 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
            <button className="cta-btn" onClick={onBuyTicket}>
              Beli Tiket
            </button>
            <button 
              className={`hamburger-btn ${isMenuOpen ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Menu"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`mobile-menu ${isMenuOpen ? 'active' : ''}`}>
          <ul className="mobile-menu-list">
            <li><a href="#beranda" onClick={(e) => { handleSmoothScroll(e, '#beranda'); setIsMenuOpen(false); }}>Beranda</a></li>
            <li><a href="#fitur" onClick={(e) => { handleSmoothScroll(e, '#fitur'); setIsMenuOpen(false); }}>Fitur</a></li>
            <li><a href="#timeline" onClick={(e) => { handleSmoothScroll(e, '#timeline'); setIsMenuOpen(false); }}>Timeline</a></li>
            <li><a href="#lokasi" onClick={(e) => { handleSmoothScroll(e, '#lokasi'); setIsMenuOpen(false); }}>Lokasi</a></li>
            <li><a href="#tentang" onClick={(e) => { handleSmoothScroll(e, '#tentang'); setIsMenuOpen(false); }}>Tentang</a></li>
            <li className="mobile-cta">
              <button className="mobile-cta-btn" onClick={() => { onBuyTicket(); setIsMenuOpen(false); }}>
                Beli Tiket Museum
              </button>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}
