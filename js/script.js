// Meylla Bookstore - seluruh interaksi DOM aplikasi.
const rupiah = angka => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(angka);
const ambil = key => JSON.parse(localStorage.getItem(key) || "null");
const simpan = (key, value) => localStorage.setItem(key, JSON.stringify(value));
let katalog = ambil("meyllaKatalog") || (typeof dataKatalogBuku !== "undefined" ? dataKatalogBuku : []);
let keranjang = ambil("meyllaCart") || {};
let transaksi = ambil("meyllaOrders") || [];

function updateStorage() {
  simpan("meyllaKatalog", katalog);
  simpan("meyllaCart", keranjang);
  simpan("meyllaOrders", transaksi);
}
function showModal(id) {
  const modal = document.getElementById(id);
  if (modal) { modal.classList.add("show"); modal.setAttribute("aria-hidden", "false"); }
}
function closeModal(modal) {
  modal.classList.remove("show");
  modal.setAttribute("aria-hidden", "true");
}

// Modal login: daftar dan lupa password.
document.querySelectorAll("[data-modal]").forEach(btn => btn.addEventListener("click", () => showModal(btn.dataset.modal)));
document.querySelectorAll("[data-close]").forEach(btn => btn.addEventListener("click", () => closeModal(btn.closest(".modal"))));
document.querySelectorAll(".modal").forEach(modal => modal.addEventListener("click", e => { if (e.target === modal) closeModal(modal); }));

const loginForm = document.getElementById("loginForm");
if (loginForm) loginForm.addEventListener("submit", e => {
  e.preventDefault();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  if (email === "admin@meylla.com" && password === "12345") {
    sessionStorage.setItem("meyllaLogin", "true");
    window.location.href = "dashboard.html";
  } else alert("Email/password yang anda masukkan salah");
});
const forgotForm = document.getElementById("forgotForm");
if (forgotForm) forgotForm.addEventListener("submit", e => {
  e.preventDefault(); alert("Jika email terdaftar, petunjuk pemulihan akan dikirim. (Simulasi UTS)");
  closeModal(forgotForm.closest(".modal")); forgotForm.reset();
});
const registerForm = document.getElementById("registerForm");
if (registerForm) registerForm.addEventListener("submit", e => {
  e.preventDefault(); alert("Pendaftaran berhasil (simulasi). Silakan gunakan akun demo untuk login.");
  closeModal(registerForm.closest(".modal")); registerForm.reset();
});

// Tombol keluar dan greeting sesuai waktu lokal.
document.querySelectorAll("[data-logout]").forEach(btn => btn.addEventListener("click", () => {
  sessionStorage.removeItem("meyllaLogin"); window.location.href = "login.html";
}));
const greeting = document.getElementById("greeting");
if (greeting) {
  const jam = new Date().getHours();
  greeting.textContent = jam < 11 ? "Selamat pagi!" : jam < 15 ? "Selamat siang!" : jam < 18 ? "Selamat sore!" : "Selamat malam!";
}

