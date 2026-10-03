// ServerG Provider Dashboard & Customer Dashboard Controller
// Fully functional frontend implementation powered by Vanilla JS & LocalStorage persistence.

document.addEventListener("DOMContentLoaded", () => {
  // Check active dashboard view
  if (document.getElementById("customer-bookings-grid")) {
    initCustomerDashboard();
  } else if (document.getElementById("overview-section") || document.getElementById("app-sidebar")) {
    initProviderSaaSDashboard();
  }
});

/* ==========================================================================
   1. LOCALSTORAGE DATA SEEDING & HELPERS
   ========================================================================== */

function initLocalStorageData() {
  // 1. Default Provider Record
  if (!localStorage.getItem("serverg_provider")) {
    const defaultProvider = {
      id: "prov-1",
      name: "Sai Vivek",
      email: "provider@example.com",
      phone: "+91 98765 43210",
      location: "Guntur",
      businessName: "Kumar Electrical Services",
      experience: "5 years",
      category: "Electrician",
      about: "Professional electrical repair and installation services with guaranteed safety.",
      rating: 4.9,
      reviewsCount: 48,
      completedJobs: 24,
      avatar: "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150&auto=format&fit=crop&q=80"
    };
    localStorage.setItem("serverg_provider", JSON.stringify(defaultProvider));
  }

  // 2. Default Services Data
  if (!localStorage.getItem("serverg_services")) {
    const defaultServices = [
      {
        id: 1,
        title: "Electrical Repair",
        category: "Electrician",
        description: "Professional home electrical repair services and panel troubleshooting.",
        price: 500,
        location: "Guntur",
        availability: "Mon - Sat (9 AM - 6 PM)",
        status: "active",
        image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=300&auto=format&fit=crop&q=80"
      },
      {
        id: 2,
        title: "AC Repair & Servicing",
        category: "AC Technician",
        description: "Comprehensive AC filter cleaning, gas refilling, and noise reduction.",
        price: 800,
        location: "Guntur",
        availability: "Daily (8 AM - 8 PM)",
        status: "active",
        image: "https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=300&auto=format&fit=crop&q=80"
      },
      {
        id: 3,
        title: "Smart Switch Installation",
        category: "Electrician",
        description: "Smart home automation setup, wifi switch configuration, and wiring.",
        price: 750,
        location: "Guntur",
        availability: "Mon - Sat (10 AM - 7 PM)",
        status: "active",
        image: "https://images.unsplash.com/photo-1558002038-1055907df827?w=300&auto=format&fit=crop&q=80"
      },
      {
        id: 4,
        title: "Inverter & Battery Wiring",
        category: "Electrician",
        description: "Home backup power setup, inverter installation, and battery testing.",
        price: 600,
        location: "Guntur",
        availability: "Mon - Sat (9 AM - 6 PM)",
        status: "inactive",
        image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=300&auto=format&fit=crop&q=80"
      }
    ];
    localStorage.setItem("serverg_services", JSON.stringify(defaultServices));
  }

  // 3. Default Requests Data
  if (!localStorage.getItem("serverg_requests")) {
    const defaultRequests = [
      {
        id: 101,
        customerName: "Rahul Kumar",
        customerAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
        service: "Electrical Repair",
        location: "Guntur",
        requestDate: "2026-09-25",
        preferredDate: "2026-09-28",
        price: 500,
        message: "Need help with a wiring issue in the living room.",
        status: "pending"
      },
      {
        id: 102,
        customerName: "Ananya Sharma",
        customerAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80",
        service: "AC Repair & Servicing",
        location: "Guntur",
        requestDate: "2026-09-24",
        preferredDate: "2026-09-27",
        price: 800,
        message: "My AC unit is not cooling properly and making a buzzing noise.",
        status: "pending"
      },
      {
        id: 103,
        customerName: "Vikram Sen",
        customerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
        service: "Smart Switch Installation",
        location: "Guntur",
        requestDate: "2026-09-20",
        preferredDate: "2026-09-23",
        price: 750,
        message: "Want to replace 4 standard switches with smart touch panels.",
        status: "accepted"
      },
      {
        id: 104,
        customerName: "Priyanka Mehta",
        customerAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80",
        service: "Electrical Repair",
        location: "Guntur",
        requestDate: "2026-09-18",
        preferredDate: "2026-09-21",
        price: 500,
        message: "Short circuit repair in kitchen power outlet.",
        status: "completed"
      },
      {
        id: 105,
        customerName: "Siddharth Rao",
        customerAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
        service: "Inverter & Battery Wiring",
        location: "Guntur",
        requestDate: "2026-09-15",
        preferredDate: "2026-09-17",
        price: 600,
        message: "Need urgent battery wiring fix.",
        status: "rejected"
      }
    ];
    localStorage.setItem("serverg_requests", JSON.stringify(defaultRequests));
  }
}

