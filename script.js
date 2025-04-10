let countdownInterval;

// ==========================
// Ενεργοποίηση του Flatpickr στο πεδίο ημερομηνίας και ώρας
// ==========================
document.addEventListener("DOMContentLoaded", function () {
    flatpickr("#arrivalTime", {
        enableTime: true,
        dateFormat: "Y-m-d H:i",
        minDate: "today",
        time_24hr: true,
        locale: "el"
    });

    const savedLang = localStorage.getItem('preferredLanguage') || 'el';
    applyLanguage(savedLang);
});

// ==========================
// ΑΝΟΙΓΜΑ & ΚΛΕΙΣΙΜΟ ΦΟΡΜΑΣ CHECK-IN
// ==========================
function openCheckinForm() {
    let overlay = document.getElementById('formOverlay');
    overlay.classList.add('show');
}

function closeForm() {
    document.getElementById('formOverlay').classList.remove('show');
}

// ==========================
// Υποβολή Check-In
// ==========================
function submitForm(event) {
    event.preventDefault();

    const fullName = document.getElementById('fullName').value.trim();
    const passportNumber = document.getElementById('passportNumber').value.trim();
    const nationality = document.getElementById('nationality').value.trim();
    const arrivalTimeInput = document.getElementById('arrivalTime').value;

    if (!fullName || !passportNumber || !nationality || !arrivalTimeInput) {
        alert("❌ Παρακαλώ συμπληρώστε όλα τα πεδία.");
        return;
    }

    const arrivalTime = new Date(arrivalTimeInput);
    const currentTime = new Date();
    const countdownEndTime = new Date(arrivalTime.getTime() - 30 * 60000);

    if (currentTime >= countdownEndTime) {
        alert("❌ Η ώρα άφιξης πρέπει να είναι τουλάχιστον 30 λεπτά μετά από τώρα.");
        return;
    }

    const checkinBox = document.getElementById('checkinBox');
    checkinBox.style.backgroundColor = "#28a745";
    checkinBox.style.fontSize = "18px";
    checkinBox.style.pointerEvents = "none";
    
    document.getElementById('countdownNote').style.display = "block";


    startCountdown(checkinBox, countdownEndTime);
    closeForm();
}

function startCountdown(buttonElement, endTime) {
    clearInterval(countdownInterval);

    function updateCountdown() {
        const now = new Date();
        const timeRemaining = endTime - now;

        if (timeRemaining <= 0) {
            clearInterval(countdownInterval);
            buttonElement.innerHTML = `<i class="fas fa-lock"></i> <span>Κωδικός: <b>1234</b></span>`;
            buttonElement.style.backgroundColor = "#ff5733";
            return;
        }

        const hours = Math.floor(timeRemaining / (1000 * 60 * 60));
        const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);
        buttonElement.innerHTML = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    updateCountdown();
    countdownInterval = setInterval(updateCountdown, 1000);
}

document.getElementById("checkinForm").addEventListener("submit", submitForm);

// ==========================
// ΑΝΟΙΓΜΑ VIBER & WHATSAPP
// ==========================
function openViber() {
    window.location.href = "viber://chat?number=+123456789";
}
function openWhatsApp() {
    window.location.href = "whatsapp://send?phone=306972009094";
}


// ==========================
// MODAL: Χάρτης
// ==========================
const mapBtn = document.getElementById('mapBtn');
const mapModal = document.getElementById('mapModal');
const directionsBtn = document.getElementById('directionsBtn');
const closeButtons = mapModal.querySelector('.close');

