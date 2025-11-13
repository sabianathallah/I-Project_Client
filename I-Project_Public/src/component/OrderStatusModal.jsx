import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { getOrderStatus } from '../services/orderService';

export default function OrderStatusModal({ isOpen, onClose, orderId }) {
  const { token } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [orderData, setOrderData] = useState(null);

  useEffect(() => {
    if (isOpen && orderId) {
      fetchOrderStatus();
    }
  }, [isOpen, orderId]);

  const fetchOrderStatus = async () => {
    setLoading(true);
    setError('');

    try {
      const data = await getOrderStatus(orderId, token);
      setOrderData(data);
    } catch (err) {
      const errorMsg = err.message || 'Gagal memuat status order';
      setError(errorMsg);
      showToast(errorMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { text: 'Menunggu Pembayaran', class: 'status-pending' },
      paid: { text: 'Sudah Dibayar', class: 'status-paid' },
      cancelled: { text: 'Dibatalkan', class: 'status-cancelled' },
      expired: { text: 'Kadaluarsa', class: 'status-expired' },
      used: { text: 'Sudah Digunakan', class: 'status-used' }
    };

    const config = statusConfig[status] || { text: status, class: 'status-default' };
    return <span className={`status-badge ${config.class}`}>{config.text}</span>;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatVisitDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content order-status-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Status Pesanan</h2>
          <button className="modal-close-btn" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="order-status-content">
          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Memuat status pesanan...</p>
            </div>
          ) : error ? (
            <div className="error-state">
              <svg width="48" height="48" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" />
              </svg>
              <p>{error}</p>
              <button onClick={fetchOrderStatus} className="btn btn-retry">
                Coba Lagi
              </button>
            </div>
          ) : orderData ? (
            <div className="order-details">
              {/* Order Status */}
              <div className="detail-section status-section">
                <div className="status-icon">
                  {orderData.order.status === 'paid' ? (
                    <svg width="48" height="48" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                    </svg>
                  ) : (
                    <svg width="48" height="48" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" />
                    </svg>
                  )}
                </div>
                {getStatusBadge(orderData.order.status)}
              </div>

              {/* Order Info */}
              <div className="detail-section">
                <h3>Informasi Pesanan</h3>
                <div className="detail-row">
                  <span className="label">Order ID:</span>
                  <span className="value">#{orderData.order.id}</span>
                </div>
                {orderData.order.ticketCode && (
                  <div className="detail-row ticket-code-row">
                    <span className="label">Kode Tiket:</span>
                    <span className="value ticket-code">{orderData.order.ticketCode}</span>
                  </div>
                )}
                <div className="detail-row">
                  <span className="label">Museum:</span>
                  <span className="value">{orderData.order.museumName || '-'}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Tanggal Kunjungan:</span>
                  <span className="value">{formatVisitDate(orderData.order.visitDate)}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Jumlah Tiket:</span>
                  <span className="value">{orderData.order.ticketQuantity} tiket</span>
                </div>
                <div className="detail-row">
                  <span className="label">Total Harga:</span>
                  <span className="value highlight">{formatCurrency(orderData.order.price_amount)}</span>
                </div>
              </div>

              {/* Payment Info */}
              {orderData.midtrans && (
                <div className="detail-section">
                  <h3>Informasi Pembayaran</h3>
                  <div className="detail-row">
                    <span className="label">Metode Pembayaran:</span>
                    <span className="value">{orderData.midtrans.payment_type || '-'}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Transaction ID:</span>
                    <span className="value small">{orderData.midtrans.transaction_id || '-'}</span>
                  </div>
                  {orderData.order.paidAt && (
                    <div className="detail-row">
                      <span className="label">Dibayar pada:</span>
                      <span className="value">{formatDate(orderData.order.paidAt)}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Dates */}
              <div className="detail-section">
                <h3>Tanggal</h3>
                <div className="detail-row">
                  <span className="label">Dibuat:</span>
                  <span className="value">{formatDate(orderData.order.createdAt)}</span>
                </div>
                {orderData.order.expiredAt && (
                  <div className="detail-row">
                    <span className="label">Kadaluarsa:</span>
                    <span className="value">{formatDate(orderData.order.expiredAt)}</span>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div className="action-section">
                <button onClick={fetchOrderStatus} className="btn btn-refresh">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" />
                  </svg>
                  Refresh Status
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
