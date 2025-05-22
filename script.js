document.addEventListener("DOMContentLoaded", function () {
  // Set current year for copyright
  const currentYearElement = document.getElementById("current-year");
  if (currentYearElement) {
    currentYearElement.textContent = new Date().getFullYear();
  }

  // Add animation classes to elements
  const animateElements = document.querySelectorAll(
    ".fade-in, .slide-in-left, .slide-in-right"
  );

  // Scroll animation handler
  const animateOnScroll = function () {
    animateElements.forEach((element) => {
      const elementPosition = element.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;

      if (elementPosition < windowHeight - 100) {
        element.classList.add("active");
      }
    });

    // Handle header shrinking on scroll
    const header = document.querySelector("header");
    const nav = document.querySelector("nav");
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
      nav.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
      nav.classList.remove("scrolled");
    }
  };

  // Run once to initialize visible elements
  animateOnScroll();

  // Add scroll event listener
  window.addEventListener("scroll", animateOnScroll);

  // Mobile menu toggle
  const mobileMenuToggle = document.querySelector(".mobile-menu-toggle");
  const navMenu = document.querySelector(".nav-menu");
  const body = document.body;

  // Function to close the mobile menu
  function closeMobileMenu() {
    navMenu.classList.remove("active");
    body.classList.remove("menu-open");
  }

  // Function to handle clicks outside the menu
  function handleOutsideClick(e) {
    if (!navMenu.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
      closeMobileMenu();
      document.removeEventListener("click", handleOutsideClick);
    }
  }

  if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener("click", function (e) {
      e.stopPropagation(); // Prevent the click from immediately triggering the document click
      navMenu.classList.toggle("active");
      body.classList.toggle("menu-open");

      // Add event listener for outside clicks only when menu is open
      if (body.classList.contains("menu-open")) {
        // Small delay to prevent the event from firing immediately
        setTimeout(() => {
          document.addEventListener("click", handleOutsideClick);
        }, 10);
      }
    });
  }

  // Ensure mobile menu closes when window is resized to desktop size
  window.addEventListener("resize", function () {
    if (window.innerWidth > 768 && body.classList.contains("menu-open")) {
      closeMobileMenu();
    }
  });

  // Smooth scrolling for navigation links
  const navLinks = document.querySelectorAll(".nav-menu li a");
  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();

      // Close mobile menu if open
      if (navMenu.classList.contains("active")) {
        closeMobileMenu();
      }

      const targetId = this.getAttribute("href").substring(1);
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80, // Adjusted for sticky header height
          behavior: "smooth",
        });
      }
    });
  });

  // Active navigation link highlighting on scroll
  const sections = document.querySelectorAll("section");
  window.addEventListener("scroll", function () {
    let current = "";
    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      if (pageYOffset >= sectionTop - 85) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href").substring(1) === current) {
        link.classList.add("active");
      }
    });
  });

  // Brochure PDF interactions
  const pdfContainer = document.querySelector(".pdf-container");
  const brochureDownloadBtn = document.querySelector(
    ".brochure-info .cta-button"
  );

  if (pdfContainer) {
    // Add fallback for browsers that might not support iframes well
    const iframe = pdfContainer.querySelector("iframe");
    iframe.onerror = function () {
      iframe.style.display = "none";
      pdfContainer.innerHTML +=
        '<div class="pdf-fallback"><p>PDF preview not available. Please download the brochure using the button.</p></div>';
    };

    // Track brochure view/download events
    if (brochureDownloadBtn) {
      brochureDownloadBtn.addEventListener("click", function () {
        console.log("Brochure download clicked");
        // Here you could add analytics tracking if needed
      });
    }

    // Project card hover effects
    const projectCards = document.querySelectorAll(".project-card");
    projectCards.forEach((card) => {
      card.addEventListener("mouseenter", function () {
        this.classList.add("hover");
      });

      card.addEventListener("mouseleave", function () {
        this.classList.remove("hover");
      });
    });
  }

  // Contact form validation
  const contactForm = document.querySelector(".contact-form form");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // Simulate form submission
      const formButton = this.querySelector("button");
      const originalText = formButton.innerText;

      formButton.innerText = "Sending...";
      formButton.disabled = true;

      // Simulate form submission with timeout (would be replaced with actual form submission)
      setTimeout(() => {
        const successMessage = document.createElement("div");
        successMessage.classList.add("form-success");
        successMessage.innerHTML =
          "<p>Thank you for your message! We'll get back to you soon.</p>";

        // Replace form with success message
        this.style.display = "none";
        this.parentNode.appendChild(successMessage);
      }, 1500);
    });
  }

  // Service category hover effects
  const serviceCategories = document.querySelectorAll(".service-category");
  serviceCategories.forEach((category) => {
    category.addEventListener("mouseenter", function () {
      this.classList.add("hover");
    });

    category.addEventListener("mouseleave", function () {
      this.classList.remove("hover");
    });
  });

  // Project filter functionality
  const filterButtons = document.querySelectorAll(".filter-button");
  const projectItems = document.querySelectorAll(".project-item");

  if (filterButtons.length && projectItems.length) {
    // Initialize counters for each category
    const countProjects = () => {
      const counts = {
        all: projectItems.length,
        industrial: 0,
        commercial: 0,
        residential: 0,
        drives: 0,
      };

      projectItems.forEach((item) => {
        const category = item.getAttribute("data-category");
        if (counts.hasOwnProperty(category)) {
          counts[category]++;
        }
      });

      return counts;
    };

    const counts = countProjects();

    // Update filter buttons with count
    filterButtons.forEach((button) => {
      const filter = button.getAttribute("data-filter");
      if (counts.hasOwnProperty(filter)) {
        button.setAttribute("data-count", counts[filter]);
        // Add small badge with count
        const badge = document.createElement("span");
        badge.className = "filter-count";
        badge.textContent = counts[filter];
        button.appendChild(badge);
      }
    });

    // Filter functionality
    filterButtons.forEach((button) => {
      button.addEventListener("click", function () {
        // Remove active class from all buttons
        filterButtons.forEach((btn) => btn.classList.remove("active"));

        // Add active class to clicked button
        this.classList.add("active");

        const filter = this.getAttribute("data-filter");

        // Filter projects
        projectItems.forEach((item) => {
          if (
            filter === "all" ||
            item.getAttribute("data-category") === filter
          ) {
            item.style.display = "block";
            // Add a slight delay for smoother animation
            setTimeout(() => {
              item.style.opacity = "1";
              item.style.transform = "translateY(0)";
            }, 50);
          } else {
            item.style.opacity = "0";
            item.style.transform = "translateY(20px)";
            // Add delay before hiding to allow for animation
            setTimeout(() => {
              item.style.display = "none";
            }, 300);
          }
        });
      });
    });
  }

  // Image lazy loading
  const lazyImages = document.querySelectorAll('img[loading="lazy"]');
  if ("loading" in HTMLImageElement.prototype) {
    // Browser supports native lazy loading
    lazyImages.forEach((img) => {
      img.src = img.dataset.src;
    });
  } else {
    // Fallback for browsers that don't support lazy loading
    const lazyImageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const lazyImage = entry.target;
          lazyImage.src = lazyImage.dataset.src;
          observer.unobserve(lazyImage);
        }
      });
    });

    lazyImages.forEach((img) => {
      lazyImageObserver.observe(img);
    });
  }
});
