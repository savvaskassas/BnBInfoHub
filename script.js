let countdownInterval;

// ==========================
// Ενεργοποίηση του Flatpickr στο πεδίο ημερομηνίας και ώρας
// ==========================
document.addEventListener("DOMContentLoaded", function() {
    flatpickr("#arrivalTime", {
        enableTime: true,
        dateFormat: "Y-m-d H:i",
        minDate: "today",
        time_24hr: true,
        locale: "el" // Ελληνική γλώσσα
    });
});



// ==========================
// ΑΝΟΙΓΜΑ & ΚΛΕΙΣΙΜΟ ΦΟΡΜΑΣ CHECK-IN
// ==========================

// Εμφάνιση της φόρμας Check-In μόνο όταν πατηθεί το κουμπί
function openCheckinForm() {
    let overlay = document.getElementById('formOverlay');
    overlay.classList.add('show');
}

// Κλείσιμο της φόρμας Check-In
function closeForm() {
    let overlay = document.getElementById('formOverlay');
    overlay.classList.remove('show');
}

// ==========================
// Υποβολή Check-In με Αντίστροφη Μέτρηση & Locker Code
// ==========================
function submitForm(event) {
    event.preventDefault(); // Αποτρέπουμε την άμεση υποβολή

    const fullName = document.getElementById('fullName').value.trim();
    const passportNumber = document.getElementById('passportNumber').value.trim();
    const nationality = document.getElementById('nationality').value.trim();
    const arrivalTimeInput = document.getElementById('arrivalTime').value;

    if (!fullName || !passportNumber || !nationality || !arrivalTimeInput) {
        alert("❌ Παρακαλώ συμπληρώστε όλα τα πεδία.");
        return;
    }

    // Μετατροπή της εισαγόμενης ημερομηνίας σε αντικείμενο Date
    const arrivalTime = new Date(arrivalTimeInput);
    const currentTime = new Date();

    // Υπολογισμός της ώρας που το countdown πρέπει να σταματήσει (30 λεπτά πριν την άφιξη)
    const countdownEndTime = new Date(arrivalTime.getTime() - 30 * 60000); // Αφαίρεση 30 λεπτών

    // Έλεγχος αν η επιλεγμένη ώρα είναι έγκυρη (πρέπει να είναι τουλάχιστον 30 λεπτά μετά από τώρα)
    if (currentTime >= countdownEndTime) {
        alert("❌ Η ώρα άφιξης πρέπει να είναι τουλάχιστον 30 λεπτά μετά από τώρα.");
        return;
    }

    // Αλλαγή εμφάνισης του κουμπιού Check-In
    const checkinBox = document.getElementById('checkinBox');
    checkinBox.style.backgroundColor = "#28a745"; // Πράσινο χρώμα
    checkinBox.style.fontSize = "18px";
    checkinBox.style.pointerEvents = "none"; // Απενεργοποίηση του κουμπιού

    // Ξεκινά η αντίστροφη μέτρηση
    startCountdown(checkinBox, countdownEndTime);

    // Κλείσιμο της φόρμας
    closeForm();
}

// ==========================
// Συνάρτηση Αντίστροφης Μέτρησης & Locker Code
// ==========================
function startCountdown(buttonElement, endTime) {
    clearInterval(countdownInterval); // Διακοπή παλιότερης μέτρησης αν υπάρχει

    function updateCountdown() {
        const now = new Date();
        const timeRemaining = endTime - now;

        if (timeRemaining <= 0) {
            clearInterval(countdownInterval);
            buttonElement.innerHTML = `<i class="fas fa-lock"></i> <span>Κωδικός: <b>1234</b></span>`;
            buttonElement.style.backgroundColor = "#ff5733"; // Πορτοκαλί χρώμα για να ξεχωρίζει
            return;
        }

        // Υπολογισμός ωρών, λεπτών, δευτερολέπτων
        const hours = Math.floor(timeRemaining / (1000 * 60 * 60));
        const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

        // Ενημέρωση του κουμπιού με τον χρόνο που απομένει
        buttonElement.innerHTML = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    // Κλήση της συνάρτησης κάθε 1 δευτερόλεπτο
    updateCountdown();
    countdownInterval = setInterval(updateCountdown, 1000);
}

// Συνδέουμε την υποβολή φόρμας με το submitForm()
document.getElementById("checkinForm").addEventListener("submit", submitForm);

// ==========================
// ΑΝΟΙΓΜΑ VIBER & WHATSAPP
// ==========================

// Άνοιγμα συνομιλίας Viber
function openViber() {
    window.location.href = "viber://chat?number=+123456789";
}

// Άνοιγμα συνομιλίας WhatsApp
function openWhatsApp() {
    window.location.href = "https://wa.me/123456789";
}

// ==========================
// ΓΕΝΙΚΕΣ ΛΕΙΤΟΥΡΓΙΕΣ
// ==========================

// Κλείσιμο του modal αν γίνει κλικ εκτός
window.onclick = function(event) {
    if (event.target.classList.contains('popup-overlay')) {
        closeForm();
    }
};

// Επιλογή στοιχείων από το DOM
const mapBtn       = document.getElementById('mapBtn');
const mapModal     = document.getElementById('mapModal');
const directionsBtn = document.getElementById('directionsBtn');
const closeButtons = mapModal.querySelector('.close');

// Συναρτήσεις για άνοιγμα και κλείσιμο του Χάρτη
function openMapModal() {
  mapModal.classList.add('show');
}
function closeMapModal() {
  mapModal.classList.remove('show');
}

// Άνοιγμα του modal όταν πατηθεί το κουμπί "Χάρτης"
mapBtn.addEventListener('click', openMapModal);

// Κλείσιμο modal όταν πατηθεί το "X"
closeButtons.addEventListener('click', closeMapModal);

// Κλείσιμο όταν γίνει κλικ εκτός του modal
mapModal.addEventListener('click', (e) => {
  if (e.target === mapModal) {
    closeMapModal();
  }
});

// Λειτουργία για το κουμπί "Οδηγίες Πλοήγησης"
directionsBtn.addEventListener('click', () => {
  // Προσπάθεια λήψης τοποθεσίας του χρήστη
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      // Άνοιγμα Google Maps με οδηγίες από την τρέχουσα τοποθεσία προς το Σύνταγμα, Αθήνα
      window.open(`https://www.google.com/maps/dir/?api=1&origin=${lat},${lon}&destination=Σύνταγμα,+Αθήνα`);
    }, () => {
      // Αν δεν επιτραπεί η τοποθεσία, ανοίγει απλά ο χάρτης για τον προορισμό
      window.open(`https://www.google.com/maps/dir/?api=1&destination=Σύνταγμα,+Αθήνα`);
    });
  } else {
    // Αν η γεωτοποθεσία δεν υποστηρίζεται, ανοίγει απλά ο χάρτης με τον προορισμό
    window.open(`https://www.google.com/maps/dir/?api=1&destination=Σύνταγμα,+Αθήνα`);
  }
});

