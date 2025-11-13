import { API_ENDPOINTS } from '../constant/url';

// Fixed ticket price (backend enforced)
export const TICKET_PRICE = 20000;

/**
 * Create a new order for museum ticket
 * @param {Object} orderData - Order data
 * @param {number} orderData.ticketQuantity - Number of tickets (required)
 * @param {string} orderData.museumName - Museum name (optional)
 * @param {string} orderData.visitDate - Visit date YYYY-MM-DD (optional)
 * @param {string} token - JWT token
 * @returns {Promise} Order response with Midtrans data
 */
export const createOrder = async (orderData, token) => {
  try {
    // Remove price_amount from request body (v2.0 API change)
    // Backend now enforces fixed price of Rp 20,000 per ticket
    const requestBody = {
      ticketQuantity: orderData.ticketQuantity
    };

    // Add optional fields if provided
    if (orderData.museumName) {
      requestBody.museumName = orderData.museumName;
    }
    if (orderData.visitDate) {
      requestBody.visitDate = orderData.visitDate;
    }

    const response = await fetch(API_ENDPOINTS.ORDERS, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(requestBody)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to create order');
    }

    return data;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

/**
 * Get order status and sync with Midtrans
 * @param {number} orderId - Order ID
 * @param {string} token - JWT token
 * @returns {Promise} Order status data
 */
export const getOrderStatus = async (orderId, token) => {
  try {
    const response = await fetch(API_ENDPOINTS.ORDER_STATUS(orderId), {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to get order status');
    }

    return data;
  } catch (error) {
    console.error('Error getting order status:', error);
    throw error;
  }
};
