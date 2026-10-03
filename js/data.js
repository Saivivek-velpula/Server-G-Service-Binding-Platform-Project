// ServerG Mock Database
// This file stores all the application data locally in memory to simulate a database.
// Storing it here keeps our rendering logic separate from raw data (Separation of Concerns).

const ServerGData = {
  // Available Service Categories
  categories: [
    {
      id: "electrician",
      name: "Electrician",
      icon: "zap",
      serviceCount: 42,
      description: "Home wiring, appliance repair, short circuit fixes, and lighting installation."
    },
    {
      id: "plumber",
      name: "Plumber",
      icon: "droplet",
      serviceCount: 38,
      description: "Leak repairs, pipe installations, drain cleaning, and tap replacements."
    },
    {
      id: "carpenter",
      name: "Carpenter",
      icon: "hammer",
      serviceCount: 29,
      description: "Furniture assembly, door repairs, modular kitchen work, and wood carving."
    },
    {
      id: "painter",
      name: "Painter",
      icon: "paint-brush",
      serviceCount: 24,
      description: "Interior and exterior wall painting, wallpaper application, and touch-ups."
    },
    {
      id: "ac-technician",
      name: "AC Technician",
      icon: "wind",
      serviceCount: 31,
      description: "AC servicing, gas filling, filter cleaning, and installation or removal."
    },
    {
      id: "cleaning",
      name: "Cleaning",
      icon: "sparkles",
      serviceCount: 55,
      description: "Deep home cleaning, bathroom scrubbing, sofa sanitizing, and kitchen cleaning."
    },
    {
      id: "appliance-repair",
      name: "Appliance Repair",
      icon: "tv",
      serviceCount: 20,
      description: "Washing machine, refrigerator, microwave, and TV troubleshooting."
    },
    {
      id: "tutor",
      name: "Tutor",
      icon: "book-open",
      serviceCount: 45,
      description: "School subjects, languages, coding lessons, and competitive exam prep."
    }
  ],

  // Service Providers and their offerings
  providers: [
    {
      id: "prov-1",
      name: "Rajesh Kumar",
      avatar: "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150&auto=format&fit=crop&q=80",
      serviceTitle: "Premium Electrician & Smart Home Setup",
      category: "electrician",
      rating: 4.9,
      reviewsCount: 84,
      location: "Indiranagar, Bangalore",
      price: 500, // per hour
      experience: "8 Years",
      phone: "+91 98765 43210",
      email: "rajesh.electrician@gmail.com",
      availability: "Mon - Sat (9 AM - 7 PM)",
      description: "Certified electrician specialized in residential smart lighting setup, inverter installations, panel upgrades, and urgent short-circuit fixes. Known for prompt arrival and clean, safe work.",
      reviews: [
        {
          customerName: "Ananya S.",
          rating: 5,
          comment: "Rajesh resolved an issue that two other technicians couldn't fix. He installed my smart switches perfectly!",
          date: "2026-08-14"
        },
        {
          customerName: "Vikram Sen",
          rating: 4.8,
          comment: "Very polite and helpful. Arrived on time and cleaned up after completing the inverter setup.",
          date: "2026-08-09"
        }
      ]
    },
    {
      id: "prov-2",
      name: "Amit Sharma",
      avatar: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150&auto=format&fit=crop&q=80",
      serviceTitle: "Expert Leak Detection & Drain Cleaning",
      category: "plumber",
      rating: 4.7,
      reviewsCount: 112,
      location: "Koramangala, Bangalore",
      price: 400,
      experience: "6 Years",
      phone: "+91 98765 43211",
      email: "amit.plumbing@yahoo.com",
      availability: "Daily (8 AM - 8 PM)",
      description: "Specialized in emergency leak detection, pipeline remodeling, toilet installation, bathroom fittings, and drain clogging issues. 100% satisfaction guaranteed.",
      reviews: [
        {
          customerName: "Siddharth Rao",
          rating: 5,
          comment: "Had an overnight pipe burst. Amit showed up within 30 minutes and fixed it quickly. Highly recommended!",
          date: "2026-08-18"
        },
        {
          customerName: "Neha Gupta",
          rating: 4,
          comment: "Good service. A bit expensive for minor tap fitting, but the quality of work was solid.",
          date: "2026-08-05"
        }
      ]
    },
    {
      id: "prov-3",
      name: "John Fernandes",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
      serviceTitle: "Modular Furniture Assembly & Repair",
      category: "carpenter",
      rating: 4.8,
      reviewsCount: 63,
      location: "HSR Layout, Bangalore",
      price: 450,
      experience: "10 Years",
      phone: "+91 98765 43212",
      email: "john.woodcraft@outlook.com",
      availability: "Mon - Sat (9 AM - 6 PM)",
      description: "Master carpenter offering modular kitchen installation, sliding door alignments, wooden furniture repair, and customized bookshelf crafting.",
      reviews: [
        {
          customerName: "Rohan Patel",
          rating: 5,
          comment: "Assembled our complex IKEA wardrobe in under 2 hours. Very skilled and professional.",
          date: "2026-08-11"
        }
      ]
    },
    {
      id: "prov-4",
      name: "Sunita Roy",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
      serviceTitle: "Deep Cleaning & Sanitization Services",
      category: "cleaning",
      rating: 4.9,
      reviewsCount: 145,
      location: "Jayanagar, Bangalore",
      price: 600,
      experience: "5 Years",
      phone: "+91 98765 43213",
      email: "sunita.cleaners@gmail.com",
      availability: "Daily (7 AM - 9 PM)",
      description: "Complete house deep cleaning, sanitizing, sofa vacuuming, kitchen degreasing, and window scrubbing. We use environment-friendly, safe chemicals.",
      reviews: [
        {
          customerName: "Priyanka M.",
          rating: 5,
          comment: "Absolutely outstanding work. The kitchen and bathrooms look brand new. Worth every rupee!",
          date: "2026-08-16"
        },
        {
          customerName: "Karan Johar",
          rating: 4.8,
          comment: "They were highly detail-oriented and very thorough with the deep cleaning process.",
          date: "2026-08-12"
        }
      ]
    },
    {
      id: "prov-5",
      name: "Sandeep Verma",
      avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
      serviceTitle: "AC Installation, Gas Refill & Servicing",
      category: "ac-technician",
      rating: 4.6,
      reviewsCount: 98,
      location: "Whitefield, Bangalore",
      price: 350,
      experience: "7 Years",
      phone: "+91 98765 43214",
      email: "sandeep.ac@gmail.com",
      availability: "Daily (9 AM - 8 PM)",
      description: "Experiencing poor cooling or noise from your AC? Get top-notch AC filter cleaning, coil servicing, gas charging, and master mounting repairs for Split and Window ACs.",
      reviews: [
        {
          customerName: "Arun K.",
          rating: 5,
          comment: "Sandeep diagnosed the refrigerant leak quickly, repaired it, and refilled the gas. AC cools perfectly now.",
          date: "2026-08-15"
        }
      ]
    },
    {
      id: "prov-6",
      name: "Pooja Malhotra",
      avatar: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&auto=format&fit=crop&q=80",
      serviceTitle: "Home Wall Painting & Custom Wallpapers",
      category: "painter",
      rating: 4.8,
      reviewsCount: 47,
      location: "Malleswaram, Bangalore",
      price: 550,
      experience: "9 Years",
      phone: "+91 98765 43215",
      email: "pooja.colors@gmail.com",
      availability: "Mon - Sat (9 AM - 6 PM)",
      description: "Transform your living space with expert wall painting, texture coatings, modern waterproofing paints, and customized wallpaper alignment. Clean prep and spotless completion.",
      reviews: [
        {
          customerName: "Simran Kaur",
          rating: 5,
          comment: "Pooja helped us select the perfect accent wall color and executed it beautifully. No mess left behind!",
          date: "2026-08-13"
        }
      ]
    }
  ],

  // Active bookings list
  // Stores structures like: { id, customerId, customerName, providerId, providerName, serviceTitle, category, price, date, time, status, notes }
  bookings: [
    {
      id: "book-101",
      customerId: "cust-1",
      customerName: "Aarav Sharma",
      providerId: "prov-1",
      providerName: "Rajesh Kumar",
      serviceTitle: "Premium Electrician & Smart Home Setup",
      category: "electrician",
      price: 500,
      date: "2026-08-21",
      time: "10:00 AM",
      status: "pending",
      notes: "Need smart switches installed in the living room."
    },
    {
      id: "book-102",
      customerId: "cust-1",
      customerName: "Aarav Sharma",
      providerId: "prov-4",
      providerName: "Sunita Roy",
      serviceTitle: "Deep Cleaning & Sanitization Services",
      category: "cleaning",
      price: 600,
      date: "2026-08-15",
      time: "09:00 AM",
      status: "completed",
      notes: "Sofa vacuuming and kitchen cleaning."
    }
  ]
};

// Seed initial bookings into localStorage if not already present, to enable persistence across page reloads.
if (!localStorage.getItem("serverg_bookings")) {
  localStorage.setItem("serverg_bookings", JSON.stringify(ServerGData.bookings));
}

// Helper functions to fetch dynamic bookings
const getBookings = () => {
  return JSON.parse(localStorage.getItem("serverg_bookings")) || ServerGData.bookings;
};

const saveBookings = (bookings) => {
  localStorage.setItem("serverg_bookings", JSON.stringify(bookings));
};
