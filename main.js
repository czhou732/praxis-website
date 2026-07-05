document.addEventListener('DOMContentLoaded', () => {
  console.log("PRAXIS Website initialized.");

  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  });

  revealElements.forEach(el => {
    revealObserver.observe(el);
  });
  
  // Trigger once on load for elements already in view
  setTimeout(() => {
    revealElements.forEach(el => {
      const rect = el.getBoundingClientRect();
      if(rect.top < window.innerHeight) {
        el.classList.add('active');
      }
    });
  }, 100);
});
