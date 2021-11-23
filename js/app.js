/**
 * Aplikasi Jam Waktu Sholat (JWS) sederhana
 * Dibuat oleh  : Riyanto
 * email        : riyanto.droider@gmail.com
 * GitHub       : https://github.com/reeyanto
 * Lisensi      : Gratis (tidak untuk dikomersilkan)
 * 
 * Dibuat menggunakan CSS Framework Bootstrap 5
 * Data dari API https://api.myquran.com (terima kasih myquran.com)
 */
const BASE_URL = 'https://api.myquran.com/v1/sholat';
let KODE       = '';

/**
 * berguna untuk membaca file config.json yang berisi konfigurasi nama masjid, alamat, kode (kabupaten) dan running teks
 * setelah berhasil membaca isi filenya, atur nilai beberapa selektor, jalankan fungsi prayerTime (berdasarkan kode kabupaten)
 * dan tampilkan waktu saat ini secara realtime (durasi 1 detik)
 */
function init() {
  fetch('config.json')
    .then(response => response.json())
    .then(config   => {
      // atur nilai pada laman utama
      document.querySelector('#masjid').textContent = config.masjid;
      document.querySelector('#alamat').textContent = config.alamat;
      document.querySelector('#teks').textContent   = config.teks;

      // atur nilai pada modal
      document.querySelector('#modal-masjid').value = config.masjid;
      document.querySelector('#modal-alamat').value = config.alamat;
      document.querySelector('#modal-teks').value   = config.teks;

      // atur KODE (kabupaten)
      KODE = config.kode;

      prayerTime(config.kode);
      setInterval(showDateTime, 1000);
      showModal();
    })
    .catch(error => alert('Tidak dapat membuka file \'config.json\'\n'+ error));
}

/**
 * @param {*} kodeKabupaten 
 * berguna untuk mendapatkan jadwalSholat dari API server dan menampilkannya pada beberapa selektor
 */
function prayerTime(kodeKabupaten) {
  const d   = new Date();
  const bln = ((d.getMonth()+1) < 10) ? "0".concat(d.getMonth()+1) : d.getMonth()+1;
  const tgl = (d.getDate() < 10) ? "0".concat() : d.getDate();

  fetch(BASE_URL +'/jadwal/'+ kodeKabupaten +'/'+ d.getFullYear() +'/'+ bln +'/'+ tgl)
    .then(response    => response.json())
    .then(waktuSholat => {
      document.querySelector('#w-imsak').textContent    = waktuSholat.data.jadwal.imsak;
      document.querySelector('#w-subuh').textContent    = waktuSholat.data.jadwal.subuh;
      document.querySelector('#w-dzuhur').textContent   = waktuSholat.data.jadwal.dzuhur;
      document.querySelector('#w-ashar').textContent    = waktuSholat.data.jadwal.ashar;
      document.querySelector('#w-maghrib').textContent  = waktuSholat.data.jadwal.maghrib;
      document.querySelector('#w-isya').textContent     = waktuSholat.data.jadwal.isya;

      document.querySelector('#lokasi').textContent     = waktuSholat.data.lokasi +', '+ waktuSholat.data.daerah;
    })
    .catch(error => alert('Tidak dapat terhubung ke Restfull API\n'+ error));
}

/**
 * menampilkan tanggal, menit dan detik secara realtime (interval 1 detik) ke dalam beberapa selektor
 */
function showDateTime() {
  const bulanArr = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  const hariArr  = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jum\'at', 'Sabtu'];
  const waktu    = new Date();

  let jam   = (waktu.getHours() < 10)   ? "0".concat(waktu.getHours())   : waktu.getHours();
  let menit = (waktu.getMinutes() < 10) ? "0".concat(waktu.getMinutes()) : waktu.getMinutes(); 
  let detik = (waktu.getSeconds() < 10) ? "0".concat(waktu.getSeconds()) : waktu.getSeconds();

  document.querySelector('#hari').textContent     = hariArr[waktu.getDay()];
  document.querySelector('#tanggal').textContent  = waktu.getDate() +' '+ bulanArr[waktu.getMonth()] +' '+ waktu.getFullYear();
  document.querySelector('#jam').textContent      = jam +':'+ menit +':'+ detik;

  // tampilkan jam, menit, detik saat ini
  showCurrentPrayerTime();
}

