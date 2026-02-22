/* ==================================
   ADVANCED FORM SYSTEM
================================== */

document.addEventListener("DOMContentLoaded", function () {
    initForms();
});

/* ===============================
   INIT FORMS
=============================== */
function initForms() {
    const forms = document.querySelectorAll("form");

    forms.forEach(form => {

        // Real-time validation
        const inputs = form.querySelectorAll("input, textarea, select");

        inputs.forEach(input => {
            input.addEventListener("input", () => validateField(input));
            input.addEventListener("blur", () => validateField(input));
        });

        // On Submit
        form.addEventListener("submit", function (e) {
            let valid = true;

            inputs.forEach(input => {
                if (!validateField(input)) {
                    valid = false;
                }
            });

            if (!valid) {
                e.preventDefault();
                showFormAlert("Please fix errors before submitting", "error");
            }
        });
    });
}

/* ===============================
   FIELD VALIDATION
=============================== */
function validateField(field) {

    const value = field.value.trim();
    const type = field.type;
    const name = field.name || field.id;

    removeError(field);

    // Required check
    if (field.hasAttribute("required") && value === "") {
        showError(field, "This field is required");
        return false;
    }

    // Email validation
    if (type === "email" && value !== "") {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(value)) {
            showError(field, "Invalid email format");
            return false;
        }
    }

    // Password strength
    if (name.includes("password") && value !== "") {
        if (value.length < 6) {
            showError(field, "Password must be at least 6 characters");
            return false;
        }
    }

    // Confirm password
    if (name.includes("confirm")) {
        const passwordField = document.querySelector("input[type='password']");
        if (passwordField && value !== passwordField.value) {
            showError(field, "Passwords do not match");
            return false;
        }
    }

    // Success styling
    field.style.borderColor = "#10b981";
    return true;
}

/* ===============================
   ERROR DISPLAY
=============================== */
function showError(field, message) {

    field.style.borderColor = "#ef4444";

    const error = document.createElement("small");
    error.className = "form-error";
    error.style.color = "#ef4444";
    error.innerText = message;

    field.parentElement.appendChild(error);
}

function removeError(field) {
    field.style.borderColor = "#ddd";

    const existing = field.parentElement.querySelector(".form-error");
    if (existing) existing.remove();
}

/* ===============================
   GLOBAL FORM ALERT
=============================== */
function showFormAlert(message, type = "success") {

    const alert = document.createElement("div");
    alert.className = "form-alert";
    alert.innerText = message;

    alert.style.position = "fixed";
    alert.style.top = "20px";
    alert.style.right = "20px";
    alert.style.padding = "12px 20px";
    alert.style.borderRadius = "6px";
    alert.style.color = "white";
    alert.style.zIndex = "9999";
    alert.style.background = type === "error" ? "#ef4444" : "#10b981";

    document.body.appendChild(alert);

    setTimeout(() => alert.remove(), 3000);
}