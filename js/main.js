// ServerG Main Javascript Entry
// This file coordinates interactions on the landing page and general utility functions.

document.addEventListener("DOMContentLoaded", () => {
  // Initialize general UI components
  initHeaderScroll();
  initMobileMenu();
  initToastNotificationContainer();
  updateNavbarAuth();
  
  // Initialize landing-page-specific dynamic content
  if (document.getElementById("categories-grid")) {
    renderPopularCategories();
  }
  
  if (document.getElementById("featured-providers-grid")) {
    renderFeaturedProviders();
  }
  
  if (document.getElementById("hero-search-form")) {
    initHeroSearch();
  }
});

/* ==========================================================================
   1. General Navbar and Header Functions
   ========================================================================== */

// Add shadow/background to header when user scrolls down
function initHeaderScroll() {
  const header = document.querySelector(".header");
  
  const handleScroll = () => {
    if (window.scrollY > 20) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  };
  
  window.addEventListener("scroll", handleScroll);
  handleScroll(); // Run immediately in case page is refreshed while scrolled
}

// Toggle mobile navigation menu drawer
function initMobileMenu() {
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");
  
  if (!menuToggle || !navLinks) return;
  
  menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("active");
    // Change menu icon between hamburger and close
    const icon = menuToggle.querySelector("i");
    if (icon) {
      if (navLinks.classList.contains("active")) {
        icon.setAttribute("data-lucide", "x");
      } else {
        icon.setAttribute("data-lucide", "menu");
      }
      // Re-run lucide to render the changed icon
      if (typeof lucide !== "undefined") {
        lucide.createIcons();
      }
    }
  });
  
  // Close menu when clicking outside or on a link
  document.addEventListener("click", (e) => {
    if (!navLinks.contains(e.target) && !menuToggle.contains(e.target) && navLinks.classList.contains("active")) {
      navLinks.classList.remove("active");
      const icon = menuToggle.querySelector("i");
      if (icon) {
        icon.setAttribute("data-lucide", "menu");
        if (typeof lucide !== "undefined") {
          lucide.createIcons();
        }
      }
    }
  });
}

/* ==========================================================================
   2. Dynamic Content Rendering (Landing Page)
   ========================================================================== */

// Render Categories Grid dynamically from ServerGData
function renderPopularCategories() {
  const grid = document.getElementById("categories-grid");
  if (!grid || typeof ServerGData === "undefined") return;
  
  // Clean container
  grid.innerHTML = "";
  
  // Take first 8 categories for the landing page
  const displayCategories = ServerGData.categories.slice(0, 8);
  
  displayCategories.forEach(cat => {
    const cardHtml = `
      <a href="services.html?category=${cat.id}" class="category-card" data-category="${cat.id}">
        <div class="category-icon-wrapper">
          <i data-lucide="${cat.icon || 'tag'}"></i>
        </div>
        <h3>${cat.name}</h3>
        <p>${cat.serviceCount} Providers</p>
      </a>
    `;
    grid.insertAdjacentHTML("beforeend", cardHtml);
  });
  
  // Since we inserted new data-lucide elements, we must trigger Lucide to render them
  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }
}

// Render Featured Providers dynamically from ServerGData
function renderFeaturedProviders() {
  const grid = document.getElementById("featured-providers-grid");
  if (!grid || typeof ServerGData === "undefined") return;
  
  grid.innerHTML = "";
  
  // Show 3 top-rated/featured providers on the landing page
  const featured = ServerGData.providers.slice(0, 3);
  
  featured.forEach(prov => {
    // Find category name
    const categoryObj = ServerGData.categories.find(c => c.id === prov.category);
    const categoryName = categoryObj ? categoryObj.name : prov.category;
    
    const cardHtml = `
      <div class="provider-card">
        <div class="provider-header">
          <img src="${prov.avatar}" alt="${prov.name}" class="provider-avatar">
          <div class="provider-info-basic">
            <h3>${prov.name}</h3>
            <div class="provider-rating-row">
              <i data-lucide="star"></i>
              <span>${prov.rating.toFixed(1)}</span>
              <span class="reviews-count">(${prov.reviewsCount} reviews)</span>
            </div>
          </div>
        </div>
        <div class="provider-body">
          <h4 class="provider-title">${prov.serviceTitle}</h4>
          <p class="provider-desc">${prov.description}</p>
          <div class="provider-meta">
            <div class="meta-item">
              <i data-lucide="map-pin"></i>
              <span>${prov.location}</span>
            </div>
            <div class="meta-item">
              <i data-lucide="briefcase"></i>
              <span>${prov.experience} Experience</span>
            </div>
          </div>
        </div>
        <div class="provider-footer">
          <div class="provider-price">
            <span class="price-label">Rate Starts From</span>
            <div>
              <span class="price-amount">₹${prov.price}</span>
              <span class="price-unit">/ hr</span>
            </div>
          </div>
          <a href="service-details.html?id=${prov.id}" class="btn btn-primary btn-sm">View Details</a>
        </div>
      </div>
    `;
    grid.insertAdjacentHTML("beforeend", cardHtml);
  });
  
  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }
}

