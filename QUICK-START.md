# 🚀 Quick Start - Proteksi Kode

## 🎯 Apa yang Sudah Aktif?

Proteksi sudah **AKTIF** di proyek ini! Buka `index.html` dan coba:
- ❌ Klik kanan → Diblokir
- ❌ F12 → Diblokir  
- ❌ Ctrl+C → Diblokir
- ❌ Select text → Diblokir

## ⚡ One-Click Build (Production)

Jalankan build script untuk obfuscation + minification:

```powershell
# Opsi 1: Via PowerShell
.\build-production.ps1

# Opsi 2: Via NPM (install dependencies dulu)
npm install
npm run build
```

Hasil ada di folder `dist/` - siap deploy! 🎉

## 📦 Manual Build (Tanpa Script)

### Install Tools:
```powershell
npm install -g javascript-obfuscator terser clean-css-cli
```

### Obfuscate File:
```powershell
# Protection.js (high security)
javascript-obfuscator js/protection.js --output js/protection.min.js --compact true --control-flow-flattening true --self-defending true --string-array-encoding base64

# App.js (medium security)
javascript-obfuscator js/app.js --output js/app.min.js --compact true
```

### Minify CSS:
```powershell
cleancss -o css/styles.min.css css/styles.css
```

### Update index.html:
Ganti path ke versi `.min.js` dan `.min.css`

## 🌐 Online Tools (No Install)

Tidak mau install? Pakai online:

**JavaScript Obfuscator:**
1. Buka https://obfuscator.io/
2. Copy kode dari `js/protection.js`
3. Settings: Compact ✅, Control Flow ✅, String Array ✅
4. Klik "Obfuscate"
5. Save hasil sebagai `protection.min.js`

**CSS Minifier:**
1. Buka https://cssminifier.com/
2. Paste kode dari `css/styles.css`
3. Klik "Minify"
4. Save hasil

## ⚙️ Konfigurasi

Edit `js/protection.js` line 11-20:

```javascript
config: {
  enableRightClickBlock: true,      // Blokir klik kanan
  enableSelectBlock: true,          // Blokir select text
  enableDevToolsBlock: true,        // Blokir F12, Ctrl+Shift+I
  enableDevToolsDetection: true,    // Deteksi DevTools terbuka
  enableCopyBlock: true,            // Blokir copy/paste
  enableDebuggerLoop: false,        // ⚠️ Aggressive - bisa mengganggu
  redirectUrl: null                 // Set URL untuk redirect
}
```

## 📊 File Structure

```
FundamentalMetpen/
├── index.html                    # Main file
├── js/
│   ├── protection.js            # 🔒 Proteksi system (edit ini)
│   ├── app.js                   # Main app
│   ├── ContentLoader.js         # Content loader
│   └── NavigationManager.js     # Navigation
├── css/
│   └── styles.css               # Styles
├── content/                     # Konten HTML
│   ├── gambaran-umum/
│   ├── prolog/
│   ├── bagian-utama/
│   └── referensi/
├── build-production.ps1         # 🔨 Build script
├── package.json                 # NPM config
├── PROTECTION-GUIDE.md          # 📖 Guide lengkap
└── QUICK-START.md              # This file
```

## 🧪 Test Proteksi

Open browser dan test:

### ✅ Harus Diblokir:
- [ ] Right click (Context menu)
- [ ] F12 (DevTools)
- [ ] Ctrl+Shift+I (Inspect)
- [ ] Ctrl+U (View source)
- [ ] Ctrl+C (Copy)
- [ ] Text selection
- [ ] Drag & drop images

### ✅ Harus Berfungsi Normal:
- [ ] Navigasi sidebar
- [ ] Load content
- [ ] Scroll smooth
- [ ] Input/textarea tetap bisa di-select

### ✅ DevTools Detection:
1. Buka DevTools (paksa dari browser menu)
2. Harus muncul overlay "ACCESS DENIED"
3. Konten di-blur
4. Close DevTools → Normal kembali

## 🚀 Deploy ke Hosting

### Via Built Version:
```powershell
# 1. Build production
npm run build

# 2. Upload folder dist/ ke hosting
# - Netlify: Drag & drop folder dist/
# - GitHub Pages: Push ke branch gh-pages
# - Vercel: Deploy dari folder dist/
```

### Via Source:
Upload semua files kecuali:
- ❌ node_modules/
- ❌ .git/
- ❌ *.md files (optional)

## ⚠️ PENTING!

### Tidak 100% Aman!
Developer berpengalaman tetap bisa bypass. Ini hanya **lapisan tambahan**.

### Jangan Taruh di Frontend:
- ❌ API keys
- ❌ Passwords/secrets
- ❌ Database credentials
- ❌ Logika bisnis penting

### Selalu Gunakan Backend:
- ✅ Validasi server-side
- ✅ Authentication proper
- ✅ Authorization checks
- ✅ Rate limiting

## 📚 Resources

- 📖 **Full Guide:** `PROTECTION-GUIDE.md`
- 🔗 **Obfuscator:** https://obfuscator.io/
- 🔗 **Minifier:** https://javascript-minifier.com/
- 🔗 **CSS Minifier:** https://cssminifier.com/

## 🆘 Troubleshooting

### Build script error?
```powershell
# Set execution policy
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### NPM install gagal?
```powershell
# Clear cache
npm cache clean --force
npm install
```

### Proteksi tidak berfungsi?
1. Check console untuk errors
2. Pastikan `protection.js` loaded sebelum `app.js`
3. Clear browser cache
4. Test di browser lain

### File tidak ke-obfuscate?
```powershell
# Install tools global
npm install -g javascript-obfuscator terser clean-css-cli

# Test command
javascript-obfuscator --version
```

## 💡 Tips

### Development vs Production:
- **Development:** Pakai source files (mudah debug)
- **Production:** Pakai dist/ files (protected + optimized)

### Git Workflow:
```bash
# Development
git checkout dev
# Edit source files
git commit -m "Add feature"

# Production
npm run build
# Test dist/index.html
# Deploy dist/ folder
```

### Performance:
Minified files = Faster loading:
- JS: ~60-80% size reduction
- CSS: ~40-60% size reduction

---

**🎉 Selamat! Proyek Anda sudah terlindungi.**

Butuh help lebih lanjut? Baca `PROTECTION-GUIDE.md`
