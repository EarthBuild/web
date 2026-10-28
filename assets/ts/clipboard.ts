/**
 * Clipboard Copy Functionality with multi-tier fallback & transient visual feedback
 */

export async function copyTextToClipboard(text: string): Promise<boolean> {
  // 1. Try modern navigator.clipboard if available
  if (
    typeof navigator !== 'undefined' &&
    navigator.clipboard &&
    typeof navigator.clipboard.writeText === 'function'
  ) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Async clipboard can reject due to permissions, focus, or browser policies.
      // Fall through immediately to synchronous execCommand copy.
    }
  }

  // 2. Synchronous fallback using temporary textarea + document.execCommand('copy')
  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.top = '0';
    textarea.style.left = '0';
    textarea.style.width = '2em';
    textarea.style.height = '2em';
    textarea.style.padding = '0';
    textarea.style.border = 'none';
    textarea.style.outline = 'none';
    textarea.style.boxShadow = 'none';
    textarea.style.background = 'transparent';
    textarea.style.opacity = '0.01';
    textarea.style.zIndex = '-1';
    textarea.style.pointerEvents = 'none';
    document.body.appendChild(textarea);
    textarea.focus({ preventScroll: true });
    textarea.select();
    textarea.setSelectionRange(0, textarea.value.length);
    const success = document.execCommand('copy');
    document.body.removeChild(textarea);
    return Boolean(success);
  } catch (err) {
    console.error('execCommand copy fallback failed:', err);
    return false;
  }
}

export function initClipboard(): void {
  document.addEventListener('click', async (e: MouseEvent) => {
    const btn = (e.target as HTMLElement)?.closest?.('.copy-btn') as HTMLButtonElement | null;
    if (!btn) return;

    const targetId = btn.getAttribute('data-clipboard-target');
    const targetEl = targetId ? document.getElementById(targetId) : null;
    const textToCopy = targetEl
      ? targetEl.innerText || targetEl.textContent
      : btn.getAttribute('data-copy-text');

    if (textToCopy) {
      const ok = await copyTextToClipboard(textToCopy.trim());
      if (ok) {
        const originalHTML = btn.innerHTML;
        btn.classList.add('copied');
        btn.innerHTML = `
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <span>Copied!</span>
        `;
        setTimeout(() => {
          btn.innerHTML = originalHTML;
          btn.classList.remove('copied');
        }, 2000);
      }
    }
  });
}
