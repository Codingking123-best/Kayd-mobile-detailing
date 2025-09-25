// Minimal interactions: mobile nav toggle, smooth scroll, contact form mailto fallback, gallery lightbox
document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.getElementById('navToggle');
  const siteNav = document.getElementById('siteNav');

  navToggle.addEventListener('click', () => {
    siteNav.classList.toggle('open');
  });

  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({behavior:'smooth', block:'start'});
        if (siteNav.classList.contains('open')) siteNav.classList.remove('open');
      }
    });
  });

  const form = document.getElementById('contactForm');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const email = document.getElementById('email').value.trim();
    const service = document.getElementById('service').value;
    const when = document.getElementById('when').value.trim();
    const notes = document.getElementById('notes').value.trim();

    if (!name || !phone || !email) {
      alert('Please fill in Name, Phone, and Email.');
      return;
    }

    const subject = encodeURIComponent(`Detail Request from ${name}`);
    const body = encodeURIComponent(
      `Name: ${name}\nPhone: ${phone}\nEmail: ${email}\nService: ${service}\nPreferred: ${when}\nNotes: ${notes}`
    );

    window.location.href = `mailto:info@maksdetails.com?subject=${subject}&body=${body}`;
  });

  // gallery lightbox
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');

  document.querySelectorAll('.img-card').forEach(btn => {
    btn.addEventListener('click', async () => {
      const base = btn.getAttribute('data-base');
      const candidates = [
        `assets/images/optimized/${base}-1600.webp`,
        `assets/images/optimized/${base}-1024.webp`,
        `assets/images/optimized/${base}-1024.jpg`
      ];
      let chosen = '';
      for (const url of candidates) {
        try {
          const res = await fetch(url, { method: 'HEAD' });
          if (res.ok) { chosen = url; break; }
        } catch (e) {}
      }
      lightboxImg.src = chosen || `assets/images/optimized/${base}-1024.jpg`;
      lightboxImg.alt = btn.querySelector('img').alt || 'Gallery image';
      lightbox.classList.add('open');
      lightbox.setAttribute('aria-hidden', 'false');
    });
  });

  lightboxClose.addEventListener('click', () => {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    lightboxImg.src = '';
  });

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) { lightboxClose.click(); }
  });

  document.getElementById('year').textContent = new Date().getFullYear();
});
