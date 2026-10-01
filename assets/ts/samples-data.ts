import { CodeSamplesMap } from './types';

export const codeSamples: CodeSamplesMap = {
  go: {
    filename: 'examples/go/Earthfile',
    repoUrl: 'https://github.com/earthbuild/earthbuild/tree/main/examples/go',
    metrics: {
      cachedTime: '1.1s',
      editTime: '1.8s',
      coldTime: '6.2s',
      editSpeedup: '3.4x Faster',
      speedup: '5.6x Faster',
      saved: '82% Saved (5.1s)',
      ciSaved: '82% Fewer Runner Mins',
      co2Saved: '~1.4g CO₂e / build',
    },
    code: `<span class="kw-cmd">VERSION</span> <span class="kw-val">0.8</span>
<span class="kw-cmd">FROM</span> <span class="kw-string">golang:1.27-alpine3.24</span>
<span class="kw-cmd">WORKDIR</span> <span class="kw-string">/go-example</span>

<span class="kw-comment"># deps caches vendor dependencies independently</span>
<span class="kw-target">deps</span>:
  <span class="kw-cmd">COPY</span> go.mod go.sum ./
  <span class="kw-cmd">RUN</span> go mod download
  <span class="kw-cmd">SAVE ARTIFACT</span> go.mod <span class="kw-flag">AS LOCAL</span> go.mod
  <span class="kw-cmd">SAVE ARTIFACT</span> go.sum <span class="kw-flag">AS LOCAL</span> go.sum

<span class="kw-comment"># build compiles standalone Go binary with instant layer cache</span>
<span class="kw-target">build</span>:
  <span class="kw-cmd">FROM</span> <span class="kw-target">+deps</span>
  <span class="kw-cmd">COPY</span> main.go .
  <span class="kw-cmd">RUN</span> go build <span class="kw-flag">-o</span> build/go-example main.go
  <span class="kw-cmd">SAVE ARTIFACT</span> build/go-example /go-example <span class="kw-flag">AS LOCAL</span> build/go-example`,
    cached: [
      { text: '$ earth +build', class: 'term-cmd', delay: 80 },
      {
        text: '─── Init 🚀 Found buildkit daemon as podman container (earth-buildkitd)',
        class: 'term-dim',
        delay: 180,
      },
      { text: '─── Build 🔧', class: 'term-bold', delay: 260 },
      {
        text: '   +base | *cached* --> FROM golang:1.27-alpine3.24',
        class: 'term-cached',
        delay: 360,
      },
      { text: '   +base | *cached* --> WORKDIR /go-example', class: 'term-cached', delay: 460 },
      { text: '   +deps | *cached* --> COPY go.mod go.sum ./', class: 'term-cached', delay: 560 },
      { text: '   +deps | *cached* --> RUN go mod download', class: 'term-cached', delay: 660 },
      { text: '  +build | *cached* --> COPY main.go .', class: 'term-cached', delay: 760 },
      {
        text: '  +build | *cached* --> RUN go build -o build/go-example main.go',
        class: 'term-cached',
        delay: 860,
      },
      {
        text: '  +build | *cached* --> SAVE ARTIFACT build/go-example AS LOCAL build/go-example',
        class: 'term-cached',
        delay: 960,
      },
      {
        text: '  output | [----------] 100% exporting outputs',
        class: 'terminal-line',
        delay: 1020,
      },
      {
        text: '🎁 Artifact +build/go-example output as build/go-example',
        class: 'term-running',
        delay: 1060,
      },
      {
        text: '============= 🌍 Earth Build  ✅ SUCCESS [1.1s] =============',
        class: 'term-success',
        delay: 1100,
      },
    ],
    edit: [
      { text: '$ earth +build', class: 'term-cmd', delay: 80 },
      {
        text: '─── Init 🚀 Found buildkit daemon as podman container (earth-buildkitd)',
        class: 'term-dim',
        delay: 180,
      },
      { text: '─── Build 🔧', class: 'term-bold', delay: 260 },
      {
        text: '   +base | *cached* --> FROM golang:1.27-alpine3.24',
        class: 'term-cached',
        delay: 360,
      },
      { text: '   +base | *cached* --> WORKDIR /go-example', class: 'term-cached', delay: 460 },
      { text: '   +deps | *cached* --> COPY go.mod go.sum ./', class: 'term-cached', delay: 560 },
      { text: '   +deps | *cached* --> RUN go mod download', class: 'term-cached', delay: 660 },
      { text: '  +build | --> COPY main.go .', class: 'terminal-line', delay: 900 },
      {
        text: '  +build | --> RUN go build -o build/go-example main.go',
        class: 'term-yellow',
        delay: 1300,
      },
      {
        text: '  +build | --> SAVE ARTIFACT build/go-example AS LOCAL build/go-example',
        class: 'terminal-line',
        delay: 1550,
      },
      {
        text: '  output | [----------] 100% exporting outputs',
        class: 'terminal-line',
        delay: 1650,
      },
      {
        text: '🎁 Artifact +build/go-example output as build/go-example',
        class: 'term-running',
        delay: 1720,
      },
      {
        text: '============= 🌍 Earth Build  ✅ SUCCESS [1.8s] =============',
        class: 'term-success',
        delay: 1800,
      },
    ],
    cold: [
      { text: '$ earth +build', class: 'term-cmd', delay: 80 },
      {
        text: '─── Init 🚀 Found buildkit daemon as podman container (earth-buildkitd)',
        class: 'term-dim',
        delay: 250,
      },
      { text: '─── Build 🔧', class: 'term-bold', delay: 450 },
      { text: '   +base | --> FROM golang:1.27-alpine3.24', class: 'terminal-line', delay: 900 },
      { text: '   +base | --> WORKDIR /go-example', class: 'terminal-line', delay: 1400 },
      { text: '   +deps | --> COPY go.mod go.sum ./', class: 'terminal-line', delay: 1900 },
      { text: '   +deps | --> RUN go mod download', class: 'term-yellow', delay: 2700 },
      { text: '  +build | --> COPY main.go .', class: 'terminal-line', delay: 3800 },
      {
        text: '  +build | --> RUN go build -o build/go-example main.go',
        class: 'term-yellow',
        delay: 4900,
      },
      {
        text: '  +build | --> SAVE ARTIFACT build/go-example AS LOCAL build/go-example',
        class: 'terminal-line',
        delay: 5600,
      },
      {
        text: '  output | [----------] 100% exporting outputs',
        class: 'terminal-line',
        delay: 5900,
      },
      {
        text: '🎁 Artifact +build/go-example output as build/go-example',
        class: 'term-running',
        delay: 6050,
      },
      {
        text: '============= 🌍 Earth Build  ✅ SUCCESS [6.2s] =============',
        class: 'term-success',
        delay: 6200,
      },
    ],
  },
  cpp: {
    filename: 'examples/cpp/Earthfile',
    repoUrl: 'https://github.com/earthbuild/earthbuild/tree/main/examples/cpp',
    metrics: {
      cachedTime: '0.9s',
      editTime: '2.6s',
      coldTime: '22.8s',
      editSpeedup: '8.8x Faster',
      speedup: '25.3x Faster',
      saved: '96% Saved (21.9s)',
      ciSaved: '96% Fewer Runner Mins',
      co2Saved: '~5.5g CO₂e / build',
    },
    code: `<span class="kw-cmd">VERSION</span> <span class="kw-val">0.8</span>
<span class="kw-cmd">FROM</span> <span class="kw-string">ubuntu:26.04</span>
<span class="kw-cmd">RUN</span> apt-get update && apt-get install <span class="kw-flag">-y</span> build-essential cmake
<span class="kw-cmd">WORKDIR</span> <span class="kw-string">/code</span>

<span class="kw-comment"># code copies C++ source tree</span>
<span class="kw-target">code</span>:
  <span class="kw-cmd">COPY</span> src src

<span class="kw-comment"># build compiles with CMake & persistent compiler cache mount</span>
<span class="kw-target">build</span>:
  <span class="kw-cmd">FROM</span> <span class="kw-target">+code</span>
  <span class="kw-cmd">COPY</span> CMakeLists.txt .
  <span class="kw-cmd">RUN</span> <span class="kw-flag">--mount=type=cache,target=/root/.cache/ccache</span> cmake -B build -S . && cmake --build build
  <span class="kw-cmd">SAVE ARTIFACT</span> build/app <span class="kw-flag">AS LOCAL</span> build/app`,
    cached: [
      { text: '$ earth +build', class: 'term-cmd', delay: 80 },
      {
        text: '─── Init 🚀 Found buildkit daemon as podman container (earth-buildkitd)',
        class: 'term-dim',
        delay: 150,
      },
      { text: '─── Build 🔧', class: 'term-bold', delay: 220 },
      { text: '   +base | *cached* --> FROM ubuntu:26.04', class: 'term-cached', delay: 300 },
      {
        text: '   +base | *cached* --> RUN apt-get update && apt-get install -y build-essential cmake',
        class: 'term-cached',
        delay: 400,
      },
      { text: '   +code | *cached* --> COPY src src', class: 'term-cached', delay: 490 },
      { text: '  +build | *cached* --> COPY CMakeLists.txt .', class: 'term-cached', delay: 580 },
      {
        text: '  +build | *cached* --> RUN --mount=type=cache,target=/root/.cache/ccache cmake -B build -S . && cmake --build build',
        class: 'term-cached',
        delay: 680,
      },
      {
        text: '  +build | *cached* --> SAVE ARTIFACT build/app AS LOCAL build/app',
        class: 'term-cached',
        delay: 780,
      },
      {
        text: '  output | [----------] 100% exporting outputs',
        class: 'terminal-line',
        delay: 830,
      },
      { text: '🎁 Artifact +build/app output as build/app', class: 'term-running', delay: 870 },
      {
        text: '============= 🌍 Earth Build  ✅ SUCCESS [0.9s] =============',
        class: 'term-success',
        delay: 900,
      },
    ],
    edit: [
      { text: '$ earth +build', class: 'term-cmd', delay: 80 },
      {
        text: '─── Init 🚀 Found buildkit daemon as podman container (earth-buildkitd)',
        class: 'term-dim',
        delay: 180,
      },
      { text: '─── Build 🔧', class: 'term-bold', delay: 260 },
      { text: '   +base | *cached* --> FROM ubuntu:26.04', class: 'term-cached', delay: 360 },
      {
        text: '   +base | *cached* --> RUN apt-get update && apt-get install -y build-essential cmake',
        class: 'term-cached',
        delay: 460,
      },
      { text: '   +code | --> COPY src src', class: 'term-yellow', delay: 750 },
      { text: '  +build | *cached* --> COPY CMakeLists.txt .', class: 'term-cached', delay: 950 },
      {
        text: '  +build | --> RUN --mount=type=cache,target=/root/.cache/ccache cmake -B build -S . && cmake --build build',
        class: 'term-yellow',
        delay: 1800,
      },
      {
        text: '  +build | [100%] Linking CXX executable build/app',
        class: 'terminal-line',
        delay: 2200,
      },
      {
        text: '  +build | --> SAVE ARTIFACT build/app AS LOCAL build/app',
        class: 'terminal-line',
        delay: 2400,
      },
      {
        text: '============= 🌍 Earth Build  ✅ SUCCESS [2.6s] =============',
        class: 'term-success',
        delay: 2600,
      },
    ],
    cold: [
      { text: '$ earth +build', class: 'term-cmd', delay: 80 },
      {
        text: '─── Init 🚀 Found buildkit daemon as podman container (earth-buildkitd)',
        class: 'term-dim',
        delay: 300,
      },
      { text: '─── Build 🔧', class: 'term-bold', delay: 600 },
      { text: '   +base | --> FROM ubuntu:26.04', class: 'terminal-line', delay: 1500 },
      {
        text: '   +base | --> RUN apt-get update && apt-get install -y build-essential cmake',
        class: 'term-yellow',
        delay: 6500,
      },
      { text: '   +code | --> COPY src src', class: 'terminal-line', delay: 10500 },
      { text: '  +build | --> COPY CMakeLists.txt .', class: 'terminal-line', delay: 12000 },
      {
        text: '  +build | --> RUN --mount=type=cache,target=/root/.cache/ccache cmake -B build -S . && cmake --build build',
        class: 'terminal-line',
        delay: 14000,
      },
      {
        text: '  +build | [ 33%] Building CXX object CMakeFiles/app.dir/main.cpp.o',
        class: 'terminal-line',
        delay: 17000,
      },
      {
        text: '  +build | [ 66%] Building CXX object CMakeFiles/app.dir/util.cpp.o',
        class: 'terminal-line',
        delay: 19000,
      },
      {
        text: '  +build | [100%] Linking CXX executable build/app',
        class: 'terminal-line',
        delay: 21000,
      },
      {
        text: '  +build | --> SAVE ARTIFACT build/app AS LOCAL build/app',
        class: 'terminal-line',
        delay: 22200,
      },
      {
        text: '============= 🌍 Earth Build  ✅ SUCCESS [22.8s] =============',
        class: 'term-success',
        delay: 22800,
      },
    ],
  },
  python: {
    filename: 'examples/python/Earthfile',
    repoUrl: 'https://github.com/earthbuild/earthbuild/tree/main/examples/python',
    metrics: {
      cachedTime: '0.8s',
      editTime: '1.8s',
      coldTime: '14.5s',
      editSpeedup: '8.1x Faster',
      speedup: '18.1x Faster',
      saved: '94% Saved (13.7s)',
      ciSaved: '94% Fewer Runner Mins',
      co2Saved: '~3.5g CO₂e / build',
    },
    code: `<span class="kw-cmd">VERSION</span> <span class="kw-val">0.8</span>
<span class="kw-cmd">FROM</span> <span class="kw-string">python:3.14-slim</span>
<span class="kw-cmd">WORKDIR</span> <span class="kw-string">/app</span>

<span class="kw-comment"># deps caches pip dependencies in isolated container layer</span>
<span class="kw-target">deps</span>:
  <span class="kw-cmd">COPY</span> requirements.txt .
  <span class="kw-cmd">RUN</span> <span class="kw-flag">--mount=type=cache,target=/root/.cache/pip</span> pip install <span class="kw-flag">-r</span> requirements.txt

<span class="kw-comment"># test runs unit tests inside isolated container</span>
<span class="kw-target">test</span>:
  <span class="kw-cmd">FROM</span> <span class="kw-target">+deps</span>
  <span class="kw-cmd">COPY</span> src src
  <span class="kw-cmd">RUN</span> pytest src/`,
    cached: [
      { text: '$ earth +test', class: 'term-cmd', delay: 80 },
      {
        text: '─── Init 🚀 Found buildkit daemon as podman container (earth-buildkitd)',
        class: 'term-dim',
        delay: 150,
      },
      { text: '─── Build 🔧', class: 'term-bold', delay: 220 },
      { text: '   +deps | *cached* --> FROM python:3.14-slim', class: 'term-cached', delay: 300 },
      { text: '   +deps | *cached* --> WORKDIR /app', class: 'term-cached', delay: 390 },
      { text: '   +deps | *cached* --> COPY requirements.txt .', class: 'term-cached', delay: 480 },
      {
        text: '   +deps | *cached* --> RUN --mount=type=cache,target=/root/.cache/pip pip install -r requirements.txt',
        class: 'term-cached',
        delay: 580,
      },
      { text: '   +test | *cached* --> COPY src src', class: 'term-cached', delay: 680 },
      { text: '   +test | *cached* --> RUN pytest src/', class: 'term-cached', delay: 750 },
      {
        text: '============= 🌍 Earth Build  ✅ SUCCESS [0.8s] =============',
        class: 'term-success',
        delay: 800,
      },
    ],
    edit: [
      { text: '$ earth +test', class: 'term-cmd', delay: 80 },
      {
        text: '─── Init 🚀 Found buildkit daemon as podman container (earth-buildkitd)',
        class: 'term-dim',
        delay: 180,
      },
      { text: '─── Build 🔧', class: 'term-bold', delay: 260 },
      { text: '   +deps | *cached* --> FROM python:3.14-slim', class: 'term-cached', delay: 360 },
      { text: '   +deps | *cached* --> WORKDIR /app', class: 'term-cached', delay: 460 },
      { text: '   +deps | *cached* --> COPY requirements.txt .', class: 'term-cached', delay: 560 },
      {
        text: '   +deps | *cached* --> RUN --mount=type=cache,target=/root/.cache/pip pip install -r requirements.txt',
        class: 'term-cached',
        delay: 660,
      },
      { text: '   +test | --> COPY src src', class: 'term-yellow', delay: 850 },
      { text: '   +test | --> RUN pytest src/', class: 'term-yellow', delay: 1400 },
      {
        text: '   +test | ================= 14 passed in 0.23s =================',
        class: 'terminal-line',
        delay: 1650,
      },
      {
        text: '============= 🌍 Earth Build  ✅ SUCCESS [1.8s] =============',
        class: 'term-success',
        delay: 1800,
      },
    ],
    cold: [
      { text: '$ earth +test', class: 'term-cmd', delay: 80 },
      {
        text: '─── Init 🚀 Found buildkit daemon as podman container (earth-buildkitd)',
        class: 'term-dim',
        delay: 300,
      },
      { text: '─── Build 🔧', class: 'term-bold', delay: 600 },
      { text: '   +deps | --> FROM python:3.14-slim', class: 'terminal-line', delay: 1800 },
      { text: '   +deps | --> WORKDIR /app', class: 'terminal-line', delay: 3000 },
      { text: '   +deps | --> COPY requirements.txt .', class: 'terminal-line', delay: 4500 },
      {
        text: '   +deps | --> RUN --mount=type=cache,target=/root/.cache/pip pip install -r requirements.txt',
        class: 'term-yellow',
        delay: 7500,
      },
      { text: '   +test | --> COPY src src', class: 'terminal-line', delay: 11000 },
      { text: '   +test | --> RUN pytest src/', class: 'term-yellow', delay: 13200 },
      {
        text: '   +test | ================= 14 passed in 0.45s =================',
        class: 'terminal-line',
        delay: 14000,
      },
      {
        text: '============= 🌍 Earth Build  ✅ SUCCESS [14.5s] =============',
        class: 'term-success',
        delay: 14500,
      },
    ],
  },
  rust: {
    filename: 'examples/rust/Earthfile',
    repoUrl: 'https://github.com/earthbuild/earthbuild/tree/main/examples/rust',
    metrics: {
      cachedTime: '1.4s',
      editTime: '4.2s',
      coldTime: '38.4s',
      editSpeedup: '9.1x Faster',
      speedup: '27.4x Faster',
      saved: '96% Saved (37.0s)',
      ciSaved: '96% Fewer Runner Mins',
      co2Saved: '~9.2g CO₂e / build',
    },
    code: `<span class="kw-cmd">VERSION</span> <span class="kw-val">0.8</span>
<span class="kw-cmd">FROM</span> <span class="kw-string">rust:1.85-alpine</span>
<span class="kw-cmd">WORKDIR</span> <span class="kw-string">/rust-app</span>

<span class="kw-comment"># deps pre-warms cargo registry & dependency build cache</span>
<span class="kw-target">deps</span>:
  <span class="kw-cmd">COPY</span> Cargo.toml Cargo.lock ./
  <span class="kw-cmd">RUN</span> mkdir src && echo "fn main() {}" > src/main.rs
  <span class="kw-cmd">RUN</span> cargo build <span class="kw-flag">--release</span>

<span class="kw-comment"># build compiles release binary using persistent sccache mount</span>
<span class="kw-target">build</span>:
  <span class="kw-cmd">FROM</span> <span class="kw-target">+deps</span>
  <span class="kw-cmd">COPY</span> src src
  <span class="kw-cmd">RUN</span> <span class="kw-flag">--mount=type=cache,target=/usr/local/cargo/registry</span> cargo build <span class="kw-flag">--release</span>
  <span class="kw-cmd">SAVE ARTIFACT</span> target/release/app <span class="kw-flag">AS LOCAL</span> bin/app`,
    cached: [
      { text: '$ earth +build', class: 'term-cmd', delay: 80 },
      {
        text: '─── Init 🚀 Found buildkit daemon as podman container (earth-buildkitd)',
        class: 'term-dim',
        delay: 180,
      },
      { text: '─── Build 🔧', class: 'term-bold', delay: 260 },
      { text: '   +base | *cached* --> FROM rust:1.85-alpine', class: 'term-cached', delay: 380 },
      { text: '   +base | *cached* --> WORKDIR /rust-app', class: 'term-cached', delay: 460 },
      {
        text: '   +deps | *cached* --> COPY Cargo.toml Cargo.lock ./',
        class: 'term-cached',
        delay: 560,
      },
      {
        text: '   +deps | *cached* --> RUN cargo build --release',
        class: 'term-cached',
        delay: 680,
      },
      { text: '  +build | *cached* --> COPY src src', class: 'term-cached', delay: 780 },
      {
        text: '  +build | *cached* --> RUN --mount=type=cache,target=/usr/local/cargo/registry cargo build --release',
        class: 'term-cached',
        delay: 900,
      },
      {
        text: '  +build | *cached* --> SAVE ARTIFACT target/release/app AS LOCAL bin/app',
        class: 'term-cached',
        delay: 1050,
      },
      {
        text: '  output | [----------] 100% exporting outputs',
        class: 'terminal-line',
        delay: 1180,
      },
      { text: '🎁 Artifact +build/app output as bin/app', class: 'term-running', delay: 1280 },
      {
        text: '============= 🌍 Earth Build  ✅ SUCCESS [1.4s] =============',
        class: 'term-success',
        delay: 1400,
      },
    ],
    edit: [
      { text: '$ earth +build', class: 'term-cmd', delay: 80 },
      {
        text: '─── Init 🚀 Found buildkit daemon as podman container (earth-buildkitd)',
        class: 'term-dim',
        delay: 180,
      },
      { text: '─── Build 🔧', class: 'term-bold', delay: 260 },
      { text: '   +base | *cached* --> FROM rust:1.85-alpine', class: 'term-cached', delay: 380 },
      { text: '   +base | *cached* --> WORKDIR /rust-app', class: 'term-cached', delay: 460 },
      {
        text: '   +deps | *cached* --> COPY Cargo.toml Cargo.lock ./',
        class: 'term-cached',
        delay: 560,
      },
      {
        text: '   +deps | *cached* --> RUN cargo build --release',
        class: 'term-cached',
        delay: 680,
      },
      { text: '  +build | --> COPY src src', class: 'term-yellow', delay: 1100 },
      {
        text: '  +build | --> RUN --mount=type=cache,target=/usr/local/cargo/registry cargo build --release',
        class: 'term-yellow',
        delay: 2400,
      },
      {
        text: '  +build |    Compiling app v0.1.0 (/rust-app)',
        class: 'terminal-line',
        delay: 3500,
      },
      {
        text: '  +build | --> SAVE ARTIFACT target/release/app AS LOCAL bin/app',
        class: 'terminal-line',
        delay: 3950,
      },
      {
        text: '============= 🌍 Earth Build  ✅ SUCCESS [4.2s] =============',
        class: 'term-success',
        delay: 4200,
      },
    ],
    cold: [
      { text: '$ earth +build', class: 'term-cmd', delay: 80 },
      {
        text: '─── Init 🚀 Found buildkit daemon as podman container (earth-buildkitd)',
        class: 'term-dim',
        delay: 300,
      },
      { text: '─── Build 🔧', class: 'term-bold', delay: 600 },
      { text: '   +base | --> FROM rust:1.85-alpine', class: 'terminal-line', delay: 1500 },
      { text: '   +base | --> WORKDIR /rust-app', class: 'terminal-line', delay: 3000 },
      { text: '   +deps | --> COPY Cargo.toml Cargo.lock ./', class: 'terminal-line', delay: 4500 },
      { text: '   +deps | --> RUN cargo build --release', class: 'term-yellow', delay: 8500 },
      { text: '   +deps |    Updating crates.io index', class: 'terminal-line', delay: 14000 },
      { text: '   +deps |    Compiling 58 dependencies', class: 'terminal-line', delay: 22000 },
      { text: '  +build | --> COPY src src', class: 'terminal-line', delay: 27000 },
      {
        text: '  +build | --> RUN --mount=type=cache,target=/usr/local/cargo/registry cargo build --release',
        class: 'term-yellow',
        delay: 32000,
      },
      {
        text: '  +build |    Compiling app v0.1.0 (/rust-app)',
        class: 'terminal-line',
        delay: 35500,
      },
      {
        text: '  +build | --> SAVE ARTIFACT target/release/app AS LOCAL bin/app',
        class: 'terminal-line',
        delay: 37500,
      },
      {
        text: '============= 🌍 Earth Build  ✅ SUCCESS [38.4s] =============',
        class: 'term-success',
        delay: 38400,
      },
    ],
  },
  zig: {
    filename: 'examples/zig/Earthfile',
    repoUrl: 'https://github.com/earthbuild/earthbuild/tree/main/examples/zig',
    metrics: {
      cachedTime: '0.7s',
      editTime: '1.6s',
      coldTime: '8.6s',
      editSpeedup: '5.4x Faster',
      speedup: '12.3x Faster',
      saved: '92% Saved (7.9s)',
      ciSaved: '92% Fewer Runner Mins',
      co2Saved: '~2.0g CO₂e / build',
    },
    code: `<span class="kw-cmd">VERSION</span> <span class="kw-val">0.8</span>
<span class="kw-cmd">FROM</span> <span class="kw-string">alpine:3.24</span>
<span class="kw-cmd">WORKDIR</span> <span class="kw-string">/zig-app</span>

<span class="kw-comment"># toolchain downloads Zig compiler toolchain</span>
<span class="kw-target">toolchain</span>:
  <span class="kw-cmd">RUN</span> apk add --no-cache curl tar xz
  <span class="kw-cmd">RUN</span> curl -LO https://ziglang.org/download/0.14.0/zig-linux-aarch64-0.14.0.tar.xz && \\
      tar -xf zig-linux-aarch64-0.14.0.tar.xz && mv zig-linux-aarch64-0.14.0 /opt/zig
  <span class="kw-cmd">ENV</span> PATH="/opt/zig:\${PATH}"

<span class="kw-comment"># build compiles optimized ReleaseFast binary</span>
<span class="kw-target">build</span>:
  <span class="kw-cmd">FROM</span> <span class="kw-target">+toolchain</span>
  <span class="kw-cmd">COPY</span> build.zig src ./
  <span class="kw-cmd">RUN</span> <span class="kw-flag">--mount=type=cache,target=/root/.cache/zig</span> zig build -Doptimize=ReleaseFast
  <span class="kw-cmd">SAVE ARTIFACT</span> zig-out/bin/main <span class="kw-flag">AS LOCAL</span> bin/zig-app`,
    cached: [
      { text: '$ earth +build', class: 'term-cmd', delay: 80 },
      {
        text: '─── Init 🚀 Found buildkit daemon as podman container (earth-buildkitd)',
        class: 'term-dim',
        delay: 150,
      },
      { text: '─── Build 🔧', class: 'term-bold', delay: 220 },
      { text: '   +toolchain | *cached* --> FROM alpine:3.24', class: 'term-cached', delay: 300 },
      {
        text: '   +toolchain | *cached* --> RUN apk add --no-cache curl tar xz',
        class: 'term-cached',
        delay: 380,
      },
      {
        text: '   +toolchain | *cached* --> RUN curl -LO https://ziglang.org/download/0.14.0/zig-linux-aarch64-0.14.0.tar.xz',
        class: 'term-cached',
        delay: 460,
      },
      {
        text: '        +build | *cached* --> COPY build.zig src ./',
        class: 'term-cached',
        delay: 520,
      },
      {
        text: '        +build | *cached* --> RUN --mount=type=cache,target=/root/.cache/zig zig build -Doptimize=ReleaseFast',
        class: 'term-cached',
        delay: 580,
      },
      {
        text: '        +build | *cached* --> SAVE ARTIFACT zig-out/bin/main AS LOCAL bin/zig-app',
        class: 'term-cached',
        delay: 640,
      },
      {
        text: '        output | [----------] 100% exporting outputs',
        class: 'terminal-line',
        delay: 670,
      },
      { text: '🎁 Artifact +build/main output as bin/zig-app', class: 'term-running', delay: 685 },
      {
        text: '============= 🌍 Earth Build  ✅ SUCCESS [0.7s] =============',
        class: 'term-success',
        delay: 700,
      },
    ],
    edit: [
      { text: '$ earth +build', class: 'term-cmd', delay: 80 },
      {
        text: '─── Init 🚀 Found buildkit daemon as podman container (earth-buildkitd)',
        class: 'term-dim',
        delay: 180,
      },
      { text: '─── Build 🔧', class: 'term-bold', delay: 260 },
      { text: '   +toolchain | *cached* --> FROM alpine:3.24', class: 'term-cached', delay: 380 },
      {
        text: '   +toolchain | *cached* --> RUN apk add --no-cache curl tar xz',
        class: 'term-cached',
        delay: 460,
      },
      {
        text: '   +toolchain | *cached* --> RUN curl -LO https://ziglang.org/download/0.14.0/zig-linux-aarch64-0.14.0.tar.xz',
        class: 'term-cached',
        delay: 540,
      },
      { text: '        +build | --> COPY build.zig src ./', class: 'term-yellow', delay: 700 },
      {
        text: '        +build | --> RUN --mount=type=cache,target=/root/.cache/zig zig build -Doptimize=ReleaseFast',
        class: 'term-yellow',
        delay: 1200,
      },
      {
        text: '        +build | --> SAVE ARTIFACT zig-out/bin/main AS LOCAL bin/zig-app',
        class: 'terminal-line',
        delay: 1450,
      },
      {
        text: '============= 🌍 Earth Build  ✅ SUCCESS [1.6s] =============',
        class: 'term-success',
        delay: 1600,
      },
    ],
    cold: [
      { text: '$ earth +build', class: 'term-cmd', delay: 80 },
      {
        text: '─── Init 🚀 Found buildkit daemon as podman container (earth-buildkitd)',
        class: 'term-dim',
        delay: 250,
      },
      { text: '─── Build 🔧', class: 'term-bold', delay: 500 },
      { text: '   +toolchain | --> FROM alpine:3.24', class: 'terminal-line', delay: 1200 },
      {
        text: '   +toolchain | --> RUN apk add --no-cache curl tar xz',
        class: 'terminal-line',
        delay: 2500,
      },
      {
        text: '   +toolchain | --> RUN curl -LO https://ziglang.org/download/0.14.0/zig-linux-aarch64-0.14.0.tar.xz',
        class: 'terminal-line',
        delay: 4500,
      },
      { text: '        +build | --> COPY build.zig src ./', class: 'terminal-line', delay: 5400 },
      {
        text: '        +build | --> RUN --mount=type=cache,target=/root/.cache/zig zig build -Doptimize=ReleaseFast',
        class: 'term-yellow',
        delay: 6900,
      },
      {
        text: '        +build | [1/4] Compiling src/main.zig',
        class: 'terminal-line',
        delay: 7600,
      },
      {
        text: '        +build | [4/4] Linking binary zig-out/bin/main',
        class: 'terminal-line',
        delay: 8100,
      },
      {
        text: '        +build | --> SAVE ARTIFACT zig-out/bin/main AS LOCAL bin/zig-app',
        class: 'terminal-line',
        delay: 8400,
      },
      {
        text: '============= 🌍 Earth Build  ✅ SUCCESS [8.6s] =============',
        class: 'term-success',
        delay: 8600,
      },
    ],
  },
  typescript: {
    filename: 'examples/typescript-node/Earthfile',
    repoUrl: 'https://github.com/earthbuild/earthbuild/tree/main/examples/typescript-node',
    metrics: {
      cachedTime: '1.2s',
      editTime: '2.8s',
      coldTime: '16.2s',
      editSpeedup: '5.8x Faster',
      speedup: '13.5x Faster',
      saved: '93% Saved (15.0s)',
      ciSaved: '93% Fewer Runner Mins',
      co2Saved: '~3.8g CO₂e / build',
    },
    code: `<span class="kw-cmd">VERSION</span> <span class="kw-val">0.8</span>
<span class="kw-cmd">FROM</span> <span class="kw-string">node:26-alpine</span>
<span class="kw-cmd">WORKDIR</span> <span class="kw-string">/ts-app</span>

<span class="kw-comment"># deps caches npm dependencies</span>
<span class="kw-target">deps</span>:
  <span class="kw-cmd">COPY</span> package.json package-lock.json ./
  <span class="kw-cmd">RUN</span> <span class="kw-flag">--mount=type=cache,target=/root/.npm</span> npm ci

<span class="kw-comment"># build typechecks & builds production bundle</span>
<span class="kw-target">build</span>:
  <span class="kw-cmd">FROM</span> <span class="kw-target">+deps</span>
  <span class="kw-cmd">COPY</span> tsconfig.json vite.config.ts src ./
  <span class="kw-cmd">RUN</span> npm run build
  <span class="kw-cmd">SAVE ARTIFACT</span> dist <span class="kw-flag">AS LOCAL</span> dist`,
    cached: [
      { text: '$ earth +build', class: 'term-cmd', delay: 80 },
      {
        text: '─── Init 🚀 Found buildkit daemon as podman container (earth-buildkitd)',
        class: 'term-dim',
        delay: 180,
      },
      { text: '─── Build 🔧', class: 'term-bold', delay: 260 },
      { text: '   +deps | *cached* --> FROM node:26-alpine', class: 'term-cached', delay: 380 },
      { text: '   +deps | *cached* --> WORKDIR /ts-app', class: 'term-cached', delay: 450 },
      {
        text: '   +deps | *cached* --> COPY package.json package-lock.json ./',
        class: 'term-cached',
        delay: 520,
      },
      {
        text: '   +deps | *cached* --> RUN --mount=type=cache,target=/root/.npm npm ci',
        class: 'term-cached',
        delay: 600,
      },
      {
        text: '  +build | *cached* --> COPY tsconfig.json vite.config.ts src ./',
        class: 'term-cached',
        delay: 680,
      },
      { text: '  +build | *cached* --> RUN npm run build', class: 'term-cached', delay: 800 },
      {
        text: '  +build | *cached* --> SAVE ARTIFACT dist AS LOCAL dist',
        class: 'term-cached',
        delay: 950,
      },
      {
        text: '  output | [----------] 100% exporting outputs',
        class: 'terminal-line',
        delay: 1050,
      },
      { text: '🎁 Artifact +build/dist output as dist', class: 'term-running', delay: 1120 },
      {
        text: '============= 🌍 Earth Build  ✅ SUCCESS [1.2s] =============',
        class: 'term-success',
        delay: 1200,
      },
    ],
    edit: [
      { text: '$ earth +build', class: 'term-cmd', delay: 80 },
      {
        text: '─── Init 🚀 Found buildkit daemon as podman container (earth-buildkitd)',
        class: 'term-dim',
        delay: 180,
      },
      { text: '─── Build 🔧', class: 'term-bold', delay: 260 },
      { text: '   +deps | *cached* --> FROM node:26-alpine', class: 'term-cached', delay: 380 },
      { text: '   +deps | *cached* --> WORKDIR /ts-app', class: 'term-cached', delay: 450 },
      {
        text: '   +deps | *cached* --> COPY package.json package-lock.json ./',
        class: 'term-cached',
        delay: 520,
      },
      {
        text: '   +deps | *cached* --> RUN --mount=type=cache,target=/root/.npm npm ci',
        class: 'term-cached',
        delay: 600,
      },
      {
        text: '  +build | --> COPY tsconfig.json vite.config.ts src ./',
        class: 'term-yellow',
        delay: 900,
      },
      { text: '  +build | --> RUN npm run build', class: 'term-yellow', delay: 2000 },
      {
        text: '  +build | --> SAVE ARTIFACT dist AS LOCAL dist',
        class: 'terminal-line',
        delay: 2600,
      },
      {
        text: '============= 🌍 Earth Build  ✅ SUCCESS [2.8s] =============',
        class: 'term-success',
        delay: 2800,
      },
    ],
    cold: [
      { text: '$ earth +build', class: 'term-cmd', delay: 80 },
      {
        text: '─── Init 🚀 Found buildkit daemon as podman container (earth-buildkitd)',
        class: 'term-dim',
        delay: 300,
      },
      { text: '─── Build 🔧', class: 'term-bold', delay: 600 },
      { text: '   +deps | --> FROM node:26-alpine', class: 'terminal-line', delay: 1500 },
      { text: '   +deps | --> WORKDIR /ts-app', class: 'terminal-line', delay: 2500 },
      {
        text: '   +deps | --> COPY package.json package-lock.json ./',
        class: 'terminal-line',
        delay: 3500,
      },
      {
        text: '   +deps | --> RUN --mount=type=cache,target=/root/.npm npm ci',
        class: 'term-yellow',
        delay: 6500,
      },
      { text: '   +deps | added 214 packages in 3.8s', class: 'terminal-line', delay: 7000 },
      {
        text: '  +build | --> COPY tsconfig.json vite.config.ts src ./',
        class: 'terminal-line',
        delay: 8500,
      },
      { text: '  +build | --> RUN npm run build', class: 'term-yellow', delay: 12500 },
      {
        text: '  +build | --> SAVE ARTIFACT dist AS LOCAL dist',
        class: 'terminal-line',
        delay: 15600,
      },
      {
        text: '============= 🌍 Earth Build  ✅ SUCCESS [16.2s] =============',
        class: 'term-success',
        delay: 16200,
      },
    ],
  },
  js: {
    filename: 'examples/js/Earthfile',
    repoUrl: 'https://github.com/earthbuild/earthbuild/tree/main/examples/js',
    metrics: {
      cachedTime: '0.9s',
      editTime: '1.8s',
      coldTime: '11.4s',
      editSpeedup: '6.3x Faster',
      speedup: '12.6x Faster',
      saved: '92% Saved (10.5s)',
      ciSaved: '92% Fewer Runner Mins',
      co2Saved: '~2.6g CO₂e / build',
    },
    code: `<span class="kw-cmd">VERSION</span> <span class="kw-val">0.8</span>
<span class="kw-cmd">FROM</span> <span class="kw-string">node:26-alpine</span>
<span class="kw-cmd">WORKDIR</span> <span class="kw-string">/js-app</span>

<span class="kw-comment"># deps caches npm modules layer</span>
<span class="kw-target">deps</span>:
  <span class="kw-cmd">COPY</span> package.json package-lock.json ./
  <span class="kw-cmd">RUN</span> npm install

<span class="kw-comment"># test runs test suite</span>
<span class="kw-target">test</span>:
  <span class="kw-cmd">FROM</span> <span class="kw-target">+deps</span>
  <span class="kw-cmd">COPY</span> src test ./
  <span class="kw-cmd">RUN</span> npm test`,
    cached: [
      { text: '$ earth +test', class: 'term-cmd', delay: 80 },
      {
        text: '─── Init 🚀 Found buildkit daemon as podman container (earth-buildkitd)',
        class: 'term-dim',
        delay: 160,
      },
      { text: '─── Build 🔧', class: 'term-bold', delay: 240 },
      { text: '   +base | *cached* --> FROM node:26-alpine', class: 'term-cached', delay: 340 },
      { text: '   +base | *cached* --> WORKDIR /js-app', class: 'term-cached', delay: 400 },
      {
        text: '   +deps | *cached* --> COPY package.json package-lock.json ./',
        class: 'term-cached',
        delay: 480,
      },
      { text: '   +deps | *cached* --> RUN npm install', class: 'term-cached', delay: 580 },
      { text: '   +test | *cached* --> COPY src test ./', class: 'term-cached', delay: 700 },
      { text: '   +test | *cached* --> RUN npm test', class: 'term-cached', delay: 820 },
      {
        text: '============= 🌍 Earth Build  ✅ SUCCESS [0.9s] =============',
        class: 'term-success',
        delay: 900,
      },
    ],
    edit: [
      { text: '$ earth +test', class: 'term-cmd', delay: 80 },
      {
        text: '─── Init 🚀 Found buildkit daemon as podman container (earth-buildkitd)',
        class: 'term-dim',
        delay: 180,
      },
      { text: '─── Build 🔧', class: 'term-bold', delay: 260 },
      { text: '   +base | *cached* --> FROM node:26-alpine', class: 'term-cached', delay: 380 },
      { text: '   +base | *cached* --> WORKDIR /js-app', class: 'term-cached', delay: 440 },
      {
        text: '   +deps | *cached* --> COPY package.json package-lock.json ./',
        class: 'term-cached',
        delay: 500,
      },
      { text: '   +deps | *cached* --> RUN npm install', class: 'term-cached', delay: 580 },
      { text: '   +test | --> COPY src test ./', class: 'term-yellow', delay: 850 },
      { text: '   +test | --> RUN npm test', class: 'term-yellow', delay: 1400 },
      { text: '   +test | Tests: 12 passed, 12 total', class: 'terminal-line', delay: 1650 },
      {
        text: '============= 🌍 Earth Build  ✅ SUCCESS [1.8s] =============',
        class: 'term-success',
        delay: 1800,
      },
    ],
    cold: [
      { text: '$ earth +test', class: 'term-cmd', delay: 80 },
      {
        text: '─── Init 🚀 Found buildkit daemon as podman container (earth-buildkitd)',
        class: 'term-dim',
        delay: 300,
      },
      { text: '─── Build 🔧', class: 'term-bold', delay: 600 },
      { text: '   +base | --> FROM node:26-alpine', class: 'terminal-line', delay: 1800 },
      { text: '   +base | --> WORKDIR /js-app', class: 'terminal-line', delay: 3000 },
      {
        text: '   +deps | --> COPY package.json package-lock.json ./',
        class: 'terminal-line',
        delay: 4000,
      },
      { text: '   +deps | --> RUN npm install', class: 'term-yellow', delay: 6500 },
      { text: '   +deps | added 142 packages in 4.6s', class: 'terminal-line', delay: 7200 },
      { text: '   +test | --> COPY src test ./', class: 'terminal-line', delay: 8500 },
      { text: '   +test | --> RUN npm test', class: 'term-yellow', delay: 10500 },
      { text: '   +test | Tests: 12 passed, 12 total', class: 'terminal-line', delay: 11000 },
      {
        text: '============= 🌍 Earth Build  ✅ SUCCESS [11.4s] =============',
        class: 'term-success',
        delay: 11400,
      },
    ],
  },
  java: {
    filename: 'examples/java/Earthfile',
    repoUrl: 'https://github.com/earthbuild/earthbuild/tree/main/examples/java',
    metrics: {
      cachedTime: '1.5s',
      editTime: '3.4s',
      coldTime: '21.8s',
      editSpeedup: '6.4x Faster',
      speedup: '14.5x Faster',
      saved: '93% Saved (20.3s)',
      ciSaved: '93% Fewer Runner Mins',
      co2Saved: '~5.1g CO₂e / build',
    },
    code: `<span class="kw-cmd">VERSION</span> <span class="kw-val">0.8</span>
<span class="kw-cmd">FROM</span> <span class="kw-string">gradle:8.12-jdk23</span>
<span class="kw-cmd">WORKDIR</span> <span class="kw-string">/java-app</span>

<span class="kw-comment"># deps caches Gradle dependencies and daemon</span>
<span class="kw-target">deps</span>:
  <span class="kw-cmd">COPY</span> build.gradle settings.gradle ./
  <span class="kw-cmd">RUN</span> gradle dependencies --no-daemon

<span class="kw-comment"># build compiles & tests multi-module project</span>
<span class="kw-target">build</span>:
  <span class="kw-cmd">FROM</span> <span class="kw-target">+deps</span>
  <span class="kw-cmd">COPY</span> src src
  <span class="kw-cmd">RUN</span> <span class="kw-flag">--mount=type=cache,target=/root/.gradle/caches</span> \\
      gradle assemble test --no-daemon
  <span class="kw-cmd">SAVE ARTIFACT</span> build/libs/*.jar <span class="kw-flag">AS LOCAL</span> build/libs/app.jar`,
    cached: [
      { text: '$ earth +build', class: 'term-cmd', delay: 80 },
      {
        text: '─── Init 🚀 Found buildkit daemon as podman container (earth-buildkitd)',
        class: 'term-dim',
        delay: 180,
      },
      { text: '─── Build 🔧', class: 'term-bold', delay: 260 },
      { text: '   +deps | *cached* --> FROM gradle:8.12-jdk23', class: 'term-cached', delay: 350 },
      { text: '   +deps | *cached* --> WORKDIR /java-app', class: 'term-cached', delay: 420 },
      {
        text: '   +deps | *cached* --> COPY build.gradle settings.gradle ./',
        class: 'term-cached',
        delay: 490,
      },
      {
        text: '   +deps | *cached* --> RUN gradle dependencies --no-daemon',
        class: 'term-cached',
        delay: 560,
      },
      { text: '  +build | *cached* --> COPY src src', class: 'term-cached', delay: 640 },
      {
        text: '  +build | *cached* --> RUN --mount=type=cache,target=/root/.gradle/caches gradle assemble test --no-daemon',
        class: 'term-cached',
        delay: 850,
      },
      {
        text: '  +build | *cached* --> SAVE ARTIFACT build/libs/*.jar AS LOCAL build/libs/app.jar',
        class: 'term-cached',
        delay: 1100,
      },
      {
        text: '  output | [----------] 100% exporting outputs',
        class: 'terminal-line',
        delay: 1250,
      },
      {
        text: '🎁 Artifact +build/libs/app.jar output as build/libs/app.jar',
        class: 'term-running',
        delay: 1380,
      },
      {
        text: '============= 🌍 Earth Build  ✅ SUCCESS [1.5s] =============',
        class: 'term-success',
        delay: 1500,
      },
    ],
    edit: [
      { text: '$ earth +build', class: 'term-cmd', delay: 80 },
      {
        text: '─── Init 🚀 Found buildkit daemon as podman container (earth-buildkitd)',
        class: 'term-dim',
        delay: 180,
      },
      { text: '─── Build 🔧', class: 'term-bold', delay: 260 },
      { text: '   +deps | *cached* --> FROM gradle:8.12-jdk23', class: 'term-cached', delay: 350 },
      { text: '   +deps | *cached* --> WORKDIR /java-app', class: 'term-cached', delay: 420 },
      {
        text: '   +deps | *cached* --> COPY build.gradle settings.gradle ./',
        class: 'term-cached',
        delay: 490,
      },
      {
        text: '   +deps | *cached* --> RUN gradle dependencies --no-daemon',
        class: 'term-cached',
        delay: 560,
      },
      { text: '  +build | --> COPY src src', class: 'term-yellow', delay: 800 },
      {
        text: '  +build | --> RUN --mount=type=cache,target=/root/.gradle/caches gradle assemble test --no-daemon',
        class: 'term-yellow',
        delay: 1500,
      },
      { text: '  +build | > Task :compileJava', class: 'terminal-line', delay: 2200 },
      { text: '  +build | > Task :test', class: 'terminal-line', delay: 2800 },
      {
        text: '  +build | --> SAVE ARTIFACT build/libs/*.jar AS LOCAL build/libs/app.jar',
        class: 'terminal-line',
        delay: 3150,
      },
      {
        text: '============= 🌍 Earth Build  ✅ SUCCESS [3.4s] =============',
        class: 'term-success',
        delay: 3400,
      },
    ],
    cold: [
      { text: '$ earth +build', class: 'term-cmd', delay: 80 },
      {
        text: '─── Init 🚀 Found buildkit daemon as podman container (earth-buildkitd)',
        class: 'term-dim',
        delay: 300,
      },
      { text: '─── Build 🔧', class: 'term-bold', delay: 600 },
      { text: '   +deps | --> FROM gradle:8.12-jdk23', class: 'terminal-line', delay: 1500 },
      { text: '   +deps | --> WORKDIR /java-app', class: 'terminal-line', delay: 2500 },
      {
        text: '   +deps | --> COPY build.gradle settings.gradle ./',
        class: 'terminal-line',
        delay: 3500,
      },
      {
        text: '   +deps | --> RUN gradle dependencies --no-daemon',
        class: 'term-yellow',
        delay: 6500,
      },
      { text: '  +build | --> COPY src src', class: 'terminal-line', delay: 9000 },
      {
        text: '  +build | --> RUN --mount=type=cache,target=/root/.gradle/caches gradle assemble test --no-daemon',
        class: 'terminal-line',
        delay: 12000,
      },
      { text: '  +build | > Task :compileJava', class: 'terminal-line', delay: 15000 },
      { text: '  +build | > Task :test', class: 'terminal-line', delay: 17500 },
      { text: '  +build | > Task :assemble', class: 'terminal-line', delay: 19500 },
      {
        text: '  +build | --> SAVE ARTIFACT build/libs/*.jar AS LOCAL build/libs/app.jar',
        class: 'terminal-line',
        delay: 21000,
      },
      {
        text: '============= 🌍 Earth Build  ✅ SUCCESS [21.8s] =============',
        class: 'term-success',
        delay: 21800,
      },
    ],
  },
};
