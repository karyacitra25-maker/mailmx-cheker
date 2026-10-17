# Mailmx Cheker — Google Authentication dengan sesi otomatis

## Yang tersedia
- Nama website: **Mailmx Cheker**
- Banner di bagian atas: **Daftar Mailmx platform stor Gmail** → https://mailmx.web.id/
- Popup promosi saat pertama kali membuka situs untuk bergabung ke saluran WhatsApp Mailmx.
- Popup disimpan sebagai sudah dilihat melalui `localStorage`, sehingga biasanya hanya muncul sekali per browser. Menghapus data situs atau menggunakan browser/perangkat lain akan membuat popup muncul lagi.
- Login Google resmi melalui Firebase Authentication.
- `browserLocalPersistence` agar sesi dipulihkan otomatis pada kunjungan berikutnya di browser/perangkat yang sama.
- Tombol logout dan pemeriksaan ulang sesi.

## Penting tentang login otomatis
Pengguna harus menyetujui login Google satu kali terlebih dahulu. Setelah itu Firebase mencoba memulihkan sesi lokal secara otomatis. Login ulang mungkin diperlukan jika pengguna logout, menghapus data browser, menggunakan mode incognito/perangkat lain, sesi dicabut, atau Google meminta autentikasi ulang. Website tidak bisa memaksa Google melewati pemeriksaan keamanan.

## Setup Firebase
1. Buka https://console.firebase.google.com/ dan buat/pilih proyek.
2. Tambahkan aplikasi Web, lalu salin konfigurasi Firebase.
3. Buka **Authentication → Sign-in method** dan aktifkan **Google**.
4. Buka **Authentication → Settings → Authorized domains** dan tambahkan domain hosting final.
5. Edit `firebase-config.js`; ganti placeholder dengan `apiKey`, `authDomain`, `projectId`, dan `appId` dari aplikasi Web Firebase.

Konfigurasi Firebase Web memang berada di frontend. Jangan pernah memasukkan service-account JSON, private key, password, token rahasia, atau kredensial server di file frontend.

## Tes lokal
Jangan buka `index.html` langsung melalui `file://`. Jalankan server lokal, misalnya:
`python -m http.server 8000`
Lalu buka `http://localhost:8000`.

## Publikasikan untuk semua orang
1. Unggah file `index.html`, `style.css`, `app.js`, dan `firebase-config.js` ke hosting static, misalnya GitHub Pages atau Cloudflare Pages.
2. Tambahkan domain hosting ke Firebase Authorized domains.
3. Buka URL publik lewat HP dan komputer; tes login Google, refresh halaman, tutup-buka browser, tombol logout, banner dan popup.
4. Sebelum dipakai publik, siapkan halaman kebijakan privasi yang menjelaskan data profil dasar yang ditampilkan, tujuan penggunaannya, dan cara menghubungi pengelola.

## Batasan keamanan
Status `LOGIN AKTIF` menunjukkan Firebase berhasil memulihkan sesi autentikasi pengguna ini. Ini bukan checker massal, bukan bukti akun akan selalu dapat login, dan tidak mendeteksi CAPTCHA sebagai status akun. Jika Google meminta verifikasi tambahan, pengguna harus menyelesaikannya di Google.
