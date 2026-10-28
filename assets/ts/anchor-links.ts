/**
 * Anchor Links & Copy Link to Specific Content
 * Allows users to copy direct URLs to sections, headings, and FAQ questions with instant clipboard feedback.
 */

import { copyTextToClipboard } from './clipboard';

let toastTimeout: number | null = null;

export function showCopyToast(message: string): void {
  let toast = document.getElementById('copyToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'copyToast';
    toast.className = 'copy-toast';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    toast.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
      <span class="copy-toast-msg"></span>
    `;
    document.body.appendChild(toast);
  }

  const msgEl = toast.querySelector('.copy-toast-msg');
  if (msgEl) {
    msgEl.textContent = message;
  }

  toast.classList.add('show');

  if (toastTimeout !== null) {
    window.clearTimeout(toastTimeout);
  }
  toastTimeout = window.setTimeout(() => {
    toast?.classList.remove('show');
    toastTimeout = null;
  }, 2200);
}

export function scrollElementIntoView(target: HTMLElement, smooth = true): void {
  // If target is or contains a details element, make sure it is open before calculating position
  if (target instanceof HTMLDetailsElement) {
    target.open = true;
  }
  const parentDetails = target.closest('details');
  if (parentDetails) {
    parentDetails.open = true;
  }

  // If target has a .section-header inside (like <section class="section" id="...">),
  // the content begins at .section-header, not at the top of the outer section padding.
  const contentStart = target.querySelector<HTMLElement>('.section-header') || target;
  const targetTop = contentStart.getBoundingClientRect().top + window.pageYOffset - 32; // 2rem clearance

  window.scrollTo({
    top: Math.max(0, targetTop),
    behavior: smooth ? 'smooth' : 'auto',
  });
}

function createAnchorButton(id: string, titleText: string): HTMLAnchorElement {
  const link = document.createElement('a');
  link.href = `#${id}`;
  link.className = 'heading-anchor-btn';
  link.setAttribute('data-anchor-id', id);
  link.setAttribute('aria-label', `Copy link to "${titleText}"`);
  link.setAttribute('title', `Copy link to "${titleText}"`);
  link.innerHTML = `
    <svg class="anchor-icon-link" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
    </svg>
    <svg class="anchor-icon-check" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  `;

  link.addEventListener('click', async (e: MouseEvent) => {
    // If user clicked with Ctrl/Cmd or middle click, allow browser to open in new tab
    if (e.metaKey || e.ctrlKey || e.button === 1) return;

    e.preventDefault();
    e.stopPropagation();

    const search = window.location.search || '';
    const url = `${window.location.origin}${window.location.pathname}${search}#${id}`;

    // 1. Always update browser history and address bar so user has the hash link
    try {
      window.history.pushState(null, '', `${search}#${id}`);
    } catch {
      window.location.hash = id;
    }

    // 2. Smooth scroll target into view where content starts
    const target = document.getElementById(id);
    if (target) {
      scrollElementIntoView(target, true);
      target.classList.add('anchor-highlight');
      setTimeout(() => target.classList.remove('anchor-highlight'), 1500);
    }

    // 3. Multi-tier copy to clipboard (Async Clipboard API -> fallback execCommand)
    const copied = await copyTextToClipboard(url);

    // 4. Visual feedback
    link.classList.add('copied');
    showCopyToast(copied ? 'Link copied to clipboard!' : 'Link updated in address bar!');

    setTimeout(() => {
      link.classList.remove('copied');
    }, 2000);
  });

  return link;
}

function attachAnchorToTitle(titleEl: HTMLElement, anchorBtn: HTMLAnchorElement): void {
  // Append zero-width, zero-height holder containing the absolutely positioned anchor button.
  // This leaves all text and child elements 100% untouched and adds 0px to the line width,
  // guaranteeing mathematical precision for centered headers and zero unwanted line wraps.
  const holder = document.createElement('span');
  holder.className = 'heading-anchor-holder';
  holder.appendChild(anchorBtn);
  titleEl.appendChild(holder);
}

export function initHeadingAnchorLinks(): void {
  // 1. Process all section titles in sections that have an ID
  const sections = document.querySelectorAll<HTMLElement>('section[id]');
  sections.forEach((section) => {
    const id = section.id;
    if (!id) return;

    const titleEl = section.querySelector<HTMLElement>('.section-title');
    if (titleEl && !titleEl.querySelector('.heading-anchor-btn')) {
      const cleanTitle = titleEl.textContent?.trim().replace(/\s+/g, ' ') || id;
      const anchorBtn = createAnchorButton(id, cleanTitle);
      attachAnchorToTitle(titleEl, anchorBtn);
    }
  });

  // 2. Process documentation headings with IDs in markdown (.doc-content)
  const docHeadings = document.querySelectorAll<HTMLElement>(
    '.doc-content h2[id], .doc-content h3[id]',
  );
  docHeadings.forEach((heading) => {
    const id = heading.id;
    if (!id || heading.querySelector('.heading-anchor-btn')) return;

    const cleanTitle = heading.textContent?.trim().replace(/\s+/g, ' ') || id;
    const anchorBtn = createAnchorButton(id, cleanTitle);
    attachAnchorToTitle(heading, anchorBtn);
  });

  // 3. Process FAQ items if they have an ID
  const faqItems = document.querySelectorAll<HTMLElement>('.faq-item[id]');
  faqItems.forEach((item) => {
    const id = item.id;
    if (!id) return;
    const summary = item.querySelector<HTMLElement>('.faq-summary');
    if (summary && !summary.querySelector('.heading-anchor-btn')) {
      const cleanTitle = summary.textContent?.trim().replace(/\s+/g, ' ') || id;
      const anchorBtn = createAnchorButton(id, cleanTitle);
      const questionSpan = document.createElement('span');
      questionSpan.className = 'faq-question-text';
      while (summary.firstChild) {
        questionSpan.appendChild(summary.firstChild);
      }
      attachAnchorToTitle(questionSpan, anchorBtn);
      summary.appendChild(questionSpan);
    }
  });

  // 4. In-page anchor click interception for smooth, exact scrolling
  document.addEventListener('click', (e: MouseEvent) => {
    const anchor = (e.target as HTMLElement)?.closest<HTMLAnchorElement>('a[href*="#"]');
    if (!anchor || anchor.classList.contains('heading-anchor-btn')) return;

    // Skip if external, modified click (cmd/ctrl/shift), or has target="_blank"
    if (e.metaKey || e.ctrlKey || e.button === 1 || anchor.target === '_blank') return;

    const href = anchor.getAttribute('href');
    if (!href) return;

    let hash = '';
    if (href.startsWith('#')) {
      hash = href.substring(1);
    } else if (
      href.startsWith('/#') &&
      (window.location.pathname === '/' || window.location.pathname === '')
    ) {
      hash = href.substring(2);
    }

    if (hash) {
      const target = document.getElementById(hash);
      if (target) {
        e.preventDefault();
        window.history.pushState(null, '', `#${hash}`);
        scrollElementIntoView(target, true);
        target.classList.add('anchor-highlight');
        setTimeout(() => target.classList.remove('anchor-highlight'), 1500);

        // Close mobile menu if open
        const drawer = document.getElementById('mobileNavDrawer');
        drawer?.classList.remove('open', 'active');
        const toggle = document.getElementById('mobileMenuToggle');
        toggle?.setAttribute('aria-expanded', 'false');
      }
    }
  });

  // 5. Initial Hash Navigation handler: if user opens page with #hash, expand details and scroll cleanly to content start
  const handleHashChange = (smooth = true) => {
    if (window.location.hash) {
      let rawId = window.location.hash.substring(1);
      if (rawId.includes('?')) {
        rawId = rawId.split('?')[0];
      }
      const target = document.getElementById(rawId);
      if (target) {
        scrollElementIntoView(target, smooth);
        setTimeout(
          () => {
            target.classList.add('anchor-highlight');
            setTimeout(() => target.classList.remove('anchor-highlight'), 1800);
          },
          smooth ? 250 : 0,
        );
      }
    }
  };

  // Run on browser back/forward or manual hash changes
  window.addEventListener('hashchange', () => handleHashChange(true));

  // Run on initial load once styles/fonts have settled
  if (window.location.hash) {
    if (document.readyState === 'complete') {
      setTimeout(() => handleHashChange(false), 50);
    } else {
      window.addEventListener('load', () => {
        setTimeout(() => handleHashChange(false), 50);
      });
    }
  }
}
