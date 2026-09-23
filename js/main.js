/* 
   Md. Mohiuddin - General Site Logic
   Handles scroll mechanics, IntersectionObservers, and dynamic page state
*/

document.addEventListener('DOMContentLoaded', () => {
  // 1. Interactive Scroll Animations (Apple Style Fade In)
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.12
  };
  
  const fadeUpElements = document.querySelectorAll('.glass-card, .section-header, .dft-visualizer, .timeline-item, .pub-card');
  
  // Style transition effects
  fadeUpElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
  });
  
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        obs.unobserve(entry.target); // Trigger only once
      }
    });
  }, observerOptions);
  
  fadeUpElements.forEach(el => observer.observe(el));
  
  // 2. Navigation Active State on Scroll
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('nav a:not(.nav-cta)');
  
  window.addEventListener('scroll', () => {
    let currentSectionId = '';
    const scrollPos = window.scrollY + 120; // offset
    
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentSectionId = section.getAttribute('id');
      }
    });
    
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  });
  
  // 3. Smooth internal scrolling for Apple aesthetic
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetSec = document.querySelector(targetId);
      
      if (targetSec) {
        const offsetPosition = targetSec.offsetTop - 30; // offset for navbar
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
  
  // 4. Console greeting for visitors / review boards (Extremely professional and geeky)
  console.log(
    '%cMd. Mohiuddin | Materials Scientist & DFT Specialist Portfolio%c\nHello professor! Thanks for checking my console. Feel free to inspect the custom 3D Canvas lattice.js renderer or the DFT Bandgap canvas bandgap.js widget. Clear, modular physics simulation is key!',
    'color: #00f2fe; font-family: monospace; font-size: 14px; font-weight: bold;',
    'color: #86868b; font-family: sans-serif; font-size: 12px;'
  );
});
