import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { createOrder, TICKET_PRICE } from '../services/orderService';

export default function TicketOrderModal({ isOpen, onClose, onOrderCreated }) {
  const { token, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    museumName: 'Museum Sejarah Soeharto',
    visitDate: '',
    ticketQuantity: 1
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'ticketQuantity' ? parseInt(value) || 1 : value
    }));
  };

  // Calculate total price using fixed TICKET_PRICE from backend (Rp 20,000)
  const totalPrice = formData.ticketQuantity * TICKET_PRICE;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      showToast('Anda harus login terlebih dahulu', 'warning');
      return;
    }

    if (!formData.visitDate) {
      showToast('Tanggal kunjungan harus diisi', 'warning');
      return;
    }

    // Check if visit date is in the future
    const selectedDate = new Date(formData.visitDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      showToast('Tanggal kunjungan harus di masa depan', 'warning');
      return;
    }

    setLoading(true);

    try {
      // v2.0 API: No need to send price_amount, backend calculates it
      const orderData = {
        ticketQuantity: formData.ticketQuantity,
        museumName: formData.museumName,
        visitDate: formData.visitDate
      };

      const response = await createOrder(orderData, token);
      
      // If Midtrans redirect URL is provided, redirect to payment page
      if (response.midtrans && response.midtrans.redirect_url) {
        showToast('Membuka halaman pembayaran...', 'info', 2000);
        window.open(response.midtrans.redirect_url, '_blank');
      }

      // Call parent callback with order info
      if (onOrderCreated) {
        onOrderCreated(response.order);
      }

      showToast('Pesanan berhasil dibuat!', 'success');

      // Reset form and close modal
      setFormData({
        museumName: 'Museum Sejarah Soeharto',
        visitDate: '',
        ticketQuantity: 1
      });
      
      onClose();
    } catch (err) {
      showToast(err.message || 'Gagal membuat order', 'error');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Get tomorrow's date as minimum selectable date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  console.log('🎟️ TicketOrderModal render, isOpen:', isOpen);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content ticket-order-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Pesan Tiket Museum</h2>
          <button className="modal-close-btn" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="ticket-order-form">
          <div className="form-group">
            <label htmlFor="museumName">Nama Museum</label>
            <input
              type="text"
              id="museumName"
              name="museumName"
              value={formData.museumName}
              onChange={handleChange}
              disabled
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="visitDate">Tanggal Kunjungan</label>
            <input
              type="date"
              id="visitDate"
              name="visitDate"
              value={formData.visitDate}
              onChange={handleChange}
              min={minDate}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="ticketQuantity">Jumlah Tiket</label>
            <input
              type="number"
              id="ticketQuantity"
              name="ticketQuantity"
              value={formData.ticketQuantity}
              onChange={handleChange}
              min="1"
              max="10"
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>Harga per Tiket</label>
            <div className="price-display">{formatCurrency(TICKET_PRICE)}</div>
            <p className="price-info">
              <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" />
              </svg>
              Harga tetap Rp 20.000 per tiket
            </p>
          </div>

          <div className="total-price">
            <span>Total Harga:</span>
            <span className="total-amount">{formatCurrency(totalPrice)}</span>
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose} className="btn btn-secondary" disabled={loading}>
              Batal
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Memproses...' : 'Lanjut ke Pembayaran'}
            </button>
          </div>

          <div className="payment-info">
            <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" />
            </svg>
            <span>Anda akan diarahkan ke halaman pembayaran Midtrans</span>
          </div>
        </form>
      </div>
    </div>
  );
}
