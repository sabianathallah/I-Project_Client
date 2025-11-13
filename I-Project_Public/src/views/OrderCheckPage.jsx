import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import OrderStatusModal from '../component/OrderStatusModal';

export default function OrderCheckPage() {
  const [orderId, setOrderId] = useState('');
  const [isOrderStatusOpen, setIsOrderStatusOpen] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isAuthenticated()) {
      showToast('Anda harus login terlebih dahulu', 'warning');
      setTimeout(() => {
        navigate('/login');
      }, 1500);
      return;
    }

    if (!orderId || orderId.trim() === '') {
      showToast('Masukkan Order ID yang valid', 'warning');
      return;
    }

    const orderIdNum = parseInt(orderId);
    if (isNaN(orderIdNum) || orderIdNum <= 0) {
      showToast('Order ID harus berupa angka positif', 'warning');
      return;
    }

    setIsOrderStatusOpen(true);
  };

  return (
    <div className="order-check-page">
      {/* Back to Home Button - Top Left */}
      <button onClick={() => navigate('/')} className="back-to-home-btn">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span>Kembali ke Beranda</span>
      </button>

      <div className="order-check-container">
        <div className="order-check-card">
          <div className="order-check-header">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" className="order-icon">
              <path d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15M9 5C9 6.10457 9.89543 7 11 7H13C14.1046 7 15 6.10457 15 5M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5M12 12H15M12 16H15M9 12H9.01M9 16H9.01" stroke="#d4af37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <h1>Cek Status Pesanan</h1>
            <p>Masukkan Order ID untuk melihat status pesanan tiket Anda</p>
          </div>

          <form onSubmit={handleSubmit} className="order-check-form">
            <div className="form-group">
              <label htmlFor="orderId">Order ID</label>
              <input
                type="text"
                id="orderId"
                name="orderId"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="Contoh: 123"
                className="form-input"
                required
              />
              <p className="input-hint">
                Order ID dapat ditemukan di email konfirmasi atau notifikasi pesanan Anda
              </p>
            </div>

            <button type="submit" className="btn btn-primary btn-submit">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" />
              </svg>
              Cek Status Pesanan
            </button>
          </form>

          <div className="order-check-info">
            <div className="info-item">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" />
              </svg>
              <div>
                <h3>Belum punya tiket?</h3>
                <p>Pesan tiket museum sekarang untuk kunjungan Anda</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Order Status Modal */}
      <OrderStatusModal
        isOpen={isOrderStatusOpen}
        onClose={() => {
          setIsOrderStatusOpen(false);
          setOrderId('');
        }}
        orderId={parseInt(orderId)}
      />
    </div>
  );
}
