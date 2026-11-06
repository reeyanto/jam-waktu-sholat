/**
 * Presentation: UI Controller
 */
export class UIController {
    renderHeader(repository) {
        document.querySelector("#masjid").textContent = repository.getConfig("masjid");
        document.querySelector("#alamat").textContent = repository.getConfig("alamat");
        document.querySelector("#teks").textContent = repository.getConfig("teks");
    }

    renderCityLocation(cities, cityCode) {
        for (let i = 0; i < cities.length; i++) {
            if (cityCode == cities[i].id) {
                document.querySelector("#lokasi").textContent = cities[i].lokasi;
                break;
            }
        }
    }

    renderSchedule(scheduleData, dayName) {
        if (!scheduleData || !scheduleData.data) return;
        const jadwal = scheduleData.data.jadwal;

        document.querySelector("#w-imsak").textContent = jadwal.imsak;
        document.querySelector("#w-subuh").textContent = jadwal.subuh;
        document.querySelector("#w-dzuhur").textContent = jadwal.dzuhur;

        // Jum'at special label
        const labelDzuhur = document.querySelector("#label-dzuhur");
        if (dayName === "Jum'at") {
            labelDzuhur.textContent = "Jum'at";
        } else {
            labelDzuhur.textContent = "Dzuhur";
        }

        document.querySelector("#w-ashar").textContent = jadwal.ashar;
        document.querySelector("#w-maghrib").textContent = jadwal.maghrib;
        document.querySelector("#w-isya").textContent = jadwal.isya;
    }
}
