// Main JS for Skill Up Institute website
(function () {
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  // Mobile nav toggle
  const hamburger = $('#hamburger');
  const nav = $('#navbar');
  if (hamburger && nav) {
    hamburger.addEventListener('click', () => {
      const expanded = hamburger.getAttribute('aria-expanded') === 'true';
      hamburger.setAttribute('aria-expanded', String(!expanded));
      nav.classList.toggle('show');
    });
    // Close on link click (mobile)
    $$('.nav a').forEach(a => a.addEventListener('click', () => {
      nav.classList.remove('show');
      hamburger.setAttribute('aria-expanded', 'false');
    }));
  }

  // IntersectionObserver animations
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in-view');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });
  $$('[data-animate]').forEach(el => io.observe(el));

  // Animated counters
  function animateCounter(el) {
    const target = Number(el.getAttribute('data-target') || '0');
    const duration = 1200;
    const start = performance.now();
    function frame(now) {
      const p = Math.min(1, (now - start) / duration);
      const val = Math.floor(target * (0.1 + 0.9 * p * (2 - p))); // ease-out
      el.textContent = val.toLocaleString();
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }
  const counters = $$('.counter');
  if (counters.length) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          animateCounter(e.target);
          counterObserver.unobserve(e.target);
        }
      })
    }, { threshold: 0.5 });
    counters.forEach(c => counterObserver.observe(c));
  }

  // Testimonials carousel (simple fade)
  const carousel = $('#testimonialCarousel');
  if (carousel) {
    const slides = $$('.slide', carousel);
    let idx = 0;
    setInterval(() => {
      slides[idx].classList.remove('active');
      idx = (idx + 1) % slides.length;
      slides[idx].classList.add('active');
    }, 3800);
  }

  // Parallax effect for hero background
  const parallaxSection = $('.has-parallax');
  if (parallaxSection) {
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      parallaxSection.style.backgroundPosition = `center ${-y * 0.15}px`;
    }, { passive: true });
  }

  // Optional simple particles
  const particles = $('#particles');
  if (particles && particles.getContext) {
    const ctx = particles.getContext('2d');
    const dots = new Array(40).fill(0).map(() => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * 400 + 40,
      r: Math.random() * 2 + 1,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4
    }));
    function resize() { particles.width = particles.clientWidth; particles.height = particles.clientHeight; }
    const resizeObserver = new ResizeObserver(resize); resizeObserver.observe(particles);
    function draw() {
      ctx.clearRect(0, 0, particles.width, particles.height);
      ctx.fillStyle = 'rgba(0,123,255,0.6)';
      dots.forEach(d => {
        d.x += d.vx; d.y += d.vy;
        if (d.x < 0 || d.x > particles.width) d.vx *= -1;
        if (d.y < 0 || d.y > particles.height) d.vy *= -1;
        ctx.beginPath(); ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2); ctx.fill();
      });
      requestAnimationFrame(draw);
    }
    resize();
    requestAnimationFrame(draw);
  }

  // Courses page: data and filtering + card rendering
  const courseGrid = $('#courseGrid');
  const courseData = [
    // Computer Application Department
    { department: 'Computer Application', name: 'Office Automation', duration: ['3 months','6 months'], fee: '₹6,000 - ₹10,000' },
    { department: 'Computer Application', name: 'Computer Application', duration: ['6 months','12 months'], fee: '₹12,000 - ₹18,000' },
    // Designing Department
    { department: 'Designing', name: 'Graphic Designing', duration: ['6 months','12 months'], fee: '₹15,000 - ₹24,000' },
    { department: 'Designing', name: 'Web Designing', duration: ['6 months','12 months'], fee: '₹14,000 - ₹22,000' },
    // Accounting Department
    { department: 'Accounting', name: 'Tally ERP-9 & PRIME', duration: ['3 months','6 months'], fee: '₹8,000 - ₹14,000' },
    // Editing Department
    { department: 'Editing', name: 'Video Editing', duration: ['3 months','6 months'], fee: '₹10,000 - ₹16,000' },
    // Languages Department
    { department: 'Languages', name: 'C', duration: ['3 months'], fee: '₹5,000' },
    { department: 'Languages', name: 'C++', duration: ['3 months'], fee: '₹6,000' },
    { department: 'Languages', name: 'JavaScript', duration: ['3 months','6 months'], fee: '₹8,000 - ₹12,000' },
    { department: 'Languages', name: 'HTML', duration: ['3 months'], fee: '₹4,000' },
    { department: 'Languages', name: 'CSS', duration: ['3 months'], fee: '₹4,000' },
    { department: 'Languages', name: 'SQL', duration: ['3 months','6 months'], fee: '₹7,000 - ₹11,000' },
    // Typing Department
    { department: 'Typing', name: 'English Typing', duration: ['3 months'], fee: '₹3,000' },
    { department: 'Typing', name: 'Punjabi Typing', duration: ['3 months'], fee: '₹3,000' },
    // Spoken English
    { department: 'Spoken English', name: 'Spoken English', duration: ['3 months','6 months'], fee: '₹6,000 - ₹10,000' },
  ];

  function renderCourses(targetDepartment = 'all') {
    if (!courseGrid) return;
    courseGrid.innerHTML = '';
    const fragment = document.createDocumentFragment();
    const filtered = targetDepartment === 'all' ? courseData : courseData.filter(c => c.department === targetDepartment);
    filtered.forEach((c, i) => {
      const card = document.createElement('div');
      card.className = 'card course';
      card.setAttribute('data-animate', 'fade-up');
      card.setAttribute('data-delay', String(i * 20 % 200));
      card.innerHTML = `
        <div class="course-dept chip" aria-label="Department">${c.department}</div>
        <h3>${c.name}</h3>
        <p><strong>Duration:</strong> ${c.duration.join(' / ')}</p>
        <p><strong>Fees:</strong> ${c.fee}</p>
        <div class="cta-group">
          <a href="register.html" class="btn btn-primary">Enroll Now</a>
        </div>
      `;
      fragment.appendChild(card);
    });
    courseGrid.appendChild(fragment);
    // Re-observe for animations
    $$('[data-animate]', courseGrid).forEach(el => io.observe(el));
  }

  if (courseGrid) {
    renderCourses('all');
    const filterBar = $('.filter-bar');
    if (filterBar) {
      filterBar.addEventListener('click', (e) => {
        const btn = e.target.closest('button');
        if (!btn) return;
        $$('.chip', filterBar).forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const dep = btn.getAttribute('data-filter') || 'all';
        // Simple filtering animation
        courseGrid.style.opacity = '0';
        setTimeout(() => { renderCourses(dep); courseGrid.style.opacity = '1'; }, 180);
      });
    }
  }

  // Registration page: populate course dropdown, validation, localStorage, modal
  const registerForm = $('#registerForm');
  if (registerForm) {
    const courseSelect = $('#course');
    if (courseSelect) {
      const allNames = [...new Set(courseData.map(c => c.name))];
      allNames.forEach(name => {
        const opt = document.createElement('option');
        opt.value = name; opt.textContent = name; courseSelect.appendChild(opt);
      });
    }

    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = Object.fromEntries(new FormData(registerForm).entries());
      // Basic validation
      const emailOk = /.+@.+\..+/.test(formData.email || '');
      const phoneOk = /^[0-9\-\s+]{8,}$/.test(formData.phone || '');
      if (!emailOk) { alert('Please enter a valid email.'); return; }
      if (!phoneOk) { alert('Please enter a valid phone number.'); return; }
      // Save temporarily
      localStorage.setItem('skillup_last_registration', JSON.stringify({ ...formData, ts: Date.now() }));
      // Show success modal
      const modal = $('#successModal');
      if (modal) {
        modal.classList.add('show');
        modal.setAttribute('aria-hidden', 'false');
      }
      registerForm.reset();
    });

    $$('#successModal [data-close-modal]').forEach(el => el.addEventListener('click', () => {
      const modal = $('#successModal');
      if (!modal) return;
      modal.classList.remove('show');
      modal.setAttribute('aria-hidden', 'true');
    }));
  }

  // Footer mini contact (demo only)
  const footerForm = $('#footerContact');
  if (footerForm) {
    footerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Thanks! We will get back to you.');
      footerForm.reset();
    });
  }

  // Gallery lightbox
  const gallery = $('#galleryGrid');
  const lightbox = $('#lightbox');
  const lightboxImage = $('#lightboxImage');
  if (gallery && lightbox && lightboxImage) {
    gallery.addEventListener('click', (e) => {
      const a = e.target.closest('a.gallery-item');
      if (!a) return;
      e.preventDefault();
      lightboxImage.src = a.getAttribute('href');
      lightbox.classList.add('show');
      lightbox.setAttribute('aria-hidden', 'false');
    });
    $$('[data-close-lightbox]').forEach(el => el.addEventListener('click', () => {
      lightbox.classList.remove('show');
      lightbox.setAttribute('aria-hidden', 'true');
    }));
  }
})();


