# Google OAuth Setup Guide

## 🔐 Masalah: "Please login first" saat Google Login

### Penyebab Masalah

Error `{"message":"Please login first"}` muncul karena implementasi Google OAuth belum lengkap. 

**Yang salah sebelumnya:**
- Frontend redirect ke `GET /google-login` tanpa mengirim `googleToken`
- Backend endpoint `POST /google-login` memerlukan `googleToken` di request body
- Tidak ada proses OAuth yang proper untuk mendapatkan token dari Google

### Solusi: Implementasi Google Sign-In dengan Google Identity Services

## 📋 Setup Steps

### 1. Dapatkan Google Client ID

1. Buka [Google Cloud Console](https://console.cloud.google.com)
2. Create new project atau pilih project yang sudah ada
3. Enable **Google+ API** di APIs & Services
4. Buat **OAuth 2.0 Client IDs** di Credentials:
   - Application type: **Web application**
   - Authorized JavaScript origins: `http://localhost:5173`
   - Authorized redirect URIs: `http://localhost:5173/google-callback`
5. Copy **Client ID** yang dihasilkan

### 2. Set Environment Variable

Create file `.env` di root folder `/I-Project_Public/`:

```env
# API Base URL
VITE_API_BASE_URL=http://localhost:3000

# Google OAuth Client ID
VITE_GOOGLE_CLIENT_ID=YOUR_ACTUAL_CLIENT_ID_HERE.apps.googleusercontent.com
```

⚠️ **PENTING:** Ganti `YOUR_ACTUAL_CLIENT_ID_HERE` dengan Client ID yang didapat dari Google Cloud Console

### 3. Update LoginPage.jsx

File `LoginPage.jsx` sudah diupdate dengan implementasi berikut:

```javascript
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

// Initialize Google Sign-In
useEffect(() => {
  if (!GOOGLE_CLIENT_ID) {
    console.warn('Google Client ID not configured');
    return;
  }

  // Load Google Sign-In library
  const script = document.createElement('script');
  script.src = 'https://accounts.google.com/gsi/client';
  script.async = true;
  script.defer = true;
  document.body.appendChild(script);

  script.onload = () => {
    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: handleGoogleResponse,
    });
  };
}, []);

// Handle Google OAuth response
const handleGoogleResponse = async (response) => {
  // Send Google token to backend
  const res = await fetch(`${baseUrl}/google-login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      googleToken: response.credential // JWT token from Google
    }),
  });
  
  const data = await res.json();
  login(data.user, data.access_token);
};
```

## 🔄 Flow Google OAuth

```
┌──────────┐         ┌────────────┐         ┌──────────┐
│  User    │         │  Frontend  │         │  Backend │
│  clicks  │  ────>  │  (React)   │  ────>  │  (API)   │
│  button  │         │            │         │          │
└──────────┘         └────────────┘         └──────────┘
                            │
                            │ Load Google Script
                            ▼
                     ┌──────────────┐
                     │   Google     │
                     │   Sign-In    │
                     │   (Popup)    │
                     └──────────────┘
                            │
                            │ Return JWT Token
                            ▼
                     ┌──────────────┐
                     │  Frontend    │
                     │  receives    │
                     │  credential  │
                     └──────────────┘
                            │
                            │ POST /google-login
                            │ { googleToken: "..." }
                            ▼
                     ┌──────────────┐
                     │  Backend     │
                     │  verifies    │
                     │  returns JWT │
                     └──────────────┘
```

## ✅ Testing

1. **Check Console:** Buka browser console, cari warning:
   ```
   ⚠️ Google Client ID not configured. Please add VITE_GOOGLE_CLIENT_ID to .env file
   ```
   
2. **If warning appears:** Google Client ID belum diset di `.env`

3. **If no warning:** Google Sign-In sudah ter-initialize

4. **Click Google Login button:**
   - Popup Google Sign-In should appear
   - Select your Google account
   - Backend akan menerima `googleToken` dan return `access_token`
   - User akan di-redirect ke homepage dengan status logged in

## 🐛 Troubleshooting

### Error: "Please login first"
**Penyebab:** Backend tidak menerima `googleToken` yang valid  
**Solusi:** 
- Pastikan `.env` file ada dan berisi `VITE_GOOGLE_CLIENT_ID`
- Restart Vite dev server: `npm run dev`
- Check browser console untuk error messages

### Error: "Google Sign-In belum siap"
**Penyebab:** Google script belum selesai loading  
**Solusi:** 
- Refresh halaman
- Check internet connection
- Check if `https://accounts.google.com/gsi/client` can be loaded

### Popup tidak muncul
**Penyebab:** Browser memblokir popup  
**Solusi:**
- Allow popups dari `localhost:5173`
- Check browser console untuk blocked popup warning

## 📝 Backend Requirements

Backend (`POST /google-login`) harus:

1. **Accept request body:**
   ```json
   {
     "googleToken": "eyJhbGciOiJSUzI1NiIsImtpZCI..."
   }
   ```

2. **Verify Google token** menggunakan Google OAuth2 library

3. **Return response:**
   ```json
   {
     "access_token": "your_jwt_token_here",
     "user": {
       "id": 1,
       "fullName": "John Doe",
       "email": "user@gmail.com",
       "isMembership": false
     }
   }
   ```

## 🔗 Resources

- [Google Identity Services](https://developers.google.com/identity/gsi/web/guides/overview)
- [Google Cloud Console](https://console.cloud.google.com)
- [OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
