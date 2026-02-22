/* ==================================
   ADVANCED RIDE SEARCH ENGINE
================================== */

document.addEventListener("DOMContentLoaded", function () {
    initSearch();
});

/* ===============================
   INIT SEARCH
=============================== */
function initSearch() {

    const searchForm = document.querySelector(".find-form");
    const resultsContainer = document.querySelector(".ride-results");
    const sortSelect = document.getElementById("sort-price");

    if (!searchForm || !resultsContainer) return;

    // Form submit search
    searchForm.addEventListener("submit", function (e) {
        e.preventDefault();
        performSearch();
    });

    // Sort change
    if (sortSelect) {
        sortSelect.addEventListener("change", performSearch);
    }
}

/* ===============================
   PERFORM SEARCH
=============================== */
function performSearch() {

    const fromInput = document.getElementById("search-from");
    const toInput = document.getElementById("search-to");
    const dateInput = document.getElementById("search-date");
    const minSeatsInput = document.getElementById("search-seats");
    const sortSelect = document.getElementById("sort-price");

    const resultsContainer = document.querySelector(".ride-results");

    let rides = JSON.parse(localStorage.getItem("rides")) || [];

    let filtered = rides.filter(ride => {

        const matchFrom = fromInput && fromInput.value
            ? ride.from.toLowerCase().includes(fromInput.value.toLowerCase())
            : true;

        const matchTo = toInput && toInput.value
            ? ride.to.toLowerCase().includes(toInput.value.toLowerCase())
            : true;

        const matchDate = dateInput && dateInput.value
            ? ride.date === dateInput.value
            : true;

        const matchSeats = minSeatsInput && minSeatsInput.value
            ? ride.seats >= parseInt(minSeatsInput.value)
            : true;

        return matchFrom && matchTo && matchDate && matchSeats;
    });

    // SORTING
    if (sortSelect && sortSelect.value === "low") {
        filtered.sort((a, b) => a.price - b.price);
    }

    if (sortSelect && sortSelect.value === "high") {
        filtered.sort((a, b) => b.price - a.price);
    }

    renderResults(filtered);
}

/* ===============================
   RENDER RESULTS
=============================== */
function renderResults(rides) {

    const resultsContainer = document.querySelector(".ride-results");
    resultsContainer.innerHTML = "";

    if (rides.length === 0) {
        resultsContainer.innerHTML = `
            <div class="no-results">
                <p>No rides found 🚫</p>
            </div>
        `;
        return;
    }

    rides.forEach(ride => {

        const card = document.createElement("div");
        card.className = "ride-card";

        card.innerHTML = `
            <h4>${ride.from} ➝ ${ride.to}</h4>
            <p><strong>Date:</strong> ${ride.date}</p>
            <p><strong>Seats:</strong> ${ride.seats}</p>
            <p><strong>Price:</strong> ₹${ride.price}</p>
            <button onclick="simulatePayment(${ride.id})">
                Book Now
            </button>
        `;

        resultsContainer.appendChild(card);
    });
}