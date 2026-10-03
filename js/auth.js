// ServerG Authentication Logic
// Manages registration, form validation, user database seeding in localStorage, and session management.

document.addEventListener("DOMContentLoaded", () => {
  // Seed default users in localStorage if not already present
  seedDefaultUsers();
  
  // 1. Handle Registration page specific triggers
  if (document.getElementById("register-form")) {
    parseRegisterRoleParam();
    initRegisterForm();
  }
  
  // 2. Handle Login page specific triggers
  if (document.getElementById("login-form")) {
    initLoginForm();
  }
});

/* ==========================================================================
   1. User Database Seeding & Helpers
   ========================================================================== */

function seedDefaultUsers() {
  const defaultUsers = [
    {
      id: "cust-1",
      name: "Aarav Sharma",
      email: "customer@serverg.com",
      phone: "9876543210",
      password: "password123",
      role: "customer"
    },
    {
      id: "prov-1", // Maps to Rajesh Kumar in data.js
      name: "Rajesh Kumar",
      email: "provider@serverg.com",
      phone: "9876543211",
      password: "password123",
      role: "provider"
    }
  ];

  if (!localStorage.getItem("serverg_users")) {
    localStorage.setItem("serverg_users", JSON.stringify(defaultUsers));
  }
}

// Global helper to get all registered users
function getUsers() {
  return JSON.parse(localStorage.getItem("serverg_users")) || [];
}

// Global helper to check active session
function getLoggedInUser() {
  return JSON.parse(localStorage.getItem("serverg_logged_in_user")) || null;
}

// Global helper to terminate active session (can be called from dashboard scripts)
function logoutUser() {
  localStorage.removeItem("serverg_logged_in_user");
  if (typeof showToast !== "undefined") {
    showToast("Logged out successfully!", "success");
  }
  setTimeout(() => {
    window.location.href = "index.html";
  }, 1000);
}

/* ==========================================================================
   2. Registration Handling & Validation
   ========================================================================== */

// Auto-select role based on URL parameter (?role=provider)
function parseRegisterRoleParam() {
  const params = new URLSearchParams(window.location.search);
  const role = params.get("role");
  
  if (role === "customer" || role === "provider") {
    const radio = document.querySelector(`input[name="register-role"][value="${role}"]`);
    if (radio) radio.checked = true;
  }
}

function initRegisterForm() {
  const form = document.getElementById("register-form");
  if (!form) return;
  
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    
    // Clear previous error messages
    const errors = form.querySelectorAll(".error-msg");
    errors.forEach(err => err.textContent = "");
    
    // Grab inputs
    const role = form.querySelector('input[name="register-role"]:checked').value;
    const nameInput = document.getElementById("reg-name");
    const emailInput = document.getElementById("reg-email");
    const phoneInput = document.getElementById("reg-phone");
    const passwordInput = document.getElementById("reg-password");
    const confirmInput = document.getElementById("reg-confirm");
    
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const phone = phoneInput.value.trim();
    const password = passwordInput.value;
    const confirm = confirmInput.value;
    
    let isValid = true;
    
    // Validation: Name
    if (!name || name.length < 2) {
      showInputError("name-error", "Name must be at least 2 characters long.");
      isValid = false;
    }
    
    // Validation: Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      showInputError("email-error", "Please enter a valid email address.");
      isValid = false;
    }
    
    // Validation: Phone (10 digits)
    const phoneRegex = /^[6-9]\d{9}$/; // Indian mobile number pattern
    if (!phone || !phoneRegex.test(phone)) {
      showInputError("phone-error", "Please enter a valid 10-digit mobile number starting with 6-9.");
      isValid = false;
    }
    
    // Validation: Password (>= 6 chars)
    if (!password || password.length < 6) {
      showInputError("password-error", "Password must be at least 6 characters.");
      isValid = false;
    }
    
    // Validation: Password Match
    if (password !== confirm) {
      showInputError("confirm-error", "Passwords do not match.");
      isValid = false;
    }
    
    if (!isValid) {
      if (typeof showToast !== "undefined") {
        showToast("Please fix the validation errors in the form.", "error");
      }
      return;
    }
    
    // Check if email already registered
    const users = getUsers();
    const emailExists = users.some(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (emailExists) {
      showInputError("email-error", "This email address is already registered.");
      if (typeof showToast !== "undefined") {
        showToast("Registration failed: Email already exists.", "error");
      }
      return;
    }
    
    // Create new user record
    const newUser = {
      id: role === "customer" ? "cust-" + Date.now() : "prov-" + Date.now(),
      name,
      email,
      phone,
      password, // Simple database simulation (plain text)
      role
    };
    
    users.push(newUser);
    localStorage.setItem("serverg_users", JSON.stringify(users));
    
    // Log user session in
    localStorage.setItem("serverg_logged_in_user", JSON.stringify(newUser));
    
    if (typeof showToast !== "undefined") {
      showToast("Account registered successfully!", "success");
    }
    
    // Redirect to dashboard based on role
    setTimeout(() => {
      if (role === "customer") {
        window.location.href = "customer-dashboard.html";
      } else {
        window.location.href = "provider-dashboard.html";
      }
    }, 1500);
  });
}

