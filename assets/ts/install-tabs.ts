/**
 * Hero Install Quick Selector
 */

export function initInstallTabs(): void {
  const tabs = document.querySelectorAll<HTMLButtonElement>('.install-tab-btn');
  const snippetEl = document.getElementById('installCodeSnippet');

  const installCommands: Record<string, string> = {
    brew: 'brew install earthbuild/tap/earth',
    curl: 'curl -fsSL https://www.earthbuild.dev/install.sh | sh',
    windows: 'curl -fsSL https://www.earthbuild.dev/install.sh | sh',
    nix: 'nix-shell -p earthbuild',
  };

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');

      const type = tab.getAttribute('data-install-type');
      if (snippetEl && type && installCommands[type]) {
        snippetEl.innerText = installCommands[type];
      }
    });
  });
}
