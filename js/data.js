// Data dummy katalog buku dalam format Array of Object (JSON-like).
const dataKatalogBuku = [
  { id: 1, judul: "Laskar Pelangi", penulis: "Andrea Hirata", harga: 85000, stok: 12, kategori: "Novel", emoji: "🌈", warna: "cover-lilac" },
  { id: 2, judul: "Bumi", penulis: "Tere Liye", harga: 92000, stok: 8, kategori: "Fantasi", emoji: "🌍", warna: "cover-blue" },
  { id: 3, judul: "Atomic Habits", penulis: "James Clear", harga: 110000, stok: 15, kategori: "Pengembangan Diri", emoji: "🌱", warna: "cover-green" },
  { id: 4, judul: " Filosofi Teras", penulis: "Henry Manampiring", harga: 78000, stok: 6, kategori: "Nonfiksi", emoji: "🏛️", warna: "cover-peach" },
  { id: 5, judul: "Negeri 5 Menara", penulis: "Ahmad Fuadi", harga: 89000, stok: 10, kategori: "Novel", emoji: "⛰️", warna: "cover-yellow" },
  { id: 6, judul: "The Psychology of Money", penulis: "Morgan Housel", harga: 105000, stok: 9, kategori: "Bisnis", emoji: "💡", warna: "cover-pink" }
];

// Data tracking awal untuk simulasi fitur pencarian DO.
const dataPengiriman = [
  { do: "DO-MEYLLA-001", nama: "Nadia Putri", status: "Dalam perjalanan", ekspedisi: "JNE Express", tanggal: "08 November 2026", paket: "Reguler", total: 177000, progress: 65, detail: "Paket telah tiba di gudang sortir kota tujuan." }
];