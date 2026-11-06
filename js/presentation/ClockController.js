/**
 * Presentation: Clock & Audio Controller
 */
export class ClockController {
    constructor(repository, onMidnightCallback) {
        this.repository = repository;
        this.onMidnightCallback = onMidnightCallback;
        this.hariArr = ["Ahad", "Senin", "Selasa", "Rabu", "Kamis", "Jum'at", "Sabtu"];
        this.bulanArr = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
        
        this.wJadwal = ["#w-imsak", "#w-subuh", "#w-dzuhur", "#w-ashar", "#w-maghrib", "#w-isya"];
        this.cardJadwal = ["#card-imsak", "#card-subuh", "#card-dzuhur", "#card-ashar", "#card-maghrib", "#card-isya"];
    }

    start(onTickUIUpdate) {
        setInterval(() => {
            const date = new Date();
            const dayName = this.hariArr[date.getDay()];
            
            document.querySelector("#hari").textContent = dayName;
            document.querySelector("#tanggal").textContent = 
                date.getDate() + " " + this.bulanArr[date.getMonth()] + " " + date.getFullYear();

            let h = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
            let i = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
            let s = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();

            let his = h + ":" + i + ":" + s;
            document.querySelector("#jam").textContent = his;

            if (his === "00:00:00" && this.onMidnightCallback) {
                this.onMidnightCallback();
            }

            this.checkPrayerTimeAlert(his);

            if (onTickUIUpdate) {
                onTickUIUpdate(dayName);
            }
        }, 1000);
    }

    checkPrayerTimeAlert(his) {
        const background = "bg-danger";
        const foreground = "text-light";

        for (let idx = 0; idx < this.wJadwal.length; idx++) {
            const timeElement = document.querySelector(this.wJadwal[idx]);
            const cardElement = document.querySelector(this.cardJadwal[idx]);

            if (timeElement && timeElement.textContent && his.substr(0, 5) === timeElement.textContent) {
                cardElement.classList.add(background, foreground);

                const seconds = parseInt(his.substr(6, 2));
                if (seconds < 10) {
                    this.playBeep();
                } else if (seconds === 10) {
                    const iqamahMinutes = parseInt(this.repository.getConfig("iqamah")) || 10;
                    setTimeout(() => this.playBeep(), iqamahMinutes * 60000);
                }
            } else {
                cardElement.classList.remove(background, foreground);
            }
        }
    }

    playBeep() {
        const audio = document.querySelector("audio");
        if (audio) {
            audio.play().catch(e => console.log("Audio autoplay prevented:", e));
        }
    }
}