/* ==========================================================================
   3. Navigation / Redirection Logic
   ========================================================================== */

function initHeroSearch() {
  const form = document.getElementById("hero-search-form");
  if (!form) return;
  
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const queryInput = document.getElementById("search-query");
    const categorySelect = document.getElementById("search-category");
    
    const query = queryInput ? queryInput.value.trim() : "";
    const category = categorySelect ? categorySelect.value : "";
    
    // Redirect to services search page with parameters
    let url = "services.html";
    const params = [];
    
    if (query) params.push(`query=${encodeURIComponent(query)}`);
    if (category) params.push(`category=${encodeURIComponent(category)}`);
    
    if (params.length > 0) {
      url += "?" + params.join("&");
    }
    
    window.location.href = url;
  });
}

/* ==========================================================================
   4. Toast Notifications System
   ========================================================================== */

function initToastNotificationContainer() {
  if (!document.getElementById("toast-container")) {
    const container = document.createElement("div");
    container.id = "toast-container";
    container.className = "toast-container";
    document.body.appendChild(container);
  }
}

// Global utility function to display toast notices (used on other pages as well)
function showToast(message, type = "success") {
  const container = document.getElementById("toast-container");
  if (!container) return;
  
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  
  let iconName = "check-circle";
  if (type === "error") iconName = "alert-circle";
  else if (type === "warning") iconName = "alert-triangle";
  
  toast.innerHTML = `
    <i data-lucide="${iconName}"></i>
    <div class="toast-content">${message}</div>
  `;
  
  container.appendChild(toast);
  
  // Render lucide icon
  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }
  
  // Slide in
  setTimeout(() => {
    toast.classList.add("show");
  }, 10);
  
  // Slide out and remove
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => {
      toast.remove();
    }, 300); // match transition duration
  }, 4000);
}

// Synchronize navbar elements with active user session states
function updateNavbarAuth() {
  const desktopActions = document.querySelector(".nav-actions");
  const mobileActions = document.querySelector(".nav-actions-mobile");
  
  if (!desktopActions) return;
  
  const loggedInUser = localStorage.getItem("serverg_logged_in_user") ? JSON.parse(localStorage.getItem("serverg_logged_in_user")) : null;
  
  if (loggedInUser) {
    const dashboardLink = loggedInUser.role === "customer" ? "customer-dashboard.html" : "provider-dashboard.html";
    
    // Desktop layout updates
    desktopActions.innerHTML = `
      <a href="${dashboardLink}" class="btn btn-secondary btn-sm" style="display: flex; align-items: center; gap: 0.35rem; padding: 0.5rem 1rem;">
        <i data-lucide="user" style="width: 14px; height: 14px;"></i>
        <span>${loggedInUser.name.split(" ")[0]}</span>
      </a>
      <button onclick="logoutUser()" class="btn btn-primary btn-sm btn-outline">Logout</button>
    `;
    
    // Mobile menu drawer updates
    if (mobileActions) {
      mobileActions.style.display = "flex";
      mobileActions.innerHTML = `
        <a href="${dashboardLink}" class="btn btn-secondary btn-sm" style="width: 100%;">My Dashboard</a>
        <button onclick="logoutUser()" class="btn btn-primary btn-sm btn-outline" style="width: 100%;">Logout</button>
      `;
    }
  } else {
    // Return standard anonymous state triggers
    desktopActions.innerHTML = `
      <a href="login.html" class="btn btn-secondary btn-sm">Login</a>
      <a href="register.html" class="btn btn-primary btn-sm">Sign Up</a>
    `;
    
    if (mobileActions) {
      mobileActions.style.display = "flex";
      mobileActions.innerHTML = `
        <a href="login.html" class="btn btn-secondary btn-sm" style="width: 100%;">Login</a>
        <a href="register.html" class="btn btn-primary btn-sm" style="width: 100%;">Sign Up</a>
      `;
    }
  }
  
  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }
}
