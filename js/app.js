(() => {
  const topbar = document.querySelector('.topbar');
  const toggle = document.querySelector('.topbar__toggle');
  const nav = document.querySelector('.topbar__nav');
  const navLinks = Array.from(document.querySelectorAll('.topbar__nav a[href^="#"]'));
  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  if (!topbar || !nav || !navLinks.length || !sections.length) {
    return;
  }

  const mobileQuery = window.matchMedia('(max-width: 768px)');

  const setMenuState = (open, { syncFocus = false } = {}) => {
    if (!toggle) {
      return;
    }

    topbar.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));

    if ('inert' in nav) {
      nav.inert = !open && mobileQuery.matches;
    }

    nav.setAttribute('aria-hidden', String(!open && mobileQuery.matches));
    navLinks.forEach((link) => {
      link.tabIndex = !open && mobileQuery.matches ? -1 : 0;
    });

    if (syncFocus && open) {
      const firstLink = navLinks[0];
      if (firstLink) {
        firstLink.focus({ preventScroll: true });
      }
    }
  };

  const closeMenu = () => setMenuState(false);
  const openMenu = () => setMenuState(true, { syncFocus: true });
  const toggleMenu = () => {
    const isOpen = topbar.classList.contains('is-open');
    setMenuState(!isOpen, { syncFocus: !isOpen });
  };

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
    closeMenu();
  };

  navLinks.forEach((link) => {
    link.addEventListener('click', scrollToSection);
  });

  if (toggle) {
    toggle.addEventListener('click', toggleMenu);
  }

  document.addEventListener('click', (event) => {
    if (!mobileQuery.matches || !topbar.classList.contains('is-open')) {
      return;
    }

    if (!topbar.contains(event.target)) {
      closeMenu();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeMenu();
      toggle?.focus();
    }
  });

  const syncMenuForViewport = () => {
    if (mobileQuery.matches) {
      if (toggle) {
        toggle.setAttribute('aria-expanded', String(topbar.classList.contains('is-open')));
      }
      nav.setAttribute('aria-hidden', String(!topbar.classList.contains('is-open')));
      if ('inert' in nav) {
        nav.inert = !topbar.classList.contains('is-open');
      }
      navLinks.forEach((link) => {
        link.tabIndex = topbar.classList.contains('is-open') ? 0 : -1;
      });
    } else {
      topbar.classList.remove('is-open');
      if (toggle) {
        toggle.setAttribute('aria-expanded', 'false');
      }
      nav.removeAttribute('aria-hidden');
      if ('inert' in nav) {
        nav.inert = false;
      }
      navLinks.forEach((link) => {
        link.tabIndex = 0;
      });
    }
  };

  if (mobileQuery.addEventListener) {
    mobileQuery.addEventListener('change', syncMenuForViewport);
  } else {
    mobileQuery.addListener(syncMenuForViewport);
  }

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

  syncMenuForViewport();

  if (location.hash) {
    const initialTarget = document.querySelector(location.hash);

    if (initialTarget) {
      setActiveLink(initialTarget.id);
    }
  } else {
    setActiveLink(sections[0].id);
  }
})();
