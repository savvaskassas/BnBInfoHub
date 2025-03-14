let countdownInterval;

// ========================
// Επιλογή API Key δυναμικά
// ========================
function getAPIKey() {
    var userAgent = navigator.userAgent || navigator.vendor || window.opera;

    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        return "AIzaSyAD_a0tYAiju4et2NO46uPi3Xcs3zT6QuY"; // iOS API Key
    } else if (/android/i.test(userAgent)) {
        return "AIzaSyAYdj8Xpf107n7YXvHOQfa0DHJ-TF83OYE"; // Android API Key
    } else {
        return "AIzaSyBFZpKomltfnV6zmBq5NXbz_ncW7N0pNyY"; // JavaScript API Key
    }
}

var apiKey = getAPIKey();
var script = document.createElement("script");
script.src = "https://maps.googleapis.com/maps/api/js?key=" + apiKey + "&callback=initMap";
script.async = true;
script.defer = true;
document.head.appendChild(script);

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

    const minTime = new Date(now.setHours(15, 0, 0, 0));
    const maxTime = new Date(now.setDate(now.getDate() + 1));
    maxTime.setHours(14, 59, 59, 999);

    if (arrivalTime < minTime || arrivalTime > maxTime) {
        alert("Μη έγκυρη ώρα. Επιλέξτε μεταξύ 15:00 - 14:59.");
        return;
    }

    closeForm();
    document.getElementById('confirmationOverlay').style.display = 'none';
    document.getElementById('checkinBox').style.backgroundColor = '#28a745'; 
    document.getElementById('checkinBox').onclick = function() {
        document.getElementById('detailsOverlay').style.display = 'block';
    };
    startCountdown(arrivalTime);
}

// ========================
// Countdown System
// ========================
function startCountdown(targetTime) {
    const unlockTime = new Date(targetTime.getTime() - 1800000);

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
// Google Maps & Geolocation API
// ========================
function initMap() {
    var location = { lat: 36.448105, lng: 28.223146 };
    var map = new google.maps.Map(document.getElementById("map"), {
        zoom: 16,
        center: location
    });
    var marker = new google.maps.Marker({
        position: location,
        map: map
    });
}

// ========================
// Προβολή Χάρτη και Δρομολόγησης
// ========================
function showInfo(type) {
    let content = '';
    switch(type) {
        case 'wifi':
            content = '<h3>WiFi</h3><p>Network: Airbnb-Guest<br>Password: 12345678</p>';
            break;
        case 'map':
            content = '<h3>Χάρτης</h3>' +
                      '<iframe width="100%" height="300" ' +
                      'src="https://www.google.com/maps/embed/v1/place?key=AIzaSyA1ewuS912j3p1Z09qRtKLqkd5UKuMzfRU' +
                      '&q=36.448105,28.223146" allowfullscreen loading="lazy"></iframe>' +
                      '<br>' +
                      '<a href="https://maps.app.goo.gl/mgmqkw5mvRuCXP6WA" target="_blank" ' +
                      'style="display:block; text-align:center; margin-top:10px; font-weight:bold; ' +
                      'padding: 10px; background:#007bff; color:white; border-radius:5px; text-decoration:none;">' +
                      '📍 Άνοιγμα στους Χάρτες</a>';
            break;
        case 'route':
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(position) {
                    const userLat = position.coords.latitude;
                    const userLng = position.coords.longitude;
                    content = '<h3>Οδηγίες</h3>' +
                              '<iframe width="100%" height="300" ' +
                              'src="https://www.google.com/maps/embed/v1/directions?key=AIzaSyB6Rovtn0YAemBMAktqFAbngmyXk13CnjM' +
                              '&origin=' + userLat + ',' + userLng + '&destination=36.448105,28.223146" allowfullscreen></iframe>';
                    document.getElementById('infoContent').innerHTML = content;
                    document.getElementById('infoOverlay').style.display = 'block';
                }, function() {
                    alert("Δεν ήταν δυνατή η ανάκτηση της τοποθεσίας σας.");
                });
            } else {
                alert("Η συσκευή σας δεν υποστηρίζει Geolocation.");
            }
            return;
        case 'other':
            content = '<h3>Άλλες Πληροφορίες</h3><ul><li>Πάρκινγκ: 2 θέσεις</li><li>Κλιματισμός: Ναι</li><li>Πισίνα: Όχι</li></ul>';
    }

    document.getElementById('infoContent').innerHTML = content;
    document.getElementById('infoOverlay').style.display = 'block';
}

// ========================
// General Functions
// ========================
function closeInfo() {
    document.getElementById('infoOverlay').style.display = 'none';
}

window.onclick = function(event) {
    if (event.target.className === 'popup-overlay') {
        event.target.style.display = 'none';
    }
};

