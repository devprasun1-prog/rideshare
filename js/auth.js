/* ==================================
   AUTH SYSTEM - SHARE RIDE
================================== */

/* ===============================
   REGISTER USER
=============================== */
function registerUser(e) {
    e.preventDefault();

    const name = document.getElementById("reg-name").value.trim();
    const email = document.getElementById("reg-email").value.trim();
    const password = document.getElementById("reg-password").value.trim();

    if (!name || !email || !password) {
        alert("All fields are required");
        return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];

    // Check duplicate email
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
        alert("User already exists with this email");
        return;
    }

    const newUser = {
        id: Date.now(),
        name,
        email,
        password,
        role: "user",
        rating: [],
        ridesBooked: []
    };

    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    alert("Registration Successful 🎉");
    window.location.href = "login.html";
}

/* ===============================
   LOGIN USER
=============================== */
function loginUser(e) {
    e.preventDefault();

    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value.trim();

    let users = JSON.parse(localStorage.getItem("users")) || [];

    const user = users.find(
        user => user.email === email && user.password === password
    );

    if (!user) {
        alert("Invalid Email or Password");
        return;
    }

    // Create session
    const session = {
        userId: user.id,
        role: user.role,
        loginTime: Date.now()
    };

    localStorage.setItem("session", JSON.stringify(session));

    // Role based redirect
    if (user.role === "admin") {
        window.location.href = "admin.html";
    } else {
        window.location.href = "dashboard.html";
    }
}

/* ===============================
   LOGOUT
=============================== */
function logout() {
    localStorage.removeItem("session");
    window.location.href = "index.html";
}

/* ===============================
   AUTO SESSION CHECK
=============================== */
function autoRedirectIfLoggedIn() {

    const session = JSON.parse(localStorage.getItem("session"));
    if (!session) return;

    const currentPage = window.location.pathname.split("/").pop();

    // If already logged in, don't allow login/register page
    if (currentPage === "login.html" || currentPage === "register.html") {

        if (session.role === "admin") {
            window.location.href = "admin.html";
        } else {
            window.location.href = "dashboard.html";
        }
    }
}

document.addEventListener("DOMContentLoaded", autoRedirectIfLoggedIn);

/* ===============================
   CREATE DEFAULT ADMIN (IF NOT EXISTS)
=============================== */
function ensureAdminExists() {

    let users = JSON.parse(localStorage.getItem("users")) || [];

    const adminExists = users.some(user => user.role === "admin");

    if (!adminExists) {
        const defaultAdmin = {
            id: 1,
            name: "Admin",
            email: "admin@gmail.com",
            password: "1234",
            role: "admin",
            rating: [],
            ridesBooked: []
        };

        users.push(defaultAdmin);
        localStorage.setItem("users", JSON.stringify(users));
    }
}

document.addEventListener("DOMContentLoaded", ensureAdminExists);