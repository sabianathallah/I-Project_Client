import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function GoogleCallback() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showToast } = useToast();

  useEffect(() => {
    // This callback is primarily for server-side OAuth flow (if backend implements it)
    // For client-side GSI flow, this page may not be needed
    
    // Get token from URL query parameters (server-side flow)
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const accessToken = urlParams.get('access_token');
    const userParam = urlParams.get('user');
    const error = urlParams.get('error');

    if (error) {
      console.error('Google login error:', error);
      showToast('Login dengan Google gagal. Silakan coba lagi.', 'error');
      navigate('/login');
      return;
    }

    const authToken = token || accessToken;

    if (authToken) {
      let userData = {};
      
      if (userParam) {
        try {
          userData = JSON.parse(decodeURIComponent(userParam));
        } catch (e) {
          console.error('Error parsing user data:', e);
        }
      }

      // Save token and user data
      login(userData, authToken);
      showToast('Login berhasil! Selamat datang.', 'success');
      
      // Redirect to home
      navigate('/');
    } else {
      // No token found, redirect to login
      console.log('No token found in callback URL, redirecting to login');
      showToast('Tidak ada token autentikasi. Silakan login kembali.', 'warning');
      navigate('/login');
    }
  }, [navigate, login, showToast]);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2416 50%, #1a1a1a 100%)',
      color: '#e0e0e0'
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: '50px',
          height: '50px',
          border: '4px solid rgba(212, 175, 55, 0.3)',
          borderTop: '4px solid #d4af37',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 20px'
        }}></div>
        <h2 style={{ color: '#ffffff', marginBottom: '8px' }}>Memproses login...</h2>
        <p style={{ color: '#8b7355' }}>Mohon tunggu sebentar</p>
      </div>
    </div>
  );
}
