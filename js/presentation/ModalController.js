/**
 * Presentation: Modal Controller
 */
export class ModalController {
    constructor(repository, onSaveCallback) {
        this.repository = repository;
        this.onSaveCallback = onSaveCallback;
        this.initListeners();
    }

    initListeners() {
        document.addEventListener("keypress", (key) => {
            if (key.code == "Backquote") {
                this.showModal();
            } else if (key.code == "Escape") {
                this.closeModal();
            }
        });
    }

    populateModal(cities) {
        document.querySelector("#modal-masjid").value = this.repository.getConfig("masjid");
        document.querySelector("#modal-alamat").value = this.repository.getConfig("alamat");
        document.querySelector("#modal-teks").value = this.repository.getConfig("teks");
        document.querySelector("#modal-iqamah").value = this.repository.getConfig("iqamah");

        let modalKabupaten = document.querySelector("#modal-kabupaten");
        modalKabupaten.innerHTML = "";

        const currentCode = this.repository.getConfig("kode");
        for (let i = 0; i < cities.length; i++) {
            let item = document.createElement("option");
            item.textContent = cities[i].lokasi;
            item.value = cities[i].id;
            if (currentCode == cities[i].id) {
                item.setAttribute("selected", "selected");
            }
            modalKabupaten.appendChild(item);
        }
    }

    showModal() {
        const modal = document.querySelector("#modal");
        modal.classList.add("show");
        modal.setAttribute("style", "display: block;");
        modal.setAttribute("aria-modal", true);
        modal.setAttribute("role", "dialog");
        modal.removeAttribute("aria-hidden");
    }

    closeModal() {
        const modal = document.querySelector("#modal");
        modal.classList.remove("show");
        modal.removeAttribute("style");
        modal.removeAttribute("aria-modal");
        modal.removeAttribute("role");
        modal.setAttribute("aria-hidden", true);
    }

    saveConfiguration() {
        const configData = {
            masjid: document.querySelector("#modal-masjid").value,
            alamat: document.querySelector("#modal-alamat").value,
            kode: document.querySelector("#modal-kabupaten").value,
            iqamah: document.querySelector("#modal-iqamah").value,
            teks: document.querySelector("#modal-teks").value
        };

        this.repository.saveConfig(configData);
        this.closeModal();
        if (this.onSaveCallback) {
            this.onSaveCallback();
        }
    }
}
