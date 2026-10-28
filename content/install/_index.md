---
title: "Install EarthBuild"
description: "Step-by-step instructions for installing EarthBuild CLI via Homebrew, cURL script, manual binary, Windows (WSL 2), Nix, and GitHub Actions."
---

Get EarthBuild running on your machine in under a minute.

---

## 📋 Prerequisites

EarthBuild supports **Podman**, **Docker**, and **Apple container engines** out-of-the-box by default:

- **macOS:** Apple container engines, [Docker Desktop](https://docs.docker.com/desktop/mac/install/), or [Podman](https://podman.io/)
- **Linux:** [Podman](https://podman.io/), [Docker Engine](https://docs.docker.com/engine/install/), or Rootless Docker
- **Windows:** [Docker Desktop](https://docs.docker.com/desktop/windows/install/) or [Podman Desktop](https://podman-desktop.io/) with WSL 2

---

## 🍺 Homebrew (macOS & Linux)

The easiest way to install and keep EarthBuild updated on macOS and Linux:

```bash
brew install earthbuild/tap/earth
```

---

## 🐚 Shell Script (Linux, macOS, WSL 2)

Install the latest release automatically with our official install script:

```bash
curl -fsSL https://www.earthbuild.dev/install.sh | sh
```

---

## 📦 Manual Binary Download

Download and install pre-compiled binaries directly from GitHub Releases:

```bash
# Set your architecture (e.g., amd64, arm64)
ARCH=amd64

# Download the latest Linux release
curl -LO "https://github.com/earthbuild/earthbuild/releases/latest/download/earth-linux-${ARCH}"

# Make it executable and place in PATH
chmod +x "earth-linux-${ARCH}"
sudo mv "earth-linux-${ARCH}" /usr/local/bin/earth
```

For macOS Darwin binaries, replace `earth-linux-${ARCH}` with `earth-darwin-arm64` (Apple Silicon) or `earth-darwin-amd64` (Intel).

---

## 🪟 Windows (WSL 2)

Inside your WSL 2 Ubuntu / Debian terminal:

```bash
curl -fsSL https://www.earthbuild.dev/install.sh | sh
```

> **Note:** Native Windows support is experimental. We recommend using WSL 2 for container isolation, BuildKit caching, and performance parity with Linux.

---

## ❄️ Nix & NixOS

EarthBuild is packaged in `nixpkgs`:

### Temporary Shell:
```bash
nix-shell -p earthbuild
```

### NixOS (`configuration.nix`):
```nix
environment.systemPackages = [ pkgs.earthbuild ];
```

### nix-darwin:
```nix
environment.systemPackages = [ pkgs.earthbuild ];
```

### Home Manager (`home.nix`):
```nix
home.packages = [ pkgs.earthbuild ];
```

---

## 🐳 Docker Container

Run EarthBuild directly inside Docker without installing the host binary:

```bash
docker run --privileged --rm \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v $(pwd):/workspace \
  -w /workspace \
  earthbuild/earthbuild:latest +build
```

---

## ⚡ GitHub Actions CI/CD

Integrate EarthBuild into your GitHub Actions pipelines with official caching and setup:

```yaml
name: CI
on: [push, pull_request]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Setup EarthBuild
        uses: earthbuild/actions-setup@v2
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}

      - name: Execute Pipeline
        run: earth --ci +all
```

---

## ✅ Verification & Setup

Verify that the CLI is installed and check the version:
```bash
earth --version
```

Initialize the BuildKit daemon container (first-time bootstrap):
```bash
earth bootstrap
```

### Next Steps
- [Getting Started Guide](https://docs.earthbuild.dev/basics)
- [Earthfile Reference](https://docs.earthbuild.dev/docs/earthfile)
- [Example Projects](https://docs.earthbuild.dev/docs/examples)