// Data fetch helpers
function getProviderData() {
  return JSON.parse(localStorage.getItem("serverg_provider"));
}

function saveProviderData(provider) {
  localStorage.setItem("serverg_provider", JSON.stringify(provider));
}

function getServicesData() {
  return JSON.parse(localStorage.getItem("serverg_services")) || [];
}

function saveServicesData(services) {
  localStorage.setItem("serverg_services", JSON.stringify(services));
}

function getRequestsData() {
  return JSON.parse(localStorage.getItem("serverg_requests")) || [];
}

function saveRequestsData(requests) {
  localStorage.setItem("serverg_requests", JSON.stringify(requests));
}


/* ==========================================================================
   2. SAAS PROVIDER DASHBOARD CONTROLLER
   ========================================================================== */

let activeSection = "overview-section";
let activeRequestsFilter = "all";
let activeRequestsSearch = "";
let pendingTargetDeleteServiceId = null;
let pendingTargetRejectRequestId = null;

function initProviderSaaSDashboard() {
  initLocalStorageData();

  // Session guard
  const user = checkDashboardSession("provider");
  if (!user) return;

  // Initialize UI components
  initSidebarNavigation();
  initMobileSidebarDrawer();
  initGlobalModalCloseEvents();

  // Load section data
  loadProviderProfileData();
  renderDashboardOverview();
  renderMyServices();
  renderServiceRequests();

  // Attach modal form handlers
  initServiceModalEvents();
  initProfileModalEvents();
  initDeleteConfirmModalEvents();
  initRejectConfirmModalEvents();
}


/* --- Sidebar & Section Switching --- */

function initSidebarNavigation() {
  const sidebarItems = document.querySelectorAll(".sidebar-item[data-section]");
  
  sidebarItems.forEach(item => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      const targetSection = item.getAttribute("data-section");
      switchDashboardSection(targetSection);
      
      // Auto-close mobile drawer if open
      closeMobileSidebar();
    });
  });

  // Links with data-switch-section attribute (e.g. "View All" links)
  const quickSwitchLinks = document.querySelectorAll("[data-switch-section]");
  quickSwitchLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetSection = link.getAttribute("data-switch-section");
      switchDashboardSection(targetSection);
    });
  });
}

function switchDashboardSection(sectionId) {
  activeSection = sectionId;

  // Update active sidebar nav item
  const sidebarItems = document.querySelectorAll(".sidebar-item[data-section]");
  sidebarItems.forEach(item => {
    if (item.getAttribute("data-section") === sectionId) {
      item.classList.add("active");
    } else {
      item.classList.remove("active");
    }
  });

  // Toggle active section view
  const sections = document.querySelectorAll(".dashboard-section");
  sections.forEach(sec => {
    if (sec.id === sectionId) {
      sec.classList.add("active");
    } else {
      sec.classList.remove("active");
    }
  });

  // Re-run lucide icons
  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }
}

function initMobileSidebarDrawer() {
  const toggleBtn = document.getElementById("sidebar-toggle-btn");
  const closeBtn = document.getElementById("sidebar-close-btn");
  const overlay = document.getElementById("sidebar-overlay");
  const sidebar = document.getElementById("app-sidebar");

  if (toggleBtn && sidebar && overlay) {
    toggleBtn.addEventListener("click", () => {
      sidebar.classList.add("sidebar-collapsed-open");
      overlay.classList.add("active");
    });
  }

  if (closeBtn) closeBtn.addEventListener("click", closeMobileSidebar);
  if (overlay) overlay.addEventListener("click", closeMobileSidebar);
}

function closeMobileSidebar() {
  const sidebar = document.getElementById("app-sidebar");
  const overlay = document.getElementById("sidebar-overlay");
  if (sidebar) sidebar.classList.remove("sidebar-collapsed-open");
  if (overlay) overlay.classList.remove("active");
}


/* --- Profile Loader & Header Sync --- */