/**
 * menampilkan waktu sholat saat ini (card berwarna)
 */
function showCurrentPrayerTime() {
  let background  = 'bg-danger';
  let foreground  = 'text-light';
  let currentTime = document.querySelector('#jam').textContent.substr(0, 5);
  let cardList    = ['imsak', 'subuh', 'dzuhur', 'ashar', 'maghrib', 'isya'];

  // hapus background pada card
  cardList.forEach(element => {
    let item = '#card-'+ element;
    document.querySelector(item).classList.remove(background);
  });

  // tentukan card yang seharusnya aktif
  if((currentTime >= document.querySelector('#w-imsak').textContent) && (currentTime < document.querySelector('#w-subuh').textContent)) {
    document.querySelector('#card-imsak').classList.add(background, foreground);
  }
  else if((currentTime >= document.querySelector('#w-subuh').textContent) && (currentTime < document.querySelector('#w-dzuhur').textContent)) {
    document.querySelector('#card-subuh').classList.add(background, foreground);
  }
  else if((currentTime >= document.querySelector('#w-dzuhur').textContent) && (currentTime < document.querySelector('#w-ashar').textContent)) {
    document.querySelector('#card-dzuhur').classList.add(background, foreground);
  }
  else if((currentTime >= document.querySelector('#w-ashar').textContent) && (currentTime < document.querySelector('#w-maghrib').textContent)) {
    document.querySelector('#card-ashar').classList.add(background, foreground);
  }
  else if((currentTime >= document.querySelector('#w-maghrib').textContent) && (currentTime < document.querySelector('#w-isya').textContent)) {
    document.querySelector('#card-maghrib').classList.add(background, foreground);
  }
  else {
    document.querySelector('#card-isya').classList.add(background, foreground);
  }

  // perlu hit API lagi?
  if(document.querySelector('#jam').textContent == "00:00:00") init();
}


/**
 * mendengarkan event dari keyboard
 * apabila user menekan tombol Escape, tampilkan modal bootstrap berisi konfigurasi JWS
 */
function showModal() {
  document.addEventListener('keypress', (key) => {
    if(key.code == 'Escape') {
      const modal = document.querySelector('#modal');

      modal.classList.add('show');
      modal.setAttribute('style', 'display: block;');
      modal.setAttribute('aria-modal', true);
      modal.setAttribute('role', 'dialog');
      modal.removeAttribute('aria-hidden');

      // menampilkan daftar kabupaten (ID dan Nama Kabupaten) pada combobox
      let modalKabupaten      = document.querySelector('#modal-kabupaten');
      modalKabupaten.value    = null;

      fetch(BASE_URL +'/kota/semua')
        .then(response   => response.json())
        .then(kabupaten  => {
          for(i=0; i<kabupaten.length; i++) {
            let item          = document.createElement('option');
            item.textContent  = kabupaten[i].lokasi;
            item.value        = kabupaten[i].id;

            // selected?
            if(kabupaten[i].id == KODE) {
              item.setAttribute('selected', 'selected');
            }

            modalKabupaten.appendChild(item);
          }
        })
        .catch(error => alert('Gagal mendapatkan daftar kota\n'+ error));
    }
  });
}

/**
 * menutup modal yang tampil tanpa merubah konfigurasi yang ada
 */
function closeModal() {
    const modal = document.querySelector('#modal');

    modal.classList.remove('show');
    modal.removeAttribute('style', 'display: block;');
    modal.removeAttribute('aria-modal');
    modal.removeAttribute('role');
    modal.setAttribute('aria-hidden', true);
}

/**
 * menyimpan konfigurasi ke dalam file bernama config.json (re-write)
 * lalu menutup modal
 */
function saveConfiguration() {
  const masjid    = document.querySelector('#modal-masjid').value;
  const alamat    = document.querySelector('#modal-alamat').value;
  const kabupaten = document.querySelector('#modal-kabupaten').value;
  const teks      = document.querySelector('#modal-teks').value;

  const blob = new Blob(['{"masjid":"'+ masjid +'", "alamat":"'+ alamat +'", "kode":"'+ kabupaten +'", "teks":"'+ teks +'"}'], {
    type: "text/plain;charset=utf-8"
  });
  saveAs(blob, "config.json");
  
  closeModal();
}

init();