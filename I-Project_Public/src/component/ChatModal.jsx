import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import baseUrl from '../constant/url';
import geminiLogo from '../assets/images/logo-geminiai.jpg';

export default function ChatModal({ isOpen, onClose }) {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const messageCounter = useRef(0);
  const { token } = useAuth();
  const { showToast } = useToast();
  
  const MAX_CHARACTERS = 1000;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!inputMessage.trim() || isLoading) return;
    
    // Validate message length
    if (inputMessage.length > MAX_CHARACTERS) {
      showToast(`Pesan terlalu panjang. Maksimal ${MAX_CHARACTERS} karakter.`, 'warning');
      return;
    }
    
    // Check if user is authenticated
    if (!token) {
      showToast('Anda harus login terlebih dahulu untuk menggunakan chatbot.', 'warning');
      return;
    }

    const userMessage = {
      id: `${Date.now()}-${messageCounter.current++}`,
      text: inputMessage,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch(`${baseUrl}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ message: userMessage.text }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle specific error codes
        if (response.status === 401) {
          throw new Error('Sesi Anda telah berakhir. Silakan login kembali.');
        } else if (response.status === 400) {
          throw new Error(data.message || 'Pesan tidak valid.');
        } else if (response.status === 500) {
          throw new Error('Server sedang mengalami gangguan. Silakan coba lagi nanti.');
        } else {
          throw new Error(data.message || 'Terjadi kesalahan pada server.');
        }
      }

      // Parse response according to API documentation
      const aiResponse = data.data?.aiResponse || data.aiResponse || data.message || 'Maaf, saya tidak dapat memproses permintaan Anda.';

      const aiMessage = {
        id: `${Date.now()}-${messageCounter.current++}`,
        text: aiResponse,
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      showToast(error.message || 'Terjadi kesalahan dalam menghubungi server', 'error');
      
      const errorMessage = {
        id: `${Date.now()}-${messageCounter.current++}`,
        text: error.message || 'Maaf, terjadi kesalahan dalam menghubungi server. Silakan coba lagi.',
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        isError: true
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };
  
  const suggestedQuestions = [
    "Siapa itu Soeharto?",
    "Kapan Soeharto menjadi presiden?",
    "Apa itu Orde Baru?",
    "Bagaimana Reformasi 1998 terjadi?",
    "Apa kebijakan ekonomi Soeharto?",
    "Ceritakan tentang keluarga Soeharto"
  ];
  
  const handleSuggestedQuestion = (question) => {
    setInputMessage(question);
  };

  if (!isOpen) return null;

  return (
    <div className="chat-modal-overlay" onClick={onClose}>
      <div className="chat-modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="chat-modal-header">
          <div className="chat-header-info">
            <div className="chat-avatar">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 5C13.66 5 15 6.34 15 8C15 9.66 13.66 11 12 11C10.34 11 9 9.66 9 8C9 6.34 10.34 5 12 5ZM12 19.2C9.5 19.2 7.29 17.92 6 15.98C6.03 13.99 10 12.9 12 12.9C13.99 12.9 17.97 13.99 18 15.98C16.71 17.92 14.5 19.2 12 19.2Z" fill="currentColor"/>
              </svg>
            </div>
            <div>
              <h3 className="chat-title">AI Assistant</h3>
              <p className="chat-status">Online</p>
              <div className="powered-by" style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '6px',
                marginTop: '4px'
              }}>
                <span style={{ 
                  fontSize: '12px', 
                  color: '#F5F5DC',
                  fontWeight: 'bold',
                  letterSpacing: '0.3px'
                }}>
                  powered by
                </span>
                <img 
                  src={geminiLogo} 
                  alt="Gemini AI" 
                  style={{ 
                    height: '24px', 
                    objectFit: 'contain',
                    display: 'block'
                  }} 
                />
              </div>
            </div>
          </div>
          <button className="chat-close-btn" onClick={onClose} aria-label="Close chat">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Messages Container */}
        <div className="chat-messages-container">
          {messages.length === 0 ? (
            <div className="chat-empty-state">
              <div className="chat-empty-icon">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
                  <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <p className="chat-empty-text">Selamat datang di Museum AI Assistant!</p>
              <p className="chat-empty-subtext">Tanyakan apa saja tentang Presiden Soeharto dan masa Orde Baru</p>
              
              {/* Suggested Questions */}
              <div className="suggested-questions">
                <p className="suggested-questions-title">💡 Pertanyaan yang sering diajukan:</p>
                <div className="suggested-questions-grid">
                  {suggestedQuestions.slice(0, 4).map((question, index) => (
                    <button
                      key={index}
                      className="suggested-question-btn"
                      onClick={() => handleSuggestedQuestion(question)}
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <div key={message.id} className={`chat-message ${message.sender} ${message.isError ? 'error' : ''}`}>
                  <div className="message-content">
                    <p className="message-text">{message.text}</p>
                    <span className="message-time">{message.timestamp}</span>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="chat-message ai">
                  <div className="message-content">
                    <div className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                    <p className="typing-text">AI sedang berpikir...</p>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input Form */}
        <form className="chat-input-form" onSubmit={handleSendMessage}>
          <div className="chat-input-wrapper">
            <textarea
              className="chat-input"
              placeholder="Ketik pesan Anda... (tekan Enter untuk kirim)"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              maxLength={MAX_CHARACTERS}
              rows="1"
            />
            <div className="input-actions">
              <span className={`char-counter ${inputMessage.length > MAX_CHARACTERS * 0.9 ? 'warning' : ''}`}>
                {inputMessage.length}/{MAX_CHARACTERS}
              </span>
              <button 
                type="submit" 
                className="chat-send-btn"
                disabled={!inputMessage.trim() || isLoading || inputMessage.length > MAX_CHARACTERS}
                aria-label="Send message"
              >
                {isLoading ? (
                  <svg className="spinner" width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" opacity="0.25"/>
                    <path d="M12 2 A10 10 0 0 1 22 12" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