function openMapModal() {
    mapModal.classList.add('show');
}
function closeMapModal() {
    mapModal.classList.remove('show');
}
mapBtn.addEventListener('click', openMapModal);
closeButtons.addEventListener('click', closeMapModal);
mapModal.addEventListener('click', (e) => {
    if (e.target === mapModal) closeMapModal();
});
directionsBtn.addEventListener('click', () => {
    const destLat = 36.4481064171205;
    const destLng = 28.223163717687097;

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const originLat = position.coords.latitude;
            const originLng = position.coords.longitude;
            window.open(`https://www.google.com/maps/dir/?api=1&origin=${originLat},${originLng}&destination=${destLat},${destLng}`);
        }, () => {
            window.open(`https://www.google.com/maps/dir/?api=1&destination=${destLat},${destLng}`);
        });
    } else {
        window.open(`https://www.google.com/maps/dir/?api=1&destination=${destLat},${destLng}`);
    }
});


// ==========================
// MODAL: WiFi & Άλλες Πληροφορίες
// ==========================
const wifiOverlay = document.getElementById("wifiOverlay");
const wifiPasswordInput = document.getElementById("wifiPassword");
const copyWifiBtn = document.getElementById("copyWifiBtn");
const infoOverlay = document.getElementById("infoOverlay");

function showInfo(type) {
    if (type === "wifi") {
        wifiOverlay.classList.add("show");
    } else if (type === "other") {
        infoOverlay.classList.add("show");
    }
}
function closeWifiForm() {
    wifiOverlay.classList.remove("show");
}
function closeInfoForm() {
    infoOverlay.classList.remove("show");
}
copyWifiBtn.addEventListener("click", () => {
    navigator.clipboard.writeText(wifiPasswordInput.value).then(() => {
        copyWifiBtn.textContent = "Αντιγράφηκε!";
        setTimeout(() => {
            copyWifiBtn.textContent = "Αντιγραφή";
        }, 2000);
    }).catch(err => {
        console.error("Σφάλμα αντιγραφής: ", err);
    });
});

// ==========================
// ΠΟΛΥΓΛΩΣΣΙΑ
// ==========================
function setLanguage(lang) {
    localStorage.setItem('preferredLanguage', lang);
    applyLanguage(lang);
    document.getElementById('languagePopup').classList.remove('show');
}