function loadProviderProfileData() {
  const provider = getProviderData();
  if (!provider) return;

  // Sync Header User Profile
  const headerAvatar = document.getElementById("header-avatar");
  const headerName = document.getElementById("header-user-name");
  if (headerAvatar) headerAvatar.src = provider.avatar;
  if (headerName) headerName.textContent = provider.name;

  // Overview Welcome Banner
  const welcomeHeading = document.getElementById("overview-welcome-heading");
  if (welcomeHeading) welcomeHeading.textContent = `Welcome back, ${provider.name} 👋`;

  // Profile Section Displays
  const heroAvatar = document.getElementById("profile-avatar-display");
  const heroName = document.getElementById("profile-name-display");
  const heroCategory = document.getElementById("profile-category-display");
  const heroLocation = document.getElementById("profile-location-display");
  const heroRating = document.getElementById("profile-rating-display");
  const heroJobs = document.getElementById("profile-jobs-display");

  if (heroAvatar) heroAvatar.src = provider.avatar;
  if (heroName) heroName.textContent = provider.name;
  if (heroCategory) heroCategory.textContent = `${provider.category} Services`;
  if (heroLocation) heroLocation.textContent = provider.location;
  if (heroRating) heroRating.textContent = `${provider.rating} (${provider.reviewsCount} reviews)`;
  if (heroJobs) heroJobs.textContent = `${provider.completedJobs} Completed Jobs`;

  // Personal Info
  const fullNameEl = document.getElementById("info-full-name");
  const emailEl = document.getElementById("info-email");
  const phoneEl = document.getElementById("info-phone");
  const locationEl = document.getElementById("info-location");

  if (fullNameEl) fullNameEl.textContent = provider.name;
  if (emailEl) emailEl.textContent = provider.email;
  if (phoneEl) phoneEl.textContent = provider.phone;
  if (locationEl) locationEl.textContent = provider.location;

  // Professional Info
  const businessEl = document.getElementById("info-business-name");
  const expEl = document.getElementById("info-experience");
  const areaEl = document.getElementById("info-service-area");
  const aboutEl = document.getElementById("info-about");

  if (businessEl) businessEl.textContent = provider.businessName;
  if (expEl) expEl.textContent = provider.experience;
  if (areaEl) areaEl.textContent = `${provider.location} & Surrounding Areas`;
  if (aboutEl) aboutEl.textContent = provider.about;
}


/* --- Overview & Stats Calculator --- */

function renderDashboardOverview() {
  const services = getServicesData();
  const requests = getRequestsData();
  const provider = getProviderData();

  // Compute Stats Numbers
  const totalServices = services.length;
  const pendingRequests = requests.filter(r => r.status === "pending").length;
  const acceptedRequests = requests.filter(r => r.status === "accepted").length;
  const completedJobs = requests.filter(r => r.status === "completed").length;

  // Update Stats Cards Elements
  const totalEl = document.getElementById("stat-total-services");
  const pendingEl = document.getElementById("stat-pending-requests");
  const acceptedEl = document.getElementById("stat-accepted-requests");
  const completedEl = document.getElementById("stat-completed-jobs");

  if (totalEl) totalEl.textContent = totalServices;
  if (pendingEl) pendingEl.textContent = pendingRequests;
  if (acceptedEl) acceptedEl.textContent = acceptedRequests;
  if (completedEl) completedEl.textContent = completedJobs;

  // Sidebar Pending Badge indicator
  const pendingBadge = document.getElementById("sidebar-pending-badge");
  if (pendingBadge) {
    if (pendingRequests > 0) {
      pendingBadge.textContent = pendingRequests;
      pendingBadge.style.display = "inline-block";
    } else {
      pendingBadge.style.display = "none";
    }
  }

  // Render Recent Requests List (top 3)
  renderOverviewRecentRequests(requests.slice(0, 3));

  // Render Services Summary List (top 3)
  renderOverviewServicesSummary(services.slice(0, 3));
}

function renderOverviewRecentRequests(recentList) {
  const container = document.getElementById("overview-recent-requests-list");
  if (!container) return;

  if (recentList.length === 0) {
    container.innerHTML = `<p class="text-muted" style="padding: 1rem 0;">No incoming requests.</p>`;
    return;
  }

  container.innerHTML = "";
  recentList.forEach(r => {
    let badgeClass = "badge-accent";
    if (r.status === "accepted") badgeClass = "badge-primary";
    else if (r.status === "completed") badgeClass = "badge-secondary";
    else if (r.status === "rejected") badgeClass = "badge-danger";

    const itemHtml = `
      <div class="flex align-center justify-between py-3" style="border-bottom: 1px solid var(--slate-100); padding: 0.85rem 0;">
        <div class="flex align-center gap-1" style="gap: 0.75rem;">
          <img src="${r.customerAvatar}" alt="${r.customerName}" style="width: 2.5rem; height: 2.5rem; border-radius: var(--radius-full); object-fit: cover;">
          <div>
            <h4 style="font-weight: 700; font-size: 0.95rem; color: var(--slate-900);">${r.customerName}</h4>
            <span class="text-muted" style="font-size: 0.8rem;">${r.service} • ₹${r.price}</span>
          </div>
        </div>
        <div>
          <span class="badge ${badgeClass}">${r.status}</span>
        </div>
      </div>
    `;
    container.insertAdjacentHTML("beforeend", itemHtml);
  });
}

