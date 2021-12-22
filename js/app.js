/** Aplikasi Jam Waktu Sholat (JWS) sederhana
 * Dibuat oleh  : Riyanto
 * email        : riyanto.droider@gmail.com
 * GitHub       : https://github.com/reeyanto
 * Lisensi      : Gratis (tidak untuk dikomersilkan)
 *
 * Dibuat menggunakan CSS Framework Bootstrap 5
 * Data dari API https://api.myquran.com (terima kasih myquran.com)
 */

const BASE_URL = "https://api.myquran.com/v1/sholat/";

function init() {
  // jika datanya kosong, set nilai default
  if (localStorage.getItem("masjid") == null) {
    localStorage.setItem("masjid", "Masjid Besar Al-Muttaqin");
    localStorage.setItem("alamat", "Jl. Maharaja Indra, Pangkalan Kerinci");
    localStorage.setItem("kode", "0407");
    localStorage.setItem(
      "teks",
      "Tekan tombol Backquote ( ` ) untuk mengubah konfigurasi standar"
    );
    localStorage.setItem("iqamah", "10");
  }

  // fetch seluruh data dari rest server
  fetch(BASE_URL + "kota/semua")
    .then((response) => response.json())
    .then((kota) => {
      document.querySelector("#masjid").textContent =
        localStorage.getItem("masjid");
      document.querySelector("#alamat").textContent =
        localStorage.getItem("alamat");
      document.querySelector("#teks").textContent =
        localStorage.getItem("teks");

      // tampilkan nama kota pada #lokasi
      for (let i = 0; i < kota.length; i++) {
        if (localStorage.getItem("kode") == kota[i].id) {
          document.querySelector("#lokasi").textContent = kota[i].lokasi;
        }
      }

      // tampilkan daftar kota pada modal
      showModal(kota);
    });
}

function showModal(daftarKota) {
  document.addEventListener("keypress", (key) => {
    if (key.code == "Backquote") {
      // tampilkan informasi dari localstorage
      document.querySelector("#modal-masjid").value =
        localStorage.getItem("masjid");
      document.querySelector("#modal-alamat").value =
        localStorage.getItem("alamat");
      document.querySelector("#modal-teks").value =
        localStorage.getItem("teks");
      document.querySelector("#modal-iqamah").value =
        localStorage.getItem("iqamah");

      // siapkan #modal-kabupaten
      let modalKabupaten = document.querySelector("#modal-kabupaten");
      modalKabupaten.value = null;

      // tampilkan seluruh data kota ke combobox
      for (let i = 0; i < daftarKota.length; i++) {
        let item = document.createElement("option");
        item.textContent = daftarKota[i].lokasi;
        item.value = daftarKota[i].id;

        // selected?
        if (localStorage.getItem("kode") == daftarKota[i].id) {
          item.setAttribute("selected", "selected");
        }
        modalKabupaten.appendChild(item);
      }

      // tampilkan modal setelah seluruh data selesai diload
      const modal = document.querySelector("#modal");

      modal.classList.add("show");
      modal.setAttribute("style", "display: block;");
      modal.setAttribute("aria-modal", true);
      modal.setAttribute("role", "dialog");
      modal.removeAttribute("aria-hidden");
    } else if (key.code == "Escape") {
      closeModal();
    }
  });
}

function closeModal() {
  const modal = document.querySelector("#modal");

  modal.classList.remove("show");
  modal.removeAttribute("style", "display: block;");
  modal.removeAttribute("aria-modal");
  modal.removeAttribute("role");
  modal.setAttribute("aria-hidden", true);
}

