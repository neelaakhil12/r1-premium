document.addEventListener('DOMContentLoaded', () => {
  // --- SPLASH SCREEN PRELOADER LOGIC ---
  const splashScreen = document.getElementById('splash-screen');
  if (splashScreen) {
    const isSplashShown = sessionStorage.getItem('splash_shown');
    
    // Detect page refresh/reload using the Performance API
    let isReload = false;
    if (window.performance && window.performance.getEntriesByType) {
      const navEntries = window.performance.getEntriesByType('navigation');
      if (navEntries.length > 0) {
        isReload = navEntries[0].type === 'reload';
      }
    } else if (window.performance && window.performance.navigation) {
      isReload = window.performance.navigation.type === window.performance.navigation.TYPE_RELOAD;
    }
    
    // Play the splash screen on first entry to the session OR on any page refresh
    if (!isSplashShown || isReload) {
      document.body.classList.add('overflow-hidden');
      setTimeout(() => {
        splashScreen.classList.add('opacity-0', 'pointer-events-none');
        document.body.classList.remove('overflow-hidden');
        sessionStorage.setItem('splash_shown', 'true');
        setTimeout(() => {
          splashScreen.remove();
        }, 800);
      }, 8000);
    } else {
      // Instantly dismiss on internal link navigations
      splashScreen.style.display = 'none';
      splashScreen.remove();
    }
  }

  // --- AOS INITIALIZATION ---
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: false,
      mirror: true
    });
  }

  // --- MOBILE NAV MENU TOGGLE (DRAWER) ---
  const menuBtn = document.getElementById('menu-btn');
  const menuCloseBtn = document.getElementById('menu-close-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileBackdrop = document.getElementById('mobile-backdrop');

  function openMenu() {
    if (mobileMenu) mobileMenu.classList.add('drawer-open');
    if (mobileBackdrop) mobileBackdrop.classList.add('backdrop-visible');
    document.body.classList.add('menu-open', 'overflow-hidden');
    if (menuBtn) {
      const icon = menuBtn.querySelector('i');
      if (icon) icon.className = 'fas fa-times text-2xl text-primary';
    }
  }

  function closeMenu() {
    if (mobileMenu) mobileMenu.classList.remove('drawer-open');
    if (mobileBackdrop) mobileBackdrop.classList.remove('backdrop-visible');
    document.body.classList.remove('menu-open', 'overflow-hidden');
    if (menuBtn) {
      const icon = menuBtn.querySelector('i');
      if (icon) icon.className = 'fas fa-bars text-2xl';
    }
  }

  if (menuBtn) menuBtn.addEventListener('click', openMenu);
  if (menuCloseBtn) menuCloseBtn.addEventListener('click', closeMenu);
  if (mobileBackdrop) mobileBackdrop.addEventListener('click', closeMenu);

  // Close menu when a nav link is clicked
  if (mobileMenu) {
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMenu);
    });
  }

  // --- STICKY NAV HEADER & BACK-TO-TOP BUTTON ---
  const header = document.getElementById('main-header');
  const backToTopBtn = document.getElementById('back-to-top');

  window.addEventListener('scroll', () => {
    // Header effect
    if (header) {
      if (window.scrollY > 50) {
        header.classList.add('bg-background/95', 'backdrop-blur-md', 'shadow-md', 'py-3');
        header.classList.remove('bg-background', 'py-5');
      } else {
        header.classList.add('bg-background', 'py-5');
        header.classList.remove('bg-background/95', 'backdrop-blur-md', 'shadow-md', 'py-3');
      }
    }

    // Back to top visibility
    if (backToTopBtn) {
      if (window.scrollY > 500) {
        backToTopBtn.classList.remove('opacity-0', 'pointer-events-none');
        backToTopBtn.classList.add('opacity-100', 'pointer-events-auto');
      } else {
        backToTopBtn.classList.remove('opacity-100', 'pointer-events-auto');
        backToTopBtn.classList.add('opacity-0', 'pointer-events-none');
      }
    }
  });

  // --- BACK-TO-TOP CLICK ACTION ---
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // --- FAQ ACCORDION (SERVICES PAGE) ---
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-btn');
    const answer = item.querySelector('.faq-answer');
    const icon = item.querySelector('.faq-icon');

    if (questionBtn && answer && icon) {
      questionBtn.addEventListener('click', () => {
        const isOpen = !answer.classList.contains('hidden');
        
        // Close all FAQ items
        faqItems.forEach(otherItem => {
          const otherAnswer = otherItem.querySelector('.faq-answer');
          const otherIcon = otherItem.querySelector('.faq-icon');
          if (otherAnswer && otherIcon) {
            otherAnswer.classList.add('hidden');
            otherIcon.className = 'fas fa-chevron-down faq-icon transition-transform duration-300 text-gray-400';
          }
        });

        // Toggle clicked item
        if (!isOpen) {
          answer.classList.remove('hidden');
          icon.className = 'fas fa-chevron-up faq-icon transition-transform duration-300 text-primary';
        }
      });
    }
  });

  // --- TESTIMONIALS AUTO-SLIDER (HOME PAGE) ---
  const testimonials = document.querySelectorAll('.testimonial-card');
  const prevBtn = document.getElementById('prev-testimonial');
  const nextBtn = document.getElementById('next-testimonial');
  
  if (testimonials.length > 0) {
    let currentIndex = 0;
    let autoPlayInterval;

    const showTestimonial = (index) => {
      testimonials.forEach((card, idx) => {
        if (idx === index) {
          card.classList.remove('hidden');
          card.classList.add('block');
        } else {
          card.classList.remove('block');
          card.classList.add('hidden');
        }
      });
    };

    const nextTestimonial = () => {
      currentIndex = (currentIndex + 1) % testimonials.length;
      showTestimonial(currentIndex);
    };

    const prevTestimonial = () => {
      currentIndex = (currentIndex - 1 + testimonials.length) % testimonials.length;
      showTestimonial(currentIndex);
    };

    // Initial load
    showTestimonial(currentIndex);

    // Event listeners
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        nextTestimonial();
        resetInterval();
      });
    }
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        prevTestimonial();
        resetInterval();
      });
    }

    const startInterval = () => {
      autoPlayInterval = setInterval(nextTestimonial, 6000);
    };

    const resetInterval = () => {
      clearInterval(autoPlayInterval);
      startInterval();
    };

    startInterval();
  }

  // --- DYNAMIC PORTFOLIO FILTER (RECENT WORKS PAGE) ---
  const filterButtons = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  if (filterButtons.length > 0 && galleryItems.length > 0) {
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        // Active button style
        filterButtons.forEach(b => {
          b.classList.remove('bg-primary', 'text-background', 'font-semibold');
          b.classList.add('bg-card-bg', 'text-white', 'hover:bg-primary/20');
        });
        btn.classList.add('bg-primary', 'text-background', 'font-semibold');
        btn.classList.remove('bg-card-bg', 'text-white', 'hover:bg-primary/20');

        const filterValue = btn.getAttribute('data-filter');

        galleryItems.forEach(item => {
          const itemCategories = item.getAttribute('data-category').split(' ');
          if (filterValue === 'all' || itemCategories.includes(filterValue)) {
            item.classList.remove('hidden');
            // Re-trigger AOS animation
            item.classList.add('fade-in-animation');
          } else {
            item.classList.add('hidden');
            item.classList.remove('fade-in-animation');
          }
        });

        // Trigger layouts update
        if (typeof AOS !== 'undefined') {
          AOS.refresh();
        }
      });
    });
  }

  // --- CUSTOM LIGHTBOX MODULE ---
  const lightboxTriggers = document.querySelectorAll('.lightbox-trigger');
  
  if (lightboxTriggers.length > 0) {
    // Create Lightbox DOM Elements
    const lightbox = document.createElement('div');
    lightbox.id = 'custom-lightbox';
    lightbox.className = 'fixed inset-0 z-[100] hidden items-center justify-center p-4 lightbox-backdrop';
    
    lightbox.innerHTML = `
      <button class="absolute top-6 right-6 text-white text-3xl hover:text-primary transition-colors focus:outline-none" id="lightbox-close">
        <i class="fas fa-times"></i>
      </button>
      <button class="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 text-4xl hover:text-primary transition-colors focus:outline-none p-2" id="lightbox-prev">
        <i class="fas fa-chevron-left"></i>
      </button>
      <div class="max-w-4xl max-h-[80vh] flex flex-col items-center w-full">
        <img class="max-w-full max-h-[70vh] rounded-lg object-contain shadow-2xl border border-border-color hidden" id="lightbox-img" src="" alt="Zoomed view">
        <video class="max-w-full max-h-[70vh] rounded-lg shadow-2xl border border-border-color hidden w-full" id="lightbox-video" controls playsinline></video>
        <div class="text-center mt-4">
          <h4 class="text-xl font-semibold text-white" id="lightbox-title">Project Name</h4>
          <p class="text-sm text-primary mt-1" id="lightbox-subtitle">Location - Category</p>
        </div>
      </div>
      <button class="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 text-4xl hover:text-primary transition-colors focus:outline-none p-2" id="lightbox-next">
        <i class="fas fa-chevron-right"></i>
      </button>
    `;

    document.body.appendChild(lightbox);

    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxVideo = document.getElementById('lightbox-video');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxSubtitle = document.getElementById('lightbox-subtitle');
    const closeBtn = document.getElementById('lightbox-close');
    const prevBtnL = document.getElementById('lightbox-prev');
    const nextBtnL = document.getElementById('lightbox-next');

    let currentGalleryArray = [];
    let currentImgIndex = 0;

    const openLightbox = (index, elements) => {
      currentGalleryArray = Array.from(elements);
      currentImgIndex = index;
      updateLightboxContent();
      lightbox.classList.remove('hidden');
      lightbox.classList.add('flex');
      document.body.classList.add('overflow-hidden');
    };

    const updateLightboxContent = () => {
      const activeTrigger = currentGalleryArray[currentImgIndex];
      const imgEl = activeTrigger.querySelector('img');
      const imgSrc = (activeTrigger.getAttribute('href') && activeTrigger.getAttribute('href') !== '#') ? activeTrigger.getAttribute('href') : (imgEl ? imgEl.src : '');
      const title = activeTrigger.getAttribute('data-title') || 'Project Installation';
      const loc = activeTrigger.getAttribute('data-location') || 'Hyderabad';
      const category = activeTrigger.getAttribute('data-category-name') || 'Installation';
      const videoSrc = activeTrigger.getAttribute('data-video');

      // Reset sources and hide both elements
      lightboxImg.src = '';
      lightboxImg.classList.add('hidden');
      lightboxVideo.src = '';
      lightboxVideo.classList.add('hidden');
      lightboxVideo.pause();

      if (videoSrc) {
        lightboxVideo.src = videoSrc;
        lightboxVideo.classList.remove('hidden');
        lightboxVideo.play().catch(err => console.log('Autoplay blocked:', err));
        
        // Hide title/subtitle for videos
        lightboxTitle.classList.add('hidden');
        lightboxSubtitle.classList.add('hidden');
      } else {
        lightboxImg.src = imgSrc;
        lightboxImg.classList.remove('hidden');
        
        // Show title/subtitle for images
        lightboxTitle.textContent = title;
        lightboxSubtitle.textContent = `${loc} • ${category}`;
        lightboxTitle.classList.remove('hidden');
        lightboxSubtitle.classList.remove('hidden');
      }
    };

    const closeLightbox = () => {
      lightbox.classList.add('hidden');
      lightbox.classList.remove('flex');
      document.body.classList.remove('overflow-hidden');
      lightboxImg.src = '';
      lightboxVideo.src = '';
      lightboxVideo.classList.add('hidden');
      lightboxVideo.pause();
    };

    const nextLightboxImg = () => {
      currentImgIndex = (currentImgIndex + 1) % currentGalleryArray.length;
      updateLightboxContent();
    };

    const prevLightboxImg = () => {
      currentImgIndex = (currentImgIndex - 1 + currentGalleryArray.length) % currentGalleryArray.length;
      updateLightboxContent();
    };

    // Attach click events to triggers
    lightboxTriggers.forEach((trigger, idx) => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Find visible triggers if page has filtering
        const visibleTriggers = Array.from(lightboxTriggers).filter(t => {
          const item = t.closest('.gallery-item');
          return !item || !item.classList.contains('hidden');
        });
        
        const visibleIndex = visibleTriggers.indexOf(trigger);
        openLightbox(visibleIndex, visibleTriggers);
      });
    });

    // Close lightbox events
    closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    // Prev/Next events
    nextBtnL.addEventListener('click', nextLightboxImg);
    prevBtnL.addEventListener('click', prevLightboxImg);

    // Keyboard controls
    document.addEventListener('keydown', (e) => {
      if (lightbox.classList.contains('flex')) {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') nextLightboxImg();
        if (e.key === 'ArrowLeft') prevLightboxImg();
      }
    });
  }

  // --- CONTACT FORM SUBMISSION VALIDATION ---
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('form-name').value.trim();
      const mobile = document.getElementById('form-mobile').value.trim();
      const service = document.getElementById('form-service').value;
      const location = document.getElementById('form-location').value.trim();
      
      if (!name || !mobile || !service || !location) {
        alert('Please fill in all required fields.');
        return;
      }

      // Successful feedback simulation
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Sending...';

      setTimeout(() => {
        // Show Success Alert
        const successMessage = document.createElement('div');
        successMessage.className = 'mt-4 p-4 bg-green-500/20 border border-green-500 text-green-300 rounded text-center font-medium animate-pulse';
        successMessage.innerHTML = '<i class="fas fa-check-circle mr-2"></i>Thank you! Your enquiry has been sent. We will contact you shortly.';
        
        contactForm.appendChild(successMessage);
        contactForm.reset();
        
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;

        setTimeout(() => {
          successMessage.remove();
        }, 5000);
      }, 1500);
    });
  }
  // --- BEFORE / AFTER IMAGE SLIDER ---
  const sliderRanges = document.querySelectorAll('.slider-range');

  sliderRanges.forEach(range => {
    const targetId = range.getAttribute('data-target');
    const beforeImg = document.getElementById(`before-img-${targetId}`);
    const sliderLine = document.getElementById(`slider-line-${targetId}`);

    if (beforeImg && sliderLine) {
      const updateSlider = () => {
        const pos = range.value;
        beforeImg.style.clipPath = `inset(0 ${100 - pos}% 0 0)`;
        sliderLine.style.left = `${pos}%`;
      };
      
      // Update on input/change events
      range.addEventListener('input', updateSlider);
      range.addEventListener('change', updateSlider);
    }
  });

  // --- STATS COUNTER ANIMATION ---
  const statsGrid = document.getElementById('stats-grid');
  const statNumbers = document.querySelectorAll('.stat-number');
  
  if (statsGrid && statNumbers.length > 0) {
    let animated = false;
    
    const startCounting = () => {
      statNumbers.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'), 10);
        const suffix = stat.getAttribute('data-suffix') || '';
        const duration = 2000; // 2 seconds animation duration
        const startTime = performance.now();
        
        const updateCount = (currentTime) => {
          const elapsedTime = currentTime - startTime;
          const progress = Math.min(elapsedTime / duration, 1);
          
          // Easing function: easeOutQuad
          const easeProgress = progress * (2 - progress);
          
          const currentCount = Math.floor(easeProgress * target);
          stat.textContent = currentCount + suffix;
          
          if (progress < 1) {
            requestAnimationFrame(updateCount);
          } else {
            stat.textContent = target + suffix;
          }
        };
        
        requestAnimationFrame(updateCount);
      });
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (!animated) {
            animated = true;
            startCounting();
          }
        } else {
          animated = false;
        }
      });
    }, { threshold: 0.2 });
    
    observer.observe(statsGrid);
  }
});
