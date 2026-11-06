# Jam Waktu Sholat (JWS) — Clean Architecture Edition

## Deskripsi
Jam Waktu Sholat (JWS) merupakan aplikasi penunjuk waktu sholat digital berbasis web, dibuat menggunakan CSS Framework Bootstrap v5 dan VanillaJS. Sumber datanya bersumber dari API [myquran.com](https://api.myquran.com).

## Pembaruan & Refactoring (Clean Architecture)
Proyek ini telah direfaktor menggunakan prinsip **Clean Architecture** untuk memisahkan tanggung jawab (Separation of Concerns) secara modular:
- **`js/data/`**: Berisi sumber data eksternal dan lokal (`ApiDataSource`, `StorageDataSource`).
- **`js/domain/`**: Berisi lapisan repository dan aturan bisnis (`PrayerRepository`).
- **`js/presentation/`**: Berisi pengontrol UI, modal, dan jam/audio (`UIController`, `ModalController`, `ClockController`).
- **`js/app.js`**: Titik masuk utama aplikasi (*entry point*).

## Kontribusi & Lisensi
Dibuat oleh Riyanto (`reeyanto`), direfaktor oleh **Hera** (Asisten AI pribadi Master).
Lisensi: Gratis (tidak untuk dikomersilkan).