function showRealTime() {
  // siapkan array hari dan bulan
  const hariArr = [
    "Ahad",
    "Senin",
    "Selasa",
    "Rabu",
    "Kamis",
    "Jum'at",
    "Sabtu",
  ];
  const bulanArr = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  let wJadwal = [
    "#w-imsak",
    "#w-subuh",
    "#w-dzuhur",
    "#w-ashar",
    "#w-maghrib",
    "#w-isya",
  ];
  let cardJadwal = [
    "#card-imsak",
    "#card-subuh",
    "#card-dzuhur",
    "#card-ashar",
    "#card-maghrib",
    "#card-isya",
  ];
  let background = "bg-danger";
  let foreground = "text-light";

  setInterval(() => {
    const date = new Date();

    // set hari dan tanggal
    document.querySelector("#hari").textContent = hariArr[date.getDay()];
    document.querySelector("#tanggal").textContent =
      date.getDate() +
      " " +
      bulanArr[date.getMonth()] +
      " " +
      date.getFullYear();

    // siapkan jam, menit dan detik
    let h =
      date.getHours() < 10 ? "0".concat(date.getHours()) : date.getHours();
    let i =
      date.getMinutes() < 10
        ? "0".concat(date.getMinutes())
        : date.getMinutes();
    let s =
      date.getSeconds() < 10
        ? "0".concat(date.getSeconds())
        : date.getSeconds();

    // set jam, menit dan detik
    let his = h + ":" + i + ":" + s;
    document.querySelector("#jam").textContent = his;

    // lakukan fetch data baru setiap ganti hari
    if (his == "00:00:00") init();

    // kapan beep dibunyikan?
    for (let i = 0; i < wJadwal.length; i++) {
      if (his.substr(0, 5) == document.querySelector(wJadwal[i]).textContent) {
        document
          .querySelector(cardJadwal[i])
          .classList.add(background, foreground);

        //bunyikan beep adzan
        if (document.querySelector("#jam").textContent.substr(6, 2) < 10) {
          beep();
        }
        // bunyikan beep iqamah setelah ? menit
        else if (
          document.querySelector("#jam").textContent.substr(6, 2) == 10
        ) {
          setTimeout(beep, localStorage.getItem("iqamah") * 60000);
        }
      } else {
        document
          .querySelector(cardJadwal[i])
          .classList.remove(background, foreground);
      }
    }
  }, 1000); // 1000 = 1 detik

  fetchPrayerTime(
    new Date().getFullYear(),
    new Date().getMonth(),
    new Date().getDate()
  );
}

function fetchPrayerTime(tahun, bulan, tanggal) {
  fetch(
    BASE_URL +
      "jadwal/" +
      localStorage.getItem("kode") +
      "/" +
      tahun +
      "/" +
      bulan +
      "/" +
      tanggal
  )
    .then((response) => response.json())
    .then((waktuSholat) => {
      document.querySelector("#w-imsak").textContent =
        waktuSholat.data.jadwal.imsak;
      document.querySelector("#w-subuh").textContent =
        waktuSholat.data.jadwal.subuh;
      document.querySelector("#w-dzuhur").textContent =
        waktuSholat.data.jadwal.dzuhur;

      // khusus hari Jum'at, ganti label Dzuhur menjadi Jum'at
      if (document.querySelector("#hari").textContent == "Jum'at")
        document.querySelector("#label-dzuhur").textContent = "Jum'at";
      else document.querySelector("#label-dzuhur").textContent = "Dzuhur";

      document.querySelector("#w-ashar").textContent =
        waktuSholat.data.jadwal.ashar;
      document.querySelector("#w-maghrib").textContent =
        waktuSholat.data.jadwal.maghrib;
      document.querySelector("#w-isya").textContent =
        waktuSholat.data.jadwal.isya;
    });
}

function saveConfiguration() {
  localStorage.setItem("masjid", document.querySelector("#modal-masjid").value);
  localStorage.setItem("alamat", document.querySelector("#modal-alamat").value);
  localStorage.setItem(
    "kode",
    document.querySelector("#modal-kabupaten").value
  );
  localStorage.setItem("iqamah", document.querySelector("#modal-iqamah").value);
  localStorage.setItem("teks", document.querySelector("#modal-teks").value);

  closeModal();
  history.go(0);
}

function beep() {
  document.querySelector("audio").play();
}

init();
showRealTime();
