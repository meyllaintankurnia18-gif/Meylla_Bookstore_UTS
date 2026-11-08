# Meylla Bookstore - UTS Pemrograman Web 1

## Cara menjalankan
1. Ekstrak folder `meylla_bookstore`.
2. Buka folder tersebut di Visual Studio Code.
3. Jalankan `login.html` menggunakan ekstensi Live Server (disarankan), atau buka langsung di browser.
4. Login dengan akun demo:
   - Email: `admin@meylla.com`
   - Password: `12345`
   ![Gambar 1](ss/ss1.png)

## Halaman
- `login.html`: login, lupa password, dan daftar (modal).
   ![Gambar 2](ss/ss2.png)
- `dashboard.html`: menu utama dan greeting sesuai waktu lokal.
   ![Gambar 3](ss/ss3.png)
- `stok.html`: katalog dinamis, pencarian, tambah stok, tambah ke pesanan.
   ![Gambar 4](ss/ss4.png)
   ![Gambar 5](ss/ss5.png)
   ![Gambar 6](ss/ss6.png)
   ![Gambar 7](ss/ss7.png)
- `checkout.html`: ubah jumlah pesanan, data pemesan/pembayaran, riwayat transaksi.
   ![Gambar 8](ss/ss8.png)
- `tracking.html`: pencarian nomor DO dan status pengiriman.
   ![Gambar 9](ss/ss5.png)
   ![Gambar 10](ss/ss10.png)

## Catatan
- Data katalog dan transaksi disimpan di `localStorage` browser agar simulasi tetap tersedia setelah halaman dimuat ulang.
- Login, pendaftaran, lupa password, pembayaran, dan pengiriman merupakan simulasi front-end, bukan autentikasi atau transaksi sungguhan.
- Nomor tracking contoh: `DO-MEYLLA-001`. Nomor DO baru akan muncul setelah membuat pesanan.
   ![Gambar 11](ss/ss11.png)