function openPopup(type) {
    const popup = document.getElementById('popup');
    const popupBody = document.getElementById('popup-body');

    let content = '';

    switch (type) {
        case 'checkin':
            content = `
                <h2>Check-In</h2>
                <p><strong>Ώρες:</strong> 15:00 - 20:00</p>
                <p><strong>Check-Out:</strong> 10:00</p>
                <h3>Επιλέξτε Ημερομηνία & Ώρα Άφιξης</h3>
                <input type="datetime-local" id="arrival-time">
                <button onclick="setUnlockTime()">Επιβεβαίωση</button>
            `;
            break;
        case 'wifi':
            content = `
                <h2>WiFi</h2>
                <p><strong>Όνομα Δικτύου:</strong> MyAirbnb</p>
                <p><strong>Κωδικός:</strong> 12345678</p>
                <button class="copy-btn" onclick="copyToClipboard('12345678')">Αντιγραφή</button>
            `;
            break;
        case 'map':
            content = `
                <h2>Χάρτης</h2>
                <p><strong>Διεύθυνση:</strong> Παράδεισος 123, Αθήνα</p>
                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3145.123456789012!2d23.123456789012345!3d37.98765432109876!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzfCsDU5JzE1LjYiTiAyM8KwMDcnMzYuMCJF!5e0!3m2!1sel!2sgr!4v1234567890123!5m2!1sel!2sgr" width="100%" height="200" style="border:0;" allowfullscreen="" loading="lazy"></iframe>
            `;
            break;
        case 'other':
            content = `
                <h2>Άλλες Πληροφορίες</h2>
                <ul>
                    <li>Κουζίνα</li>
                    <li>Πάρκινγκ</li>
                    <li>Κλιματισμός</li>
                </ul>
            `;
            break;
        default:
            content = '<p>Επιλέξτε ένα κουτάκι για περισσότερες πληροφορίες.</p>';
    }

    popupBody.innerHTML = content;
    popup.classList.remove('hidden');
}

function closePopup() {
    document.getElementById('popup').classList.add('hidden');
}

function openCodePopup() {
    document.getElementById("code-popup").classList.remove("hidden");
}

function closeCodePopup() {
    document.getElementById("code-popup").classList.add("hidden");
}

// Αντιγραφή WiFi στο πρόχειρο
function copyToClipboard(text) {
    navigator.clipboard.writeText(text);
    alert("Αντιγράφηκε στο πρόχειρο: " + text);
}

// Ρύθμιση ώρας ξεκλειδώματος
function setUnlockTime() {
    const arrivalTimeInput = document.getElementById("arrival-time").value;
    if (!arrivalTimeInput) {
        alert("Παρακαλώ επιλέξτε ημερομηνία και ώρα άφιξης.");
        return;
    }

    const arrivalTime = new Date(arrivalTimeInput);
    const unlockTime = arrivalTime.getTime();
    const lockTime = unlockTime + 3 * 60 * 60 * 1000;

    const unlockBtn = document.getElementById("unlock-btn");
    const timeUntilUnlock = unlockTime - Date.now();

    if (timeUntilUnlock > 0) {
        setTimeout(() => {
            unlockBtn.disabled = false;
            unlockBtn.textContent = "🔓 Δείτε τον Κωδικό";
            unlockBtn.onclick = openCodePopup;

            setTimeout(() => {
                unlockBtn.disabled = true;
                unlockBtn.textContent = "🔒 Κωδικός Κλειδιού";
                unlockBtn.onclick = null;
            }, lockTime - Date.now());

        }, timeUntilUnlock);
    } else {
        unlockBtn.disabled = false;
        unlockBtn.textContent = "🔓 Δείτε τον Κωδικό";
        unlockBtn.onclick = openCodePopup;

        setTimeout(() => {
            unlockBtn.disabled = true;
            unlockBtn.textContent = "🔒 Κωδικός Κλειδιού";
            unlockBtn.onclick = null;
        }, lockTime - Date.now());
    }

    closePopup();
}
