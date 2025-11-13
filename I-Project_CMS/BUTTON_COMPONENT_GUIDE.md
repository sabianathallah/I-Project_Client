# Reusable Button Component - CMS Museum

## 📍 Lokasi
`/src/component/button-reusable.jsx`

## 🎯 Fitur Button Component

### Props yang Tersedia:
1. **nameProp** (required) - Text yang ditampilkan di button
2. **type** (optional, default: "submit") - Type button: "submit", "button", "reset"
3. **onClick** (optional) - Function yang dipanggil saat button diklik
4. **disabled** (optional, default: false) - Menonaktifkan button
5. **variant** (optional, default: "primary") - Style variant button
6. **fullWidth** (optional, default: true) - Button full width atau tidak
7. **className** (optional) - Custom className tambahan

### Variant yang Tersedia:

#### 1. Primary (Default)
- Warna: Gradient amber-yellow
- Cocok untuk: Submit form, aksi utama
```jsx
<Button nameProp="Simpan" variant="primary" />
```

#### 2. Secondary
- Warna: Border amber dengan background putih
- Cocok untuk: Tombol batal, aksi sekunder
```jsx
<Button nameProp="Batal" variant="secondary" />
```

#### 3. Danger
- Warna: Border merah dengan background putih
- Cocok untuk: Tombol hapus, aksi berbahaya
```jsx
<Button nameProp="Hapus" variant="danger" />
```

#### 4. Dark
- Warna: Background hitam dengan shadow
- Cocok untuk: Style alternatif
```jsx
<Button nameProp="Login" variant="dark" />
```

## 📖 Contoh Penggunaan

### 1. Login/Register Form
```jsx
import Button from '../component/button-reusable.jsx'

<Button nameProp="Masuk" type="submit" variant="primary" />
```

### 2. Form dengan Tombol Batal dan Simpan
```jsx
<div className="flex gap-4">
  <Button 
    nameProp="Batal"
    type="button"
    onClick={() => navigate("/articles")}
    variant="secondary"
    fullWidth={true}
  />
  <Button 
    nameProp="Simpan Artikel"
    type="submit"
    disabled={loading}
    variant="primary"
    fullWidth={true}
  />
</div>
```

### 3. Button dengan Loading State
```jsx
<Button 
  nameProp={loading ? "Menyimpan..." : "Simpan"}
  type="submit"
  disabled={loading}
  variant="primary"
/>
```

### 4. Button Tidak Full Width
```jsx
<Button 
  nameProp="Lihat Detail"
  fullWidth={false}
  variant="secondary"
/>
```

## ✅ File yang Sudah Menggunakan Button Component

1. ✅ **login,.jsx** - Button "Masuk"
2. ✅ **register.jsx** - Button "Daftar"
3. ✅ **AddArticle.jsx** - Button "Batal" dan "Simpan Artikel"
4. ✅ **EditArticle.jsx** - Button "Batal" dan "Perbarui Artikel"
5. ✅ **PeriodTable.jsx** - Modal button "Batal" dan "Simpan/Perbarui"

## 🎨 Styling

Button component sudah include:
- ✅ Padding dan border radius yang konsisten
- ✅ Hover effects
- ✅ Transform scale untuk primary variant
- ✅ Disabled state dengan opacity
- ✅ Shadow untuk depth
- ✅ Transition smooth untuk semua changes
- ✅ Responsive dengan fullWidth option

## 💡 Tips

1. **Untuk form submit**: Gunakan `type="submit"` (default)
2. **Untuk aksi non-submit**: Gunakan `type="button"` dan tambahkan `onClick`
3. **Untuk loading state**: Ubah `nameProp` dan set `disabled={true}`
4. **Untuk side-by-side buttons**: Wrap dengan flex container dan set `fullWidth={true}`

## 🔧 Customization

Jika perlu styling tambahan:
```jsx
<Button 
  nameProp="Custom Button"
  className="mt-4 mb-2"  // Tambahkan margin
  variant="primary"
/>
```

---

**Note**: Component ini konsisten dengan tema Museum Soeharto menggunakan warna amber/gold palette.