// ==========================
// ΛΕΙΤΟΥΡΓΙΑ MODAL WIFI
// ==========================

const wifiOverlay = document.getElementById("wifiOverlay");
const wifiPasswordInput = document.getElementById("wifiPassword");
const copyWifiBtn = document.getElementById("copyWifiBtn");

// Άνοιγμα όταν πατηθεί το κουμπί WiFi
function showInfo(type) {
    if (type === "wifi") {
        wifiOverlay.classList.add("show");
    }
}

// Κλείσιμο WiFi Modal
function closeWifiForm() {
    wifiOverlay.classList.remove("show");
}

// Αντιγραφή WiFi Κωδικού
copyWifiBtn.addEventListener("click", () => {
    navigator.clipboard.writeText(wifiPasswordInput.value)
        .then(() => {
            copyWifiBtn.textContent = "Αντιγράφηκε!";
            setTimeout(() => {
                copyWifiBtn.textContent = "Αντιγραφή";
            }, 2000);
        })
        .catch(err => {
            console.error("Σφάλμα αντιγραφής: ", err);
        });
});

// ==========================
// ΛΕΙΤΟΥΡΓΙΑ MODAL ΓΙΑ ΑΛΛΕΣ ΠΛΗΡΟΦΟΡΙΕΣ
// ==========================

const infoOverlay = document.getElementById("infoOverlay");

// Άνοιγμα όταν πατηθεί το κουμπί "Άλλα"
function showInfo(type) {
    if (type === "other") {
        infoOverlay.classList.add("show");
    } else if (type === "wifi") {
        wifiOverlay.classList.add("show");
    }
}

// Κλείσιμο του modal πληροφοριών
function closeInfoForm() {
    infoOverlay.classList.remove("show");
}

function setLanguage(lang) {
    localStorage.setItem('preferred_language', lang);
    applyLanguage(lang);
    document.getElementById('languagePopup').classList.remove('show');
}


function applyLanguage(lang) {
    const translations = {
        el: {
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
            wifiClose: "ΚΛΕΙΣΙΜΟ"
           
        },
        en: {
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
            wifiClose: "CLOSE"
            

        },
        fr: {
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
            wifiClose: "FERMER"
            

        },
        de: {
            checkin: "Check-In",
            wifi: "WiFi",
            map: "Karte",
            other: "Andere",
            name: "Vollständiger Name",
            passport: "Reisepassnummer",
            nationality: "Staatsangehörigkeit",
            arrival: "Ankunftsdatum & -uhrzeit",
            submit: "Absenden",
            cancel: "Abbrechen",
            wifiTitle: "WiFi-Informationen",
            wifiName: "Netzwerkname",
            wifiPass: "Passwort",
            wifiCopy: "KOPIEREN",
            wifiClose: "SCHLIESSEN"
            

        }
    };

    const t = translations[lang];

    // Κουμπιά
    document.querySelectorAll(".box")[1].querySelector("span").innerText = t.wifi;
    document.querySelectorAll(".box")[2].querySelector("span").innerText = t.map;
    document.querySelectorAll(".box")[3].querySelector("span").innerText = t.other;

    // Check-in labels
    document.querySelector("label[for='fullName']").innerText = t.name;
    document.querySelector("label[for='passportNumber']").innerText = t.passport;
    document.querySelector("label[for='nationality']").innerText = t.nationality;
    document.querySelector("label[for='arrivalTime']").innerText = t.arrival;

    // Check-in buttons
    document.querySelector("#checkinForm button[type='submit']").innerText = t.submit;
    document.querySelector("#checkinForm button[type='button']").innerText = t.cancel;

    // ✅ WiFi Modal
    document.querySelector("#wifiOverlay h2").innerText = t.wifiTitle;
    document.querySelector("label[for='wifiName']").innerText = t.wifiName;
    document.querySelector("label[for='wifiPassword']").innerText = t.wifiPass;
    document.getElementById("copyWifiBtn").innerText = t.wifiCopy;
    document.querySelector("#wifiOverlay .form-actions button").innerText = t.wifiClose;
}


document.addEventListener("DOMContentLoaded", function () {
    const savedLang = localStorage.getItem('preferredLanguage') || 'el';
    applyLanguage(savedLang);
});