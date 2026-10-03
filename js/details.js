// ServerG Service Details Logic
// Handles profile fetching, review loops, booking modal transitions, and localStorage syncing.

document.addEventListener("DOMContentLoaded", () => {
  // 1. Fetch provider details based on ID query param
  const prov = getProviderFromQuery();
  
  if (!prov) {
    showErrorProfile();
    return;
  }
  
  // 2. Render provider details to DOM
  renderProviderDetails(prov);
  
  // 3. Setup Booking Modal controls
  initBookingModal(prov);
  
  // 4. Auto-open modal if requested via URL (?book=true)
  const params = new URLSearchParams(window.location.search);
  if (params.get("book") === "true") {
    openBookingModal(prov);
  }
});

// Parse the provider ID from URL query parameters
function getProviderFromQuery() {
  if (typeof ServerGData === "undefined" || !ServerGData.providers) return null;
  
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  
  return ServerGData.providers.find(p => p.id === id) || null;
}

// Show error template if provider doesn't exist
function showErrorProfile() {
  const container = document.getElementById("details-container");
  const errorDiv = document.getElementById("profile-error");
  
  if (container) container.style.display = "none";
  if (errorDiv) errorDiv.style.display = "flex";
}

// Populate page element text/attributes with provider data
function renderProviderDetails(prov) {
  // Breadcrumb
  const breadcrumbName = document.getElementById("breadcrumb-provider-name");
  if (breadcrumbName) breadcrumbName.textContent = prov.name;
  
  // Avatar
  const avatar = document.getElementById("detail-avatar");
  if (avatar) {
    avatar.src = prov.avatar;
    avatar.alt = prov.name;
  }
  
  // Category Badge
  const badge = document.getElementById("detail-category-badge");
  if (badge && typeof ServerGData !== "undefined") {
    const categoryObj = ServerGData.categories.find(c => c.id === prov.category);
    badge.textContent = categoryObj ? categoryObj.name : prov.category;
  }
  
  // Title & Name
  const title = document.getElementById("detail-title");
  if (title) title.textContent = prov.serviceTitle;
  
  const provName = document.getElementById("detail-provider-name");
  if (provName) provName.textContent = prov.name;
  
  // Ratings and reviews count
  const rating = document.getElementById("detail-rating");
  if (rating) rating.textContent = prov.rating.toFixed(1);
  
  const reviewsCount = document.getElementById("detail-reviews-count");
  if (reviewsCount) reviewsCount.textContent = `(${prov.reviewsCount} reviews)`;
  
  // Experience, location, availability, pricing
  const experience = document.getElementById("detail-experience");
  if (experience) experience.textContent = `${prov.experience} Exp`;
  
  const description = document.getElementById("detail-description");
  if (description) description.textContent = prov.description;
  
  const location = document.getElementById("detail-location");
  if (location) location.textContent = prov.location;
  
  const availability = document.getElementById("detail-availability");
  if (availability) availability.textContent = prov.availability;
  
  const price = document.getElementById("detail-price");
  if (price) price.textContent = `₹${prov.price}`;
  
  // Render Reviews List
  renderReviews(prov.reviews);
}

// Build customer reviews elements
function renderReviews(reviews) {
  const listContainer = document.getElementById("reviews-list");
  if (!listContainer) return;
  
  listContainer.innerHTML = "";
  
  if (!reviews || reviews.length === 0) {
    listContainer.innerHTML = `<p class="text-muted" style="font-style: italic;">No reviews posted yet.</p>`;
    return;
  }
  
  reviews.forEach(rev => {
    // Generate stars HTML block
    let starsHtml = "";
    const score = Math.round(rev.rating);
    for (let i = 1; i <= 5; i++) {
      if (i <= score) {
        starsHtml += `<i data-lucide="star" style="fill: var(--accent); color: var(--accent);"></i>`;
      } else {
        starsHtml += `<i data-lucide="star" style="color: var(--slate-300);"></i>`;
      }
    }
    
    // Format date nicely (Simple placeholder formatting)
    const formattedDate = new Date(rev.date).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
    
    const reviewCard = `
      <div class="review-item-card" style="background-color: var(--white); border: 1px solid var(--slate-100); padding: 1.5rem; border-radius: var(--radius-md); margin-bottom: 1rem; box-shadow: var(--shadow-sm);">
        <div class="flex justify-between align-center mb-1">
          <h4 style="font-weight: 700; font-size: 0.95rem;">${rev.customerName}</h4>
          <span style="font-size: 0.75rem; color: var(--slate-400);">${formattedDate}</span>
        </div>
        <div class="review-stars flex mb-2" style="gap: 0.2rem; font-size: 0.8rem;">
          ${starsHtml}
        </div>
        <p class="text-muted" style="font-size: 0.9rem; line-height: 1.5;">"${rev.comment}"</p>
      </div>
    `;
    listContainer.insertAdjacentHTML("beforeend", reviewCard);
  });
  
  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }
}