function renderOverviewServicesSummary(summaryList) {
  const container = document.getElementById("overview-services-summary-list");
  if (!container) return;

  if (summaryList.length === 0) {
    container.innerHTML = `<p class="text-muted" style="padding: 1rem 0;">No services added yet.</p>`;
    return;
  }

  container.innerHTML = "";
  summaryList.forEach(s => {
    const itemHtml = `
      <div class="flex align-center justify-between py-3" style="border-bottom: 1px solid var(--slate-100); padding: 0.85rem 0;">
        <div>
          <h4 style="font-weight: 700; font-size: 0.95rem; color: var(--slate-900);">${s.title}</h4>
          <span class="text-muted" style="font-size: 0.8rem;">${s.category} • ₹${s.price}</span>
        </div>
        <span class="badge ${s.status === 'active' ? 'badge-secondary' : 'badge-accent'}">${s.status}</span>
      </div>
    `;
    container.insertAdjacentHTML("beforeend", itemHtml);
  });
}


/* ==========================================================================
   3. MY SERVICES SECTION (ADD, EDIT, DELETE)
   ========================================================================== */

function renderMyServices() {
  const services = getServicesData();
  const container = document.getElementById("services-container");
  const emptyState = document.getElementById("services-empty-state");

  if (!container) return;

  if (services.length === 0) {
    container.innerHTML = "";
    container.style.display = "none";
    if (emptyState) emptyState.style.display = "flex";
    return;
  }

  container.style.display = "grid";
  if (emptyState) emptyState.style.display = "none";
  container.innerHTML = "";

  services.forEach(s => {
    const cardHtml = `
      <div class="provider-card" id="service-card-${s.id}">
        <div style="position: relative; height: 160px; overflow: hidden;">
          <img src="${s.image || 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=300&auto=format&fit=crop&q=80'}" alt="${s.title}" style="width: 100%; height: 100%; object-fit: cover;">
          <span class="badge ${s.status === 'active' ? 'badge-secondary' : 'badge-accent'}" style="position: absolute; top: 1rem; right: 1rem; box-shadow: var(--shadow-md);">
            ${s.status.toUpperCase()}
          </span>
        </div>
        
        <div class="provider-body">
          <span class="badge badge-primary mb-1">${s.category}</span>
          <h3 class="provider-title" style="font-size: 1.15rem; font-weight: 750;">${s.title}</h3>
          <p class="provider-desc">${s.description}</p>
          
          <div class="provider-meta" style="margin-top: 1rem;">
            <div class="meta-item">
              <i data-lucide="map-pin"></i>
              <span>${s.location}</span>
            </div>
            ${s.availability ? `
            <div class="meta-item">
              <i data-lucide="clock"></i>
              <span>${s.availability}</span>
            </div>` : ""}
          </div>
        </div>

        <div class="provider-footer" style="padding: 1rem 1.5rem;">
          <div class="provider-price">
            <span class="price-label">Price</span>
            <span class="price-amount">₹${s.price}</span>
          </div>
          
          <div style="display: flex; gap: 0.5rem;">
            <button class="btn btn-secondary btn-sm edit-service-btn" data-service-id="${s.id}">
              <i data-lucide="edit-2" style="width: 14px; height: 14px;"></i> Edit
            </button>
            <button class="btn btn-secondary btn-sm delete-service-btn" data-service-id="${s.id}" style="color: var(--danger); border-color: var(--danger-light);">
              <i data-lucide="trash-2" style="width: 14px; height: 14px;"></i> Delete
            </button>
          </div>
        </div>
      </div>
    `;
    container.insertAdjacentHTML("beforeend", cardHtml);
  });

  if (typeof lucide !== "undefined") lucide.createIcons();
  attachServicesCardListeners();
}

function attachServicesCardListeners() {
  // Edit Buttons
  const editBtns = document.querySelectorAll(".edit-service-btn");
  editBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const id = parseInt(btn.getAttribute("data-service-id"));
      openAddEditServiceModal(id);
    });
  });

  // Delete Buttons
  const deleteBtns = document.querySelectorAll(".delete-service-btn");
  deleteBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const id = parseInt(btn.getAttribute("data-service-id"));
      openDeleteServiceConfirmModal(id);
    });
  });
}

