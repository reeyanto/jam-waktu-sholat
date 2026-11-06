/**
 * Application Entry Point - Clean Architecture
 */
import { PrayerRepository } from './domain/PrayerRepository.js';
import { UIController } from './presentation/UIController.js';
import { ModalController } from './presentation/ModalController.js';
import { ClockController } from './presentation/ClockController.js';

class App {
    constructor() {
        this.repository = new PrayerRepository();
        this.uiController = new UIController();
        this.modalController = new ModalController(this.repository, () => this.init());
        this.clockController = new ClockController(this.repository, () => this.init());
    }

    async init() {
        // 1. Initialize local storage defaults
        this.repository.initStorage();

        // 2. Render static/config header info
        this.uiController.renderHeader(this.repository);

        // 3. Fetch cities and prayer schedule from API
        const cities = await this.repository.fetchCities();
        const cityCode = this.repository.getConfig("kode");
        
        this.uiController.renderCityLocation(cities, cityCode);
        this.modalController.populateModal(cities);

        const scheduleData = await this.repository.fetchTodaySchedule();
        const currentDayName = document.querySelector("#hari").textContent || "Senin";
        this.uiController.renderSchedule(scheduleData, currentDayName);

        // 4. Start real-time clock & alert system
        this.clockController.start((dayName) => {
            // Periodic UI tick updates if needed
        });
    }
}

// Global hook for modal HTML onclick attributes
window.closeModal = () => {
    window.app.modalController.closeModal();
};

window.saveConfiguration = () => {
    window.app.modalController.saveConfiguration();
};

// Initialize App on DOM load
document.addEventListener("DOMContentLoaded", () => {
    window.app = new App();
    window.app.init();
});
