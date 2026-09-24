(function loadGoogleAnalytics() {
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function gtag(){ window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', 'G-E433MWD071');
  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://www.googletagmanager.com/gtag/js?id=G-E433MWD071';
  document.head.appendChild(script);
})();

document.addEventListener('DOMContentLoaded', () => {
  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.site-nav');
  if (menuButton && nav) {
    menuButton.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      menuButton.setAttribute('aria-expanded', String(open));
    });
    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
      nav.classList.remove('is-open');
      menuButton.setAttribute('aria-expanded', 'false');
    }));
  }

  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach(item => observer.observe(item));
  } else revealItems.forEach(item => item.classList.add('is-visible'));

  const lightbox = document.getElementById('lightbox');
  if (lightbox) {
    const image = lightbox.querySelector('img');
    const caption = lightbox.querySelector('figcaption');
    const close = () => { lightbox.hidden = true; document.body.style.overflow = ''; };
    document.querySelectorAll('[data-lightbox]').forEach(button => button.addEventListener('click', () => {
      image.src = button.dataset.lightbox;
      image.alt = button.querySelector('img')?.alt || 'Enlarged research figure';
      caption.textContent = button.dataset.caption || '';
      lightbox.hidden = false;
      document.body.style.overflow = 'hidden';
    }));
    lightbox.querySelector('.lightbox-close').addEventListener('click', close);
    lightbox.addEventListener('click', event => { if (event.target === lightbox) close(); });
    document.addEventListener('keydown', event => { if (event.key === 'Escape' && !lightbox.hidden) close(); });
  }
});