// Add/Edit Service Modal Controls
function initServiceModalEvents() {
  const modal = document.getElementById("service-form-modal");
  const form = document.getElementById("service-modal-form");
  const openBtns = [
    document.getElementById("overview-add-service-btn"),
    document.getElementById("add-service-main-btn"),
    document.getElementById("empty-add-service-btn")
  ];

  openBtns.forEach(btn => {
    if (btn) {
      btn.addEventListener("click", () => openAddEditServiceModal(null));
    }
  });

  if (!form || !modal) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    
    // Clear validation errors
    const errors = form.querySelectorAll(".error-msg");
    errors.forEach(err => err.textContent = "");

    const hiddenId = document.getElementById("service-id-hidden").value;
    const titleInput = document.getElementById("modal-service-title");
    const categorySelect = document.getElementById("modal-service-category");
    const priceInput = document.getElementById("modal-service-price");
    const locationInput = document.getElementById("modal-service-location");
    const availInput = document.getElementById("modal-service-availability");
    const descInput = document.getElementById("modal-service-desc");

    const title = titleInput.value.trim();
    const category = categorySelect.value;
    const price = parseInt(priceInput.value);
    const location = locationInput.value.trim();
    const availability = availInput.value.trim();
    const description = descInput.value.trim();

    let isValid = true;

    if (!title) {
      document.getElementById("service-title-error").textContent = "Service title is required.";
      isValid = false;
    }

    if (!category) {
      document.getElementById("service-category-error").textContent = "Please select a category.";
      isValid = false;
    }

    if (!price || isNaN(price) || price <= 0) {
      document.getElementById("service-price-error").textContent = "Enter a valid price.";
      isValid = false;
    }

    if (!location) {
      document.getElementById("service-location-error").textContent = "Location is required.";
      isValid = false;
    }

    if (!description) {
      document.getElementById("service-desc-error").textContent = "Description is required.";
      isValid = false;
    }

    if (!isValid) return;

    const services = getServicesData();

    if (hiddenId) {
      // Edit existing service
      const id = parseInt(hiddenId);
      const index = services.findIndex(s => s.id === id);
      if (index !== -1) {
        services[index].title = title;
        services[index].category = category;
        services[index].price = price;
        services[index].location = location;
        services[index].availability = availability;
        services[index].description = description;

        saveServicesData(services);
        if (typeof showToast !== "undefined") {
          showToast("Service updated successfully!", "success");
        }
      }
    } else {
      // Add new service
      const newService = {
        id: Date.now(),
        title,
        category,
        description,
        price,
        location,
        availability: availability || "Mon - Sat (9 AM - 6 PM)",
        status: "active",
        image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=300&auto=format&fit=crop&q=80"
      };

      services.unshift(newService);
      saveServicesData(services);

      if (typeof showToast !== "undefined") {
        showToast("Service added successfully!", "success");
      }
    }

    // Re-render UI & stats
    closeModal(modal);
    form.reset();
    renderMyServices();
    renderDashboardOverview();
  });
}

function openAddEditServiceModal(serviceId) {
  const modal = document.getElementById("service-form-modal");
  const modalTitle = document.getElementById("service-modal-title");
  const hiddenInput = document.getElementById("service-id-hidden");
  const form = document.getElementById("service-modal-form");

  if (!modal || !form) return;

  // Clear errors
  const errors = form.querySelectorAll(".error-msg");
  errors.forEach(err => err.textContent = "");
  form.reset();

  if (serviceId) {
    // Edit Mode
    const services = getServicesData();
    const s = services.find(item => item.id === serviceId);
    if (!s) return;

    modalTitle.textContent = "Edit Service";
    hiddenInput.value = s.id;
    document.getElementById("modal-service-title").value = s.title;
    document.getElementById("modal-service-category").value = s.category;
    document.getElementById("modal-service-price").value = s.price;
    document.getElementById("modal-service-location").value = s.location;
    document.getElementById("modal-service-availability").value = s.availability || "";
    document.getElementById("modal-service-desc").value = s.description;
  } else {
    // Add Mode
    modalTitle.textContent = "Add New Service";
    hiddenInput.value = "";
  }

  openModal(modal);
}

// Delete Service Modal Logic
function openDeleteServiceConfirmModal(serviceId) {
  pendingTargetDeleteServiceId = serviceId;
  const modal = document.getElementById("delete-service-modal");
  openModal(modal);
}

function initDeleteConfirmModalEvents() {
  const modal = document.getElementById("delete-service-modal");
  const confirmBtn = document.getElementById("confirm-delete-service-btn");

  if (confirmBtn) {
    confirmBtn.addEventListener("click", () => {
      if (!pendingTargetDeleteServiceId) return;

      let services = getServicesData();
      services = services.filter(s => s.id !== pendingTargetDeleteServiceId);
      saveServicesData(services);

      pendingTargetDeleteServiceId = null;
      closeModal(modal);

      renderMyServices();
      renderDashboardOverview();

      if (typeof showToast !== "undefined") {
        showToast("Service deleted successfully!", "success");
      }
    });
  }
}


/* ==========================================================================
   4. SERVICE REQUESTS SECTION (ACCEPT, REJECT, SEARCH, FILTER, VIEW DETAILS)
   ========================================================================== */

