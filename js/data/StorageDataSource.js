/**
 * Data Source: Local Storage Service
 */
export class StorageDataSource {
    getDefaultConfig() {
        return {
            masjid: "Masjid Besar Al-Muttaqin",
            alamat: "Jl. Maharaja Indra, Pangkalan Kerinci",
            kode: "0407",
            teks: "Tekan tombol Backquote ( ` ) untuk mengubah konfigurasi standar",
            iqamah: "10"
        };
    }

    get(key) {
        if (localStorage.getItem(key) == null) {
            const defaults = this.getDefaultConfig();
            if (defaults[key] !== undefined) {
                localStorage.setItem(key, defaults[key]);
            }
        }
        return localStorage.getItem(key);
    }

    set(key, value) {
        localStorage.setItem(key, value);
    }

    initDefaults() {
        const defaults = this.getDefaultConfig();
        for (const [key, value] of Object.entries(defaults)) {
            if (localStorage.getItem(key) == null) {
                localStorage.setItem(key, value);
            }
        }
    }
}
