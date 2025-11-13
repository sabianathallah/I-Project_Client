import { useNavigate } from 'react-router';

export default function BackToHomeButton() {
  const navigate = useNavigate();

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <button 
      onClick={handleBackToHome}
      className="back-to-home-button"
    >
      Kembali ke Beranda
    </button>
  );
}