function renderServiceRequests() {
  const requests = getRequestsData();
  const container = document.getElementById("requests-container");
  const emptyState = document.getElementById("requests-empty-state");

  if (!container) return;

  // Attach search & filter pill listeners
  initRequestsSearchAndFilters();

  let filteredList = [...requests];

  // Apply status filter pill
  if (activeRequestsFilter !== "all") {
    filteredList = filteredList.filter(r => r.status.toLowerCase() === activeRequestsFilter.toLowerCase());
  }

  // Apply search input query
  if (activeRequestsSearch) {
    const q = activeRequestsSearch.toLowerCase();
    filteredList = filteredList.filter(r => 
      r.customerName.toLowerCase().includes(q) || 
      r.service.toLowerCase().includes(q) ||
      r.location.toLowerCase().includes(q)
    );
  }

  if (filteredList.length === 0) {
    container.innerHTML = "";
    container.style.display = "none";
    if (emptyState) {
      emptyState.style.display = "flex";
      const emptyTitle = document.getElementById("empty-requests-title");
      const emptyDesc = document.getElementById("empty-requests-desc");
      if (emptyTitle) emptyTitle.textContent = activeRequestsSearch ? "No Matching Requests" : `No ${activeRequestsFilter} requests`;
      if (emptyDesc) emptyDesc.textContent = activeRequestsSearch ? `No requests match "${activeRequestsSearch}".` : `There are no ${activeRequestsFilter} service requests at this moment.`;
    }
    return;
  }

  container.style.display = "grid";
  if (emptyState) emptyState.style.display = "none";
  container.innerHTML = "";

  filteredList.forEach(r => {
    let statusClass = "badge-accent";
    if (r.status === "accepted") statusClass = "badge-primary";
    else if (r.status === "completed") statusClass = "badge-secondary";
    else if (r.status === "rejected") statusClass = "badge-danger";

    let actionsHtml = `<button class="btn btn-secondary btn-sm view-request-btn" data-request-id="${r.id}">View Details</button>`;

    if (r.status === "pending") {
      actionsHtml = `
        <button class="btn btn-primary btn-sm accept-request-btn" data-request-id="${r.id}">Accept</button>
        <button class="btn btn-secondary btn-sm reject-request-btn" data-request-id="${r.id}" style="color: var(--danger); border-color: var(--danger-light);">Reject</button>
        <button class="btn btn-secondary btn-sm view-request-btn" data-request-id="${r.id}">View Details</button>
      `;
    } else if (r.status === "accepted") {
      actionsHtml = `
        <button class="btn btn-secondary btn-sm complete-request-btn" data-request-id="${r.id}">Mark Completed</button>
        <button class="btn btn-secondary btn-sm view-request-btn" data-request-id="${r.id}">View Details</button>
      `;
    }

    const cardHtml = `
      <div class="provider-card" style="padding: 1.5rem; height: 100%; display: flex; flex-direction: column;">
        <div class="flex align-center justify-between mb-3">
          <div class="flex align-center gap-1" style="gap: 0.75rem;">
            <img src="${r.customerAvatar}" alt="${r.customerName}" style="width: 2.75rem; height: 2.75rem; border-radius: var(--radius-full); object-fit: cover;">
            <div>
              <h3 style="font-size: 1rem; font-weight: 750; color: var(--slate-900);">${r.customerName}</h3>
              <span class="text-muted" style="font-size: 0.8rem;">Requested: ${formatDateDisplay(r.requestDate)}</span>
            </div>
          </div>
          <span class="badge ${statusClass}">${r.status}</span>
        </div>

        <div style="margin-bottom: 1rem;">
          <h4 style="font-size: 1.1rem; font-weight: 700; color: var(--slate-900);">${r.service}</h4>
          <span style="font-size: 1.2rem; font-weight: 800; color: var(--primary);">₹${r.price}</span>
        </div>

        <div class="provider-meta mb-3" style="border-top: none; padding-top: 0; font-size: 0.85rem;">
          <div class="meta-item">
            <i data-lucide="calendar"></i>
            <span>Preferred Date: <strong>${formatDateDisplay(r.preferredDate)}</strong></span>
          </div>
          <div class="meta-item">
            <i data-lucide="map-pin"></i>
            <span>Location: ${r.location}</span>
          </div>
          ${r.message ? `
          <div class="meta-item" style="align-items: flex-start; margin-top: 0.5rem;">
            <i data-lucide="message-square" style="margin-top: 0.2rem;"></i>
            <span style="font-style: italic; color: var(--slate-600);">"${r.message}"</span>
          </div>` : ""}
        </div>

        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-top: auto; border-top: 1px solid var(--slate-100); padding-top: 1rem;">
          ${actionsHtml}
        </div>
      </div>
    `;
    container.insertAdjacentHTML("beforeend", cardHtml);
  });

  if (typeof lucide !== "undefined") lucide.createIcons();
  attachRequestsCardListeners();
}

