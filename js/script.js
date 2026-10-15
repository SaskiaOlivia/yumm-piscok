const NOMOR_WA = "628576311757";

const produk = document.getElementById("orderProduct");
const jumlah = document.getElementById("quantity");
const total = document.getElementById("totalPrice");

function formatRupiah(angka) {
  return "Rp" + angka.toLocaleString("id-ID");
}

function hargaProduk() {
  return Number(
    produk.options[produk.selectedIndex].dataset.price
  );
}

function hitungTotal() {
  let qty = Number.parseInt(jumlah.value, 10) || 1;
  qty = Math.max(1, Math.min(99, qty));
  jumlah.value = qty;

  total.textContent = formatRupiah(
    hargaProduk() * qty
  );
}

produk.addEventListener("change", hitungTotal);
jumlah.addEventListener("input", hitungTotal);

document.getElementById("minusQty")
  .addEventListener("click", function () {
    jumlah.value = Math.max(
      1,
      (Number.parseInt(jumlah.value, 10) || 1) - 1
    );
    hitungTotal();
  });

document.getElementById("plusQty")
  .addEventListener("click", function () {
    jumlah.value = Math.min(
      99,
      (Number.parseInt(jumlah.value, 10) || 1) + 1
    );
    hitungTotal();
  });

// Tombol tambah pada kartu produk
document.querySelectorAll(".add-button").forEach(button => {
  button.addEventListener("click", function () {
    produk.value = this.dataset.product;
    jumlah.value = 1;
    hitungTotal();

    document.getElementById("pesan")
      .scrollIntoView({ behavior: "smooth" });
  });
});

// Pesan melalui WhatsApp
document.getElementById("orderButton")
  .addEventListener("click", function () {
    const namaProduk = produk.value;
    const qty = Number(jumlah.value);
    const totalHarga = hargaProduk() * qty;

    const pesan =
      `Halo Yumm! Piscok, saya mau pesan:\n\n` +
      `Produk: ${namaProduk}\n` +
      `Jumlah: ${qty}\n` +
      `Total: ${formatRupiah(totalHarga)}\n\n` +
      `Apakah produknya masih tersedia?`;

    const link =
      "https://wa.me/" + NOMOR_WA +
      "?text=" + encodeURIComponent(pesan);

    window.open(link, "_blank");
  });

// Menu navigasi pada HP
const tombolMenu = document.getElementById("menuToggle");
const navigasi = document.getElementById("mainNav");

tombolMenu.addEventListener("click", function () {
  navigasi.classList.toggle("open");

  this.textContent = navigasi.classList.contains("open")
    ? "×"
    : "☰";
});

navigasi.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", function () {
    navigasi.classList.remove("open");
    tombolMenu.textContent = "☰";
  });
});

// Tahun otomatis pada footer
document.getElementById("year").textContent =
  new Date().getFullYear();

// Sistem ulasan sederhana
const formUlasan = document.getElementById("reviewForm");
const daftarUlasan = document.getElementById("reviewsList");
const kunciPenyimpanan = "yummPiscokReviews";

function bacaUlasan() {
  try {
    return JSON.parse(
      localStorage.getItem(kunciPenyimpanan) || "[]"
    );
  } catch {
    return [];
  }
}

function tampilkanUlasan() {
  
function tampilkanUlasan() {
  const ulasan = bacaUlasan();

  // Pertahankan komentar contoh dari HTML
  // jika belum ada ulasan baru yang disimpan.
  if (ulasan.length === 0) return;

  daftarUlasan.replaceChildren();

  ulasan.slice().reverse().forEach(item => {
    const kartu = document.createElement("article");
    kartu.className = "review-card";

    const bagianAtas = document.createElement("div");
    bagianAtas.className = "comment-top";

    const avatar = document.createElement("div");
    avatar.className = "avatar";
    avatar.textContent = item.nama.charAt(0).toUpperCase();

    const pengguna = document.createElement("div");
    pengguna.className = "comment-user";

    const nama = document.createElement("strong");
    nama.textContent = item.nama;

    const keterangan = document.createElement("small");
    keterangan.textContent = "Pelanggan Yumm! Piscok";

    pengguna.append(nama, keterangan);
    bagianAtas.append(avatar, pengguna);

    const bintang = document.createElement("div");
    bintang.className = "stars";
    bintang.textContent =
      "★".repeat(item.rating) +
      "☆".repeat(5 - item.rating);

    const komentar = document.createElement("p");
    komentar.textContent = item.komentar;

    kartu.append(bagianAtas, bintang, komentar);
    daftarUlasan.appendChild(kartu);
  });
}

formUlasan.addEventListener("submit", function (event) {
  event.preventDefault();

  const nama = document.getElementById("reviewName")
    .value.trim();

  const rating = Number(
    document.getElementById("reviewRating").value
  );

  const komentar = document.getElementById("reviewText")
    .value.trim();

  if (!nama || !komentar) return;

  const ulasan = bacaUlasan();

  ulasan.push({
    nama: nama,
    rating: rating,
    komentar: komentar
  });

  try {
    localStorage.setItem(
      kunciPenyimpanan,
      JSON.stringify(ulasan.slice(-30))
    );

    tampilkanUlasan();
    formUlasan.reset();
  } catch {
    alert("Ulasan gagal disimpan. Coba lagi.");
  }
});

hitungTotal();
tampilkanUlasan();