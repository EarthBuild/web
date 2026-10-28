/**
 * Navigation & Mobile Drawer Interactions
 */

export function initNavbar(): void {
  const toggle =
    document.getElementById('mobileMenuToggle') ||
    document.querySelector<HTMLElement>('.mobile-menu-toggle') ||
    document.querySelector<HTMLElement>('.nav-toggle');
  const drawer =
    document.getElementById('mobileNavDrawer') ||
    document.querySelector<HTMLElement>('.mobile-nav-drawer') ||
    document.querySelector<HTMLElement>('.nav-menu');
  const navbar =
    document.querySelector<HTMLElement>('.navbar') ||
    document.querySelector<HTMLElement>('.site-nav');

  if (toggle && drawer) {
    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = drawer.classList.toggle('open');
      drawer.classList.toggle('active', isOpen);
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Close on any drawer link click
    drawer.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        drawer.classList.remove('open', 'active');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
      const target = e.target as Node | null;
      if (target && !drawer.contains(target) && !toggle.contains(target)) {
        drawer.classList.remove('open', 'active');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        drawer.classList.remove('open', 'active');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  window.addEventListener(
    'scroll',
    () => {
      if (window.scrollY > 20) {
        navbar?.classList.add('scrolled');
      } else {
        navbar?.classList.remove('scrolled');
      }
    },
    { passive: true },
  );
}

/**
 * Smooth Scroll for anchor links is managed natively with history & clearance in anchor-links.ts
 */
export function initSmoothScroll(): void {
  // Handled uniformly by initHeadingAnchorLinks in anchor-links.ts
}
