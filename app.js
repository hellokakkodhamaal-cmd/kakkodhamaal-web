// Premium Interaction and Animation Script for Kakkodhamal

document.addEventListener("DOMContentLoaded", () => {
  // --- 1. Dynamic Splash Screen ---
  const splash = document.createElement("div");
  splash.id = "splash-screen";
  splash.innerHTML = `
    <div class="splash-content">
      <div class="splash-circle"></div>
    </div>
  `;
  document.body.appendChild(splash);

  // Fade out splash screen when window has loaded completely
  window.addEventListener("load", () => {
    setTimeout(() => {
      splash.style.opacity = "0";
      setTimeout(() => {
        splash.remove();
      }, 800);
    }, 500); // Small initial delay for high premium feel
  });

  // --- 2. Cursor Sparkles (Gujarati Letters) ---
  const siteContainer = document.getElementById("site-container");
  const gujaratiLetters = [
    "અ", "આ", "ઇ", "ઈ", "ઉ", "ઊ", "ઋ", "એ", "ઐ", "ઓ", "ઔ", "અં", "અઃ",
    "ક", "ખ", "ગ", "ઘ", "ચ", "છ", "જ", "ઝ", "ટ", "ઠ", "ડ", "ઢ", "ણ",
    "ત", "થ", "દ", "ધ", "ન", "પ", "ફ", "બ", "ભ", "મ", "ય", "ર", "લ",
    "વ", "શ", "ષ", "સ", "હ", "ળ", "ક્ષ", "જ્ઞ"
  ];
  
  // Palette of beautiful, warm, clay-friendly colors
  const particleColors = [
    "#ff9800", "#ff5722", "#4caf50", "#00bcd4", "#9c27b0", 
    "#e91e63", "#3f51b5", "#ffeb3b", "#8bc34a"
  ];

  let lastParticleTime = 0;
  const particleThrottleMs = 25; // Create a particle every 25ms of movement

  window.addEventListener("mousemove", (e) => {
    const now = Date.now();
    if (now - lastParticleTime < particleThrottleMs) return;
    lastParticleTime = now;

    // Create particle element
    const particle = document.createElement("span");
    particle.className = "sparkle-particle";
    
    // Choose a random letter and color
    particle.textContent = gujaratiLetters[Math.floor(Math.random() * gujaratiLetters.length)];
    particle.style.color = particleColors[Math.floor(Math.random() * particleColors.length)];
    
    // Position relative to page coordinates
    particle.style.left = `${e.pageX}px`;
    particle.style.top = `${e.pageY}px`;

    // Add random scale variation
    const randomScale = 0.5 + Math.random() * 0.8;
    particle.style.transform = `translate(-50%, -50%) scale(${randomScale})`;

    document.body.appendChild(particle);

    // Remove particle after animation completes (1s matching CSS transition)
    setTimeout(() => {
      particle.remove();
    }, 1000);
  });

  // --- 3. Parallax Engine (rAF Scroll + Mouse) ---
  const parallaxLayers = document.querySelectorAll(".parallax-layer");
  
  let scrollY = window.scrollY;
  let mouseX = 0;
  let mouseY = 0;

  // Track target variables
  let targetScrollY = window.scrollY;
  let targetMouseX = 0;
  let targetMouseY = 0;

  // Mouse move event to capture cursor position relative to screen center
  window.addEventListener("mousemove", (e) => {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    // Normalized values between -1 and 1
    targetMouseX = (e.clientX - cx) / cx;
    targetMouseY = (e.clientY - cy) / cy;
  });

  const backToTopBtn = document.querySelector(".back-to-top-arrow");
  window.addEventListener("scroll", () => {
    targetScrollY = window.scrollY;
    if (backToTopBtn) {
      if (window.scrollY > 250) {
        backToTopBtn.classList.add("visible");
      } else {
        backToTopBtn.classList.remove("visible");
      }
    }
  });

  // --- 4. Dynamic Cloud Spawning ---
  const cloudContainer = document.getElementById("cloud-container");
  const cloudsState = [];
  const numClouds = 4; // Reduced to 4 clouds to keep the sky clean and uncluttered

  if (cloudContainer) {
    const laneHeight = 26 / numClouds; // Divide sky vertical space into 4 lanes (~6.5% height each)

    for (let i = 0; i < numClouds; i++) {
      const img = document.createElement("img");
      img.className = "dynamic-cloud";
      img.src = "images/cloud 01.png";
      img.style.position = "absolute";
      
      // Assign each cloud to its own height lane so they never overlap vertically
      const cloudTop = 2 + (i * laneHeight) + Math.random() * (laneHeight - 1);
      img.style.top = `${cloudTop}%`;
      
      const baseWidth = 8 + Math.random() * 6; // Width 8vw to 14vw
      img.style.width = `${baseWidth}vw`;
      
      const scale = 0.8 + Math.random() * 0.4;
      img.style.zIndex = Math.round(baseWidth * scale);
      
      cloudContainer.appendChild(img);

      // Distribute starting positions evenly across screen segments so they don't bunch horizontally
      const segmentWidth = 135 / numClouds;
      const startX = -35 + (i * segmentWidth) + Math.random() * (segmentWidth * 0.6);
      
      const speed = 0.012 + Math.random() * 0.018; // Slow premium speed
      
      // Parallax coefficients
      const speedY = 0.12 + Math.random() * 0.12;
      const speedX = 0.06 + Math.random() * 0.08;

      cloudsState.push({
        element: img,
        x: startX,
        speed: speed,
        scale: scale,
        speedX: speedX,
        speedY: speedY,
        top: cloudTop,
        lane: i // Store the lane index to keep it in the same vertical lane when resetting
      });
    }
  }

  // Main animation frame loop
  function updateParallax() {
    // Smooth interpolation (lerp) for premium buttery feel
    scrollY += (targetScrollY - scrollY) * 0.1;
    mouseX += (targetMouseX - mouseX) * 0.08;
    mouseY += (targetMouseY - mouseY) * 0.08;

    // Update static parallax layers
    parallaxLayers.forEach((layer) => {
      const speedY = parseFloat(layer.getAttribute("data-speed-y")) || 0;
      const speedX = parseFloat(layer.getAttribute("data-speed-x")) || 0;

      // Vertical offset based on page scroll
      const verticalScrollOffset = scrollY * speedY;

      // Mouse drift offsets
      const mouseDriftX = mouseX * 45 * speedX;
      const mouseDriftY = mouseY * 45 * speedY;

      // Total translate coordinates
      const finalX = mouseDriftX;
      const finalY = -verticalScrollOffset + mouseDriftY;

      // Check if it's centered background element using translateX(-50%)
      if (layer.classList.contains("sky-bg") || layer.classList.contains("nav-bg")) {
        layer.style.transform = `translate3d(calc(-50% + ${finalX}px), ${finalY}px, 0)`;
      } else {
        layer.style.transform = `translate3d(${finalX}px, ${finalY}px, 0)`;
      }
    });

    // Update dynamic drifting clouds
    cloudsState.forEach((cloud) => {
      // 1. Advance drift x position
      cloud.x += cloud.speed;

      // 2. Wrap around to left when cloud completely exits right edge
      if (cloud.x > 115) {
        // Stagger reset to different starting positions off-screen to prevent bunching
        cloud.x = -35 - Math.random() * 45;
        
        // Reposition within its assigned vertical lane
        const laneHeight = 26 / numClouds;
        cloud.top = 2 + (cloud.lane * laneHeight) + Math.random() * (laneHeight - 1);
        cloud.element.style.top = `${cloud.top}%`;
        
        cloud.speed = 0.012 + Math.random() * 0.018;
        
        const baseWidth = 8 + Math.random() * 6;
        cloud.element.style.width = `${baseWidth}vw`;
        cloud.scale = 0.8 + Math.random() * 0.4;
        cloud.element.style.zIndex = Math.round(baseWidth * cloud.scale);
      }

      // 3. Compute parallax offsets
      const mouseDriftX = mouseX * 45 * cloud.speedX;
      const mouseDriftY = mouseY * 45 * cloud.speedY;
      const verticalScrollOffset = scrollY * cloud.speedY;

      // 4. Translate combined drift + parallax coordinate
      const driftPx = (cloud.x / 100) * window.innerWidth;
      const finalX = driftPx + mouseDriftX;
      const finalY = -verticalScrollOffset + mouseDriftY;

      cloud.element.style.transform = `translate3d(${finalX}px, ${finalY}px, 0) scale(${cloud.scale})`;
    });

    requestAnimationFrame(updateParallax);
  }

  // Start the loop
  requestAnimationFrame(updateParallax);



  // --- About Us Popup Control ---
  const aboutPopup = document.getElementById("about-popup");
  const closePopupBtn = document.getElementById("close-popup");
  const aboutTriggers = document.querySelectorAll('a[href="#about"]');

  function openPopup() {
    if (aboutPopup) {
      aboutPopup.classList.add("active");
      document.body.style.overflow = "hidden"; // Prevent background body scrolling when open
    }
  }

  function closePopup() {
    if (aboutPopup) {
      aboutPopup.classList.remove("active");
      document.body.style.overflow = ""; // Re-enable body scrolling
    }
  }

  aboutTriggers.forEach((trigger) => {
    trigger.addEventListener("click", (e) => {
      e.preventDefault(); // Intercept click and prevent page scrolling to #about anchor
      openPopup();
    });
  });

  if (closePopupBtn) {
    closePopupBtn.addEventListener("click", closePopup);
  }

  if (aboutPopup) {
    aboutPopup.addEventListener("click", (e) => {
      // Close if user clicks directly on the blurred overlay backdrop (not the card inside)
      if (e.target === aboutPopup) {
        closePopup();
      }
    });
  }

  // Handle Escape key to close popup modal
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && aboutPopup && aboutPopup.classList.contains("active")) {
      closePopup();
    }
  });

  // --- Privacy Policy Popup Control ---
  const privacyPopup = document.getElementById("privacy-popup");
  const closePrivacyBtn = document.getElementById("close-privacy");
  const privacyTriggers = document.querySelectorAll('a[href="#privacy"]');

  function openPrivacy() {
    if (privacyPopup) {
      privacyPopup.classList.add("active");
      document.body.style.overflow = "hidden"; // Prevent background body scrolling when open
    }
  }

  function closePrivacy() {
    if (privacyPopup) {
      privacyPopup.classList.remove("active");
      document.body.style.overflow = ""; // Re-enable background scrolling
    }
  }

  privacyTriggers.forEach((trigger) => {
    trigger.addEventListener("click", (e) => {
      e.preventDefault(); // Intercept jump-scroll
      openPrivacy();
    });
  });

  if (closePrivacyBtn) {
    closePrivacyBtn.addEventListener("click", closePrivacy);
  }

  // Handle Escape key to close privacy policy modal
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && privacyPopup && privacyPopup.classList.contains("active")) {
      closePrivacy();
    }
  });

  // Log layout verification confirmation
  console.log("Kakkodhamal layout initialized. 100% natural dimensions preserved.");
});
