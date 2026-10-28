# AGENTS.md — Agent Guidelines & Context for EarthBuild

Welcome to the **EarthBuild** codebase. This document outlines the project mission, target audience, communication style, technical architecture, and strict operational constraints for AI agents working in this repository.

---

## 1. Project Overview

### What is EarthBuild?
**EarthBuild** is an open-source, container-powered build automation engine. It combines the approachable syntax of Makefiles with the hermetic isolation and layer caching of Docker.

> [!IMPORTANT]
> ### Crucial Project Identity & Environment Variables
> - **This is EarthBuild, NOT Earthly**: This project is **EarthBuild**. While it originated as the community-supported, open-source fork and successor to Earthly (MPL-2.0), agents must **never** refer to the active project or current software as "Earthly". Always use **EarthBuild**.
> - **CLI Command is `earth`**: The tool package is `earthbuild`, but the command-line executable invoked by developers and CI workflows is strictly **`earth`** (e.g., `earth +build`, `earth +test`, `earth --ci +all`, `earth -i +target`).
> - **Strict `EARTH_` Environment Variable Prefix**: EarthBuild uses **`EARTH_`** prefixed environment variables (e.g., `EARTH_DOCKER_CONFIG`, `EARTH_CONFIG`, `EARTH_CI`, `EARTH_BUILDKIT_IMAGE`, `EARTH_DEBUG`, `EARTH_AUTO_SKIP`). **Never use legacy `EARTHLY_` environment variables.**

- **Tagline**: *"It's like Docker for builds"*
- **Core Value Proposition**: *"Build Once. Run Anywhere. Seriously."* — Guaranteed local-to-CI parity. If it passes on your laptop with `earth +test`, it is guaranteed to pass in any CI runner.
- **Lineage & Heritage**: EarthBuild is the community-supported, fully open-source fork and successor to Earthly, maintained under the **Mozilla Public License Version 2.0 (MPL-2.0)**.
- **Compatibility**: 100% drop-in replacement for existing `Earthfile` configurations and workflows.
- **CLI**: Provided by the `earthbuild` package, invoked via the **`earth`** command (e.g., `earth +build`, `earth +test`, `earth --ci +all`).
- **Environment Variables**: Pervasively use the **`EARTH_`** prefix (e.g., `EARTH_DOCKER_CONFIG`, `EARTH_CONFIG`, `EARTH_CI`, `EARTH_BUILDKIT_IMAGE`). Legacy `EARTHLY_*` prefixes are obsolete.
- **Engine**: Powered by a **heavily customized, forked version of BuildKit** under the hood. **EarthBuild does NOT use standard upstream BuildKit.** Its engine is a deeply modified BuildKit fork engineered specifically for `Earthfile` semantics, providing non-linear target-level DAG resolution, custom Low-Level Builder (LLB) opcodes, direct host artifact streaming (`SAVE ARTIFACT ... AS LOCAL`), and interactive container debugging (`earth -i`).

### Key Capabilities (Universal Engine Truths)
- **Heavily Customized Forked BuildKit Engine**: EarthBuild embeds and orchestrates a dedicated, customized fork of BuildKit rather than standard upstream BuildKit or standard Docker daemons. This custom engine introduces specialized LLB operations, multi-target graph execution, and container isolation features that standard BuildKit cannot execute.
- **Directed Acyclic Graph (DAG) with Multi-Core Parallelism**: Targets declare explicit dependencies. Independent pipeline branches (e.g., `+lint`, `+test-unit`, `+test-integration`, `+build`) execute concurrently by default across all available CPU cores without manual orchestration.
- **Sub-DAG Pruning & Incremental Builds**: Editing a single file only invalidates the specific target's leaf; upstream and sibling targets are instantly reused from cache.
- **Hermetic Container Sandboxing**: Every target executes inside an isolated OCI container namespace with deterministic inputs—immune to untracked host OS packages, glibc differences, or local environment variables.
- **Artifact Extraction**: Standalone host binaries, test coverage reports, or distribution bundles can be written directly to host disk using `SAVE ARTIFACT ... AS LOCAL`.
- **Zero Lock-In Remote OCI Caching**: Seamless cache export and pull via standard OCI registries (Docker Hub, GitHub Packages, AWS ECR, GCP Artifact Registry).
- **Secure Secret Isolation**: In-memory secret mounting (`RUN --secret`) that never leaks into image layers, build cache metadata, or remote registries.
- **Default Support for Podman, Docker & Apple Container Engines**: EarthBuild supports **Podman**, **Docker**, and **Apple container engines** out-of-the-box by default. It auto-detects the active local container daemon or remote BuildKit instance with zero manual setup.

