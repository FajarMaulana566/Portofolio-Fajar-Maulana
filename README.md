# Portofolio Mochamad Fajar Maulana

Kode mandiri HTML, CSS, JavaScript, dan JSON. Tidak memerlukan akun layanan, API key, atau library tambahan. Sudah termasuk foto dokumentasi proyek UAS, animasi, tema terang/gelap, galeri, serta halaman statis siap unggah.

## Menjalankan di komputer

1. Ekstrak ZIP dan buka folder `portfolio-fajar` di VS Code.
2. Gunakan Node.js versi 22 atau lebih baru.
3. Buka terminal di folder tersebut, jalankan `npm run dev`.
4. Buka `http://localhost:3000`. Hentikan dengan Ctrl+C.

Tidak perlu `npm install` karena tidak ada dependency. Jangan membuka HTML dengan klik dua kali: website menggunakan URL absolut dan modul JavaScript yang perlu server lokal.

Setelah mengedit data atau komponen, jalankan `npm run build`, lalu refresh browser. CSS dan JavaScript di `dist` cukup disimpan lalu refresh. `npm start` menjalankan hasil build yang sudah ada. `npm run check` memeriksa halaman, aset, dan kontras warna utama.

## File yang perlu diedit

| Bagian | File |
| --- | --- |
| Nama, profil, status mahasiswa, kampus, jurusan, foto | `content/profile.json` |
| Instagram, WhatsApp, email, LinkedIn | `content/socials.json` |
| Fotografi | `content/photography.json` |
| Editing | `content/editing.json` |
| Desain grafis | `content/design.json` |
| Proyek web | `content/web.json` |
| Robotika / proyek UAS | `content/robotics.json` |
| Microsoft Office | `content/office.json` |
| Skills dan tools | `content/skills.json` |
| Struktur komponen halaman | `src/views.mjs` |
| Warna, ukuran, responsivitas, animasi | `dist/style.css`, `dist/enhancements.css`, `dist/student-contact.css` |
| Interaksi dan navigasi | `dist/app.js`, `dist/modules/` |
| Gambar | `dist/images/` |

## Mengisi kontak

Edit `content/socials.json`:

```json
{
  "email": "nama@domain-anda.com",
  "whatsapp": "6281234567890",
  "instagram": "https://www.instagram.com/username-anda/",
  "linkedin": ""
}
```

Nilai di atas hanya contoh format, bukan kontak pemilik. Isi dengan kontak asli. WhatsApp menggunakan kode negara dan angka saja. Setelah build, kontak tampil otomatis di beranda dan footer setiap halaman. Jika kosong, ditampilkan sebagai belum tersedia. Form membuka WhatsApp atau aplikasi email untuk dikirim oleh pengunjung; tidak ada server pengiriman email.

## Foto dan proyek

- Masukkan foto formal/nonformal ke `dist/images/`, lalu isi `formalPhoto` dan `casualPhoto` di profile.json, misalnya `/images/formal.webp`.
- Tambahkan proyek pada array kategori sesuai. Gunakan id unik berupa huruf kecil, angka, atau tanda hubung; path bernilai creative atau tech.
- Isi title, description, result, tools, image, alt. Set sample ke false untuk karya asli. demo dan github opsional.
- Gambar responsif dapat diberi srcset, width, height. Gallery berisi objek src, alt, caption serta srcset opsional.
- Pada editing, isi before dan image untuk slider perbandingan.
- Showcase UAS memakai foto rangkaian, dashboard, dan Telegram dari laporan asli. Efek 3D berupa lapisan gambar yang dapat dimiringkan, bukan model CAD.

## Hosting mandiri

1. Ganti `siteUrl` di `content/profile.json` dari `https://example.com` menjadi domain Anda tanpa garis miring terakhir.
2. Jalankan `npm run build` dan `npm run check`.
3. Unggah seluruh **isi** folder `dist` ke root website, misalnya `public_html`. Pastikan host mendukung index.html dalam subfolder.

Tidak perlu mengunggah content, src, scripts, atau package.json. Folder tersebut digunakan untuk mengedit dan menghasilkan website. HTML hasil render berada di dist; jangan mengedit HTML hasil render karena akan ditimpa saat build.

Situs memakai jalur root `/`, sehingga harus ditempatkan di root domain/subdomain. Foto profil dan kontak asli belum disediakan. Beberapa proyek selain UAS masih merupakan contoh konten.