function initRequestsSearchAndFilters() {
  const searchInput = document.getElementById("requests-search-input");
  const globalSearch = document.getElementById("global-header-search");
  const filterPills = document.querySelectorAll(".filter-pill[data-filter]");

  if (searchInput && !searchInput.dataset.bound) {
    searchInput.dataset.bound = "true";
    searchInput.addEventListener("input", (e) => {
      activeRequestsSearch = e.target.value.trim();
      renderServiceRequests();
    });
  }

  if (globalSearch && !globalSearch.dataset.bound) {
    globalSearch.dataset.bound = "true";
    globalSearch.addEventListener("input", (e) => {
      activeRequestsSearch = e.target.value.trim();
      switchDashboardSection("requests-section");
      renderServiceRequests();
    });
  }

  filterPills.forEach(pill => {
    if (!pill.dataset.bound) {
      pill.dataset.bound = "true";
      pill.addEventListener("click", () => {
        filterPills.forEach(p => p.classList.remove("active"));
        pill.classList.add("active");
        activeRequestsFilter = pill.getAttribute("data-filter");
        renderServiceRequests();
      });
    }
  });
}

function attachRequestsCardListeners() {
  // Accept buttons
  const acceptBtns = document.querySelectorAll(".accept-request-btn");
  acceptBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const id = parseInt(btn.getAttribute("data-request-id"));
      updateRequestStatus(id, "accepted");
    });
  });

  // Reject buttons
  const rejectBtns = document.querySelectorAll(".reject-request-btn");
  rejectBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const id = parseInt(btn.getAttribute("data-request-id"));
      openRejectRequestConfirmModal(id);
    });
  });

  // Complete buttons
  const completeBtns = document.querySelectorAll(".complete-request-btn");
  completeBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const id = parseInt(btn.getAttribute("data-request-id"));
      updateRequestStatus(id, "completed");
    });
  });

  // View Details buttons
  const viewBtns = document.querySelectorAll(".view-request-btn");
  viewBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const id = parseInt(btn.getAttribute("data-request-id"));
      openRequestDetailsModal(id);
    });
  });
}

function updateRequestStatus(requestId, newStatus) {
  let requests = getRequestsData();
  const index = requests.findIndex(r => r.id === requestId);

  if (index !== -1) {
    requests[index].status = newStatus;
    saveRequestsData(requests);

    renderServiceRequests();
    renderDashboardOverview();

    let msg = `Service request ${newStatus} successfully.`;
    if (newStatus === "accepted") msg = "Service request accepted successfully.";
    else if (newStatus === "rejected") msg = "Service request rejected.";
    else if (newStatus === "completed") msg = "Job marked as completed!";

    if (typeof showToast !== "undefined") {
      showToast(msg, newStatus === "rejected" ? "error" : "success");
    }
  }
}

// Reject Confirm Modal
function openRejectRequestConfirmModal(requestId) {
  pendingTargetRejectRequestId = requestId;
  const modal = document.getElementById("reject-request-modal");
  openModal(modal);
}

function initRejectConfirmModalEvents() {
  const modal = document.getElementById("reject-request-modal");
  const confirmBtn = document.getElementById("confirm-reject-request-btn");

  if (confirmBtn) {
    confirmBtn.addEventListener("click", () => {
      if (!pendingTargetRejectRequestId) return;

      updateRequestStatus(pendingTargetRejectRequestId, "rejected");
      pendingTargetRejectRequestId = null;
      closeModal(modal);
    });
  }
}

