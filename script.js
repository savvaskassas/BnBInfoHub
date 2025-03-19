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
      // Άνοιγμα Google Maps με οδηγίες από την τρέχουσα τοποθεσία προς την καθορισμένη διεύθυνση
      window.open(`https://www.google.com/maps/dir/?api=1&origin=${lat},${lon}&destination=Acropolis%2C+Athens`);
    }, () => {
      // Αν δεν επιτραπεί η τοποθεσία, ανοίγει απλά ο χάρτης για τον προορισμό
      window.open(`https://www.google.com/maps/search/Acropolis,+Athens`);
    });
  } else {
    // Αν η γεωτοποθεσία δεν υποστηρίζεται, ανοίγει απλά ο χάρτης
    window.open(`https://www.google.com/maps/search/Acropolis,+Athens`);
  }
});