/* ==========================================================================
   2. Booking Modal Handling & Storage
   ========================================================================== */

function initBookingModal(prov) {
  const modal = document.getElementById("booking-modal");
  const openBtn = document.getElementById("book-now-btn");
  const closeBtn = document.getElementById("modal-close-btn");
  const cancelBtn = document.getElementById("booking-cancel-btn");
  const form = document.getElementById("booking-form");
  
  if (!modal || !openBtn || !closeBtn || !cancelBtn || !form) return;
  
  // Set minimum date selector to today to prevent booking in the past
  const dateInput = document.getElementById("booking-date");
  if (dateInput) {
    const today = new Date().toISOString().split("T")[0];
    dateInput.min = today;
  }
  
  // Click actions to open/close
  openBtn.addEventListener("click", () => openBookingModal(prov));
  closeBtn.addEventListener("click", closeBookingModal);
  cancelBtn.addEventListener("click", closeBookingModal);
  
  // Click backdrop overlay to close
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeBookingModal();
  });
  
  // Submit action
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    submitBookingRequest(prov);
  });
}

function openBookingModal(prov) {
  const modal = document.getElementById("booking-modal");
  
  // Set details inside modal helper profile block
  const modalAvatar = document.getElementById("modal-prov-avatar");
  const modalName = document.getElementById("modal-prov-name");
  const modalTitle = document.getElementById("modal-prov-title");
  
  if (modalAvatar) modalAvatar.src = prov.avatar;
  if (modalName) modalName.textContent = prov.name;
  if (modalTitle) modalTitle.textContent = prov.serviceTitle;
  
  modal.classList.add("active");
}

function closeBookingModal() {
  const modal = document.getElementById("booking-modal");
  if (modal) modal.classList.remove("active");
}

function submitBookingRequest(prov) {
  const dateInput = document.getElementById("booking-date");
  const timeSelect = document.getElementById("booking-time");
  const notesArea = document.getElementById("booking-notes");
  
  if (!dateInput || !timeSelect) return;
  
  const selectedDate = dateInput.value;
  const selectedTime = timeSelect.value;
  const notesText = notesArea ? notesArea.value.trim() : "";
  
  // Form compiled booking item
  const newBooking = {
    id: "book-" + Date.now(),
    customerId: "cust-1",             // Mock logged-in customer ID
    customerName: "Aarav Sharma",       // Mock customer name
    providerId: prov.id,
    providerName: prov.name,
    serviceTitle: prov.serviceTitle,
    category: prov.category,
    price: prov.price,
    date: selectedDate,
    time: selectedTime,
    status: "pending",                 // Needs provider action
    notes: notesText
  };
  
  // Save to LocalStorage
  let currentBookings = [];
  if (localStorage.getItem("serverg_bookings")) {
    currentBookings = JSON.parse(localStorage.getItem("serverg_bookings"));
  } else if (typeof ServerGData !== "undefined") {
    currentBookings = [...ServerGData.bookings];
  }
  
  currentBookings.push(newBooking);
  localStorage.setItem("serverg_bookings", JSON.stringify(currentBookings));
  
  // Show notification
  closeBookingModal();
  
  if (typeof showToast !== "undefined") {
    showToast("Booking request sent successfully!", "success");
  }
  
  // Reset Form
  document.getElementById("booking-form").reset();
  
  // Redirect to customer dashboard after short duration to let them see status
  setTimeout(() => {
    window.location.href = "customer-dashboard.html";
  }, 1500);
}