// Request Details Modal
function openRequestDetailsModal(requestId) {
  const requests = getRequestsData();
  const req = requests.find(r => r.id === requestId);
  if (!req) return;

  const modal = document.getElementById("request-details-modal");
  if (!modal) return;

  document.getElementById("req-modal-avatar").src = req.customerAvatar;
  document.getElementById("req-modal-customer-name").textContent = req.customerName;
  document.getElementById("req-modal-service-name").textContent = req.service;
  document.getElementById("req-modal-price").textContent = `₹${req.price}`;
  document.getElementById("req-modal-request-date").textContent = formatDateDisplay(req.requestDate);
  document.getElementById("req-modal-preferred-date").textContent = formatDateDisplay(req.preferredDate);
  document.getElementById("req-modal-location").innerHTML = `<i data-lucide="map-pin" style="width: 14px; height: 14px;"></i> ${req.location}`;
  document.getElementById("req-modal-message").textContent = `"${req.message || 'No additional note provided.'}"`;

  const badgeEl = document.getElementById("req-modal-status-badge");
  if (badgeEl) {
    badgeEl.textContent = req.status.toUpperCase();
    badgeEl.className = `badge ${req.status === 'accepted' ? 'badge-primary' : req.status === 'completed' ? 'badge-secondary' : req.status === 'rejected' ? 'badge-danger' : 'badge-accent'}`;
  }

  // Action buttons inside modal
  const actionsRow = document.getElementById("req-modal-actions-row");
  if (actionsRow) {
    if (req.status === "pending") {
      actionsRow.innerHTML = `
        <button class="btn btn-primary btn-sm modal-accept-action" style="flex: 1;">Accept Request</button>
        <button class="btn btn-secondary btn-sm modal-reject-action" style="flex: 1; color: var(--danger); border-color: var(--danger-light);">Reject Request</button>
      `;

      actionsRow.querySelector(".modal-accept-action").addEventListener("click", () => {
        closeModal(modal);
        updateRequestStatus(req.id, "accepted");
      });

      actionsRow.querySelector(".modal-reject-action").addEventListener("click", () => {
        closeModal(modal);
        openRejectRequestConfirmModal(req.id);
      });
    } else {
      actionsRow.innerHTML = `<button class="btn btn-secondary btn-sm modal-cancel-btn" style="width: 100%;">Close Details</button>`;
      actionsRow.querySelector(".modal-cancel-btn").addEventListener("click", () => closeModal(modal));
    }
  }

  openModal(modal);
}


/* ==========================================================================
   5. PROVIDER PROFILE SECTION (EDIT PROFILE)
   ========================================================================== */

function initProfileModalEvents() {
  const openBtn = document.getElementById("edit-profile-btn");
  const modal = document.getElementById("edit-profile-modal");
  const form = document.getElementById("edit-profile-modal-form");

  if (openBtn) {
    openBtn.addEventListener("click", () => {
      const provider = getProviderData();
      if (!provider) return;

      document.getElementById("prof-modal-name").value = provider.name;
      document.getElementById("prof-modal-email").value = provider.email;
      document.getElementById("prof-modal-phone").value = provider.phone;
      document.getElementById("prof-modal-business").value = provider.businessName;
      document.getElementById("prof-modal-location").value = provider.location;
      document.getElementById("prof-modal-experience").value = provider.experience;
      document.getElementById("prof-modal-about").value = provider.about;

      openModal(modal);
    });
  }

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = document.getElementById("prof-modal-name").value.trim();
      const email = document.getElementById("prof-modal-email").value.trim();
      const phone = document.getElementById("prof-modal-phone").value.trim();
      const businessName = document.getElementById("prof-modal-business").value.trim();
      const location = document.getElementById("prof-modal-location").value.trim();
      const experience = document.getElementById("prof-modal-experience").value.trim();
      const about = document.getElementById("prof-modal-about").value.trim();

      if (!name || !email || !phone) {
        if (typeof showToast !== "undefined") showToast("Please fill in required profile fields.", "error");
        return;
      }

      const provider = getProviderData() || {};
      provider.name = name;
      provider.email = email;
      provider.phone = phone;
      provider.businessName = businessName;
      provider.location = location;
      provider.experience = experience;
      provider.about = about;

      saveProviderData(provider);

      // Sync active session user
      const sessionUser = getLoggedInUser() || {};
      sessionUser.name = name;
      sessionUser.email = email;
      sessionUser.phone = phone;
      localStorage.setItem("serverg_logged_in_user", JSON.stringify(sessionUser));

      closeModal(modal);
      loadProviderProfileData();

      if (typeof showToast !== "undefined") {
        showToast("Profile updated successfully!", "success");
      }
    });
  }
}


/* ==========================================================================
   6. GLOBAL MODAL UTILITIES & ACCESSIBILITY
   ========================================================================== */

function openModal(modal) {
  if (!modal) return;
  modal.classList.add("active");
  if (typeof lucide !== "undefined") lucide.createIcons();
}

function closeModal(modal) {
  if (!modal) return;
  modal.classList.remove("active");
}

function initGlobalModalCloseEvents() {
  const modals = document.querySelectorAll(".modal-backdrop");
  
  modals.forEach(modal => {
    // Backdrop click close
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal(modal);
    });

    // Close buttons inside modal
    const closeBtns = modal.querySelectorAll(".modal-close-btn, .modal-cancel-btn");
    closeBtns.forEach(btn => {
      btn.addEventListener("click", () => closeModal(modal));
    });
  });

  // ESC key modal dismissal
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      modals.forEach(modal => {
        if (modal.classList.contains("active")) {
          closeModal(modal);
        }
      });
    }
  });
}

function formatDateDisplay(dateString) {
  if (!dateString) return "";
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return dateString;
  
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });
}
