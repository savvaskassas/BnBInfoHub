let countdownInterval;

// ========================
// Check-In Flow
// ========================

function openCheckinForm() {
    document.getElementById('formOverlay').style.display = 'block';
    document.getElementById('arrivalTime').min = new Date().toISOString().slice(0, 16);
}

function closeForm() {
    document.getElementById('formOverlay').style.display = 'none';
}

function confirmSubmission() {
    const fullName = document.getElementById('fullName').value.trim();
    const passportNumber = document.getElementById('passportNumber').value.trim();
    const nationality = document.getElementById('nationality').value.trim();
    const arrivalTime = document.getElementById('arrivalTime').value;

    if (!fullName || !passportNumber || !nationality || !arrivalTime) {
        alert("Παρακαλώ συμπληρώστε όλα τα πεδία.");
        return;
    }

    document.getElementById('confirmationOverlay').style.display = 'block';
}

function editForm() {
    document.getElementById('confirmationOverlay').style.display = 'none';
}

function submitForm() {
    const arrivalTime = new Date(document.getElementById('arrivalTime').value);
    const now = new Date();

    // Validation: 15:00 today - 14:59 tomorrow
    const minTime = new Date(now.setHours(15, 0, 0, 0));
    const maxTime = new Date(now.setDate(now.getDate() + 1));
    maxTime.setHours(14, 59, 59, 999);

    if (arrivalTime < minTime || arrivalTime > maxTime) {
        alert("Μη έγκυρη ώρα. Επιλέξτε μεταξύ 15:00 - 14:59.");
        return;
    }

    closeForm();
    document.getElementById('confirmationOverlay').style.display = 'none';
    document.getElementById('checkinBox').style.backgroundColor = '#28a745'; // Change to green
    document.getElementById('checkinBox').onclick = function() {
        document.getElementById('detailsOverlay').style.display = 'block';
    };
    startCountdown(arrivalTime);
}

// ========================
// Countdown System
// ========================

function startCountdown(targetTime) {
    const unlockTime = new Date(targetTime.getTime() - 1800000); // 30 λεπτά πριν

    clearInterval(countdownInterval);

    countdownInterval = setInterval(() => {
        const now = new Date();
        const diff = unlockTime - now;

        if (diff <= 0) {
            clearInterval(countdownInterval);
            document.getElementById('countdown').innerHTML = "Ο κωδικός είναι έτοιμος! 🔓";
            document.getElementById('lockerCode').classList.remove('hidden');
            return;
        }

        const hours = Math.floor(diff / 3600000);
        const minutes = Math.floor((diff % 3600000) / 60000);
        document.getElementById('countdown').innerHTML =
            `⌛ Κωδικός σε: ${hours} ώρες ${minutes} λεπτά`;
    }, 1000);
}

// ========================
// General Functions
// ========================

function closeDetails() {
    document.getElementById('detailsOverlay').style.display = 'none';
    document.getElementById('lockerCode').classList.add('hidden');
    clearInterval(countdownInterval);
}

function showInfo(type) {
    let content = '';
    switch(type) {
        case 'wifi':
            content = '<h3>WiFi</h3><p>Network: Airbnb-Guest<br>Password: 12345678</p>';
            break;
        case 'map':
            content = '<h3>Χάρτης</h3><iframe width="100%" height="300" src="https://maps.google.com/maps?q=Athens&output=embed"></iframe>';
            break;
        case 'other':
            content = '<h3>Άλλες Πληροφορίες</h3><ul><li>Πάρκινγκ: 2 θέσεις</li><li>Κλιματισμός: Ναι</li><li>Πισίνα: Όχι</li></ul>';
    }

    document.getElementById('infoContent').innerHTML = content;
    document.getElementById('infoOverlay').style.display = 'block';
}

function closeInfo() {
    document.getElementById('infoOverlay').style.display = 'none';
}

// Close popups on overlay click
window.onclick = function(event) {
    if (event.target.className === 'popup-overlay') {
        event.target.style.display = 'none';
    }
}

