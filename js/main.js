/* ==============================
   DOM READY
============================== */
document.addEventListener("DOMContentLoaded", function () {
    highlightActiveNav();
    setupFormValidation();
    setupRideOffer();
    setupRideSearch();
    loadProfileData();
    loadTheme();
    checkSessionProtection();
});

/* ==============================
   SESSION PROTECTION
============================== */
function checkSessionProtection() {
    const protectedPages = ["dashboard.html", "profile.html", "offer.html", "admin.html"];
    const current = window.location.pathname.split("/").pop();

    if (protectedPages.includes(current)) {
        const session = JSON.parse(localStorage.getItem("session"));
        if (!session) {
            window.location.href = "login.html";
        }
    }
}

/* ==============================
   NAVBAR ACTIVE LINK
============================== */
function highlightActiveNav() {
    const links = document.querySelectorAll(".navbar nav a");
    const current = window.location.pathname.split("/").pop();

    links.forEach(link => {
        if (link.getAttribute("href") === current) {
            link.classList.add("active");
        }
    });
}

/* ==============================
   GLOBAL ALERT SYSTEM
============================== */
function showAlert(message, type = "success") {
    const alert = document.createElement("div");
    alert.className = "custom-alert " + type;
    alert.innerText = message;
    alert.style.position = "fixed";
    alert.style.bottom = "20px";
    alert.style.right = "20px";
    alert.style.padding = "10px 20px";
    alert.style.background = type === "error" ? "#ef4444" : "#10b981";
    alert.style.color = "white";
    alert.style.borderRadius = "6px";
    alert.style.zIndex = "9999";

    document.body.appendChild(alert);

    setTimeout(() => alert.remove(), 3000);
}

/* ==============================
   FORM VALIDATION
============================== */
function setupFormValidation() {
    const forms = document.querySelectorAll("form");

    forms.forEach(form => {
        form.addEventListener("submit", function (e) {
            const inputs = form.querySelectorAll("input, select, textarea");
            let valid = true;

            inputs.forEach(input => {
                if (input.value.trim() === "") {
                    input.style.borderColor = "red";
                    valid = false;
                } else {
                    input.style.borderColor = "#ddd";
                }
            });

            if (!valid) {
                e.preventDefault();
                showAlert("Please fill all fields", "error");
            }
        });
    });
}

/* ==============================
   OFFER RIDE SYSTEM
============================== */
function setupRideOffer() {
    const offerForm = document.querySelector(".offer-form");
    if (!offerForm) return;

    offerForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const from = document.getElementById("from").value;
        const to = document.getElementById("to").value;
        const date = document.getElementById("date").value;
        const seats = parseInt(document.getElementById("seats").value);
        const price = parseInt(document.getElementById("price").value);

        const session = JSON.parse(localStorage.getItem("session"));
        if (!session) return;

        const ride = {
            id: Date.now(),
            from,
            to,
            date,
            seats,
            price,
            driverId: session.userId
        };

        let rides = JSON.parse(localStorage.getItem("rides")) || [];
        rides.push(ride);
        localStorage.setItem("rides", JSON.stringify(rides));

        showAlert("Ride Offered Successfully 🚗");
        offerForm.reset();
    });
}

/* ==============================
   FIND RIDE SYSTEM
============================== */
function setupRideSearch() {
    const findForm = document.querySelector(".find-form");
    const resultBox = document.querySelector(".ride-results");

    if (!findForm || !resultBox) return;

    findForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const from = document.getElementById("search-from").value.toLowerCase();
        const to = document.getElementById("search-to").value.toLowerCase();

        const rides = JSON.parse(localStorage.getItem("rides")) || [];

        const filtered = rides.filter(ride =>
            ride.from.toLowerCase().includes(from) &&
            ride.to.toLowerCase().includes(to)
        );

        resultBox.innerHTML = "";

        if (filtered.length === 0) {
            resultBox.innerHTML = "<p>No rides found.</p>";
            return;
        }

        filtered.forEach(ride => {
            const card = document.createElement("div");
            card.className = "ride-card";
            card.innerHTML = `
                <h4>${ride.from} ➝ ${ride.to}</h4>
                <p>Date: ${ride.date}</p>
                <p>Seats: ${ride.seats}</p>
                <p>Price: ₹${ride.price}</p>
                <button onclick="simulatePayment(${ride.id})">Book Now</button>
            `;
            resultBox.appendChild(card);
        });
    });
}

/* ==============================
   FAKE PAYMENT SIMULATION
============================== */
function simulatePayment(rideId) {

    const confirmPay = confirm("Proceed to payment?");
    if (!confirmPay) return;

    showLoader();

    setTimeout(() => {
        hideLoader();
        completeBooking(rideId);
        showAlert("Payment Successful 🎉");
    }, 2000);
}

function showLoader() {
    const loader = document.createElement("div");
    loader.id = "loader";
    loader.style.position = "fixed";
    loader.style.top = "0";
    loader.style.left = "0";
    loader.style.width = "100%";
    loader.style.height = "100%";
    loader.style.background = "rgba(0,0,0,0.5)";
    loader.style.color = "white";
    loader.style.display = "flex";
    loader.style.alignItems = "center";
    loader.style.justifyContent = "center";
    loader.style.fontSize = "20px";
    loader.innerText = "Processing Payment...";
    document.body.appendChild(loader);
}

function hideLoader() {
    const loader = document.getElementById("loader");
    if (loader) loader.remove();
}

/* ==============================
   COMPLETE BOOKING
============================== */
function completeBooking(rideId) {

    let rides = JSON.parse(localStorage.getItem("rides")) || [];
    let ride = rides.find(r => r.id === rideId);

    if (!ride) return;

    ride.seats -= 1;

    if (ride.seats <= 0) {
        rides = rides.filter(r => r.id !== rideId);
    }

    localStorage.setItem("rides", JSON.stringify(rides));

    location.reload();
}

/* ==============================
   RATING SYSTEM
============================== */
function rateDriver(driverId, stars) {

    let users = JSON.parse(localStorage.getItem("users")) || [];
    let driver = users.find(u => u.id === driverId);

    if (!driver) return;

    driver.rating.push(stars);

    localStorage.setItem("users", JSON.stringify(users));

    showAlert("Rating Submitted ⭐");
}

function getAverageRating(ratings) {
    if (!ratings || ratings.length === 0) return "No rating";
    const sum = ratings.reduce((a,b) => a+b, 0);
    return (sum / ratings.length).toFixed(1);
}

/* ==============================
   PROFILE LOAD
============================== */
function loadProfileData() {
    const profileName = document.querySelector(".profile-name");
    if (!profileName) return;

    const session = JSON.parse(localStorage.getItem("session"));
    if (!session) return;

    let users = JSON.parse(localStorage.getItem("users")) || [];
    let user = users.find(u => u.id === session.userId);

    if (user) profileName.innerText = user.name;
}

/* ==============================
   DARK MODE
============================== */
function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {
        localStorage.setItem("theme", "dark");
    } else {
        localStorage.setItem("theme", "light");
    }
}

function loadTheme() {
    const theme = localStorage.getItem("theme");
    if (theme === "dark") {
        document.body.classList.add("dark-mode");
    }
}

/* ==============================
   SMOOTH SCROLL
============================== */
document.querySelectorAll("a[href^='#']").forEach(anchor => {
    anchor.addEventListener("click", function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute("href"))
            .scrollIntoView({ behavior: "smooth" });
    });
});