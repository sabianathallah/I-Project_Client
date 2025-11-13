import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { logoImage } from '../assets/logo';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ onBuyTicket, onOpenChat }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const userMenuRef = useRef(null);

  // Handle scroll for navbar transparency
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    navigate('/');
  };

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

  const handleLogoClick = (e) => {
    e.preventDefault();
    navigate('/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className={`modern-header ${isScrolled ? 'scrolled' : ''}`}>
      <nav className="modern-nav">
        <div className="nav-container">
          {/* Logo */}
          <button onClick={handleLogoClick} className="modern-logo">
            <img 
              src={logoImage} 
              alt="Museum Soeharto Logo" 
              className="logo-navbar-img"
            />
          </button>

          {/* Desktop Navigation */}
          <ul className="nav-menu desktop-menu">
            <li><button onClick={(e) => handleSmoothScroll(e, '#beranda')}>Beranda</button></li>
            <li><button onClick={(e) => handleSmoothScroll(e, '#timeline')}>Timeline</button></li>
            <li><button onClick={(e) => handleSmoothScroll(e, '#lokasi')}>Lokasi</button></li>
            <li><button onClick={(e) => handleSmoothScroll(e, '#tentang')}>Tentang</button></li>
          </ul>

          {/* Right Side Actions */}
          <div className="nav-actions">
            <button className="icon-btn chat-btn" onClick={onOpenChat} aria-label="Chat AI">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button className="cta-btn" onClick={onBuyTicket}>
              Beli Tiket
            </button>
            
            {/* User Menu */}
            {isAuthenticated() ? (
              <div className="user-menu-container" ref={userMenuRef}>
                <button 
                  className="icon-btn user-btn" 
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  aria-label="User Menu"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 5C13.66 5 15 6.34 15 8C15 9.66 13.66 11 12 11C10.34 11 9 9.66 9 8C9 6.34 10.34 5 12 5ZM12 19.2C9.5 19.2 7.29 17.92 6 15.98C6.03 13.99 10 12.9 12 12.9C13.99 12.9 17.97 13.99 18 15.98C16.71 17.92 14.5 19.2 12 19.2Z" fill="currentColor"/>
                  </svg>
                </button>
                
                {isUserMenuOpen && (
                  <div className="user-dropdown">
                    <div className="user-dropdown-header">
                      <div className="user-avatar">
                        {user?.username?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div className="user-info">
                        <p className="user-name">{user?.username || 'User'}</p>
                        <p className="user-email">{user?.email}</p>
                      </div>
                    </div>
                    <div className="user-dropdown-divider"></div>
                    <button 
                      className="user-dropdown-item" 
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        navigate('/order-check');
                      }}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <path d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15M9 5C9 6.10457 9.89543 7 11 7H13C14.1046 7 15 6.10457 15 5M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5M12 12H15M12 16H15M9 12H9.01M9 16H9.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Cek Pesanan
                    </button>
                    <button className="user-dropdown-item" onClick={handleLogout}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <path d="M17 7L15.59 8.41L18.17 11H8V13H18.17L15.59 15.58L17 17L22 12L17 7ZM4 5H12V3H4C2.9 3 2 3.9 2 5V19C2 20.1 2.9 21 4 21H12V19H4V5Z" fill="currentColor"/>
                      </svg>
                      Keluar
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button 
                className="icon-btn login-btn" 
                onClick={() => navigate('/login')}
                aria-label="Login"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M11 7L9.6 8.4L12.2 11H2V13H12.2L9.6 15.6L11 17L16 12L11 7ZM20 19H12V21H20C21.1 21 22 20.1 22 19V5C22 3.9 21.1 3 20 3H12V5H20V19Z" fill="currentColor"/>
                </svg>
              </button>
            )}
            
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
            <li><button onClick={(e) => { handleSmoothScroll(e, '#beranda'); setIsMenuOpen(false); }}>Beranda</button></li>
            <li><button onClick={(e) => { handleSmoothScroll(e, '#fitur'); setIsMenuOpen(false); }}>Fitur</button></li>
            <li><button onClick={(e) => { handleSmoothScroll(e, '#timeline'); setIsMenuOpen(false); }}>Timeline</button></li>
            <li><button onClick={(e) => { handleSmoothScroll(e, '#lokasi'); setIsMenuOpen(false); }}>Lokasi</button></li>
            <li><button onClick={(e) => { handleSmoothScroll(e, '#tentang'); setIsMenuOpen(false); }}>Tentang</button></li>
            <li className="mobile-cta">
              <button className="mobile-cta-btn" onClick={() => { onBuyTicket(); setIsMenuOpen(false); }}>
                Beli Tiket Museum
              </button>
            </li>
            {isAuthenticated() ? (
              <li className="mobile-user-info">
                <div className="mobile-user-details">
                  <span className="mobile-user-name">{user?.username || user?.email}</span>
                </div>
                <button className="mobile-logout-btn" onClick={() => { handleLogout(); setIsMenuOpen(false); }}>
                  Keluar
                </button>
              </li>
            ) : (
              <li className="mobile-auth-btns">
                <button className="mobile-login-btn" onClick={() => { navigate('/login'); setIsMenuOpen(false); }}>
                  Masuk
                </button>
                <button className="mobile-register-btn" onClick={() => { navigate('/register'); setIsMenuOpen(false); }}>
                  Daftar
                </button>
              </li>
            )}
          </ul>
        </div>
      </nav>
    </header>
  );
}