/* ==========================================================================
   3. Login Handling & Validation
   ========================================================================== */

function initLoginForm() {
  const form = document.getElementById("login-form");
  if (!form) return;
  
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    
    // Clear errors
    const errors = form.querySelectorAll(".error-msg");
    errors.forEach(err => err.textContent = "");
    
    const emailInput = document.getElementById("login-email");
    const passwordInput = document.getElementById("login-password");
    
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    
    let isValid = true;
    
    // Validate Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      showInputError("email-error", "Please enter a valid email address.");
      isValid = false;
    }
    
    // Validate Password
    if (!password) {
      showInputError("password-error", "Please enter your password.");
      isValid = false;
    }
    
    if (!isValid) return;
    
    // Check credentials
    const users = getUsers();
    const matchedUser = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    
    if (!matchedUser) {
      showInputError("password-error", "Invalid email or password combination.");
      if (typeof showToast !== "undefined") {
        showToast("Access Denied: Incorrect credentials.", "error");
      }
      return;
    }
    
    // Set active session
    localStorage.setItem("serverg_logged_in_user", JSON.stringify(matchedUser));
    
    if (typeof showToast !== "undefined") {
      showToast(`Welcome back, ${matchedUser.name}!`, "success");
    }
    
    // Redirect to dashboard
    setTimeout(() => {
      if (matchedUser.role === "customer") {
        window.location.href = "customer-dashboard.html";
      } else {
        window.location.href = "provider-dashboard.html";
      }
    }, 1500);
  });
}

// Utility to display error text inline
function showInputError(elementId, message) {
  const errorPlaceholder = document.getElementById(elementId);
  if (errorPlaceholder) {
    errorPlaceholder.textContent = message;
  }
}

// One-click Demo Login handler for testing without signup
function loginDemoUser(role) {
  seedDefaultUsers();
  const users = getUsers();
  const targetEmail = role === "customer" ? "customer@serverg.com" : "provider@serverg.com";
  const demoUser = users.find(u => u.email.toLowerCase() === targetEmail.toLowerCase()) || {
    id: role === "customer" ? "cust-1" : "prov-1",
    name: role === "customer" ? "Aarav Sharma" : "Sai Vivek",
    email: targetEmail,
    phone: "9876543210",
    role: role
  };

  localStorage.setItem("serverg_logged_in_user", JSON.stringify(demoUser));
  
  if (typeof showToast !== "undefined") {
    showToast(`Logged in as Demo ${role === "customer" ? "Customer" : "Provider"} (${demoUser.name})`, "success");
  }
  
  setTimeout(() => {
    window.location.href = role === "customer" ? "customer-dashboard.html" : "provider-dashboard.html";
  }, 600);
}

