document.addEventListener('DOMContentLoaded', () => {
  // 1. Smooth Scrolling for Navigation
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('.section-card');

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      const targetSection = document.querySelector(targetId);
      
      if (targetSection) {
        window.scrollTo({
          top: targetSection.offsetTop - 40,
          behavior: 'smooth'
        });
      }
    });
  });

  // 2. Scroll Spy: Highlight nav links on scroll
  const handleScroll = () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= sectionTop - 150) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  };

  window.addEventListener('scroll', handleScroll);

  // 3. Copy to Clipboard Functionality
  const copyBtns = document.querySelectorAll('.copy-btn');
  
  copyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const codeBlock = btn.nextElementSibling.innerText;
      
      navigator.clipboard.writeText(codeBlock).then(() => {
        const originalText = btn.innerText;
        btn.innerText = 'Copied!';
        btn.style.background = 'var(--brand-green)';
        btn.style.color = '#fff';
        
        setTimeout(() => {
          btn.innerText = originalText;
          btn.style.background = 'var(--panel-bg)';
          btn.style.color = 'var(--text-secondary)';
        }, 2000);
      });
    });
  });

  // 4. Initial Entry Animations
  const animateIn = document.querySelectorAll('.animate-in');
  animateIn.forEach((el, index) => {
    el.style.opacity = '0';
    setTimeout(() => {
      el.classList.add('fadeInUp');
      el.style.opacity = '1';
    }, index * 150);
  });
});
