/**
 * Domain Repository: Prayer Repository
 */
import { ApiDataSource } from '../data/ApiDataSource.js';
import { StorageDataSource } from '../data/StorageDataSource.js';

export class PrayerRepository {
    constructor() {
        this.api = new ApiDataSource();
        this.storage = new StorageDataSource();
    }

    initStorage() {
        this.storage.initDefaults();
    }

    getConfig(key) {
        return this.storage.get(key);
    }

    saveConfig(data) {
        this.storage.set("masjid", data.masjid);
        this.storage.set("alamat", data.alamat);
        this.storage.set("kode", data.kode);
        this.storage.set("iqamah", data.iqamah);
        this.storage.set("teks", data.teks);
    }

    async fetchCities() {
        return await this.api.getCities();
    }

    async fetchTodaySchedule() {
        const now = new Date();
        const cityCode = this.storage.get("kode");
        return await this.api.getPrayerSchedule(
            cityCode,
            now.getFullYear(),
            now.getMonth() + 1,
            now.getDate()
        );
    }
}
