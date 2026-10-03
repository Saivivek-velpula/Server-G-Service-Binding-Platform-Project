// ServerG Service Discovery Logic
// This script handles search query parsing, filters (categories, location, price, rating), sorting, and DOM updates.

document.addEventListener("DOMContentLoaded", () => {
  // 1. Render category filters first
  renderCategoryFilterList();

  // 2. Parse parameters passed from Landing Page search
  parseQueryParams();

  // 3. Render initial matching cards
  applyFilters();

  // 4. Attach event listeners
  initFilterListeners();
});

// State management to hold active search & filters
const filterState = {
  search: "",
  categories: [], // Selected category IDs
  location: "",
  maxPrice: 1000,
  minRating: 0,
  sortBy: "rating"
};

/* ==========================================================================
   1. Setup UI Controls
   ========================================================================== */

// Inject categories checkboxes dynamically from data.js
function renderCategoryFilterList() {
  const container = document.getElementById("category-checkbox-list");
  if (!container || typeof ServerGData === "undefined") return;
  
  container.innerHTML = "";
  
  ServerGData.categories.forEach(cat => {
    const item = document.createElement("label");
    item.className = "checkbox-item";
    item.innerHTML = `
      <input type="checkbox" value="${cat.id}" class="category-checkbox">
      <span>${cat.name}</span>
    `;
    container.appendChild(item);
  });
}

// Parse search and category parameters from URL query string
function parseQueryParams() {
  const params = new URLSearchParams(window.location.search);
  const query = params.get("query");
  const category = params.get("category");
  
  if (query) {
    filterState.search = query;
    const searchInput = document.getElementById("filter-search");
    if (searchInput) searchInput.value = query;
  }
  
  if (category) {
    filterState.categories.push(category);
    // Find matching checkbox and tick it
    const checkboxes = document.querySelectorAll(".category-checkbox");
    checkboxes.forEach(cb => {
      if (cb.value === category) {
        cb.checked = true;
      }
    });
  }
}

// Set up DOM interaction event listeners
function initFilterListeners() {
  // Text Search input
  const searchInput = document.getElementById("filter-search");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      filterState.search = e.target.value.trim();
      applyFilters();
    });
  }
  
  // Category checklist changes
  const listContainer = document.getElementById("category-checkbox-list");
  if (listContainer) {
    listContainer.addEventListener("change", () => {
      const checkedBoxes = listContainer.querySelectorAll(".category-checkbox:checked");
      filterState.categories = Array.from(checkedBoxes).map(cb => cb.value);
      applyFilters();
    });
  }
  
  // Location select changes
  const locationSelect = document.getElementById("filter-location");
  if (locationSelect) {
    locationSelect.addEventListener("change", (e) => {
      filterState.location = e.target.value;
      applyFilters();
    });
  }
  
  // Price range slider changes
  const priceSlider = document.getElementById("filter-price");
  const priceVal = document.getElementById("price-val");
  if (priceSlider) {
    priceSlider.addEventListener("input", (e) => {
      const val = parseInt(e.target.value);
      filterState.maxPrice = val;
      if (priceVal) priceVal.textContent = `₹${val.toLocaleString()}`;
      applyFilters();
    });
  }
  
  // Rating radio button changes
  const ratingRadios = document.getElementsByName("filter-rating");
  ratingRadios.forEach(radio => {
    radio.addEventListener("change", (e) => {
      if (e.target.checked) {
        const val = e.target.value;
        filterState.minRating = val === "all" ? 0 : parseFloat(val);
        applyFilters();
      }
    });
  });
  
  // Sort select changes
  const sortSelect = document.getElementById("sort-select");
  if (sortSelect) {
    sortSelect.addEventListener("change", (e) => {
      filterState.sortBy = e.target.value;
      applyFilters();
    });
  }
  
  // Clear filters buttons
  const clearBtn = document.getElementById("clear-filters-btn");
  if (clearBtn) {
    clearBtn.addEventListener("click", resetAllFilters);
  }
  
  const resetBtn = document.getElementById("reset-filters-btn");
  if (resetBtn) {
    resetBtn.addEventListener("click", resetAllFilters);
  }

  // Mobile Filters drawer toggle
  const mobileFilterBtn = document.getElementById("mobile-filter-btn");
  const sidebar = document.getElementById("filters-sidebar");
  if (mobileFilterBtn && sidebar) {
    mobileFilterBtn.addEventListener("click", () => {
      sidebar.classList.toggle("active");
      if (sidebar.classList.contains("active")) {
        mobileFilterBtn.innerHTML = `<i data-lucide="x"></i> Hide Filters`;
      } else {
        mobileFilterBtn.innerHTML = `<i data-lucide="sliders-horizontal"></i> Show Filters & Sorting`;
      }
      if (typeof lucide !== "undefined") {
        lucide.createIcons();
      }
    });
  }
}