function applyLanguage(lang) {
    const translations = {
        el: {
            formTitle: "Στοιχεία Check-In",
            checkin: "Check-In",
            wifi: "WiFi",
            map: "Χάρτης",
            other: "Άλλα",
            name: "Ονοματεπώνυμο",
            passport: "Αριθμός Διαβατηρίου",
            nationality: "Εθνικότητα",
            arrival: "Ημερομηνία & Ώρα Άφιξης",
            submit: "Υποβολή",
            cancel: "Άκυρο",
            wifiTitle: "Στοιχεία WiFi",
            wifiName: "Όνομα Δικτύου",
            wifiPass: "Κωδικός",
            wifiCopy: "ΑΝΤΙΓΡΑΦΗ",
            wifiClose: "ΚΛΕΙΣΙΜΟ",
            placeholderName: "Π.χ. Ιωάννης Παπαδόπουλος",
            placeholderPassport: "Π.χ. ΑΒ1234567",
            placeholderNationality: "Π.χ. Ελληνική",
            arrivalNote: "* Το ωράριο Check-In είναι από τις 15:00 της μιας ημέρας έως τις 14:59 της επόμενης.",
            lockerNote: "Ο κωδικός του locker θα εμφανιστεί αφού τελειώσει η αντίστροφη μέτρηση."
        },
        en: {
            formTitle: "Check-In Info",
            checkin: "Check-In",
            wifi: "WiFi",
            map: "Map",
            other: "Other",
            name: "Full Name",
            passport: "Passport Number",
            nationality: "Nationality",
            arrival: "Arrival Date & Time",
            submit: "Submit",
            cancel: "Cancel",
            wifiTitle: "WiFi Info",
            wifiName: "Network Name",
            wifiPass: "Password",
            wifiCopy: "COPY",
            wifiClose: "CLOSE",
            placeholderName: "e.g. John Papadopoulos",
            placeholderPassport: "e.g. AB1234567",
            placeholderNationality: "e.g. Greek",
            arrivalNote: "* Check-in time is available from 15:00 of the arrival day until 14:59 of the next day.",
            lockerNote: "The locker code will appear after the countdown ends."
        },
        fr: {
            formTitle: "Informations Check-In",
            checkin: "Enregistrement",
            wifi: "WiFi",
            map: "Carte",
            other: "Autres",
            name: "Nom complet",
            passport: "Numéro de passeport",
            nationality: "Nationalité",
            arrival: "Date & Heure d'arrivée",
            submit: "Soumettre",
            cancel: "Annuler",
            wifiTitle: "Infos WiFi",
            wifiName: "Nom du réseau",
            wifiPass: "Mot de passe",
            wifiCopy: "COPIER",
            wifiClose: "FERMER",
            placeholderName: "ex. Jean Papadopoulos",
            placeholderPassport: "ex. AB1234567",
            placeholderNationality: "ex. Grecque",
            arrivalNote: "* L'heure d'arrivée est disponible de 15h00 jusqu'à 14h59 le lendemain.",
            lockerNote: "Le code du casier s'affichera une fois le compte à rebours terminé."
        },
        de: {
            formTitle: "Check-In Informationen",
            checkin: "Check-In",
            wifi: "WiFi",
            map: "Karte",
            other: "Andere",
            name: "Vollständiger Name",
            passport: "Reisepassnummer",
            nationality: "Staatsangehörigkeit",
            arrival: "Ankunftsdatum & -zeit",
            submit: "Absenden",
            cancel: "Abbrechen",
            wifiTitle: "WiFi-Informationen",
            wifiName: "Netzwerkname",
            wifiPass: "Passwort",
            wifiCopy: "KOPIEREN",
            wifiClose: "SCHLIESSEN",
            placeholderName: "z.B. Johann Papadopoulos",
            placeholderPassport: "z.B. AB1234567",
            placeholderNationality: "z.B. Griechisch",
            arrivalNote: "* Die Check-In-Zeit ist von 15:00 Uhr bis 14:59 Uhr am nächsten Tag verfügbar.",
            lockerNote: "Der Schließfachcode erscheint, sobald der Countdown endet."
        }
    };

    const t = translations[lang];

    // Ενημέρωση κουμπιών
    document.querySelectorAll(".box")[1].querySelector("span").innerText = t.wifi;
    document.querySelectorAll(".box")[2].querySelector("span").innerText = t.map;
    document.querySelectorAll(".box")[3].querySelector("span").innerText = t.other;

    // Check-In Form
    document.querySelector("#formOverlay h2").innerText = t.formTitle;
    document.querySelector("label[for='fullName']").innerText = t.name;
    document.querySelector("label[for='passportNumber']").innerText = t.passport;
    document.querySelector("label[for='nationality']").innerText = t.nationality;
    document.querySelector("label[for='arrivalTime']").innerText = t.arrival;

    document.querySelector("#checkinForm button[type='submit']").innerText = t.submit;
    document.querySelector("#checkinForm button[type='button']").innerText = t.cancel;

    document.getElementById('fullName').placeholder = t.placeholderName;
    document.getElementById('passportNumber').placeholder = t.placeholderPassport;
    document.getElementById('nationality').placeholder = t.placeholderNationality;

    const noteElement = document.getElementById("arrivalNote");
    if (noteElement) noteElement.innerText = t.arrivalNote;

    const lockerNote = document.getElementById("countdownNote");
    if (lockerNote) lockerNote.innerText = t.lockerNote;

    // WiFi Modal
    document.querySelector("#wifiOverlay h2").innerText = t.wifiTitle;
    document.querySelector("label[for='wifiName']").innerText = t.wifiName;
    document.querySelector("label[for='wifiPassword']").innerText = t.wifiPass;
    document.getElementById("copyWifiBtn").innerText = t.wifiCopy;
    document.querySelector("#wifiOverlay .form-actions button").innerText = t.wifiClose;
}