// Katalog: render data array ke dalam elemen HTML.
const catalogGrid = document.getElementById("catalogGrid");
function renderKatalog(filter = "") {
  if (!catalogGrid) return;
  const hasil = katalog.filter(b => `${b.judul} ${b.penulis}`.toLowerCase().includes(filter.toLowerCase()));
  document.getElementById("bookCount").textContent = `${hasil.length} buku ditemukan`;
  catalogGrid.innerHTML = hasil.map(b => `
    <article class="book-card">
      <div class="book-cover ${b.warna || "cover-lilac"}"><span>${b.emoji || "📚"}</span><small>${b.kategori || "Buku"}</small></div>
      <div class="book-info"><span class="category">${b.kategori || "Koleksi"}</span><h3>${escapeHTML(b.judul)}</h3><p>${escapeHTML(b.penulis)}</p>
      <div class="book-bottom"><b>${rupiah(b.harga)}</b><span>Stok: ${b.stok}</span></div>
      <button class="btn btn-primary full add-cart" data-id="${b.id}" ${b.stok < 1 ? "disabled" : ""}>+ Tambah ke pesanan</button></div>
    </article>`).join("") || `<p class="empty-state">Buku tidak ditemukan.</p>`;
  catalogGrid.querySelectorAll(".add-cart").forEach(btn => btn.addEventListener("click", () => {
    const id = btn.dataset.id; keranjang[id] = (keranjang[id] || 0) + 1; updateStorage();
    alert("Buku berhasil ditambahkan ke pesanan."); 
  }));
}
function escapeHTML(teks) {
  return String(teks).replace(/[&<>"']/g, karakter => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[karakter]));
}
if (catalogGrid) {
  renderKatalog();
  document.getElementById("searchBook").addEventListener("input", e => renderKatalog(e.target.value));
}
const addBookForm = document.getElementById("addBookForm");
if (addBookForm) addBookForm.addEventListener("submit", e => {
  e.preventDefault();
  katalog.push({
    id: Date.now(), judul: document.getElementById("newTitle").value.trim(),
    penulis: document.getElementById("newAuthor").value.trim(),
    harga: Number(document.getElementById("newPrice").value),
    stok: Number(document.getElementById("newStock").value), kategori: "Buku Baru", emoji: "📚", warna: "cover-blue"
  });
  updateStorage(); renderKatalog(document.getElementById("searchBook").value); addBookForm.reset();
  alert("Stok buku baru berhasil ditambahkan.");
});

// Checkout: tampilkan keranjang dan izinkan jumlah diubah.
const cartItems = document.getElementById("cartItems");
function renderCart() {
  if (!cartItems) return;
  const entries = Object.entries(keranjang).filter(([, jumlah]) => jumlah > 0);
  if (!entries.length) cartItems.innerHTML = `<p class="empty-state">Belum ada buku. Silakan pilih buku dari katalog.</p><a href="stok.html" class="text-link">Pilih buku →</a>`;
  else cartItems.innerHTML = entries.map(([id, jumlah]) => {
    const buku = katalog.find(b => String(b.id) === String(id));
    if (!buku) return "";
    return `<div class="cart-row"><div><b>${escapeHTML(buku.judul)}</b><small>${rupiah(buku.harga)} / buku</small><strong>${rupiah(buku.harga * jumlah)}</strong></div><div class="quantity"><button data-change="${id}" data-step="-1" aria-label="Kurangi">−</button><span>${jumlah}</span><button data-change="${id}" data-step="1" aria-label="Tambah">+</button></div></div>`;
  }).join("");
  const total = entries.reduce((sum, [id, jumlah]) => {
    const buku = katalog.find(b => String(b.id) === String(id)); return sum + (buku ? buku.harga * jumlah : 0);
  }, 0);
  document.getElementById("cartTotal").textContent = rupiah(total);
  cartItems.querySelectorAll("[data-change]").forEach(btn => btn.addEventListener("click", () => {
    const id = btn.dataset.change; keranjang[id] += Number(btn.dataset.step);
    if (keranjang[id] <= 0) delete keranjang[id];
    updateStorage(); renderCart();
  }));
  return total;
}
if (cartItems) {
  renderCart();
  const historyList = document.getElementById("historyList");
  function renderHistory() {
    historyList.innerHTML = transaksi.length ? `<table><thead><tr><th>Nomor DO</th><th>Nama</th><th>Total</th><th>Pembayaran</th></tr></thead><tbody>${transaksi.map(t => `<tr><td>${t.do}</td><td>${escapeHTML(t.nama)}</td><td>${rupiah(t.total)}</td><td>${escapeHTML(t.pembayaran)}</td></tr>`).join("")}</tbody></table>` : `<p class="muted">Belum ada transaksi tersimpan.</p>`;
  }
  renderHistory();
  document.getElementById("checkoutForm").addEventListener("submit", e => {
    e.preventDefault();
    const total = renderCart();
    if (!total) { alert("Keranjang masih kosong. Silakan pilih buku terlebih dahulu."); return; }
    const nama = document.getElementById("customerName").value.trim();
    const email = document.getElementById("customerEmail").value.trim();
    const alamat = document.getElementById("customerAddress").value.trim();
    const pembayaran = document.getElementById("paymentMethod").value;
    const order = { do: "DO-MEYLLA-" + String(Date.now()).slice(-6), nama, email, alamat, pembayaran, total, tanggal: new Date().toLocaleDateString("id-ID"), status: "Pesanan diterima" };
    transaksi.unshift(order); updateStorage(); keranjang = {}; updateStorage(); renderCart(); renderHistory(); e.target.reset();
    alert(`Pesanan berhasil dibuat!\nNomor Delivery Order: ${order.do}\nSimpan nomor ini untuk tracking.`);
  });
}

// Tracking: cari nomor DO dari transaksi atau data dummy.
const trackingForm = document.getElementById("trackingForm");
if (trackingForm) trackingForm.addEventListener("submit", e => {
  e.preventDefault();
  const nomor = document.getElementById("doNumber").value.trim().toUpperCase();
  const hasil = transaksi.find(t => t.do.toUpperCase() === nomor) || dataPengiriman.find(t => t.do.toUpperCase() === nomor);
  const area = document.getElementById("trackingResult");
  area.classList.remove("hidden");
  if (!hasil) {
    area.innerHTML = `<div class="notice-error">Nomor DO <b>${escapeHTML(nomor)}</b> tidak ditemukan. Periksa kembali nomor pesanan.</div>`;
    return;
  }
  const progress = hasil.progress || 25;
  area.innerHTML = `<span class="eyebrow">HASIL PENCARIAN</span><h2>Pesanan ditemukan ✓</h2><p class="muted">Nomor Delivery Order: <b>${escapeHTML(hasil.do)}</b></p>
    <div class="progress-track"><span style="width:${progress}%"></span></div><div class="progress-label"><span>Pesanan diterima</span><b>${escapeHTML(hasil.status)}</b></div>
    <div class="tracking-details"><div><small>Nama Pemesan</small><b>${escapeHTML(hasil.nama)}</b></div><div><small>Status Pengiriman</small><b>${escapeHTML(hasil.status)}</b></div><div><small>Ekspedisi</small><b>${hasil.ekspedisi || "Kurir toko (simulasi)"}</b></div><div><small>Tanggal Kirim</small><b>${hasil.tanggal || "Menunggu proses"}</b></div><div><small>Jenis Paket</small><b>${hasil.paket || "Reguler"}</b></div><div><small>Total Pembayaran</small><b>${rupiah(hasil.total)}</b></div></div>
    <p class="muted tiny">${hasil.detail || "Pesanan sedang diproses oleh toko. Status ini merupakan simulasi front-end."}</p>`;
});