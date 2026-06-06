(() => {
  const navLinks = Array.from(document.querySelectorAll('nav a[href^="#"]'));
  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  if (!navLinks.length || !sections.length) {
    return;
  }

  const setActiveLink = (id) => {
    navLinks.forEach((link) => {
      const isActive = link.getAttribute('href') === `#${id}`;
      if (isActive) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  };

  const scrollToSection = (event) => {
    const href = event.currentTarget.getAttribute('href');
    const target = document.querySelector(href);

    if (!target) {
      return;
    }

    event.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    history.pushState(null, '', href);
    setActiveLink(target.id);
  };

  navLinks.forEach((link) => {
    link.addEventListener('click', scrollToSection);
  });

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible) {
          setActiveLink(visible.target.id);
        }
      },
      {
        rootMargin: '-35% 0px -55% 0px',
        threshold: [0.1, 0.25, 0.5],
      }
    );

    sections.forEach((section) => observer.observe(section));
  } else {
    const updateActiveSection = () => {
      const offset = window.innerHeight * 0.35;
      let current = sections[0];

      for (const section of sections) {
        if (section.getBoundingClientRect().top - offset <= 0) {
          current = section;
        }
      }

      if (current) {
        setActiveLink(current.id);
      }
    };

    window.addEventListener('scroll', updateActiveSection, { passive: true });
    updateActiveSection();
  }

  if (location.hash) {
    const initialTarget = document.querySelector(location.hash);

    if (initialTarget) {
      setActiveLink(initialTarget.id);
    }
  } else {
    setActiveLink(sections[0].id);
  }
})();
