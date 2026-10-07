/**
 * Work-In-Progress (WIP) & Under Construction Controller
 * Displays development status indicators when draft sections are rendered locally.
 */

export function initWipController(): void {
  if (typeof document === 'undefined' || typeof window === 'undefined') return;

  const wipSections = document.querySelectorAll<HTMLElement>('[data-wip-section]');
  if (wipSections.length === 0) return;

  // Render floating status toast in bottom-right corner when draft sections are present
  if (!document.getElementById('wipPreviewToast')) {
    const toast = document.createElement('div');
    toast.id = 'wipPreviewToast';
    toast.className = 'wip-preview-toast';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');

    const dot = document.createElement('span');
    dot.className = 'wip-preview-toast-dot';

    const text = document.createElement('span');
    text.className = 'wip-preview-toast-text';
    text.innerHTML = `Local Development: <strong>Under Construction (${wipSections.length})</strong>`;

    const closeBtn = document.createElement('button');
    closeBtn.className = 'wip-preview-toast-close';
    closeBtn.type = 'button';
    closeBtn.title = 'Dismiss notice';
    closeBtn.setAttribute('aria-label', 'Dismiss notice');
    closeBtn.innerHTML = '&times;';
    closeBtn.addEventListener('click', () => {
      toast.remove();
    });

    toast.appendChild(dot);
    toast.appendChild(text);
    toast.appendChild(closeBtn);
    document.body.appendChild(toast);
  }
}
