/**
 * Data Source: API Remote Service
 */
export class ApiDataSource {
    constructor() {
        this.baseUrl = "https://api.myquran.com/v1/sholat/";
    }

    async getCities() {
        try {
            const response = await fetch(this.baseUrl + "kota/semua");
            return await response.json();
        } catch (error) {
            console.error("Failed to fetch cities:", error);
            return [];
        }
    }

    async getPrayerSchedule(cityCode, year, month, date) {
        try {
            const url = `${this.baseUrl}jadwal/${cityCode}/${year}/${month}/${date}`;
            const response = await fetch(url);
            return await response.json();
        } catch (error) {
            console.error("Failed to fetch prayer schedule:", error);
            return null;
        }
    }
}