// Reset all filter controls and state
function resetAllFilters() {
  // Reset state variables
  filterState.search = "";
  filterState.categories = [];
  filterState.location = "";
  filterState.maxPrice = 1000;
  filterState.minRating = 0;
  filterState.sortBy = "rating";
  
  // Reset HTML input elements
  const searchInput = document.getElementById("filter-search");
  if (searchInput) searchInput.value = "";
  
  const checkboxes = document.querySelectorAll(".category-checkbox");
  checkboxes.forEach(cb => cb.checked = false);
  
  const locationSelect = document.getElementById("filter-location");
  if (locationSelect) locationSelect.value = "";
  
  const priceSlider = document.getElementById("filter-price");
  if (priceSlider) priceSlider.value = 1000;
  
  const priceVal = document.getElementById("price-val");
  if (priceVal) priceVal.textContent = "₹1,000";
  
  const ratingAllRadio = document.querySelector('input[name="filter-rating"][value="all"]');
  if (ratingAllRadio) ratingAllRadio.checked = true;
  
  const sortSelect = document.getElementById("sort-select");
  if (sortSelect) sortSelect.value = "rating";
  
  // Close mobile filters panel if active
  const sidebar = document.getElementById("filters-sidebar");
  const mobileFilterBtn = document.getElementById("mobile-filter-btn");
  if (sidebar && sidebar.classList.contains("active")) {
    sidebar.classList.remove("active");
    if (mobileFilterBtn) {
      mobileFilterBtn.innerHTML = `<i data-lucide="sliders-horizontal"></i> Show Filters & Sorting`;
      if (typeof lucide !== "undefined") {
        lucide.createIcons();
      }
    }
  }

  // Apply changes
  applyFilters();
  
  if (typeof showToast !== "undefined") {
    showToast("Filters cleared", "success");
  }
}

/* ==========================================================================
   2. Processing & Rendering Logic
   ========================================================================== */

// Apply search, filters and sorting calculations, then update the grid
function applyFilters() {
  if (typeof ServerGData === "undefined" || !ServerGData.providers) return;
  
  let results = [...ServerGData.providers];
  
  // A. Search keyword filter (Case-insensitive matching title, name, description)
  if (filterState.search) {
    const q = filterState.search.toLowerCase();
    results = results.filter(prov => 
      prov.name.toLowerCase().includes(q) || 
      prov.serviceTitle.toLowerCase().includes(q) || 
      prov.description.toLowerCase().includes(q)
    );
  }
  
  // B. Category check boxes (Logical OR: matches category if checked)
  if (filterState.categories.length > 0) {
    results = results.filter(prov => filterState.categories.includes(prov.category));
  }
  
  // C. Location selection
  if (filterState.location) {
    const loc = filterState.location.toLowerCase();
    results = results.filter(prov => prov.location.toLowerCase().includes(loc));
  }
  
  // D. Max pricing slider
  results = results.filter(prov => prov.price <= filterState.maxPrice);
  
  // E. Minimum rating score
  if (filterState.minRating > 0) {
    results = results.filter(prov => prov.rating >= filterState.minRating);
  }
  
  // F. Sort calculation
  sortResults(results);
  
  // G. Dynamic Grid rendering
  renderProviders(results);
}

// Sort results array in-place based on sort setting
function sortResults(array) {
  if (filterState.sortBy === "rating") {
    array.sort((a, b) => b.rating - a.rating);
  } else if (filterState.sortBy === "price-low") {
    array.sort((a, b) => a.price - b.price);
  } else if (filterState.sortBy === "price-high") {
    array.sort((a, b) => b.price - a.price);
  } else if (filterState.sortBy === "experience") {
    array.sort((a, b) => {
      const expA = parseInt(a.experience) || 0;
      const expB = parseInt(b.experience) || 0;
      return expB - expA;
    });
  }
}

// Write compiled provider items into the HTML grid
function renderProviders(providers) {
  const grid = document.getElementById("services-grid");
  const emptyState = document.getElementById("empty-state");
  const resultsNum = document.getElementById("results-num");
  
  if (!grid) return;
  
  // Update count indicator
  if (resultsNum) resultsNum.textContent = providers.length;
  
  // If list is empty, toggle visual layouts
  if (providers.length === 0) {
    grid.style.display = "none";
    if (emptyState) emptyState.style.display = "flex";
    return;
  }
  
  grid.style.display = "grid";
  if (emptyState) emptyState.style.display = "none";
  grid.innerHTML = "";
  
  providers.forEach(prov => {
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
              <span class="reviews-count">(${prov.reviewsCount})</span>
            </div>
          </div>
        </div>
        <div class="provider-body">
          <span class="badge badge-primary mb-1">${categoryName}</span>
          <h4 class="provider-title">${prov.serviceTitle}</h4>
          <p class="provider-desc">${prov.description}</p>
          <div class="provider-meta">
            <div class="meta-item">
              <i data-lucide="map-pin"></i>
              <span>${prov.location}</span>
            </div>
            <div class="meta-item">
              <i data-lucide="clock"></i>
              <span>${prov.availability}</span>
            </div>
          </div>
        </div>
        <div class="provider-footer">
          <div class="provider-price">
            <span class="price-label">Hourly Rate</span>
            <div>
              <span class="price-amount">₹${prov.price}</span>
              <span class="price-unit">/ hr</span>
            </div>
          </div>
          <div style="display: flex; gap: 0.5rem;">
            <a href="service-details.html?id=${prov.id}" class="btn btn-secondary btn-sm">Details</a>
            <a href="service-details.html?id=${prov.id}&book=true" class="btn btn-primary btn-sm">Book</a>
          </div>
        </div>
      </div>
    `;
    grid.insertAdjacentHTML("beforeend", cardHtml);
  });
  
  // Compile icons
  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }
}
