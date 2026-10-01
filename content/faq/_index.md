---
title: "Frequently Asked Questions"
description: "Everything you need to know about EarthBuild, the open-source community fork of Earthly, licensing, architecture, and migration."
---

<div class="faq-accordion">
  <details class="faq-item" id="faq-relationship" open>
    <summary class="faq-summary">What is EarthBuild and what is its relationship with Earthly?</summary>
    <div class="faq-answer">
      <p>EarthBuild is the official, community-supported and open-source fork of Earthly. It was initiated and endorsed by the Earthly community and creators to ensure that the core container-based build engine remains vibrant, fully open source, and continuously maintained under the Mozilla Public License 2.0 (MPL-2.0).</p>
      <p style="margin-top: 0.5rem;">EarthBuild is a 100% drop-in replacement for existing Earthfiles and CLI workflows.</p>
    </div>
  </details>

  <details class="faq-item" id="faq-licensing">
    <summary class="faq-summary">Is EarthBuild free and open source?</summary>
    <div class="faq-answer">
      <p>Yes, 100%. EarthBuild is released under the <strong>Mozilla Public License Version 2.0 (MPL-2.0)</strong>. There are no closed-source enterprise tiers, no cloud telemetry lock-ins, and no sudden paywalls. All capabilities—including remote caching, satellite builds, and multi-platform compilation—are completely free for personal, team, and commercial use.</p>
    </div>
  </details>

  <details class="faq-item" id="faq-vs-docker">
    <summary class="faq-summary">How is EarthBuild different from Dockerfiles?</summary>
    <div class="faq-answer">
      <p>Dockerfiles were designed specifically for creating container runtime images. EarthBuild takes Dockerfile's layer caching and container isolation, but expands it into a general-purpose build system:</p>
      <ul style="margin-top: 0.5rem;">
        <li><strong>Artifact Output:</strong> EarthBuild can output local binaries, test reports, web bundles, and files directly to your host (<code>SAVE ARTIFACT ... AS LOCAL</code>).</li>
        <li><strong>Multi-Target Dependency Graph:</strong> Targets can depend on other targets across folders and git repos.</li>
        <li><strong>Parallel Execution:</strong> Independent targets (e.g. <code>+lint</code>, <code>+test</code>, <code>+compile</code>) execute concurrently.</li>
      </ul>
    </div>
  </details>

  <details class="faq-item" id="faq-caching">
    <summary class="faq-summary">How does caching work in EarthBuild?</summary>
    <div class="faq-answer">
      <p>EarthBuild leverages <strong>BuildKit</strong> under the hood. It tracks the exact cryptographic hash of all declared inputs (files, arguments, dependencies). If an input hasn't changed, EarthBuild re-uses the cached layer in milliseconds.</p>
      <p style="margin-top: 0.5rem;">You can also configure remote caching via any standard OCI container registry (GitHub Packages, Docker Hub, AWS ECR, GCP Artifact Registry) so your entire engineering team shares pre-computed build layers.</p>
    </div>
  </details>

  <details class="faq-item" id="faq-container-engines">
    <summary class="faq-summary">Do I need Docker installed to run EarthBuild?</summary>
    <div class="faq-answer">
      <p>No, Docker is not strictly required. EarthBuild supports <strong>Podman</strong>, <strong>Docker</strong>, and <strong>Apple container engines</strong> out-of-the-box by default.</p>
      <p style="margin-top: 0.5rem;">EarthBuild automatically detects your local container runtime without manual daemon configuration. You can also connect to remote BuildKit daemons running in Kubernetes or a remote Linux VM.</p>
    </div>
  </details>

  <details class="faq-item" id="faq-migration">
    <summary class="faq-summary">How do I migrate from Earthly to EarthBuild?</summary>
    <div class="faq-answer">
      <p>Migration is instant because Earthfiles are 100% compatible. Simply install the <code>earthbuild</code> CLI (which provides the <code>earth</code> command) and run your builds as usual. No changes to your <code>Earthfile</code> syntax are required.</p>
    </div>
  </details>

  <details class="faq-item" id="faq-secrets">
    <summary class="faq-summary">How are secrets handled during builds?</summary>
    <div class="faq-answer">
      <p>EarthBuild supports secure secret mounts via <code>RUN --secret SECRET_NAME=+secrets/token ...</code>. Secrets are mounted only in memory during the execution of that specific command and are never baked into container image layers, build cache metadata, or output artifacts.</p>
    </div>
  </details>
</div>
