# School Dashboard

Aplikasi web untuk login, user dashboard, dan admin dashboard dengan desain Neumorphism dan warna teal. Menggunakan HTML, TailwindCSS, JS, dan Google Apps Script.

## Fitur
- **Login Page**: Masukkan PIN, autentikasi via Google Sheets.
- **User Dashboard**: Lihat profil, ganti foto, dan nilai.
- **Admin Dashboard**: Upload file nilai (.xlsx/.csv), edit nilai.

## Setup
1. **Google Sheets**:
   - Buat spreadsheet dengan sheet "Users" (PIN, Role, Nama, Photo) dan "Nilai" (Siswa, Mapel, Nilai).
   - Catat ID spreadsheet dari URL.
2. **Google Drive**:
   - Buat folder untuk foto profil, catat ID folder dari URL.
3. **Google Apps Script**:
   - Buka script.google.com, paste kode di `code.gs`.
   - Ganti `YOUR_SPREADSHEET_ID` dan `YOUR_FOLDER_ID`.
   - Deploy: Deploy > New Deployment > Web App > Access: Anyone.
4. **GitHub**:
   - Upload semua file ke repo.
   - Host via GitHub Pages: Settings > Pages > Branch: main.

## Struktur
- `/pages`: Halaman utama (index.html).
- `/scripts`: Logika JS (main.js).
- `/styles`: CSS tambahan (main.css).
- `/server`: Google Apps Script (code.gs).
- `/assets`: Gambar dan font.

## Error
- **Login gagal**: Cek PIN di sheet "Users".
- **Upload gagal**: Pastikan format file .xlsx/.csv benar.
- **Desain aneh**: Cek koneksi TailwindCSS.
