// ===== Mobile Navigation =====
const mobileToggle = document.querySelector('.mobile-toggle');
const navLinks = document.querySelector('.nav-links');
const mobileOverlay = document.querySelector('.mobile-overlay');

if (mobileToggle) {
  mobileToggle.addEventListener('click', () => {
    mobileToggle.classList.toggle('active');
    navLinks.classList.toggle('open');
    mobileOverlay.classList.toggle('active');
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
  });
}

if (mobileOverlay) {
  mobileOverlay.addEventListener('click', () => {
    mobileToggle.classList.remove('active');
    navLinks.classList.remove('open');
    mobileOverlay.classList.remove('active');
    document.body.style.overflow = '';
  });
}

// Close mobile menu on link click
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    if (window.innerWidth <= 768) {
      mobileToggle.classList.remove('active');
      navLinks.classList.remove('open');
      mobileOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
});

// Mobile dropdown toggle
document.querySelectorAll('.nav-links .dropdown > a').forEach(trigger => {
  trigger.addEventListener('click', (e) => {
    if (window.innerWidth <= 768) {
      e.preventDefault();
      trigger.parentElement.classList.toggle('open');
    }
  });
});

// ===== Header Scroll Effect =====
const header = document.querySelector('.header');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});

// ===== Scroll Animations =====
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right').forEach(el => {
  observer.observe(el);
});

// ===== Counter Animation =====
function animateCounters() {
  document.querySelectorAll('[data-count]').forEach(counter => {
    const target = parseInt(counter.getAttribute('data-count'));
    const suffix = counter.getAttribute('data-suffix') || '';
    const prefix = counter.getAttribute('data-prefix') || '';
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;

    const update = () => {
      current += step;
      if (current < target) {
        counter.textContent = prefix + Math.floor(current) + suffix;
        requestAnimationFrame(update);
      } else {
        counter.textContent = prefix + target + suffix;
      }
    };

    update();
  });
}

const statsSection = document.querySelector('.stats-section') || document.querySelector('.mh-stats-section');
if (statsSection) {
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounters();
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  statsObserver.observe(statsSection);
}

// ===== Active Nav Link =====
const currentPage = window.location.pathname.split('/').pop() || 'home.html';
document.querySelectorAll('.nav-links a').forEach(link => {
  const href = link.getAttribute('href');
  if (href === currentPage) {
    link.classList.add('active');
  }
});

// ===== Contact Form =====
const contactForm = document.querySelector('#contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('.btn');
    const originalText = btn.textContent;
    btn.textContent = 'Message Sent!';
    btn.style.background = '#10b981';
    setTimeout(() => {
      btn.textContent = originalText;
      btn.style.background = '';
      contactForm.reset();
    }, 3000);
  });
}

// ===== Smooth scroll for anchor links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ===== Testimonials Slider =====
(function() {
  const track = document.querySelector('.mh-testimonials-track');
  const nextBtn = document.querySelector('.mh-slider-next');
  if (!track || !nextBtn) return;

  let scrollPos = 0;

  function getCardWidth() {
    const card = track.querySelector('.mh-testimonial-card');
    if (!card) return 400;
    const style = getComputedStyle(track);
    const gap = parseInt(style.gap) || 24;
    return card.offsetWidth + gap;
  }

  function getMaxScroll() {
    return track.scrollWidth - track.parentElement.offsetWidth;
  }

  nextBtn.addEventListener('click', () => {
    const cardW = getCardWidth();
    const maxScroll = getMaxScroll();
    scrollPos += cardW;
    if (scrollPos > maxScroll) scrollPos = 0;
    track.style.transform = `translateX(-${scrollPos}px)`;
  });

  // Touch/drag support
  let isDragging = false;
  let startX = 0;
  let startScroll = 0;

  track.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.pageX;
    startScroll = scrollPos;
    track.style.cursor = 'grabbing';
    track.style.transition = 'none';
  });

  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const dx = e.pageX - startX;
    const newPos = startScroll - dx;
    const maxScroll = getMaxScroll();
    scrollPos = Math.max(0, Math.min(newPos, maxScroll));
    track.style.transform = `translateX(-${scrollPos}px)`;
  });

  document.addEventListener('mouseup', () => {
    if (!isDragging) return;
    isDragging = false;
    track.style.cursor = 'grab';
    track.style.transition = 'transform 0.5s ease';
  });

  // Touch events
  track.addEventListener('touchstart', (e) => {
    startX = e.touches[0].pageX;
    startScroll = scrollPos;
    track.style.transition = 'none';
  }, { passive: true });

  track.addEventListener('touchmove', (e) => {
    const dx = e.touches[0].pageX - startX;
    const newPos = startScroll - dx;
    const maxScroll = getMaxScroll();
    scrollPos = Math.max(0, Math.min(newPos, maxScroll));
    track.style.transform = `translateX(-${scrollPos}px)`;
  }, { passive: true });

  track.addEventListener('touchend', () => {
    track.style.transition = 'transform 0.5s ease';
  });
})();

// ===== Format counter with commas =====
function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Override counter animation for formatted numbers
(function() {
  const mhStats = document.querySelector('.mh-stats-section');
  if (!mhStats) return;

  const mhStatsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        mhStats.querySelectorAll('[data-count]').forEach(counter => {
          const target = parseInt(counter.getAttribute('data-count'));
          const suffix = counter.getAttribute('data-suffix') || '';
          const duration = 2000;
          const step = target / (duration / 16);
          let current = 0;

          const update = () => {
            current += step;
            if (current < target) {
              counter.textContent = formatNumber(Math.floor(current)) + suffix;
              requestAnimationFrame(update);
            } else {
              counter.textContent = formatNumber(target) + suffix;
            }
          };

          update();
        });
        mhStatsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  mhStatsObserver.observe(mhStats);
})();
