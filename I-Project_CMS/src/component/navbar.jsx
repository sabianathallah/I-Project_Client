import {NavLink, useNavigate} from 'react-router'
import logoNavbar from '../assets/logo-navbar.png'

export default function Navbar() {
  const navigate = useNavigate();

  function handleLogout() {
    if (window.confirm("Apakah Anda yakin ingin logout?")) {
      localStorage.clear();
      navigate('/');
    }
  }

  return (
    <div className="relative z-10">
      <nav className="sticky top-0 z-50 bg-gradient-to-r from-amber-900 via-yellow-800 to-amber-900 backdrop-blur-sm px-6 py-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center space-x-3">
          <img
            src={logoNavbar}
            alt="Museum Soeharto Logo"
            className="h-12 drop-shadow-md cursor-pointer"
            onClick={() => navigate('/articles')}
          />
          <span className="text-[#d4af37] font-bold text-2xl tracking-wide drop-shadow-md">CMS Museum Soeharto</span>
        </div>

        <ul className="flex items-center space-x-6">
          <li>
            <NavLink 
              to="/articles" 
              className={({ isActive }) => 
                isActive 
                  ? "text-[#d4af37] font-bold border-b-2 border-[#d4af37] pb-1" 
                  : "text-amber-200 hover:text-white transition-colors font-semibold"
              }
            >
              Artikel
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/periods" 
              className={({ isActive }) => 
                isActive 
                  ? "text-[#d4af37] font-bold border-b-2 border-[#d4af37] pb-1" 
                  : "text-amber-200 hover:text-white transition-colors font-semibold"
              }
            >
              Periode
            </NavLink>
          </li>
          <li>
            <button 
              onClick={handleLogout} 
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold transition-all transform hover:scale-105 shadow-md"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
              </svg>
              Logout
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}

