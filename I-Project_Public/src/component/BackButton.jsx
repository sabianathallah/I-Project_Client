import { useNavigate } from 'react-router';

export default function BackButton() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1); // Go back to previous page
  };

  return (
    <button 
      onClick={handleBack}
      className="back-button"
    >
      Kembali
    </button>
  );
}
