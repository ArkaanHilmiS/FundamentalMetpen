# 💰 Aplikasi Keuangan - Personal Finance Manager

Aplikasi pencatatan keuangan dengan GUI modern, tema pastel, dan integrasi Google Calendar.

## ✨ Fitur

- 📊 **GUI Modern** - Interface cantik dengan tema pastel dan rounded corners
- ➕ **Tambah Transaksi** - Catat pemasukan dan pengeluaran dengan mudah
- 📅 **Integrasi Google Calendar** - Transaksi otomatis tersimpan di kalender
- 📈 **Ringkasan Keuangan** - Lihat total pemasukan, pengeluaran, dan saldo
- 📋 **Riwayat Transaksi** - Tabel lengkap dengan warna coding
- 🗑️ **Hapus Transaksi** - Hapus transaksi yang salah
- 💾 **Penyimpanan Lokal** - Data tersimpan di file JSON lokal

## 🎨 Tema

- **Warna Pastel** yang lembut untuk mata
- **Rounded Interface** yang modern
- **Color Coding**:
  - 🟢 Hijau muda = Pemasukan
  - 🔴 Merah muda = Pengeluaran

## 🚀 Cara Install

### 1. Install Dependencies

```bash
cd "d:\0. ARKAAN HILMI"
pip install -r requirements.txt
```

### 2. (Opsional) Setup Google Calendar

Jika ingin integrasi dengan Google Calendar, ikuti panduan di [SETUP_GOOGLE_CALENDAR.md](SETUP_GOOGLE_CALENDAR.md)

**Catatan:** Aplikasi tetap berjalan normal tanpa Google Calendar!

### 3. Jalankan Aplikasi

```bash
python "# aplikasi keuangan.py"
```

## 🖥️ Membuat Shortcut di Desktop

### Cara Otomatis:

```bash
python create_desktop_shortcut.py
```

### Cara Manual:

1. Klik kanan di desktop → New → Shortcut
2. Browse ke file `# aplikasi keuangan.py`
3. Beri nama: "Aplikasi Keuangan"
4. Klik Finish

## 📖 Cara Penggunaan

### Menambah Transaksi

1. Pilih tanggal transaksi
2. Pilih tipe: Pemasukan atau Pengeluaran
3. Masukkan jumlah (angka saja, tanpa Rp atau titik)
4. Masukkan kategori (contoh: gaji, makanan, transportasi)
5. Masukkan keterangan
6. Klik tombol "✓ Tambah"

### Melihat Riwayat

- Semua transaksi ditampilkan di tabel sebelah kanan
- Warna hijau muda = Pemasukan
- Warna merah muda = Pengeluaran

### Melihat Ringkasan

- Total Pemasukan, Total Pengeluaran, dan Saldo ditampilkan di kiri bawah
- Saldo hijau = positif, merah = negatif

### Menghapus Transaksi

1. Klik transaksi yang ingin dihapus di tabel
2. Klik tombol "🗑 Hapus Transaksi"
3. Konfirmasi penghapusan

## 📁 File yang Dibuat

- `data_keuangan.json` - Database lokal transaksi
- `credentials.json` - (Opsional) Kredensial Google Calendar
- `token.pickle` - (Opsional) Token akses Google Calendar

## 🔒 Keamanan

- ✅ Semua data disimpan **lokal** di komputer Anda
- ✅ Tidak ada data yang dikirim ke server eksternal (kecuali Google Calendar jika diaktifkan)
- ⚠️ **JANGAN share** file `credentials.json` dan `token.pickle`

## ✅ Status Aplikasi

**Semua fitur sudah berfungsi dengan baik!**

Untuk mengecek instalasi:
```bash
python check_installation.py
```

## 🛠️ Troubleshooting

**Lihat panduan lengkap di:** [TROUBLESHOOTING.md](TROUBLESHOOTING.md)

### Quick Fixes:

**Import warnings di VS Code?**
- ✅ Ini normal! Abaikan saja, aplikasi tetap jalan sempurna

**Google Calendar tidak connect?**
- ✅ Aplikasi tetap jalan normal tanpa calendar

**Aplikasi tidak muncul?**
```bash
python check_installation.py  # cek dependencies
python "# aplikasi keuangan.py"  # lihat error message
```

**Error saat install?**
```bash
pip install -r requirements.txt
```

## 💡 Tips

1. **Backup Data**: Copy file `data_keuangan.json` secara berkala
2. **Kategori Konsisten**: Gunakan nama kategori yang sama untuk laporan lebih rapi
3. **Keterangan Jelas**: Tulis keterangan yang detail untuk ingat transaksi
4. **Cek Saldo**: Lihat ringkasan secara rutin untuk monitor keuangan

## 🎯 Roadmap

- [ ] Export ke Excel/PDF
- [ ] Grafik dan chart keuangan
- [ ] Budget tracking
- [ ] Reminder pembayaran rutin
- [ ] Multi-currency support

## 📝 Lisensi

Free to use for personal use.

## 👨‍💻 Dibuat dengan

- Python 3
- Tkinter (GUI)
- Google Calendar API
- tkcalendar

---

**Selamat mengelola keuangan! 💰**