---

## 2. Target Audience

EarthBuild is built for technical practitioners who demand high build velocity, reproducibility, reliability, and security:

1. **Software Engineers & Monorepo Developers** (Completely language-agnostic — works with any language, runtime, or toolchain):
   - Universally supports any tech stack (Go, Rust, C/C++, Python, TypeScript, Java, Zig, Ruby, C#, Elixir, or any tool that runs in a container) with zero proprietary plugins required.
   - Developers tired of broken inner-loop iterations, lengthy CI feedback delays, and context switching between local scripts and CI YAML.
   - Engineers who want fast local rebuilds that behave identically to production CI.

2. **DevOps & Platform Engineers**:
   - Engineers responsible for CI/CD infrastructure, cloud compute bills, and developer experience (DX).
   - Teams seeking to slash GitHub Actions / GitLab CI runner minutes and cloud compute costs via shared remote caching.

3. **Security Engineers & DevSecOps Practitioners**:
   - Teams focused on software supply chain security, hermetic container sandboxing, and verifiable build reproducibility.
   - Practitioners requiring secure in-memory secret handling (`RUN --secret`) that guarantees zero credential leakage into container layers, cache metadata, or remote registries.

4. **Open-Source Maintainers & Enterprises**:
   - Organizations looking for a truly open-source build tool (MPL-2.0) with zero closed-source tiers, zero cloud telemetry tracking, and zero surprise paywalls.

---

## 3. Practical Usage & Execution Architecture (Dev Workstations vs. CI/CD)

While the customized BuildKit engine behaves identically everywhere, EarthBuild solves fundamentally different operational problems on developer workstations versus automated CI/CD pipelines.

### A. Developer Workstation Workflow (The Inner Loop & Interactive DX)
On local workstations, EarthBuild optimizes for developer velocity, host environment independence, and immediate feedback:

1. **Host Toolchain Independence & Version Drift Immunity**:
   - Developers typically have language runtimes (Go, Node, Rust, Python) installed on their host machine for editor tooling and LSPs (`gopls`, `rust-analyzer`). However, host toolchain versions often diverge from repository and CI pins (e.g., host has Go 1.28 while the project and CI are pinned to Go 1.27; or host macOS lacks Linux glibc/Cgo dependencies).
   - EarthBuild completely decouples build and test execution from the host OS and local toolchain state. Every target executes inside the exact containerized toolchain pinned in the `Earthfile`.
   - **Guaranteed Local-to-CI Parity**: If `earth +test` passes on a developer's workstation, it is guaranteed to pass in CI because both execute the identical pinned container environment. This eliminates "works on my machine" version mismatches and frees developers from juggling complex host version managers (`gvm`, `nvm`, `asdf`, `pyenv`).
2. **Sub-Second Local Inner Loop**:
   - When editing source code, developers run `earth +test`.
   - Local customized BuildKit cache reuses base images, compiler environments, and dependency downloads (`go mod download`, `npm ci`, `cargo fetch`). Only the invalidated target leaf recompiles.
3. **Direct Host Artifact Extraction for IDEs**:
   - Developers use `SAVE ARTIFACT ... AS LOCAL bin/app` to export compiled binaries, generated protobuf stubs, or test coverage reports directly to their host filesystem for editor autocompletion and local testing.
4. **Interactive Failure Debugging (`earth -i`)**:
   - When a step fails locally, running `earth -i +target` drops the developer into an interactive root shell inside the exact container environment and layer where the command failed.
5. **Private Local Workstation Cache**:
   - All workstation builds read and write strictly to local disk storage with zero network latency.

---

### B. CI/CD Runner Workflow (Pipeline Simplification & Runner Topologies)
In continuous integration environments (GitHub Actions, GitLab CI, Buildkite, CircleCI, Jenkins), EarthBuild execution generally falls into two distinct runner topologies:

1. **Self-Hosted Persistent Runners (The Ideal Environment)**:
   - **Persistent Local Engine Cache**: Runners retain their disk storage and customized BuildKit cache across pipeline runs.
   - **Maximum Build Velocity**: Subsequent pipeline executions hit local disk cache instantly with zero network download latency, delivering sub-second incremental builds identical to the local workstation experience.
   - This is the recommended, gold-standard operational setup for EarthBuild in production CI.
2. **Hosted / Ephemeral Git Platform Runners (GitHub-Hosted, GitLab SaaS, etc.)**:
   - **Ephemeral Lifecycles**: Every job spins up inside a fresh, clean VM and discards its state on completion; local disk cache is destroyed when the runner terminates.
   - **Remote Caching Mechanics**: Can import and export cache layers over the network via standard OCI registries (`--remote-cache=...`). However, network I/O transfer overhead for pulling and pushing large layers on short-lived VMs can offset build gains.
   - **Active Area of Improvement**: Improving caching mechanics, transfer payloads, and ergonomics on ephemeral platform runners is an active, ongoing development focus for EarthBuild, though persistent runners currently provide the optimal experience.
3. **Slashing CI Configuration Complexity (The YAML Killer)**:
   - Replaces hundreds of lines of fragile, vendor-specific CI YAML (`setup-node`, `setup-go`, caching actions, and custom bash scripts) with a single command:
     ```bash
     earth --ci +test
     ```
     *(Or with remote OCI caching: `earth --ci --remote-cache=registry.hub.docker.com/myorg/cache:main +test`)*
   - Eliminates CI vendor lock-in. Migrating between GitHub Actions, GitLab CI, or Jenkins requires zero pipeline rewrites.
4. **Eliminating Complex CI Matrix Setups**:
   - Because EarthBuild parallelizes independent targets automatically on multi-core runners, teams do not need to configure, debug, and maintain complex multi-job CI matrices to run tests and linters concurrently.

---

### C. Cache Security, Isolation & Secure Layer Sharing (Workstation vs. CI)
EarthBuild combines strict **execution hermeticity** with flexible cache security policies:

1. **Inherently Secure Layers (No Credential Leakage)**:
   - EarthBuild cache layers are cryptographically content-addressed and hermetically isolated.
   - Secrets mounted via `RUN --secret` exist strictly as temporary in-memory files (`tmpfs`) during step execution; they are never written to disk, never baked into image layers, and never serialized into cache metadata.
   - When properly configured, cache layers are completely clean and secure to store and distribute.
2. **Current Baseline Isolation (Poisoning Prevention)**:
   - In standard production setups today, developer workstations and CI pipelines often keep write permissions separated.
   - In CI, PR branches operate under a **Read-Only cache policy** (pulling base layers from `main` but never pushing), preventing malicious cache poisoning. Only authenticated builds on protected branches (`main`) write back to remote registries.
3. **Future Evolution (Secure Cross-Environment Layer Sharing)**:
   - Sharing pre-warmed cache layers directly between CI/CD and developer workstations represents a major build acceleration opportunity.
   - Because layers are hermetic and secure, organizations can set up authenticated, role-based OCI caching to share compiled layers across the entire engineering fleet, turning initial local builds into instant cache hits.
4. **Deterministic & Verifiable Parity**:
   - Because targets execute in hermetic container namespaces without host leakage, deterministic inputs guarantee that if a target passes locally, it passes identically in CI.

---

## 4. Language, Terminology & Tone

### Communication Tone
- **Developer-Centric, Pragmatic & Direct**: Channel the craftsmanship and clarity of modern developer tools (Vite, Rust/Cargo, Go, Docker, Bazel).
- **No Marketing Fluff**: Avoid generic buzzwords ("revolutionary", "game-changing", "next-gen"). Focus on concrete mechanics: cache hit rates, build times, CPU utilization, local-to-CI parity.
- **Respectful & Transparent**: Acknowledge Earthly roots with pride while presenting EarthBuild as the future-proof, community-governed path forward.

### Preferred Technical Terminology

| Concept | Preferred Term | Avoid / Deprecated | Rationale |
| :--- | :--- | :--- | :--- |
| **Project Identity** | **EarthBuild** | *Earthly* (when referring to active project/software) | EarthBuild is the active project and community-supported successor. Never refer to the project as Earthly. |
| **CLI Command** | **`earth`** (`earth +target`, `earth --ci`) | *earthbuild* (as command), *earthly* | The binary/command is `earth`, distributed via the `earthbuild` package. |
| **Environment Variables** | **`EARTH_*`** (`EARTH_DOCKER_CONFIG`, `EARTH_CONFIG`, `EARTH_CI`) | *`EARTHLY_*`* (`EARTHLY_DOCKER_CONFIG`, `EARTHLY_CONFIG`, etc.) | **Strict invariant**: EarthBuild uses `EARTH_` prefixed environment variables. Legacy `EARTHLY_` variables are deprecated. |
| **01 (Zero Cache)** | **Clean Build** (or *Cold Run*) | *Cold Build* | Standard developer vocabulary (`make clean`, `cargo clean`, fresh CI runner). |
| **02 (1 File Changed)** | **Incremental Build** (or *Sub-DAG Rebuild*) | *Cache Miss* | **Crucial:** Calling 1 file changed a "Cache Miss" undersells EarthBuild. 90% of the DAG is reused; only the affected target recompiles. |
| **03 (Unchanged)** | **Zero-Work Rebuild** (or *Instant Replay*) | *Cache Hit* | Emphasizes zero CPU waste and sub-second validation. |
| **Build Configuration** | **`Earthfile`** | *EarthBuild file, Dockerfile* | Exact filename used by the CLI. |
| **Execution Engine** | **Customized BuildKit Engine** (or *Forked BuildKit*) | *Standard BuildKit, Docker daemon, upstream BuildKit* | **Crucial distinction:** EarthBuild does **NOT** use standard upstream BuildKit. It executes on a heavily customized, open-source fork of BuildKit with custom LLB operations, interactive container debugging (`earth -i`), and DAG extensions designed specifically for Earthfiles. |

---

## 5. Web Application Architecture (`web/`)

The website in `web/` is the public face of EarthBuild ([earthbuild.dev](https://earthbuild.dev)).

### Technology Stack
- **Static Site Generator**: [Hugo](https://gohugo.io/) (extended with goldmark renderer).
- **Styling**: Pure **Vanilla CSS** (`static/css/style.css`). Do NOT introduce TailwindCSS or heavy CSS preprocessors without explicit instruction.
- **Interactivity**: Modular **Strict TypeScript** (`assets/ts/`), compiled natively with sub-millisecond speeds via **Hugo Pipes (`js.Build`)** and ESBuild (zero npm/node_modules dependencies). No React, Vue, or heavy client frameworks.
- **Fonts**: Inter (UI text) + JetBrains Mono (code, terminals, metric figures).

### Design Standards
- **Dark Mode First**: Clean, developer-focused aesthetic.
- **Material Design 3 (M3) Adaptive Design**: Layouts must adapt structurally across M3 Window Size Classes rather than relying on arbitrary ad-hoc media breakpoints:
  - **Compact (< 600px)**: Single-column vertical stacks, off-canvas navigation drawer, full-bleed cards, and ergonomic touch targets $\ge 48\text{px}$.
  - **Medium (600px – 839px)**: Tablets and foldables. Single-column or hybrid 2-pane, compact touch-friendly controls.
  - **Expanded (840px – 1199px)**: Small laptops and standard desktop viewports. Multi-column desktop grids and the CodeRabbit-style horizontal 3-window race runner deck.
  - **Large & Extra-Large ($\ge$ 1200px)**: Desktop monitors and ultra-wides. Bounded max-width containers (`1140px` / `1200px`) that preserve optimal reading line length (`60–75` characters) and balanced whitespace.
- **Single Source of Truth**: All design tokens (palette, glassmorphism, semantic accents, shadows, and radii) and layout mechanics are defined in `static/css/style.css`. Always use existing CSS custom properties (e.g., `var(--bg-primary)`, `var(--accent-primary)`) rather than hardcoding ad-hoc hex values or inline styles.

---

## 6. Toolchain & Runtime Version Policy

It is **mandatory** that all code examples, documentation, Earthfiles, Dockerfiles, and CI workflow configurations across the website strictly pin the **latest current toolchain, compiler, and container image versions**. Outdated, end-of-life, or superseded runtime versions must never be introduced or retained.

### Baseline Version Standards
- **Go**: `1.27+` (e.g., `golang:1.27-alpine3.24`, `go 1.27.0`, `actions/setup-go@v5` with `go-version: '1.27'`).
- **Node.js**: `26+` (e.g., `node:26-alpine`, `node:26.10.0-alpine3.24`).
- **Python**: `3.14+` (e.g., `python:3.14-slim`, `python:3.14.7-slim`).
- **Alpine Linux**: `3.24+` (e.g., `alpine:3.24`, `alpine:3.24.2`).
- **Ubuntu**: `26.04` (e.g., `ubuntu:26.04`, `runs-on: ubuntu-26.04`).
- **Rust**: `1.85+` (e.g., `rust:1.85-alpine`).
- **GitHub Actions**: Modern actions pinned to current majors (`actions/checkout@v4`, `actions/setup-go@v5`, `earthbuild/actions-setup@v2`).
- **Earthfile Specification**: Always use `VERSION 0.8`.

### Anti-Patterns to Avoid
- **Strictly never use or invent hypothetical tooling**: Never fabricate, hallucinate, or present hypothetical SDKs, packages, CLI flags, APIs, or language bindings that do not exist in reality. If an external tool, framework, or ecosystem lacks support for a language or feature (e.g., Dagger has NO Dart SDK), state that limitation immediately, directly, and factually. Never provide speculative code examples or theoretical workarounds.
- **Strictly forbidden to use deprecated APIs, methods, or configurations**: Agents are strictly forbidden from introducing deprecated, superseded, or obsolete functions, APIs, configuration helpers, or packages. Always use current, actively supported idioms (e.g., use official `defineConfig` from `eslint/config` instead of deprecated `tseslint.config`; modern ESLint 9+ flat config standards; current major versions of tools and actions).
- **Never use legacy/EOL versions**: Do not use Go 1.21/1.24, Alpine 3.19/3.21, or Node 18/20/24 in examples or documentation.
- **Maintain version parity across examples**: When demonstrating side-by-side migrations (e.g., Dockerfile vs. Earthfile vs. Dagger vs. GitHub Actions), ensure all examples use the exact same runtime versions (`golang:1.27-alpine3.24` and `alpine:3.24`).
- **Never use `EARTHLY_` environment variables**: Always write `EARTH_DOCKER_CONFIG`, `EARTH_CONFIG`, `EARTH_CI`, etc. Legacy Earthly variables are forbidden.
- **Never invoke `earthbuild` as a CLI command**: Always invoke `earth`.

### EarthBuild CLI & Environment Variable Standards
- **Binary Command**: Always invoke `earth` (e.g., `earth +test`, `earth --ci +all`, `earth -i +target`).
- **Environment Variables**: All environment variables for EarthBuild use the **`EARTH_`** prefix. Never generate or document legacy `EARTHLY_` variables. Examples:
  - `EARTH_DOCKER_CONFIG` (replaces legacy `EARTHLY_DOCKER_CONFIG`)
  - `EARTH_CONFIG` (replaces legacy `EARTHLY_CONFIG`)
  - `EARTH_CI` (replaces legacy `EARTHLY_CI`)
  - `EARTH_BUILDKIT_IMAGE` (replaces legacy `EARTHLY_BUILDKIT_IMAGE`)
  - `EARTH_DEBUG` (replaces legacy `EARTHLY_DEBUG`)
  - `EARTH_AUTO_SKIP` (replaces legacy `EARTHLY_AUTO_SKIP`)
  - `EARTH_TMP_DIR` (replaces legacy `EARTHLY_TMP_DIR`)

---

## 7. Strict Operational Rules for AI Agents

> [!IMPORTANT]
> ### Strict Prohibition of Deprecated APIs & Tools
> - **Strictly forbidden to use deprecated stuff**: Agents must never introduce deprecated APIs, superseded functions, obsolete config helpers, or legacy conventions (e.g., `tseslint.config` is deprecated in favor of official `defineConfig` from `eslint/config`). Always check current documentation and official migration guides to ensure only modern, active standards are used.

> [!IMPORTANT]
> ### Strict Reality & Verifiability Standard (Zero Hypothetical Stuff)
> - **Strictly NEVER use or invent hypothetical tooling**: Agents must never fabricate, speculate, or present hypothetical SDKs, language bindings, packages, CLI flags, or APIs.
> - **Directly acknowledge absence of support**: If an external tool, framework, or runtime does not support a language or feature in reality (e.g., Dagger has NO Dart SDK, NO Swift SDK, etc.), state this limitation immediately, unequivocally, and factually. Never write pseudocode, invent non-existent libraries, or propose theoretical "hypothetical" implementations.
> - **Verifiable artifacts only**: All code examples, dependency manifests (`Cargo.toml`, `package.json`, `pubspec.yaml`, `go.mod`), container base images, and commands must correspond strictly to real, verifiable software that actually exists in official registries and repositories.

> [!IMPORTANT]
> ### Mandatory EarthBuild Invariants
> - **Project Identity**: This project is **EarthBuild** (not Earthly). Never refer to the project, software, or repository as Earthly.
> - **CLI Binary**: The CLI command is strictly **`earth`** (package `earthbuild`).
> - **Environment Variables**: All CLI and runtime environment variables must use the **`EARTH_`** prefix (e.g., `EARTH_DOCKER_CONFIG`, `EARTH_CONFIG`, `EARTH_CI`). Never use `EARTHLY_*`.

> [!CAUTION]
> ### Mandatory Git & Version Control Rules
> - **NEVER stage changes**: Do NOT run `git add`, `git stage`, or any command that stages files into the git index.
> - **NEVER unstage user changes**: Do NOT run `git restore --staged`, `git reset`, or unstage files if the user has added files to staging. The user selectively stages files they have reviewed.
> - **NEVER commit or push**: Do NOT run `git commit`, `git push`, or modify branches/history unless explicitly commanded by the user.
> - **Leave agent changes unstaged**: All modifications, new files, and deletions made by the agent must remain unstaged in the working directory so the user retains complete review authority.
> - **Read-only inspection only**: Use strictly read-only inspection commands (`git status`, `git diff`, `git log`) to verify working tree status. Never execute commands that mutate the git index or repository history.

### Testing & Validation
- **Hugo Site Build**: Run `hugo --cleanDestinationDir --minify` in `web/` to verify zero template or asset compilation errors and automatically purge obsolete hashed asset bundles.
- **Dev Server**: Hugo dev server runs on `http://localhost:1313/` (`-D --disableFastRender`).
- **Interactive Verification**: Validate all interactive components (tabs, copy buttons, race runner, mobile drawer) across desktop and mobile viewports.
