(()=>{function ys(){let a=document.getElementById("mobileMenuToggle")||document.querySelector(".mobile-menu-toggle")||document.querySelector(".nav-toggle"),s=document.getElementById("mobileNavDrawer")||document.querySelector(".mobile-nav-drawer")||document.querySelector(".nav-menu"),n=document.querySelector(".navbar")||document.querySelector(".site-nav");a&&s&&(a.addEventListener("click",e=>{e.stopPropagation();let p=s.classList.toggle("open");s.classList.toggle("active",p),a.setAttribute("aria-expanded",p?"true":"false")}),s.querySelectorAll("a").forEach(e=>{e.addEventListener("click",()=>{s.classList.remove("open","active"),a.setAttribute("aria-expanded","false")})}),document.addEventListener("click",e=>{let p=e.target;p&&!s.contains(p)&&!a.contains(p)&&(s.classList.remove("open","active"),a.setAttribute("aria-expanded","false"))}),document.addEventListener("keydown",e=>{e.key==="Escape"&&(s.classList.remove("open","active"),a.setAttribute("aria-expanded","false"))})),window.addEventListener("scroll",()=>{window.scrollY>20?n?.classList.add("scrolled"):n?.classList.remove("scrolled")},{passive:!0})}function bs(){document.querySelectorAll('a[href^="#"]').forEach(a=>{a.addEventListener("click",function(s){let n=this.getAttribute("href");if(!n||n==="#")return;let e=document.querySelector(n);if(e){s.preventDefault();let t=e.getBoundingClientRect().top+window.pageYOffset-80;window.scrollTo({top:t,behavior:"smooth"}),(document.getElementById("mobileNavDrawer")||document.querySelector(".mobile-nav-drawer")||document.querySelector(".nav-menu"))?.classList.remove("open","active")}})})}function Rs(){document.addEventListener("click",async a=>{let s=a.target?.closest?.(".copy-btn");if(!s)return;let n=s.getAttribute("data-clipboard-target"),e=n?document.getElementById(n):null,p=e?e.innerText||e.textContent:s.getAttribute("data-copy-text");if(p)try{await navigator.clipboard.writeText(p.trim());let A=s.innerHTML;s.classList.add("copied"),s.innerHTML=`
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <span>Copied!</span>
        `,setTimeout(()=>{s.innerHTML=A,s.classList.remove("copied")},2e3)}catch(A){console.error("Clipboard copy failed:",A)}})}function Cs(){let a=document.querySelectorAll(".install-tab-btn"),s=document.getElementById("installCodeSnippet"),n={brew:"brew install earthbuild/tap/earth",curl:"curl -fsSL https://www.earthbuild.dev/install.sh | sh",windows:"curl -fsSL https://www.earthbuild.dev/install.sh | sh",nix:"nix-shell -p earthbuild"};a.forEach(e=>{e.addEventListener("click",()=>{a.forEach(A=>A.classList.remove("active")),e.classList.add("active");let p=e.getAttribute("data-install-type");s&&p&&n[p]&&(s.innerText=n[p])})})}var K={go:{filename:"examples/go/Earthfile",repoUrl:"https://github.com/earthbuild/earthbuild/tree/main/examples/go",metrics:{cachedTime:"1.1s",editTime:"1.8s",coldTime:"6.2s",editSpeedup:"3.4x Faster",speedup:"5.6x Faster",saved:"82% Saved (5.1s)",ciSaved:"82% Fewer Runner Mins",co2Saved:"~1.4g CO\u2082e / build"},code:`<span class="kw-cmd">VERSION</span> <span class="kw-val">0.8</span>
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
  <span class="kw-cmd">SAVE ARTIFACT</span> build/go-example /go-example <span class="kw-flag">AS LOCAL</span> build/go-example`,cached:[{text:"$ earth +build",class:"term-cmd",delay:80},{text:"\u2500\u2500\u2500 Init \u{1F680} Found buildkit daemon as podman container (earth-buildkitd)",class:"term-dim",delay:180},{text:"\u2500\u2500\u2500 Build \u{1F527}",class:"term-bold",delay:260},{text:"   +base | *cached* --> FROM golang:1.27-alpine3.24",class:"term-cached",delay:360},{text:"   +base | *cached* --> WORKDIR /go-example",class:"term-cached",delay:460},{text:"   +deps | *cached* --> COPY go.mod go.sum ./",class:"term-cached",delay:560},{text:"   +deps | *cached* --> RUN go mod download",class:"term-cached",delay:660},{text:"  +build | *cached* --> COPY main.go .",class:"term-cached",delay:760},{text:"  +build | *cached* --> RUN go build -o build/go-example main.go",class:"term-cached",delay:860},{text:"  +build | *cached* --> SAVE ARTIFACT build/go-example AS LOCAL build/go-example",class:"term-cached",delay:960},{text:"  output | [----------] 100% exporting outputs",class:"terminal-line",delay:1020},{text:"\u{1F381} Artifact +build/go-example output as build/go-example",class:"term-running",delay:1060},{text:"============= \u{1F30D} Earth Build  \u2705 SUCCESS [1.1s] =============",class:"term-success",delay:1100}],edit:[{text:"$ earth +build",class:"term-cmd",delay:80},{text:"\u2500\u2500\u2500 Init \u{1F680} Found buildkit daemon as podman container (earth-buildkitd)",class:"term-dim",delay:180},{text:"\u2500\u2500\u2500 Build \u{1F527}",class:"term-bold",delay:260},{text:"   +base | *cached* --> FROM golang:1.27-alpine3.24",class:"term-cached",delay:360},{text:"   +base | *cached* --> WORKDIR /go-example",class:"term-cached",delay:460},{text:"   +deps | *cached* --> COPY go.mod go.sum ./",class:"term-cached",delay:560},{text:"   +deps | *cached* --> RUN go mod download",class:"term-cached",delay:660},{text:"  +build | --> COPY main.go .",class:"terminal-line",delay:900},{text:"  +build | --> RUN go build -o build/go-example main.go",class:"term-yellow",delay:1300},{text:"  +build | --> SAVE ARTIFACT build/go-example AS LOCAL build/go-example",class:"terminal-line",delay:1550},{text:"  output | [----------] 100% exporting outputs",class:"terminal-line",delay:1650},{text:"\u{1F381} Artifact +build/go-example output as build/go-example",class:"term-running",delay:1720},{text:"============= \u{1F30D} Earth Build  \u2705 SUCCESS [1.8s] =============",class:"term-success",delay:1800}],cold:[{text:"$ earth +build",class:"term-cmd",delay:80},{text:"\u2500\u2500\u2500 Init \u{1F680} Found buildkit daemon as podman container (earth-buildkitd)",class:"term-dim",delay:250},{text:"\u2500\u2500\u2500 Build \u{1F527}",class:"term-bold",delay:450},{text:"   +base | --> FROM golang:1.27-alpine3.24",class:"terminal-line",delay:900},{text:"   +base | --> WORKDIR /go-example",class:"terminal-line",delay:1400},{text:"   +deps | --> COPY go.mod go.sum ./",class:"terminal-line",delay:1900},{text:"   +deps | --> RUN go mod download",class:"term-yellow",delay:2700},{text:"  +build | --> COPY main.go .",class:"terminal-line",delay:3800},{text:"  +build | --> RUN go build -o build/go-example main.go",class:"term-yellow",delay:4900},{text:"  +build | --> SAVE ARTIFACT build/go-example AS LOCAL build/go-example",class:"terminal-line",delay:5600},{text:"  output | [----------] 100% exporting outputs",class:"terminal-line",delay:5900},{text:"\u{1F381} Artifact +build/go-example output as build/go-example",class:"term-running",delay:6050},{text:"============= \u{1F30D} Earth Build  \u2705 SUCCESS [6.2s] =============",class:"term-success",delay:6200}]},cpp:{filename:"examples/cpp/Earthfile",repoUrl:"https://github.com/earthbuild/earthbuild/tree/main/examples/cpp",metrics:{cachedTime:"0.9s",editTime:"2.6s",coldTime:"22.8s",editSpeedup:"8.8x Faster",speedup:"25.3x Faster",saved:"96% Saved (21.9s)",ciSaved:"96% Fewer Runner Mins",co2Saved:"~5.5g CO\u2082e / build"},code:`<span class="kw-cmd">VERSION</span> <span class="kw-val">0.8</span>
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
  <span class="kw-cmd">SAVE ARTIFACT</span> build/app <span class="kw-flag">AS LOCAL</span> build/app`,cached:[{text:"$ earth +build",class:"term-cmd",delay:80},{text:"\u2500\u2500\u2500 Init \u{1F680} Found buildkit daemon as podman container (earth-buildkitd)",class:"term-dim",delay:150},{text:"\u2500\u2500\u2500 Build \u{1F527}",class:"term-bold",delay:220},{text:"   +base | *cached* --> FROM ubuntu:26.04",class:"term-cached",delay:300},{text:"   +base | *cached* --> RUN apt-get update && apt-get install -y build-essential cmake",class:"term-cached",delay:400},{text:"   +code | *cached* --> COPY src src",class:"term-cached",delay:490},{text:"  +build | *cached* --> COPY CMakeLists.txt .",class:"term-cached",delay:580},{text:"  +build | *cached* --> RUN --mount=type=cache,target=/root/.cache/ccache cmake -B build -S . && cmake --build build",class:"term-cached",delay:680},{text:"  +build | *cached* --> SAVE ARTIFACT build/app AS LOCAL build/app",class:"term-cached",delay:780},{text:"  output | [----------] 100% exporting outputs",class:"terminal-line",delay:830},{text:"\u{1F381} Artifact +build/app output as build/app",class:"term-running",delay:870},{text:"============= \u{1F30D} Earth Build  \u2705 SUCCESS [0.9s] =============",class:"term-success",delay:900}],edit:[{text:"$ earth +build",class:"term-cmd",delay:80},{text:"\u2500\u2500\u2500 Init \u{1F680} Found buildkit daemon as podman container (earth-buildkitd)",class:"term-dim",delay:180},{text:"\u2500\u2500\u2500 Build \u{1F527}",class:"term-bold",delay:260},{text:"   +base | *cached* --> FROM ubuntu:26.04",class:"term-cached",delay:360},{text:"   +base | *cached* --> RUN apt-get update && apt-get install -y build-essential cmake",class:"term-cached",delay:460},{text:"   +code | --> COPY src src",class:"term-yellow",delay:750},{text:"  +build | *cached* --> COPY CMakeLists.txt .",class:"term-cached",delay:950},{text:"  +build | --> RUN --mount=type=cache,target=/root/.cache/ccache cmake -B build -S . && cmake --build build",class:"term-yellow",delay:1800},{text:"  +build | [100%] Linking CXX executable build/app",class:"terminal-line",delay:2200},{text:"  +build | --> SAVE ARTIFACT build/app AS LOCAL build/app",class:"terminal-line",delay:2400},{text:"============= \u{1F30D} Earth Build  \u2705 SUCCESS [2.6s] =============",class:"term-success",delay:2600}],cold:[{text:"$ earth +build",class:"term-cmd",delay:80},{text:"\u2500\u2500\u2500 Init \u{1F680} Found buildkit daemon as podman container (earth-buildkitd)",class:"term-dim",delay:300},{text:"\u2500\u2500\u2500 Build \u{1F527}",class:"term-bold",delay:600},{text:"   +base | --> FROM ubuntu:26.04",class:"terminal-line",delay:1500},{text:"   +base | --> RUN apt-get update && apt-get install -y build-essential cmake",class:"term-yellow",delay:6500},{text:"   +code | --> COPY src src",class:"terminal-line",delay:10500},{text:"  +build | --> COPY CMakeLists.txt .",class:"terminal-line",delay:12e3},{text:"  +build | --> RUN --mount=type=cache,target=/root/.cache/ccache cmake -B build -S . && cmake --build build",class:"terminal-line",delay:14e3},{text:"  +build | [ 33%] Building CXX object CMakeFiles/app.dir/main.cpp.o",class:"terminal-line",delay:17e3},{text:"  +build | [ 66%] Building CXX object CMakeFiles/app.dir/util.cpp.o",class:"terminal-line",delay:19e3},{text:"  +build | [100%] Linking CXX executable build/app",class:"terminal-line",delay:21e3},{text:"  +build | --> SAVE ARTIFACT build/app AS LOCAL build/app",class:"terminal-line",delay:22200},{text:"============= \u{1F30D} Earth Build  \u2705 SUCCESS [22.8s] =============",class:"term-success",delay:22800}]},python:{filename:"examples/python/Earthfile",repoUrl:"https://github.com/earthbuild/earthbuild/tree/main/examples/python",metrics:{cachedTime:"0.8s",editTime:"1.8s",coldTime:"14.5s",editSpeedup:"8.1x Faster",speedup:"18.1x Faster",saved:"94% Saved (13.7s)",ciSaved:"94% Fewer Runner Mins",co2Saved:"~3.5g CO\u2082e / build"},code:`<span class="kw-cmd">VERSION</span> <span class="kw-val">0.8</span>
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
  <span class="kw-cmd">RUN</span> pytest src/`,cached:[{text:"$ earth +test",class:"term-cmd",delay:80},{text:"\u2500\u2500\u2500 Init \u{1F680} Found buildkit daemon as podman container (earth-buildkitd)",class:"term-dim",delay:150},{text:"\u2500\u2500\u2500 Build \u{1F527}",class:"term-bold",delay:220},{text:"   +deps | *cached* --> FROM python:3.14-slim",class:"term-cached",delay:300},{text:"   +deps | *cached* --> WORKDIR /app",class:"term-cached",delay:390},{text:"   +deps | *cached* --> COPY requirements.txt .",class:"term-cached",delay:480},{text:"   +deps | *cached* --> RUN --mount=type=cache,target=/root/.cache/pip pip install -r requirements.txt",class:"term-cached",delay:580},{text:"   +test | *cached* --> COPY src src",class:"term-cached",delay:680},{text:"   +test | *cached* --> RUN pytest src/",class:"term-cached",delay:750},{text:"============= \u{1F30D} Earth Build  \u2705 SUCCESS [0.8s] =============",class:"term-success",delay:800}],edit:[{text:"$ earth +test",class:"term-cmd",delay:80},{text:"\u2500\u2500\u2500 Init \u{1F680} Found buildkit daemon as podman container (earth-buildkitd)",class:"term-dim",delay:180},{text:"\u2500\u2500\u2500 Build \u{1F527}",class:"term-bold",delay:260},{text:"   +deps | *cached* --> FROM python:3.14-slim",class:"term-cached",delay:360},{text:"   +deps | *cached* --> WORKDIR /app",class:"term-cached",delay:460},{text:"   +deps | *cached* --> COPY requirements.txt .",class:"term-cached",delay:560},{text:"   +deps | *cached* --> RUN --mount=type=cache,target=/root/.cache/pip pip install -r requirements.txt",class:"term-cached",delay:660},{text:"   +test | --> COPY src src",class:"term-yellow",delay:850},{text:"   +test | --> RUN pytest src/",class:"term-yellow",delay:1400},{text:"   +test | ================= 14 passed in 0.23s =================",class:"terminal-line",delay:1650},{text:"============= \u{1F30D} Earth Build  \u2705 SUCCESS [1.8s] =============",class:"term-success",delay:1800}],cold:[{text:"$ earth +test",class:"term-cmd",delay:80},{text:"\u2500\u2500\u2500 Init \u{1F680} Found buildkit daemon as podman container (earth-buildkitd)",class:"term-dim",delay:300},{text:"\u2500\u2500\u2500 Build \u{1F527}",class:"term-bold",delay:600},{text:"   +deps | --> FROM python:3.14-slim",class:"terminal-line",delay:1800},{text:"   +deps | --> WORKDIR /app",class:"terminal-line",delay:3e3},{text:"   +deps | --> COPY requirements.txt .",class:"terminal-line",delay:4500},{text:"   +deps | --> RUN --mount=type=cache,target=/root/.cache/pip pip install -r requirements.txt",class:"term-yellow",delay:7500},{text:"   +test | --> COPY src src",class:"terminal-line",delay:11e3},{text:"   +test | --> RUN pytest src/",class:"term-yellow",delay:13200},{text:"   +test | ================= 14 passed in 0.45s =================",class:"terminal-line",delay:14e3},{text:"============= \u{1F30D} Earth Build  \u2705 SUCCESS [14.5s] =============",class:"term-success",delay:14500}]},rust:{filename:"examples/rust/Earthfile",repoUrl:"https://github.com/earthbuild/earthbuild/tree/main/examples/rust",metrics:{cachedTime:"1.4s",editTime:"4.2s",coldTime:"38.4s",editSpeedup:"9.1x Faster",speedup:"27.4x Faster",saved:"96% Saved (37.0s)",ciSaved:"96% Fewer Runner Mins",co2Saved:"~9.2g CO\u2082e / build"},code:`<span class="kw-cmd">VERSION</span> <span class="kw-val">0.8</span>
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
  <span class="kw-cmd">SAVE ARTIFACT</span> target/release/app <span class="kw-flag">AS LOCAL</span> bin/app`,cached:[{text:"$ earth +build",class:"term-cmd",delay:80},{text:"\u2500\u2500\u2500 Init \u{1F680} Found buildkit daemon as podman container (earth-buildkitd)",class:"term-dim",delay:180},{text:"\u2500\u2500\u2500 Build \u{1F527}",class:"term-bold",delay:260},{text:"   +base | *cached* --> FROM rust:1.85-alpine",class:"term-cached",delay:380},{text:"   +base | *cached* --> WORKDIR /rust-app",class:"term-cached",delay:460},{text:"   +deps | *cached* --> COPY Cargo.toml Cargo.lock ./",class:"term-cached",delay:560},{text:"   +deps | *cached* --> RUN cargo build --release",class:"term-cached",delay:680},{text:"  +build | *cached* --> COPY src src",class:"term-cached",delay:780},{text:"  +build | *cached* --> RUN --mount=type=cache,target=/usr/local/cargo/registry cargo build --release",class:"term-cached",delay:900},{text:"  +build | *cached* --> SAVE ARTIFACT target/release/app AS LOCAL bin/app",class:"term-cached",delay:1050},{text:"  output | [----------] 100% exporting outputs",class:"terminal-line",delay:1180},{text:"\u{1F381} Artifact +build/app output as bin/app",class:"term-running",delay:1280},{text:"============= \u{1F30D} Earth Build  \u2705 SUCCESS [1.4s] =============",class:"term-success",delay:1400}],edit:[{text:"$ earth +build",class:"term-cmd",delay:80},{text:"\u2500\u2500\u2500 Init \u{1F680} Found buildkit daemon as podman container (earth-buildkitd)",class:"term-dim",delay:180},{text:"\u2500\u2500\u2500 Build \u{1F527}",class:"term-bold",delay:260},{text:"   +base | *cached* --> FROM rust:1.85-alpine",class:"term-cached",delay:380},{text:"   +base | *cached* --> WORKDIR /rust-app",class:"term-cached",delay:460},{text:"   +deps | *cached* --> COPY Cargo.toml Cargo.lock ./",class:"term-cached",delay:560},{text:"   +deps | *cached* --> RUN cargo build --release",class:"term-cached",delay:680},{text:"  +build | --> COPY src src",class:"term-yellow",delay:1100},{text:"  +build | --> RUN --mount=type=cache,target=/usr/local/cargo/registry cargo build --release",class:"term-yellow",delay:2400},{text:"  +build |    Compiling app v0.1.0 (/rust-app)",class:"terminal-line",delay:3500},{text:"  +build | --> SAVE ARTIFACT target/release/app AS LOCAL bin/app",class:"terminal-line",delay:3950},{text:"============= \u{1F30D} Earth Build  \u2705 SUCCESS [4.2s] =============",class:"term-success",delay:4200}],cold:[{text:"$ earth +build",class:"term-cmd",delay:80},{text:"\u2500\u2500\u2500 Init \u{1F680} Found buildkit daemon as podman container (earth-buildkitd)",class:"term-dim",delay:300},{text:"\u2500\u2500\u2500 Build \u{1F527}",class:"term-bold",delay:600},{text:"   +base | --> FROM rust:1.85-alpine",class:"terminal-line",delay:1500},{text:"   +base | --> WORKDIR /rust-app",class:"terminal-line",delay:3e3},{text:"   +deps | --> COPY Cargo.toml Cargo.lock ./",class:"terminal-line",delay:4500},{text:"   +deps | --> RUN cargo build --release",class:"term-yellow",delay:8500},{text:"   +deps |    Updating crates.io index",class:"terminal-line",delay:14e3},{text:"   +deps |    Compiling 58 dependencies",class:"terminal-line",delay:22e3},{text:"  +build | --> COPY src src",class:"terminal-line",delay:27e3},{text:"  +build | --> RUN --mount=type=cache,target=/usr/local/cargo/registry cargo build --release",class:"term-yellow",delay:32e3},{text:"  +build |    Compiling app v0.1.0 (/rust-app)",class:"terminal-line",delay:35500},{text:"  +build | --> SAVE ARTIFACT target/release/app AS LOCAL bin/app",class:"terminal-line",delay:37500},{text:"============= \u{1F30D} Earth Build  \u2705 SUCCESS [38.4s] =============",class:"term-success",delay:38400}]},zig:{filename:"examples/zig/Earthfile",repoUrl:"https://github.com/earthbuild/earthbuild/tree/main/examples/zig",metrics:{cachedTime:"0.7s",editTime:"1.6s",coldTime:"8.6s",editSpeedup:"5.4x Faster",speedup:"12.3x Faster",saved:"92% Saved (7.9s)",ciSaved:"92% Fewer Runner Mins",co2Saved:"~2.0g CO\u2082e / build"},code:`<span class="kw-cmd">VERSION</span> <span class="kw-val">0.8</span>
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
  <span class="kw-cmd">SAVE ARTIFACT</span> zig-out/bin/main <span class="kw-flag">AS LOCAL</span> bin/zig-app`,cached:[{text:"$ earth +build",class:"term-cmd",delay:80},{text:"\u2500\u2500\u2500 Init \u{1F680} Found buildkit daemon as podman container (earth-buildkitd)",class:"term-dim",delay:150},{text:"\u2500\u2500\u2500 Build \u{1F527}",class:"term-bold",delay:220},{text:"   +toolchain | *cached* --> FROM alpine:3.24",class:"term-cached",delay:300},{text:"   +toolchain | *cached* --> RUN apk add --no-cache curl tar xz",class:"term-cached",delay:380},{text:"   +toolchain | *cached* --> RUN curl -LO https://ziglang.org/download/0.14.0/zig-linux-aarch64-0.14.0.tar.xz",class:"term-cached",delay:460},{text:"        +build | *cached* --> COPY build.zig src ./",class:"term-cached",delay:520},{text:"        +build | *cached* --> RUN --mount=type=cache,target=/root/.cache/zig zig build -Doptimize=ReleaseFast",class:"term-cached",delay:580},{text:"        +build | *cached* --> SAVE ARTIFACT zig-out/bin/main AS LOCAL bin/zig-app",class:"term-cached",delay:640},{text:"        output | [----------] 100% exporting outputs",class:"terminal-line",delay:670},{text:"\u{1F381} Artifact +build/main output as bin/zig-app",class:"term-running",delay:685},{text:"============= \u{1F30D} Earth Build  \u2705 SUCCESS [0.7s] =============",class:"term-success",delay:700}],edit:[{text:"$ earth +build",class:"term-cmd",delay:80},{text:"\u2500\u2500\u2500 Init \u{1F680} Found buildkit daemon as podman container (earth-buildkitd)",class:"term-dim",delay:180},{text:"\u2500\u2500\u2500 Build \u{1F527}",class:"term-bold",delay:260},{text:"   +toolchain | *cached* --> FROM alpine:3.24",class:"term-cached",delay:380},{text:"   +toolchain | *cached* --> RUN apk add --no-cache curl tar xz",class:"term-cached",delay:460},{text:"   +toolchain | *cached* --> RUN curl -LO https://ziglang.org/download/0.14.0/zig-linux-aarch64-0.14.0.tar.xz",class:"term-cached",delay:540},{text:"        +build | --> COPY build.zig src ./",class:"term-yellow",delay:700},{text:"        +build | --> RUN --mount=type=cache,target=/root/.cache/zig zig build -Doptimize=ReleaseFast",class:"term-yellow",delay:1200},{text:"        +build | --> SAVE ARTIFACT zig-out/bin/main AS LOCAL bin/zig-app",class:"terminal-line",delay:1450},{text:"============= \u{1F30D} Earth Build  \u2705 SUCCESS [1.6s] =============",class:"term-success",delay:1600}],cold:[{text:"$ earth +build",class:"term-cmd",delay:80},{text:"\u2500\u2500\u2500 Init \u{1F680} Found buildkit daemon as podman container (earth-buildkitd)",class:"term-dim",delay:250},{text:"\u2500\u2500\u2500 Build \u{1F527}",class:"term-bold",delay:500},{text:"   +toolchain | --> FROM alpine:3.24",class:"terminal-line",delay:1200},{text:"   +toolchain | --> RUN apk add --no-cache curl tar xz",class:"terminal-line",delay:2500},{text:"   +toolchain | --> RUN curl -LO https://ziglang.org/download/0.14.0/zig-linux-aarch64-0.14.0.tar.xz",class:"terminal-line",delay:4500},{text:"        +build | --> COPY build.zig src ./",class:"terminal-line",delay:5400},{text:"        +build | --> RUN --mount=type=cache,target=/root/.cache/zig zig build -Doptimize=ReleaseFast",class:"term-yellow",delay:6900},{text:"        +build | [1/4] Compiling src/main.zig",class:"terminal-line",delay:7600},{text:"        +build | [4/4] Linking binary zig-out/bin/main",class:"terminal-line",delay:8100},{text:"        +build | --> SAVE ARTIFACT zig-out/bin/main AS LOCAL bin/zig-app",class:"terminal-line",delay:8400},{text:"============= \u{1F30D} Earth Build  \u2705 SUCCESS [8.6s] =============",class:"term-success",delay:8600}]},typescript:{filename:"examples/typescript-node/Earthfile",repoUrl:"https://github.com/earthbuild/earthbuild/tree/main/examples/typescript-node",metrics:{cachedTime:"1.2s",editTime:"2.8s",coldTime:"16.2s",editSpeedup:"5.8x Faster",speedup:"13.5x Faster",saved:"93% Saved (15.0s)",ciSaved:"93% Fewer Runner Mins",co2Saved:"~3.8g CO\u2082e / build"},code:`<span class="kw-cmd">VERSION</span> <span class="kw-val">0.8</span>
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
  <span class="kw-cmd">SAVE ARTIFACT</span> dist <span class="kw-flag">AS LOCAL</span> dist`,cached:[{text:"$ earth +build",class:"term-cmd",delay:80},{text:"\u2500\u2500\u2500 Init \u{1F680} Found buildkit daemon as podman container (earth-buildkitd)",class:"term-dim",delay:180},{text:"\u2500\u2500\u2500 Build \u{1F527}",class:"term-bold",delay:260},{text:"   +deps | *cached* --> FROM node:26-alpine",class:"term-cached",delay:380},{text:"   +deps | *cached* --> WORKDIR /ts-app",class:"term-cached",delay:450},{text:"   +deps | *cached* --> COPY package.json package-lock.json ./",class:"term-cached",delay:520},{text:"   +deps | *cached* --> RUN --mount=type=cache,target=/root/.npm npm ci",class:"term-cached",delay:600},{text:"  +build | *cached* --> COPY tsconfig.json vite.config.ts src ./",class:"term-cached",delay:680},{text:"  +build | *cached* --> RUN npm run build",class:"term-cached",delay:800},{text:"  +build | *cached* --> SAVE ARTIFACT dist AS LOCAL dist",class:"term-cached",delay:950},{text:"  output | [----------] 100% exporting outputs",class:"terminal-line",delay:1050},{text:"\u{1F381} Artifact +build/dist output as dist",class:"term-running",delay:1120},{text:"============= \u{1F30D} Earth Build  \u2705 SUCCESS [1.2s] =============",class:"term-success",delay:1200}],edit:[{text:"$ earth +build",class:"term-cmd",delay:80},{text:"\u2500\u2500\u2500 Init \u{1F680} Found buildkit daemon as podman container (earth-buildkitd)",class:"term-dim",delay:180},{text:"\u2500\u2500\u2500 Build \u{1F527}",class:"term-bold",delay:260},{text:"   +deps | *cached* --> FROM node:26-alpine",class:"term-cached",delay:380},{text:"   +deps | *cached* --> WORKDIR /ts-app",class:"term-cached",delay:450},{text:"   +deps | *cached* --> COPY package.json package-lock.json ./",class:"term-cached",delay:520},{text:"   +deps | *cached* --> RUN --mount=type=cache,target=/root/.npm npm ci",class:"term-cached",delay:600},{text:"  +build | --> COPY tsconfig.json vite.config.ts src ./",class:"term-yellow",delay:900},{text:"  +build | --> RUN npm run build",class:"term-yellow",delay:2e3},{text:"  +build | --> SAVE ARTIFACT dist AS LOCAL dist",class:"terminal-line",delay:2600},{text:"============= \u{1F30D} Earth Build  \u2705 SUCCESS [2.8s] =============",class:"term-success",delay:2800}],cold:[{text:"$ earth +build",class:"term-cmd",delay:80},{text:"\u2500\u2500\u2500 Init \u{1F680} Found buildkit daemon as podman container (earth-buildkitd)",class:"term-dim",delay:300},{text:"\u2500\u2500\u2500 Build \u{1F527}",class:"term-bold",delay:600},{text:"   +deps | --> FROM node:26-alpine",class:"terminal-line",delay:1500},{text:"   +deps | --> WORKDIR /ts-app",class:"terminal-line",delay:2500},{text:"   +deps | --> COPY package.json package-lock.json ./",class:"terminal-line",delay:3500},{text:"   +deps | --> RUN --mount=type=cache,target=/root/.npm npm ci",class:"term-yellow",delay:6500},{text:"   +deps | added 214 packages in 3.8s",class:"terminal-line",delay:7e3},{text:"  +build | --> COPY tsconfig.json vite.config.ts src ./",class:"terminal-line",delay:8500},{text:"  +build | --> RUN npm run build",class:"term-yellow",delay:12500},{text:"  +build | --> SAVE ARTIFACT dist AS LOCAL dist",class:"terminal-line",delay:15600},{text:"============= \u{1F30D} Earth Build  \u2705 SUCCESS [16.2s] =============",class:"term-success",delay:16200}]},js:{filename:"examples/js/Earthfile",repoUrl:"https://github.com/earthbuild/earthbuild/tree/main/examples/js",metrics:{cachedTime:"0.9s",editTime:"1.8s",coldTime:"11.4s",editSpeedup:"6.3x Faster",speedup:"12.6x Faster",saved:"92% Saved (10.5s)",ciSaved:"92% Fewer Runner Mins",co2Saved:"~2.6g CO\u2082e / build"},code:`<span class="kw-cmd">VERSION</span> <span class="kw-val">0.8</span>
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
  <span class="kw-cmd">RUN</span> npm test`,cached:[{text:"$ earth +test",class:"term-cmd",delay:80},{text:"\u2500\u2500\u2500 Init \u{1F680} Found buildkit daemon as podman container (earth-buildkitd)",class:"term-dim",delay:160},{text:"\u2500\u2500\u2500 Build \u{1F527}",class:"term-bold",delay:240},{text:"   +base | *cached* --> FROM node:26-alpine",class:"term-cached",delay:340},{text:"   +base | *cached* --> WORKDIR /js-app",class:"term-cached",delay:400},{text:"   +deps | *cached* --> COPY package.json package-lock.json ./",class:"term-cached",delay:480},{text:"   +deps | *cached* --> RUN npm install",class:"term-cached",delay:580},{text:"   +test | *cached* --> COPY src test ./",class:"term-cached",delay:700},{text:"   +test | *cached* --> RUN npm test",class:"term-cached",delay:820},{text:"============= \u{1F30D} Earth Build  \u2705 SUCCESS [0.9s] =============",class:"term-success",delay:900}],edit:[{text:"$ earth +test",class:"term-cmd",delay:80},{text:"\u2500\u2500\u2500 Init \u{1F680} Found buildkit daemon as podman container (earth-buildkitd)",class:"term-dim",delay:180},{text:"\u2500\u2500\u2500 Build \u{1F527}",class:"term-bold",delay:260},{text:"   +base | *cached* --> FROM node:26-alpine",class:"term-cached",delay:380},{text:"   +base | *cached* --> WORKDIR /js-app",class:"term-cached",delay:440},{text:"   +deps | *cached* --> COPY package.json package-lock.json ./",class:"term-cached",delay:500},{text:"   +deps | *cached* --> RUN npm install",class:"term-cached",delay:580},{text:"   +test | --> COPY src test ./",class:"term-yellow",delay:850},{text:"   +test | --> RUN npm test",class:"term-yellow",delay:1400},{text:"   +test | Tests: 12 passed, 12 total",class:"terminal-line",delay:1650},{text:"============= \u{1F30D} Earth Build  \u2705 SUCCESS [1.8s] =============",class:"term-success",delay:1800}],cold:[{text:"$ earth +test",class:"term-cmd",delay:80},{text:"\u2500\u2500\u2500 Init \u{1F680} Found buildkit daemon as podman container (earth-buildkitd)",class:"term-dim",delay:300},{text:"\u2500\u2500\u2500 Build \u{1F527}",class:"term-bold",delay:600},{text:"   +base | --> FROM node:26-alpine",class:"terminal-line",delay:1800},{text:"   +base | --> WORKDIR /js-app",class:"terminal-line",delay:3e3},{text:"   +deps | --> COPY package.json package-lock.json ./",class:"terminal-line",delay:4e3},{text:"   +deps | --> RUN npm install",class:"term-yellow",delay:6500},{text:"   +deps | added 142 packages in 4.6s",class:"terminal-line",delay:7200},{text:"   +test | --> COPY src test ./",class:"terminal-line",delay:8500},{text:"   +test | --> RUN npm test",class:"term-yellow",delay:10500},{text:"   +test | Tests: 12 passed, 12 total",class:"terminal-line",delay:11e3},{text:"============= \u{1F30D} Earth Build  \u2705 SUCCESS [11.4s] =============",class:"term-success",delay:11400}]},java:{filename:"examples/java/Earthfile",repoUrl:"https://github.com/earthbuild/earthbuild/tree/main/examples/java",metrics:{cachedTime:"1.5s",editTime:"3.4s",coldTime:"21.8s",editSpeedup:"6.4x Faster",speedup:"14.5x Faster",saved:"93% Saved (20.3s)",ciSaved:"93% Fewer Runner Mins",co2Saved:"~5.1g CO\u2082e / build"},code:`<span class="kw-cmd">VERSION</span> <span class="kw-val">0.8</span>
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
  <span class="kw-cmd">SAVE ARTIFACT</span> build/libs/*.jar <span class="kw-flag">AS LOCAL</span> build/libs/app.jar`,cached:[{text:"$ earth +build",class:"term-cmd",delay:80},{text:"\u2500\u2500\u2500 Init \u{1F680} Found buildkit daemon as podman container (earth-buildkitd)",class:"term-dim",delay:180},{text:"\u2500\u2500\u2500 Build \u{1F527}",class:"term-bold",delay:260},{text:"   +deps | *cached* --> FROM gradle:8.12-jdk23",class:"term-cached",delay:350},{text:"   +deps | *cached* --> WORKDIR /java-app",class:"term-cached",delay:420},{text:"   +deps | *cached* --> COPY build.gradle settings.gradle ./",class:"term-cached",delay:490},{text:"   +deps | *cached* --> RUN gradle dependencies --no-daemon",class:"term-cached",delay:560},{text:"  +build | *cached* --> COPY src src",class:"term-cached",delay:640},{text:"  +build | *cached* --> RUN --mount=type=cache,target=/root/.gradle/caches gradle assemble test --no-daemon",class:"term-cached",delay:850},{text:"  +build | *cached* --> SAVE ARTIFACT build/libs/*.jar AS LOCAL build/libs/app.jar",class:"term-cached",delay:1100},{text:"  output | [----------] 100% exporting outputs",class:"terminal-line",delay:1250},{text:"\u{1F381} Artifact +build/libs/app.jar output as build/libs/app.jar",class:"term-running",delay:1380},{text:"============= \u{1F30D} Earth Build  \u2705 SUCCESS [1.5s] =============",class:"term-success",delay:1500}],edit:[{text:"$ earth +build",class:"term-cmd",delay:80},{text:"\u2500\u2500\u2500 Init \u{1F680} Found buildkit daemon as podman container (earth-buildkitd)",class:"term-dim",delay:180},{text:"\u2500\u2500\u2500 Build \u{1F527}",class:"term-bold",delay:260},{text:"   +deps | *cached* --> FROM gradle:8.12-jdk23",class:"term-cached",delay:350},{text:"   +deps | *cached* --> WORKDIR /java-app",class:"term-cached",delay:420},{text:"   +deps | *cached* --> COPY build.gradle settings.gradle ./",class:"term-cached",delay:490},{text:"   +deps | *cached* --> RUN gradle dependencies --no-daemon",class:"term-cached",delay:560},{text:"  +build | --> COPY src src",class:"term-yellow",delay:800},{text:"  +build | --> RUN --mount=type=cache,target=/root/.gradle/caches gradle assemble test --no-daemon",class:"term-yellow",delay:1500},{text:"  +build | > Task :compileJava",class:"terminal-line",delay:2200},{text:"  +build | > Task :test",class:"terminal-line",delay:2800},{text:"  +build | --> SAVE ARTIFACT build/libs/*.jar AS LOCAL build/libs/app.jar",class:"terminal-line",delay:3150},{text:"============= \u{1F30D} Earth Build  \u2705 SUCCESS [3.4s] =============",class:"term-success",delay:3400}],cold:[{text:"$ earth +build",class:"term-cmd",delay:80},{text:"\u2500\u2500\u2500 Init \u{1F680} Found buildkit daemon as podman container (earth-buildkitd)",class:"term-dim",delay:300},{text:"\u2500\u2500\u2500 Build \u{1F527}",class:"term-bold",delay:600},{text:"   +deps | --> FROM gradle:8.12-jdk23",class:"terminal-line",delay:1500},{text:"   +deps | --> WORKDIR /java-app",class:"terminal-line",delay:2500},{text:"   +deps | --> COPY build.gradle settings.gradle ./",class:"terminal-line",delay:3500},{text:"   +deps | --> RUN gradle dependencies --no-daemon",class:"term-yellow",delay:6500},{text:"  +build | --> COPY src src",class:"terminal-line",delay:9e3},{text:"  +build | --> RUN --mount=type=cache,target=/root/.gradle/caches gradle assemble test --no-daemon",class:"terminal-line",delay:12e3},{text:"  +build | > Task :compileJava",class:"terminal-line",delay:15e3},{text:"  +build | > Task :test",class:"terminal-line",delay:17500},{text:"  +build | > Task :assemble",class:"terminal-line",delay:19500},{text:"  +build | --> SAVE ARTIFACT build/libs/*.jar AS LOCAL build/libs/app.jar",class:"terminal-line",delay:21e3},{text:"============= \u{1F30D} Earth Build  \u2705 SUCCESS [21.8s] =============",class:"term-success",delay:21800}]}};var as=class{deckEl;coldWindow;coldLinesEl;coldScreenEl;coldCursorEl;editWindow;editLinesEl;editScreenEl;editCursorEl;cachedWindow;cachedLinesEl;cachedScreenEl;cachedCursorEl;parallelColdFill;parallelColdVal;parallelEditFill;parallelEditVal;parallelEditTime;parallelEditSpeedupBadge;parallelCachedFill;parallelCachedTime;parallelSpeedupBadge;summarySavedVal;summaryCiVal;summaryCo2Val;isPlaying=!1;timeouts=[];rafId=null;constructor(){this.deckEl=document.getElementById("stackedWindowsDeck"),this.coldWindow=document.getElementById("coldWindow"),this.coldLinesEl=document.getElementById("coldLines"),this.coldScreenEl=document.getElementById("coldScreen"),this.coldCursorEl=document.getElementById("coldCursor"),this.editWindow=document.getElementById("editWindow"),this.editLinesEl=document.getElementById("editLines"),this.editScreenEl=document.getElementById("editScreen"),this.editCursorEl=document.getElementById("editCursor"),this.cachedWindow=document.getElementById("cachedWindow"),this.cachedLinesEl=document.getElementById("cachedLines"),this.cachedScreenEl=document.getElementById("cachedScreen"),this.cachedCursorEl=document.getElementById("cachedCursor"),this.parallelColdFill=document.getElementById("parallelColdFill"),this.parallelColdVal=document.getElementById("parallelColdVal"),this.parallelEditFill=document.getElementById("parallelEditFill"),this.parallelEditVal=document.getElementById("parallelEditVal"),this.parallelEditTime=document.getElementById("parallelEditTime"),this.parallelEditSpeedupBadge=document.getElementById("parallelEditSpeedupBadge"),this.parallelCachedFill=document.getElementById("parallelCachedFill"),this.parallelCachedTime=document.getElementById("parallelCachedTime"),this.parallelSpeedupBadge=document.getElementById("parallelSpeedupBadge"),this.summarySavedVal=document.getElementById("summarySavedVal"),this.summaryCiVal=document.getElementById("summaryCiVal"),this.summaryCo2Val=document.getElementById("summaryCo2Val")}clear(){this.timeouts.forEach(s=>clearTimeout(s)),this.timeouts=[],this.rafId!==null&&(cancelAnimationFrame(this.rafId),this.rafId=null),this.coldLinesEl&&(this.coldLinesEl.innerHTML=""),this.editLinesEl&&(this.editLinesEl.innerHTML=""),this.cachedLinesEl&&(this.cachedLinesEl.innerHTML=""),this.parallelColdFill&&(this.parallelColdFill.style.width="0%"),this.parallelEditFill&&(this.parallelEditFill.style.width="0%"),this.parallelCachedFill&&(this.parallelCachedFill.style.width="0%"),this.coldWindow&&this.coldWindow.classList.remove("cold-pulse"),this.editWindow&&this.editWindow.classList.remove("edit-pulse"),this.cachedWindow&&this.cachedWindow.classList.remove("winner-pulse"),this.isPlaying=!1}showStatic(s){let n=K[s]||K.python;this.clear();let e=parseFloat(n.metrics.coldTime)||6.2,p=parseFloat(n.metrics.editTime)||1.8,A=parseFloat(n.metrics.cachedTime)||1.1,t=(e/p).toFixed(1),c=(e/A).toFixed(1),r=`${t}x Faster`,d=`${c}x Faster`,i=Math.max(0,e-A),o=Math.round(i/e*100),k=`${o}% Saved (${i.toFixed(1)}s)`,b=`${o}% Fewer Runner Mins`,S=`~${(i*.25).toFixed(1)}g CO\u2082e / build`,D=p/e*100,y=A/e*100;this.summarySavedVal&&(this.summarySavedVal.textContent=k),this.summaryCiVal&&(this.summaryCiVal.textContent=b),this.summaryCo2Val&&(this.summaryCo2Val.textContent=S),this.parallelColdVal&&(this.parallelColdVal.textContent=n.metrics.coldTime),this.parallelColdFill&&(this.parallelColdFill.style.width="100%"),this.parallelEditTime&&(this.parallelEditTime.textContent=n.metrics.editTime),this.parallelEditFill&&(this.parallelEditFill.style.width=`${D.toFixed(2)}%`),this.parallelEditSpeedupBadge&&(this.parallelEditSpeedupBadge.textContent=r),this.parallelCachedTime&&(this.parallelCachedTime.textContent=n.metrics.cachedTime),this.parallelCachedFill&&(this.parallelCachedFill.style.width=`${y.toFixed(2)}%`),this.parallelSpeedupBadge&&(this.parallelSpeedupBadge.textContent=d);let T=document.getElementById("coldTimePill"),x=document.getElementById("editTimePill"),P=document.getElementById("cachedTimePill");T&&(T.textContent=n.metrics.coldTime),x&&(x.textContent=n.metrics.editTime),P&&(P.textContent=n.metrics.cachedTime);let h=(R,C,I)=>{if(!R)return;let N=document.createDocumentFragment();I.forEach(w=>{let m=document.createElement("div");m.className=`player-terminal-line ${w.class||""}`,m.textContent=w.text,N.appendChild(m)}),R.appendChild(N),C&&(C.scrollTop=C.scrollHeight)};h(this.coldLinesEl,this.coldScreenEl,n.cold),h(this.editLinesEl,this.editScreenEl,n.edit),h(this.cachedLinesEl,this.cachedScreenEl,n.cached),this.coldWindow&&this.coldWindow.classList.add("cold-pulse"),this.editWindow&&this.editWindow.classList.add("edit-pulse"),this.cachedWindow&&this.cachedWindow.classList.add("winner-pulse")}startRace(s){let n=K[s]||K.python;this.clear();let e=parseFloat(n.metrics.coldTime)||6.2,p=parseFloat(n.metrics.editTime)||1.8,A=parseFloat(n.metrics.cachedTime)||1.1,t=(e/p).toFixed(1),c=(e/A).toFixed(1),r=`${t}x Faster`,d=`${c}x Faster`,i=Math.max(0,e-A),o=Math.round(i/e*100),k=`${o}% Saved (${i.toFixed(1)}s)`,b=`${o}% Fewer Runner Mins`,S=`~${(i*.25).toFixed(1)}g CO\u2082e / build`,D=e*1e3,y=p*1e3,T=A*1e3,x=p/e*100,P=A/e*100;this.summarySavedVal&&(this.summarySavedVal.textContent=k),this.summaryCiVal&&(this.summaryCiVal.textContent=b),this.summaryCo2Val&&(this.summaryCo2Val.textContent=S),this.parallelColdVal&&(this.parallelColdVal.textContent=`0.0s / ${n.metrics.coldTime}`),this.parallelEditTime&&(this.parallelEditTime.textContent="0.0s"),this.parallelEditSpeedupBadge&&(this.parallelEditSpeedupBadge.textContent=r),this.parallelCachedTime&&(this.parallelCachedTime.textContent="0.0s"),this.parallelSpeedupBadge&&(this.parallelSpeedupBadge.textContent=d);let h=document.getElementById("coldTimePill"),R=document.getElementById("editTimePill"),C=document.getElementById("cachedTimePill");h&&(h.textContent=n.metrics.coldTime),R&&(R.textContent=n.metrics.editTime),C&&(C.textContent=n.metrics.cachedTime),this.isPlaying=!0;let I=performance.now(),N=()=>{if(!this.isPlaying)return;let m=performance.now()-I;if(m<=T){let f=m/T,O=f*P;this.parallelCachedFill&&(this.parallelCachedFill.style.width=`${O.toFixed(2)}%`);let g=(f*A).toFixed(1);this.parallelCachedTime&&(this.parallelCachedTime.textContent=`${g}s`)}else this.parallelCachedFill&&(this.parallelCachedFill.style.width=`${P.toFixed(2)}%`),this.parallelCachedTime&&(this.parallelCachedTime.textContent=n.metrics.cachedTime),this.parallelSpeedupBadge&&(this.parallelSpeedupBadge.textContent=d);if(m<=y){let f=m/y,O=f*x;this.parallelEditFill&&(this.parallelEditFill.style.width=`${O.toFixed(2)}%`);let g=(f*p).toFixed(1);this.parallelEditTime&&(this.parallelEditTime.textContent=`${g}s`)}else this.parallelEditFill&&(this.parallelEditFill.style.width=`${x.toFixed(2)}%`),this.parallelEditTime&&(this.parallelEditTime.textContent=n.metrics.editTime),this.parallelEditSpeedupBadge&&(this.parallelEditSpeedupBadge.textContent=r);if(m<=D){let f=m/D,O=Math.min(100,f*100);this.parallelColdFill&&(this.parallelColdFill.style.width=`${O.toFixed(2)}%`);let g=(f*e).toFixed(1);this.parallelColdVal&&(this.parallelColdVal.textContent=`${g}s / ${n.metrics.coldTime}`),this.rafId=requestAnimationFrame(N)}else this.isPlaying=!1,this.parallelColdFill&&(this.parallelColdFill.style.width="100%"),this.parallelColdVal&&(this.parallelColdVal.textContent=n.metrics.coldTime)};this.rafId=requestAnimationFrame(N),n.cached.forEach((w,m)=>{let f=w.delay,O=window.setTimeout(()=>{let g=document.createElement("div");g.className=`player-terminal-line ${w.class||""}`,g.textContent=w.text,this.cachedLinesEl&&(this.cachedLinesEl.appendChild(g),this.cachedScreenEl&&(this.cachedScreenEl.scrollTop=this.cachedScreenEl.scrollHeight)),m===n.cached.length-1&&this.cachedWindow&&this.cachedWindow.classList.add("winner-pulse")},f);this.timeouts.push(O)}),n.edit.forEach((w,m)=>{let f=w.delay,O=window.setTimeout(()=>{let g=document.createElement("div");g.className=`player-terminal-line ${w.class||""}`,g.textContent=w.text,this.editLinesEl&&(this.editLinesEl.appendChild(g),this.editScreenEl&&(this.editScreenEl.scrollTop=this.editScreenEl.scrollHeight)),m===n.edit.length-1&&this.editWindow&&this.editWindow.classList.add("edit-pulse")},f);this.timeouts.push(O)}),n.cold.forEach((w,m)=>{let f=w.delay,O=window.setTimeout(()=>{let g=document.createElement("div");g.className=`player-terminal-line ${w.class||""}`,g.textContent=w.text,this.coldLinesEl&&(this.coldLinesEl.appendChild(g),this.coldScreenEl&&(this.coldScreenEl.scrollTop=this.coldScreenEl.scrollHeight)),m===n.cold.length-1&&(this.isPlaying=!1,this.coldWindow&&this.coldWindow.classList.add("cold-pulse"),this.parallelColdFill&&(this.parallelColdFill.style.width="100%"),this.parallelColdVal&&(this.parallelColdVal.textContent=n.metrics.coldTime))},f);this.timeouts.push(O)})}};var cs={python:{dockerfile:{legacyTitle:"Standard Dockerfile",legacyCode:`<span class="kw-cmd">FROM</span> <span class="kw-string">python:3.14-slim</span> <span class="kw-cmd">AS</span> <span class="kw-target">deps</span>
<span class="kw-cmd">WORKDIR</span> <span class="kw-string">/app</span>
<span class="kw-cmd">COPY</span> requirements.txt ./
<span class="kw-cmd">RUN</span> pip install --no-cache-dir -r requirements.txt pyinstaller

<span class="kw-cmd">FROM</span> <span class="kw-target">deps</span> <span class="kw-cmd">AS</span> <span class="kw-target">test</span>
<span class="kw-cmd">COPY</span> src tests ./ ./
<span class="kw-cmd">RUN</span> pytest tests/

<span class="kw-cmd">FROM</span> <span class="kw-target">deps</span> <span class="kw-cmd">AS</span> <span class="kw-target">builder</span>
<span class="kw-cmd">COPY</span> src tests ./ ./
<span class="kw-cmd">RUN</span> pyinstaller --onefile --distpath dist -n app src/main.py

<span class="kw-cmd">FROM</span> <span class="kw-string">python:3.14-slim</span> <span class="kw-cmd">AS</span> <span class="kw-target">runtime</span>
<span class="kw-cmd">COPY</span> <span class="kw-flag">--from</span>=<span class="kw-target">builder</span> /app/dist/app /usr/local/bin/app
<span class="kw-cmd">ENTRYPOINT</span> [<span class="kw-string">"/usr/local/bin/app"</span>]`,earthfileTitle:"Earthfile (Direct Host Artifacts & Push Built-In)",earthfileCode:`<span class="kw-cmd">VERSION</span> <span class="kw-val">0.8</span>
<span class="kw-cmd">FROM</span> <span class="kw-string">python:3.14-slim</span>
<span class="kw-cmd">WORKDIR</span> <span class="kw-string">/app</span>

<span class="kw-target">deps</span>:
  <span class="kw-cmd">COPY</span> requirements.txt ./
  <span class="kw-cmd">RUN</span> pip install <span class="kw-flag">--no-cache-dir</span> <span class="kw-flag">-r</span> requirements.txt pyinstaller

<span class="kw-target">test</span>:
  <span class="kw-cmd">FROM</span> <span class="kw-target">+deps</span>
  <span class="kw-cmd">COPY</span> . ./
  <span class="kw-cmd">RUN</span> pytest tests/

<span class="kw-target">build</span>:
  <span class="kw-cmd">FROM</span> <span class="kw-target">+deps</span>
  <span class="kw-cmd">COPY</span> . ./
  <span class="kw-cmd">RUN</span> pyinstaller <span class="kw-flag">--onefile</span> <span class="kw-flag">--distpath</span> bin <span class="kw-flag">-n</span> app src/main.py
  <span class="kw-cmd">SAVE ARTIFACT</span> bin/app <span class="kw-flag">AS LOCAL</span> bin/app

<span class="kw-target">docker</span>:
  <span class="kw-cmd">FROM</span> <span class="kw-string">python:3.14-slim</span>
  <span class="kw-cmd">WORKDIR</span> <span class="kw-string">/app</span>
  <span class="kw-cmd">COPY</span> <span class="kw-target">+build</span>/bin/app /usr/local/bin/app
  <span class="kw-cmd">ENTRYPOINT</span> [<span class="kw-string">"/usr/local/bin/app"</span>]
  <span class="kw-cmd">SAVE IMAGE</span> <span class="kw-flag">--push</span> <span class="kw-string">docker.io/myorg/myapp:latest</span>

<span class="kw-target">all</span>:
  <span class="kw-cmd">BUILD</span> <span class="kw-target">+test</span>
  <span class="kw-cmd">BUILD</span> <span class="kw-target">+build</span>
  <span class="kw-cmd">BUILD</span> <span class="kw-target">+docker</span>`},bake:{legacyTitle:"Docker Buildx Bake (Bake HCL + Dockerfile)",legacyCode:`<span class="kw-cmd">group</span> <span class="kw-string">"default"</span> {
  <span class="kw-prop">targets</span> = [<span class="kw-string">"test"</span>, <span class="kw-string">"build"</span>, <span class="kw-string">"image"</span>]
}

<span class="kw-cmd">target</span> <span class="kw-string">"test"</span> {
  <span class="kw-prop">dockerfile</span> = <span class="kw-string">"Dockerfile"</span>
  <span class="kw-prop">target</span>     = <span class="kw-string">"test"</span>
}

<span class="kw-cmd">target</span> <span class="kw-string">"build"</span> {
  <span class="kw-prop">dockerfile</span> = <span class="kw-string">"Dockerfile"</span>
  <span class="kw-prop">target</span>     = <span class="kw-string">"builder"</span>
  <span class="kw-prop">output</span>     = [<span class="kw-string">"type=local,dest=bin"</span>]
}

<span class="kw-cmd">target</span> <span class="kw-string">"image"</span> {
  <span class="kw-prop">dockerfile</span> = <span class="kw-string">"Dockerfile"</span>
  <span class="kw-prop">target</span>     = <span class="kw-string">"runtime"</span>
  <span class="kw-prop">tags</span>       = [<span class="kw-string">"docker.io/myorg/myapp:latest"</span>]
}`,earthfileTitle:"Earthfile (Self-Contained & Deterministic)",earthfileCode:`<span class="kw-cmd">VERSION</span> <span class="kw-val">0.8</span>
<span class="kw-cmd">FROM</span> <span class="kw-string">python:3.14-slim</span>
<span class="kw-cmd">WORKDIR</span> <span class="kw-string">/app</span>

<span class="kw-target">deps</span>:
  <span class="kw-cmd">COPY</span> requirements.txt ./
  <span class="kw-cmd">RUN</span> pip install <span class="kw-flag">--no-cache-dir</span> <span class="kw-flag">-r</span> requirements.txt pyinstaller

<span class="kw-target">test</span>:
  <span class="kw-cmd">FROM</span> <span class="kw-target">+deps</span>
  <span class="kw-cmd">COPY</span> . ./
  <span class="kw-cmd">RUN</span> pytest tests/

<span class="kw-target">build</span>:
  <span class="kw-cmd">FROM</span> <span class="kw-target">+deps</span>
  <span class="kw-cmd">COPY</span> . ./
  <span class="kw-cmd">RUN</span> pyinstaller <span class="kw-flag">--onefile</span> <span class="kw-flag">--distpath</span> bin <span class="kw-flag">-n</span> app src/main.py
  <span class="kw-cmd">SAVE ARTIFACT</span> bin/app <span class="kw-flag">AS LOCAL</span> bin/app

<span class="kw-target">docker</span>:
  <span class="kw-cmd">FROM</span> <span class="kw-string">python:3.14-slim</span>
  <span class="kw-cmd">WORKDIR</span> <span class="kw-string">/app</span>
  <span class="kw-cmd">COPY</span> <span class="kw-target">+build</span>/bin/app /usr/local/bin/app
  <span class="kw-cmd">ENTRYPOINT</span> [<span class="kw-string">"/usr/local/bin/app"</span>]
  <span class="kw-cmd">SAVE IMAGE</span> <span class="kw-flag">--push</span> <span class="kw-string">docker.io/myorg/myapp:latest</span>

<span class="kw-target">all</span>:
  <span class="kw-cmd">BUILD</span> <span class="kw-target">+test</span>
  <span class="kw-cmd">BUILD</span> <span class="kw-target">+build</span>
  <span class="kw-cmd">BUILD</span> <span class="kw-target">+docker</span>`},makefile:{legacyTitle:"Makefile (Python Host Execution)",legacyCode:`<span class="kw-target">.PHONY</span>: <span class="kw-target">all</span> <span class="kw-target">test</span> <span class="kw-target">build</span> <span class="kw-target">docker</span>

<span class="kw-target">all</span>: <span class="kw-target">test</span> <span class="kw-target">build</span> <span class="kw-target">docker</span>

<span class="kw-target">test</span>:
	pytest tests/

<span class="kw-target">build</span>:
	pyinstaller --onefile --distpath dist -n app src/main.py

<span class="kw-target">docker</span>: <span class="kw-target">build</span>
	docker build <span class="kw-flag">-t</span> <span class="kw-string">docker.io/myorg/myapp:latest</span> .
	docker push <span class="kw-string">docker.io/myorg/myapp:latest</span>`,earthfileTitle:"Earthfile (Hermetic & Parallel)",earthfileCode:`<span class="kw-cmd">VERSION</span> <span class="kw-val">0.8</span>
<span class="kw-cmd">FROM</span> <span class="kw-string">python:3.14-slim</span>
<span class="kw-cmd">WORKDIR</span> <span class="kw-string">/app</span>

<span class="kw-target">deps</span>:
  <span class="kw-cmd">COPY</span> requirements.txt ./
  <span class="kw-cmd">RUN</span> pip install <span class="kw-flag">--no-cache-dir</span> <span class="kw-flag">-r</span> requirements.txt pyinstaller

<span class="kw-target">test</span>:
  <span class="kw-cmd">FROM</span> <span class="kw-target">+deps</span>
  <span class="kw-cmd">COPY</span> . ./
  <span class="kw-cmd">RUN</span> pytest tests/

<span class="kw-target">build</span>:
  <span class="kw-cmd">FROM</span> <span class="kw-target">+deps</span>
  <span class="kw-cmd">COPY</span> . ./
  <span class="kw-cmd">RUN</span> pyinstaller <span class="kw-flag">--onefile</span> <span class="kw-flag">--distpath</span> bin <span class="kw-flag">-n</span> app src/main.py
  <span class="kw-cmd">SAVE ARTIFACT</span> bin/app <span class="kw-flag">AS LOCAL</span> bin/app

<span class="kw-target">docker</span>:
  <span class="kw-cmd">FROM</span> <span class="kw-string">python:3.14-slim</span>
  <span class="kw-cmd">WORKDIR</span> <span class="kw-string">/app</span>
  <span class="kw-cmd">COPY</span> <span class="kw-target">+build</span>/bin/app /usr/local/bin/app
  <span class="kw-cmd">ENTRYPOINT</span> [<span class="kw-string">"/usr/local/bin/app"</span>]
  <span class="kw-cmd">SAVE IMAGE</span> <span class="kw-flag">--push</span> <span class="kw-string">docker.io/myorg/myapp:latest</span>

<span class="kw-target">all</span>:
  <span class="kw-cmd">BUILD</span> <span class="kw-target">+test</span>
  <span class="kw-cmd">BUILD</span> <span class="kw-target">+build</span>
  <span class="kw-cmd">BUILD</span> <span class="kw-target">+docker</span>`},dagger:{legacyTitle:"Dagger (Python SDK)",legacyCode:`<span class="kw-cmd">import</span> dagger
<span class="kw-cmd">from</span> dagger <span class="kw-cmd">import</span> dag, function, object_type

<span class="kw-decorator">@object_type</span>
<span class="kw-cmd">class</span> <span class="kw-type">Pipeline</span>:
    <span class="kw-decorator">@function</span>
    <span class="kw-cmd">async def</span> <span class="kw-fn">test</span>(<span class="kw-var">self</span>, <span class="kw-var">src</span>: <span class="kw-type">dagger.Directory</span>) -&gt; <span class="kw-type">str</span>:
        <span class="kw-cmd">return await</span> (
            dag.container()
            .from_(<span class="kw-string">"python:3.14-slim"</span>)
            .with_directory(<span class="kw-string">"/app"</span>, src)
            .with_workdir(<span class="kw-string">"/app"</span>)
            .with_exec([<span class="kw-string">"pip"</span>, <span class="kw-string">"install"</span>, <span class="kw-string">"-r"</span>, <span class="kw-string">"requirements.txt"</span>])
            .with_exec([<span class="kw-string">"pytest"</span>, <span class="kw-string">"tests/"</span>])
            .stdout()
        )

    <span class="kw-decorator">@function</span>
    <span class="kw-cmd">async def</span> <span class="kw-fn">build</span>(<span class="kw-var">self</span>, <span class="kw-var">src</span>: <span class="kw-type">dagger.Directory</span>) -&gt; <span class="kw-type">dagger.File</span>:
        <span class="kw-var">bin_file</span> = (
            dag.container()
            .from_(<span class="kw-string">"python:3.14-slim"</span>)
            .with_directory(<span class="kw-string">"/app"</span>, src)
            .with_workdir(<span class="kw-string">"/app"</span>)
            .with_exec([<span class="kw-string">"pip"</span>, <span class="kw-string">"install"</span>, <span class="kw-string">"-r"</span>, <span class="kw-string">"requirements.txt"</span>, <span class="kw-string">"pyinstaller"</span>])
            .with_exec([<span class="kw-string">"pyinstaller"</span>, <span class="kw-string">"--onefile"</span>, <span class="kw-string">"-n"</span>, <span class="kw-string">"app"</span>, <span class="kw-string">"src/main.py"</span>])
            .file(<span class="kw-string">"dist/app"</span>)
        )
        <span class="kw-cmd">await</span> bin_file.export(<span class="kw-string">"bin/app"</span>)
        <span class="kw-cmd">return</span> bin_file

    <span class="kw-decorator">@function</span>
    <span class="kw-cmd">async def</span> <span class="kw-fn">publish</span>(<span class="kw-var">self</span>, <span class="kw-var">src</span>: <span class="kw-type">dagger.Directory</span>) -&gt; <span class="kw-type">str</span>:
        <span class="kw-var">bin_file</span> = <span class="kw-cmd">await</span> self.build(src)
        <span class="kw-cmd">return await</span> (
            dag.container()
            .from_(<span class="kw-string">"python:3.14-slim"</span>)
            .with_file(<span class="kw-string">"/usr/local/bin/app"</span>, bin_file)
            .with_entrypoint([<span class="kw-string">"/usr/local/bin/app"</span>])
            .publish(<span class="kw-string">"docker.io/myorg/myapp:latest"</span>)
        )`,earthfileTitle:"Earthfile",earthfileCode:`<span class="kw-cmd">VERSION</span> <span class="kw-val">0.8</span>
<span class="kw-cmd">FROM</span> <span class="kw-string">python:3.14-slim</span>
<span class="kw-cmd">WORKDIR</span> <span class="kw-string">/app</span>

<span class="kw-target">deps</span>:
  <span class="kw-cmd">COPY</span> requirements.txt ./
  <span class="kw-cmd">RUN</span> pip install <span class="kw-flag">--no-cache-dir</span> <span class="kw-flag">-r</span> requirements.txt pyinstaller

<span class="kw-target">test</span>:
  <span class="kw-cmd">FROM</span> <span class="kw-target">+deps</span>
  <span class="kw-cmd">COPY</span> . ./
  <span class="kw-cmd">RUN</span> pytest tests/

<span class="kw-target">build</span>:
  <span class="kw-cmd">FROM</span> <span class="kw-target">+deps</span>
  <span class="kw-cmd">COPY</span> . ./
  <span class="kw-cmd">RUN</span> pyinstaller <span class="kw-flag">--onefile</span> <span class="kw-flag">--distpath</span> bin <span class="kw-flag">-n</span> app src/main.py
  <span class="kw-cmd">SAVE ARTIFACT</span> bin/app <span class="kw-flag">AS LOCAL</span> bin/app

<span class="kw-target">docker</span>:
  <span class="kw-cmd">FROM</span> <span class="kw-string">python:3.14-slim</span>
  <span class="kw-cmd">WORKDIR</span> <span class="kw-string">/app</span>
  <span class="kw-cmd">COPY</span> <span class="kw-target">+build</span>/bin/app /usr/local/bin/app
  <span class="kw-cmd">ENTRYPOINT</span> [<span class="kw-string">"/usr/local/bin/app"</span>]
  <span class="kw-cmd">SAVE IMAGE</span> <span class="kw-flag">--push</span> <span class="kw-string">docker.io/myorg/myapp:latest</span>

<span class="kw-target">all</span>:
  <span class="kw-cmd">BUILD</span> <span class="kw-target">+test</span>
  <span class="kw-cmd">BUILD</span> <span class="kw-target">+build</span>
  <span class="kw-cmd">BUILD</span> <span class="kw-target">+docker</span>`},gha:{legacyTitle:"Standard GitHub Actions Workflow",legacyCode:`<span class="kw-prop">name</span>: <span class="kw-string">CI &amp; Release</span>
<span class="kw-prop">on</span>: [<span class="kw-string">push</span>]

<span class="kw-prop">jobs</span>:
  <span class="kw-prop">pipeline</span>:
    <span class="kw-prop">runs-on</span>: <span class="kw-string">ubuntu-26.04</span>
    <span class="kw-prop">steps</span>:
      - <span class="kw-prop">uses</span>: <span class="kw-string">actions/checkout@v4</span>

      - <span class="kw-prop">name</span>: <span class="kw-string">Run Tests</span>
        <span class="kw-prop">run</span>: pytest tests/

      - <span class="kw-prop">name</span>: <span class="kw-string">Build Host Binary / Package</span>
        <span class="kw-prop">run</span>: pyinstaller --onefile --distpath dist -n app src/main.py

      - <span class="kw-prop">uses</span>: <span class="kw-string">actions/upload-artifact@v4</span>
        <span class="kw-prop">with</span>:
          <span class="kw-prop">name</span>: <span class="kw-string">app-artifact</span>
          <span class="kw-prop">path</span>: <span class="kw-string">dist/app</span>

      - <span class="kw-prop">uses</span>: <span class="kw-string">docker/login-action@v3</span>
        <span class="kw-prop">with</span>:
          <span class="kw-prop">username</span>: <span class="kw-expr">\${{ secrets.DOCKER_USER }}</span>
          <span class="kw-prop">password</span>: <span class="kw-expr">\${{ secrets.DOCKER_TOKEN }}</span>

      - <span class="kw-prop">uses</span>: <span class="kw-string">docker/build-push-action@v6</span>
        <span class="kw-prop">with</span>:
          <span class="kw-prop">context</span>: <span class="kw-string">.</span>
          <span class="kw-prop">push</span>: <span class="kw-val">true</span>
          <span class="kw-prop">tags</span>: <span class="kw-string">docker.io/myorg/myapp:latest</span>`,earthfileTitle:"Clean GitHub Action with EarthBuild (10 Lines)",earthfileCode:`<span class="kw-prop">name</span>: <span class="kw-string">CI &amp; Release</span>
<span class="kw-prop">on</span>: [<span class="kw-string">push</span>]

<span class="kw-prop">jobs</span>:
  <span class="kw-prop">pipeline</span>:
    <span class="kw-prop">runs-on</span>: <span class="kw-string">ubuntu-latest</span>
    <span class="kw-prop">steps</span>:
      - <span class="kw-prop">uses</span>: <span class="kw-string">actions/checkout@v4</span>

      - <span class="kw-prop">name</span>: <span class="kw-string">Setup EarthBuild</span>
        <span class="kw-prop">uses</span>: <span class="kw-string">earthbuild/actions-setup@v2</span>

      - <span class="kw-prop">name</span>: <span class="kw-string">Test, Build Binary &amp; Push Image</span>
        <span class="kw-prop">run</span>: <span class="kw-cmd">earth</span> <span class="kw-flag">--ci</span> <span class="kw-flag">--push</span> <span class="kw-target">+all</span>
        <span class="kw-prop">env</span>:
          <span class="kw-prop">EARTH_DOCKER_CONFIG</span>: <span class="kw-expr">\${{ secrets.DOCKER_CONFIG }}</span>`}},js:{dockerfile:{legacyTitle:"Standard Dockerfile",legacyCode:`<span class="kw-cmd">FROM</span> <span class="kw-string">node:26-alpine</span> <span class="kw-cmd">AS</span> <span class="kw-target">deps</span>
<span class="kw-cmd">WORKDIR</span> <span class="kw-string">/app</span>
<span class="kw-cmd">COPY</span> package*.json ./
<span class="kw-cmd">RUN</span> npm ci

<span class="kw-cmd">FROM</span> <span class="kw-target">deps</span> <span class="kw-cmd">AS</span> <span class="kw-target">test</span>
<span class="kw-cmd">COPY</span> src ./src package*.json ./
<span class="kw-cmd">RUN</span> npm test

<span class="kw-cmd">FROM</span> <span class="kw-target">deps</span> <span class="kw-cmd">AS</span> <span class="kw-target">builder</span>
<span class="kw-cmd">COPY</span> src ./src package*.json ./
<span class="kw-cmd">RUN</span> npm run build

<span class="kw-cmd">FROM</span> <span class="kw-string">node:26-alpine</span> <span class="kw-cmd">AS</span> <span class="kw-target">runtime</span>
<span class="kw-cmd">COPY</span> <span class="kw-flag">--from</span>=<span class="kw-target">builder</span> /app/dist/bundle.js /usr/local/bin/app
<span class="kw-cmd">ENTRYPOINT</span> [<span class="kw-string">"/usr/local/bin/app"</span>]`,earthfileTitle:"Earthfile (Direct Host Artifacts & Push Built-In)",earthfileCode:`<span class="kw-cmd">VERSION</span> <span class="kw-val">0.8</span>
<span class="kw-cmd">FROM</span> <span class="kw-string">node:26-alpine</span>
<span class="kw-cmd">WORKDIR</span> <span class="kw-string">/app</span>

<span class="kw-target">deps</span>:
  <span class="kw-cmd">COPY</span> package*.json ./
  <span class="kw-cmd">RUN</span> npm ci

<span class="kw-target">test</span>:
  <span class="kw-cmd">FROM</span> <span class="kw-target">+deps</span>
  <span class="kw-cmd">COPY</span> . ./
  <span class="kw-cmd">RUN</span> npm test

<span class="kw-target">build</span>:
  <span class="kw-cmd">FROM</span> <span class="kw-target">+deps</span>
  <span class="kw-cmd">COPY</span> . ./
  <span class="kw-cmd">RUN</span> npm run build
  <span class="kw-cmd">SAVE ARTIFACT</span> dist <span class="kw-flag">AS LOCAL</span> dist

<span class="kw-target">docker</span>:
  <span class="kw-cmd">FROM</span> <span class="kw-string">node:26-alpine</span>
  <span class="kw-cmd">WORKDIR</span> <span class="kw-string">/app</span>
  <span class="kw-cmd">COPY</span> package*.json ./
  <span class="kw-cmd">RUN</span> npm ci <span class="kw-flag">--omit=dev</span>
  <span class="kw-cmd">COPY</span> <span class="kw-target">+build</span>/dist ./dist
  <span class="kw-cmd">CMD</span> [<span class="kw-string">"node"</span>, <span class="kw-string">"dist/index.js"</span>]
  <span class="kw-cmd">SAVE IMAGE</span> <span class="kw-flag">--push</span> <span class="kw-string">docker.io/myorg/myapp:latest</span>

<span class="kw-target">all</span>:
  <span class="kw-cmd">BUILD</span> <span class="kw-target">+test</span>
  <span class="kw-cmd">BUILD</span> <span class="kw-target">+build</span>
  <span class="kw-cmd">BUILD</span> <span class="kw-target">+docker</span>`},bake:{legacyTitle:"Docker Buildx Bake (Bake HCL + Dockerfile)",legacyCode:`<span class="kw-cmd">group</span> <span class="kw-string">"default"</span> {
  <span class="kw-prop">targets</span> = [<span class="kw-string">"test"</span>, <span class="kw-string">"build"</span>, <span class="kw-string">"image"</span>]
}

<span class="kw-cmd">target</span> <span class="kw-string">"test"</span> {
  <span class="kw-prop">dockerfile</span> = <span class="kw-string">"Dockerfile"</span>
  <span class="kw-prop">target</span>     = <span class="kw-string">"test"</span>
}

<span class="kw-cmd">target</span> <span class="kw-string">"build"</span> {
  <span class="kw-prop">dockerfile</span> = <span class="kw-string">"Dockerfile"</span>
  <span class="kw-prop">target</span>     = <span class="kw-string">"builder"</span>
  <span class="kw-prop">output</span>     = [<span class="kw-string">"type=local,dest=bin"</span>]
}

<span class="kw-cmd">target</span> <span class="kw-string">"image"</span> {
  <span class="kw-prop">dockerfile</span> = <span class="kw-string">"Dockerfile"</span>
  <span class="kw-prop">target</span>     = <span class="kw-string">"runtime"</span>
  <span class="kw-prop">tags</span>       = [<span class="kw-string">"docker.io/myorg/myapp:latest"</span>]
}`,earthfileTitle:"Earthfile (Self-Contained & Deterministic)",earthfileCode:`<span class="kw-cmd">VERSION</span> <span class="kw-val">0.8</span>
<span class="kw-cmd">FROM</span> <span class="kw-string">node:26-alpine</span>
<span class="kw-cmd">WORKDIR</span> <span class="kw-string">/app</span>

<span class="kw-target">deps</span>:
  <span class="kw-cmd">COPY</span> package*.json ./
  <span class="kw-cmd">RUN</span> npm ci

<span class="kw-target">test</span>:
  <span class="kw-cmd">FROM</span> <span class="kw-target">+deps</span>
  <span class="kw-cmd">COPY</span> . ./
  <span class="kw-cmd">RUN</span> npm test

<span class="kw-target">build</span>:
  <span class="kw-cmd">FROM</span> <span class="kw-target">+deps</span>
  <span class="kw-cmd">COPY</span> . ./
  <span class="kw-cmd">RUN</span> npm run build
  <span class="kw-cmd">SAVE ARTIFACT</span> dist <span class="kw-flag">AS LOCAL</span> dist

<span class="kw-target">docker</span>:
  <span class="kw-cmd">FROM</span> <span class="kw-string">node:26-alpine</span>
  <span class="kw-cmd">WORKDIR</span> <span class="kw-string">/app</span>
  <span class="kw-cmd">COPY</span> package*.json ./
  <span class="kw-cmd">RUN</span> npm ci <span class="kw-flag">--omit=dev</span>
  <span class="kw-cmd">COPY</span> <span class="kw-target">+build</span>/dist ./dist
  <span class="kw-cmd">CMD</span> [<span class="kw-string">"node"</span>, <span class="kw-string">"dist/index.js"</span>]
  <span class="kw-cmd">SAVE IMAGE</span> <span class="kw-flag">--push</span> <span class="kw-string">docker.io/myorg/myapp:latest</span>

<span class="kw-target">all</span>:
  <span class="kw-cmd">BUILD</span> <span class="kw-target">+test</span>
  <span class="kw-cmd">BUILD</span> <span class="kw-target">+build</span>
  <span class="kw-cmd">BUILD</span> <span class="kw-target">+docker</span>`},makefile:{legacyTitle:"Makefile (JavaScript Host Execution)",legacyCode:`<span class="kw-target">.PHONY</span>: <span class="kw-target">all</span> <span class="kw-target">test</span> <span class="kw-target">build</span> <span class="kw-target">docker</span>

<span class="kw-target">all</span>: <span class="kw-target">test</span> <span class="kw-target">build</span> <span class="kw-target">docker</span>

<span class="kw-target">test</span>:
	npm test

<span class="kw-target">build</span>:
	npm run build

<span class="kw-target">docker</span>: <span class="kw-target">build</span>
	docker build <span class="kw-flag">-t</span> <span class="kw-string">docker.io/myorg/myapp:latest</span> .
	docker push <span class="kw-string">docker.io/myorg/myapp:latest</span>`,earthfileTitle:"Earthfile (Hermetic & Parallel)",earthfileCode:`<span class="kw-cmd">VERSION</span> <span class="kw-val">0.8</span>
<span class="kw-cmd">FROM</span> <span class="kw-string">node:26-alpine</span>
<span class="kw-cmd">WORKDIR</span> <span class="kw-string">/app</span>

<span class="kw-target">deps</span>:
  <span class="kw-cmd">COPY</span> package*.json ./
  <span class="kw-cmd">RUN</span> npm ci

<span class="kw-target">test</span>:
  <span class="kw-cmd">FROM</span> <span class="kw-target">+deps</span>
  <span class="kw-cmd">COPY</span> . ./
  <span class="kw-cmd">RUN</span> npm test

<span class="kw-target">build</span>:
  <span class="kw-cmd">FROM</span> <span class="kw-target">+deps</span>
  <span class="kw-cmd">COPY</span> . ./
  <span class="kw-cmd">RUN</span> npm run build
  <span class="kw-cmd">SAVE ARTIFACT</span> dist <span class="kw-flag">AS LOCAL</span> dist

<span class="kw-target">docker</span>:
  <span class="kw-cmd">FROM</span> <span class="kw-string">node:26-alpine</span>
  <span class="kw-cmd">WORKDIR</span> <span class="kw-string">/app</span>
  <span class="kw-cmd">COPY</span> package*.json ./
  <span class="kw-cmd">RUN</span> npm ci <span class="kw-flag">--omit=dev</span>
  <span class="kw-cmd">COPY</span> <span class="kw-target">+build</span>/dist ./dist
  <span class="kw-cmd">CMD</span> [<span class="kw-string">"node"</span>, <span class="kw-string">"dist/index.js"</span>]
  <span class="kw-cmd">SAVE IMAGE</span> <span class="kw-flag">--push</span> <span class="kw-string">docker.io/myorg/myapp:latest</span>

<span class="kw-target">all</span>:
  <span class="kw-cmd">BUILD</span> <span class="kw-target">+test</span>
  <span class="kw-cmd">BUILD</span> <span class="kw-target">+build</span>
  <span class="kw-cmd">BUILD</span> <span class="kw-target">+docker</span>`},dagger:{legacyTitle:"Dagger (TypeScript SDK)",legacyCode:`<span class="kw-cmd">import</span> { dag, Directory, File, object, func } <span class="kw-cmd">from</span> <span class="kw-string">"@dagger.io/dagger"</span>;

<span class="kw-decorator">@object</span>()
<span class="kw-cmd">export class</span> <span class="kw-type">Pipeline</span> {
  <span class="kw-decorator">@func</span>()
  <span class="kw-cmd">async</span> <span class="kw-fn">test</span>(<span class="kw-var">src</span>: <span class="kw-type">Directory</span>): <span class="kw-type">Promise&lt;string&gt;</span> {
    <span class="kw-cmd">return</span> dag.container()
      .from(<span class="kw-string">"node:26-alpine"</span>)
      .withDirectory(<span class="kw-string">"/app"</span>, src)
      .withWorkdir(<span class="kw-string">"/app"</span>)
      .withExec([<span class="kw-string">"npm"</span>, <span class="kw-string">"ci"</span>])
      .withExec([<span class="kw-string">"npm"</span>, <span class="kw-string">"test"</span>])
      .stdout();
  }

  <span class="kw-decorator">@func</span>()
  <span class="kw-cmd">async</span> <span class="kw-fn">build</span>(<span class="kw-var">src</span>: <span class="kw-type">Directory</span>): <span class="kw-type">Promise&lt;File&gt;</span> {
    <span class="kw-var">const</span> bundle = dag.container()
      .from(<span class="kw-string">"node:26-alpine"</span>)
      .withDirectory(<span class="kw-string">"/app"</span>, src)
      .withWorkdir(<span class="kw-string">"/app"</span>)
      .withExec([<span class="kw-string">"npm"</span>, <span class="kw-string">"ci"</span>])
      .withExec([<span class="kw-string">"npm"</span>, <span class="kw-string">"run"</span>, <span class="kw-string">"build"</span>])
      .file(<span class="kw-string">"dist/index.js"</span>);
    <span class="kw-cmd">await</span> bundle.export(<span class="kw-string">"dist/index.js"</span>);
    <span class="kw-cmd">return</span> bundle;
  }

  <span class="kw-decorator">@func</span>()
  <span class="kw-cmd">async</span> <span class="kw-fn">publish</span>(<span class="kw-var">src</span>: <span class="kw-type">Directory</span>): <span class="kw-type">Promise&lt;string&gt;</span> {
    <span class="kw-var">const</span> bundle = <span class="kw-cmd">await</span> this.build(src);
    <span class="kw-cmd">return</span> dag.container()
      .from(<span class="kw-string">"node:26-alpine"</span>)
      .withFile(<span class="kw-string">"/app/dist/index.js"</span>, bundle)
      .withEntrypoint([<span class="kw-string">"node"</span>, <span class="kw-string">"/app/dist/index.js"</span>])
      .publish(<span class="kw-string">"docker.io/myorg/myapp:latest"</span>);
  }
}`,earthfileTitle:"Earthfile",earthfileCode:`<span class="kw-cmd">VERSION</span> <span class="kw-val">0.8</span>
<span class="kw-cmd">FROM</span> <span class="kw-string">node:26-alpine</span>
<span class="kw-cmd">WORKDIR</span> <span class="kw-string">/app</span>

<span class="kw-target">deps</span>:
  <span class="kw-cmd">COPY</span> package*.json ./
  <span class="kw-cmd">RUN</span> npm ci

<span class="kw-target">test</span>:
  <span class="kw-cmd">FROM</span> <span class="kw-target">+deps</span>
  <span class="kw-cmd">COPY</span> . ./
  <span class="kw-cmd">RUN</span> npm test

<span class="kw-target">build</span>:
  <span class="kw-cmd">FROM</span> <span class="kw-target">+deps</span>
  <span class="kw-cmd">COPY</span> . ./
  <span class="kw-cmd">RUN</span> npm run build
  <span class="kw-cmd">SAVE ARTIFACT</span> dist <span class="kw-flag">AS LOCAL</span> dist

<span class="kw-target">docker</span>:
  <span class="kw-cmd">FROM</span> <span class="kw-string">node:26-alpine</span>
  <span class="kw-cmd">WORKDIR</span> <span class="kw-string">/app</span>
  <span class="kw-cmd">COPY</span> package*.json ./
  <span class="kw-cmd">RUN</span> npm ci <span class="kw-flag">--omit=dev</span>
  <span class="kw-cmd">COPY</span> <span class="kw-target">+build</span>/dist ./dist
  <span class="kw-cmd">CMD</span> [<span class="kw-string">"node"</span>, <span class="kw-string">"dist/index.js"</span>]
  <span class="kw-cmd">SAVE IMAGE</span> <span class="kw-flag">--push</span> <span class="kw-string">docker.io/myorg/myapp:latest</span>

<span class="kw-target">all</span>:
  <span class="kw-cmd">BUILD</span> <span class="kw-target">+test</span>
  <span class="kw-cmd">BUILD</span> <span class="kw-target">+build</span>
  <span class="kw-cmd">BUILD</span> <span class="kw-target">+docker</span>`},gha:{legacyTitle:"Standard GitHub Actions Workflow",legacyCode:`<span class="kw-prop">name</span>: <span class="kw-string">CI &amp; Release</span>
<span class="kw-prop">on</span>: [<span class="kw-string">push</span>]

<span class="kw-prop">jobs</span>:
  <span class="kw-prop">pipeline</span>:
    <span class="kw-prop">runs-on</span>: <span class="kw-string">ubuntu-26.04</span>
    <span class="kw-prop">steps</span>:
      - <span class="kw-prop">uses</span>: <span class="kw-string">actions/checkout@v4</span>

      - <span class="kw-prop">name</span>: <span class="kw-string">Run Tests</span>
        <span class="kw-prop">run</span>: npm test

      - <span class="kw-prop">name</span>: <span class="kw-string">Build Host Binary / Package</span>
        <span class="kw-prop">run</span>: npm run build

      - <span class="kw-prop">uses</span>: <span class="kw-string">actions/upload-artifact@v4</span>
        <span class="kw-prop">with</span>:
          <span class="kw-prop">name</span>: <span class="kw-string">app-artifact</span>
          <span class="kw-prop">path</span>: <span class="kw-string">dist/bundle.js</span>

      - <span class="kw-prop">uses</span>: <span class="kw-string">docker/login-action@v3</span>
        <span class="kw-prop">with</span>:
          <span class="kw-prop">username</span>: <span class="kw-expr">\${{ secrets.DOCKER_USER }}</span>
          <span class="kw-prop">password</span>: <span class="kw-expr">\${{ secrets.DOCKER_TOKEN }}</span>

      - <span class="kw-prop">uses</span>: <span class="kw-string">docker/build-push-action@v6</span>
        <span class="kw-prop">with</span>:
          <span class="kw-prop">context</span>: <span class="kw-string">.</span>
          <span class="kw-prop">push</span>: <span class="kw-val">true</span>
          <span class="kw-prop">tags</span>: <span class="kw-string">docker.io/myorg/myapp:latest</span>`,earthfileTitle:"Clean GitHub Action with EarthBuild (10 Lines)",earthfileCode:`<span class="kw-prop">name</span>: <span class="kw-string">CI &amp; Release</span>
<span class="kw-prop">on</span>: [<span class="kw-string">push</span>]

<span class="kw-prop">jobs</span>:
  <span class="kw-prop">pipeline</span>:
    <span class="kw-prop">runs-on</span>: <span class="kw-string">ubuntu-latest</span>
    <span class="kw-prop">steps</span>:
      - <span class="kw-prop">uses</span>: <span class="kw-string">actions/checkout@v4</span>

      - <span class="kw-prop">name</span>: <span class="kw-string">Setup EarthBuild</span>
        <span class="kw-prop">uses</span>: <span class="kw-string">earthbuild/actions-setup@v2</span>

      - <span class="kw-prop">name</span>: <span class="kw-string">Test, Build Binary &amp; Push Image</span>
        <span class="kw-prop">run</span>: <span class="kw-cmd">earth</span> <span class="kw-flag">--ci</span> <span class="kw-flag">--push</span> <span class="kw-target">+all</span>
        <span class="kw-prop">env</span>:
          <span class="kw-prop">EARTH_DOCKER_CONFIG</span>: <span class="kw-expr">\${{ secrets.DOCKER_CONFIG }}</span>`}},typescript:{dockerfile:{legacyTitle:"Standard Dockerfile",legacyCode:`<span class="kw-cmd">FROM</span> <span class="kw-string">node:26-alpine</span> <span class="kw-cmd">AS</span> <span class="kw-target">deps</span>
<span class="kw-cmd">WORKDIR</span> <span class="kw-string">/app</span>
<span class="kw-cmd">COPY</span> package*.json tsconfig.json ./
<span class="kw-cmd">RUN</span> npm ci

<span class="kw-cmd">FROM</span> <span class="kw-target">deps</span> <span class="kw-cmd">AS</span> <span class="kw-target">test</span>
<span class="kw-cmd">COPY</span> src ./src tsconfig.json ./
<span class="kw-cmd">RUN</span> npm test

<span class="kw-cmd">FROM</span> <span class="kw-target">deps</span> <span class="kw-cmd">AS</span> <span class="kw-target">builder</span>
<span class="kw-cmd">COPY</span> src ./src tsconfig.json ./
<span class="kw-cmd">RUN</span> npx tsc --outDir dist

<span class="kw-cmd">FROM</span> <span class="kw-string">node:26-alpine</span> <span class="kw-cmd">AS</span> <span class="kw-target">runtime</span>
<span class="kw-cmd">COPY</span> <span class="kw-flag">--from</span>=<span class="kw-target">builder</span> /app/dist/index.js /usr/local/bin/app
<span class="kw-cmd">ENTRYPOINT</span> [<span class="kw-string">"/usr/local/bin/app"</span>]`,earthfileTitle:"Earthfile (Direct Host Artifacts & Push Built-In)",earthfileCode:`<span class="kw-cmd">VERSION</span> <span class="kw-val">0.8</span>
<span class="kw-cmd">FROM</span> <span class="kw-string">node:26-alpine</span>
<span class="kw-cmd">WORKDIR</span> <span class="kw-string">/app</span>

<span class="kw-target">deps</span>:
  <span class="kw-cmd">COPY</span> package*.json tsconfig.json ./
  <span class="kw-cmd">RUN</span> npm ci

<span class="kw-target">test</span>:
  <span class="kw-cmd">FROM</span> <span class="kw-target">+deps</span>
  <span class="kw-cmd">COPY</span> src ./src
  <span class="kw-cmd">RUN</span> npm test

<span class="kw-target">build</span>:
  <span class="kw-cmd">FROM</span> <span class="kw-target">+deps</span>
  <span class="kw-cmd">COPY</span> src ./src
  <span class="kw-cmd">RUN</span> npx tsc
  <span class="kw-cmd">SAVE ARTIFACT</span> dist <span class="kw-flag">AS LOCAL</span> dist

<span class="kw-target">docker</span>:
  <span class="kw-cmd">FROM</span> <span class="kw-string">node:26-alpine</span>
  <span class="kw-cmd">WORKDIR</span> <span class="kw-string">/app</span>
  <span class="kw-cmd">COPY</span> package*.json ./
  <span class="kw-cmd">RUN</span> npm ci <span class="kw-flag">--omit=dev</span>
  <span class="kw-cmd">COPY</span> <span class="kw-target">+build</span>/dist ./dist
  <span class="kw-cmd">CMD</span> [<span class="kw-string">"node"</span>, <span class="kw-string">"dist/index.js"</span>]
  <span class="kw-cmd">SAVE IMAGE</span> <span class="kw-flag">--push</span> <span class="kw-string">docker.io/myorg/myapp:latest</span>

<span class="kw-target">all</span>:
  <span class="kw-cmd">BUILD</span> <span class="kw-target">+test</span>
  <span class="kw-cmd">BUILD</span> <span class="kw-target">+build</span>
  <span class="kw-cmd">BUILD</span> <span class="kw-target">+docker</span>`},bake:{legacyTitle:"Docker Buildx Bake (Bake HCL + Dockerfile)",legacyCode:`<span class="kw-cmd">group</span> <span class="kw-string">"default"</span> {
  <span class="kw-prop">targets</span> = [<span class="kw-string">"test"</span>, <span class="kw-string">"build"</span>, <span class="kw-string">"image"</span>]
}

<span class="kw-cmd">target</span> <span class="kw-string">"test"</span> {
  <span class="kw-prop">dockerfile</span> = <span class="kw-string">"Dockerfile"</span>
  <span class="kw-prop">target</span>     = <span class="kw-string">"test"</span>
}

<span class="kw-cmd">target</span> <span class="kw-string">"build"</span> {
  <span class="kw-prop">dockerfile</span> = <span class="kw-string">"Dockerfile"</span>
  <span class="kw-prop">target</span>     = <span class="kw-string">"builder"</span>
  <span class="kw-prop">output</span>     = [<span class="kw-string">"type=local,dest=bin"</span>]
}

<span class="kw-cmd">target</span> <span class="kw-string">"image"</span> {
  <span class="kw-prop">dockerfile</span> = <span class="kw-string">"Dockerfile"</span>
  <span class="kw-prop">target</span>     = <span class="kw-string">"runtime"</span>
  <span class="kw-prop">tags</span>       = [<span class="kw-string">"docker.io/myorg/myapp:latest"</span>]
}`,earthfileTitle:"Earthfile (Self-Contained & Deterministic)",earthfileCode:`<span class="kw-cmd">VERSION</span> <span class="kw-val">0.8</span>
<span class="kw-cmd">FROM</span> <span class="kw-string">node:26-alpine</span>
<span class="kw-cmd">WORKDIR</span> <span class="kw-string">/app</span>

<span class="kw-target">deps</span>:
  <span class="kw-cmd">COPY</span> package*.json tsconfig.json ./
  <span class="kw-cmd">RUN</span> npm ci

<span class="kw-target">test</span>:
  <span class="kw-cmd">FROM</span> <span class="kw-target">+deps</span>
  <span class="kw-cmd">COPY</span> src ./src
  <span class="kw-cmd">RUN</span> npm test

<span class="kw-target">build</span>:
  <span class="kw-cmd">FROM</span> <span class="kw-target">+deps</span>
  <span class="kw-cmd">COPY</span> src ./src
  <span class="kw-cmd">RUN</span> npx tsc
  <span class="kw-cmd">SAVE ARTIFACT</span> dist <span class="kw-flag">AS LOCAL</span> dist

<span class="kw-target">docker</span>:
  <span class="kw-cmd">FROM</span> <span class="kw-string">node:26-alpine</span>
  <span class="kw-cmd">WORKDIR</span> <span class="kw-string">/app</span>
  <span class="kw-cmd">COPY</span> package*.json ./
  <span class="kw-cmd">RUN</span> npm ci <span class="kw-flag">--omit=dev</span>
  <span class="kw-cmd">COPY</span> <span class="kw-target">+build</span>/dist ./dist
  <span class="kw-cmd">CMD</span> [<span class="kw-string">"node"</span>, <span class="kw-string">"dist/index.js"</span>]
  <span class="kw-cmd">SAVE IMAGE</span> <span class="kw-flag">--push</span> <span class="kw-string">docker.io/myorg/myapp:latest</span>

<span class="kw-target">all</span>:
  <span class="kw-cmd">BUILD</span> <span class="kw-target">+test</span>
  <span class="kw-cmd">BUILD</span> <span class="kw-target">+build</span>
  <span class="kw-cmd">BUILD</span> <span class="kw-target">+docker</span>`},makefile:{legacyTitle:"Makefile (TypeScript Host Execution)",legacyCode:`<span class="kw-target">.PHONY</span>: <span class="kw-target">all</span> <span class="kw-target">test</span> <span class="kw-target">build</span> <span class="kw-target">docker</span>

<span class="kw-target">all</span>: <span class="kw-target">test</span> <span class="kw-target">build</span> <span class="kw-target">docker</span>

<span class="kw-target">test</span>:
	npm test

<span class="kw-target">build</span>:
	npx tsc --outDir dist

<span class="kw-target">docker</span>: <span class="kw-target">build</span>
	docker build <span class="kw-flag">-t</span> <span class="kw-string">docker.io/myorg/myapp:latest</span> .
	docker push <span class="kw-string">docker.io/myorg/myapp:latest</span>`,earthfileTitle:"Earthfile (Hermetic & Parallel)",earthfileCode:`<span class="kw-cmd">VERSION</span> <span class="kw-val">0.8</span>
<span class="kw-cmd">FROM</span> <span class="kw-string">node:26-alpine</span>
<span class="kw-cmd">WORKDIR</span> <span class="kw-string">/app</span>

<span class="kw-target">deps</span>:
  <span class="kw-cmd">COPY</span> package*.json tsconfig.json ./
  <span class="kw-cmd">RUN</span> npm ci

<span class="kw-target">test</span>:
  <span class="kw-cmd">FROM</span> <span class="kw-target">+deps</span>
  <span class="kw-cmd">COPY</span> src ./src
  <span class="kw-cmd">RUN</span> npm test

<span class="kw-target">build</span>:
  <span class="kw-cmd">FROM</span> <span class="kw-target">+deps</span>
  <span class="kw-cmd">COPY</span> src ./src
  <span class="kw-cmd">RUN</span> npx tsc
  <span class="kw-cmd">SAVE ARTIFACT</span> dist <span class="kw-flag">AS LOCAL</span> dist

<span class="kw-target">docker</span>:
  <span class="kw-cmd">FROM</span> <span class="kw-string">node:26-alpine</span>
  <span class="kw-cmd">WORKDIR</span> <span class="kw-string">/app</span>
  <span class="kw-cmd">COPY</span> package*.json ./
  <span class="kw-cmd">RUN</span> npm ci <span class="kw-flag">--omit=dev</span>
  <span class="kw-cmd">COPY</span> <span class="kw-target">+build</span>/dist ./dist
  <span class="kw-cmd">CMD</span> [<span class="kw-string">"node"</span>, <span class="kw-string">"dist/index.js"</span>]
  <span class="kw-cmd">SAVE IMAGE</span> <span class="kw-flag">--push</span> <span class="kw-string">docker.io/myorg/myapp:latest</span>

<span class="kw-target">all</span>:
  <span class="kw-cmd">BUILD</span> <span class="kw-target">+test</span>
  <span class="kw-cmd">BUILD</span> <span class="kw-target">+build</span>
  <span class="kw-cmd">BUILD</span> <span class="kw-target">+docker</span>`},dagger:{legacyTitle:"Dagger (TypeScript SDK)",legacyCode:`<span class="kw-cmd">import</span> { dag, Directory, File, object, func } <span class="kw-cmd">from</span> <span class="kw-string">"@dagger.io/dagger"</span>;

<span class="kw-decorator">@object</span>()
<span class="kw-cmd">export class</span> <span class="kw-type">Pipeline</span> {
  <span class="kw-decorator">@func</span>()
  <span class="kw-cmd">async</span> <span class="kw-fn">test</span>(<span class="kw-var">src</span>: <span class="kw-type">Directory</span>): <span class="kw-type">Promise&lt;string&gt;</span> {
    <span class="kw-cmd">return</span> dag.container()
      .from(<span class="kw-string">"node:26-alpine"</span>)
      .withDirectory(<span class="kw-string">"/app"</span>, src)
      .withWorkdir(<span class="kw-string">"/app"</span>)
      .withExec([<span class="kw-string">"npm"</span>, <span class="kw-string">"ci"</span>])
      .withExec([<span class="kw-string">"npm"</span>, <span class="kw-string">"test"</span>])
      .stdout();
  }

  <span class="kw-decorator">@func</span>()
  <span class="kw-cmd">async</span> <span class="kw-fn">build</span>(<span class="kw-var">src</span>: <span class="kw-type">Directory</span>): <span class="kw-type">Promise&lt;File&gt;</span> {
    <span class="kw-var">const</span> bundle = dag.container()
      .from(<span class="kw-string">"node:26-alpine"</span>)
      .withDirectory(<span class="kw-string">"/app"</span>, src)
      .withWorkdir(<span class="kw-string">"/app"</span>)
      .withExec([<span class="kw-string">"npm"</span>, <span class="kw-string">"ci"</span>])
      .withExec([<span class="kw-string">"npm"</span>, <span class="kw-string">"run"</span>, <span class="kw-string">"build"</span>])
      .file(<span class="kw-string">"dist/index.js"</span>);
    <span class="kw-cmd">await</span> bundle.export(<span class="kw-string">"dist/index.js"</span>);
    <span class="kw-cmd">return</span> bundle;
  }

  <span class="kw-decorator">@func</span>()
  <span class="kw-cmd">async</span> <span class="kw-fn">publish</span>(<span class="kw-var">src</span>: <span class="kw-type">Directory</span>): <span class="kw-type">Promise&lt;string&gt;</span> {
    <span class="kw-var">const</span> bundle = <span class="kw-cmd">await</span> this.build(src);
    <span class="kw-cmd">return</span> dag.container()
      .from(<span class="kw-string">"node:26-alpine"</span>)
      .withFile(<span class="kw-string">"/app/dist/index.js"</span>, bundle)
      .withEntrypoint([<span class="kw-string">"node"</span>, <span class="kw-string">"/app/dist/index.js"</span>])
      .publish(<span class="kw-string">"docker.io/myorg/myapp:latest"</span>);
  }
}`,earthfileTitle:"Earthfile",earthfileCode:`<span class="kw-cmd">VERSION</span> <span class="kw-val">0.8</span>
<span class="kw-cmd">FROM</span> <span class="kw-string">node:26-alpine</span>
<span class="kw-cmd">WORKDIR</span> <span class="kw-string">/app</span>

<span class="kw-target">deps</span>:
  <span class="kw-cmd">COPY</span> package*.json tsconfig.json ./
  <span class="kw-cmd">RUN</span> npm ci

<span class="kw-target">test</span>:
  <span class="kw-cmd">FROM</span> <span class="kw-target">+deps</span>
  <span class="kw-cmd">COPY</span> src ./src
  <span class="kw-cmd">RUN</span> npm test

<span class="kw-target">build</span>:
  <span class="kw-cmd">FROM</span> <span class="kw-target">+deps</span>
  <span class="kw-cmd">COPY</span> src ./src
  <span class="kw-cmd">RUN</span> npx tsc
  <span class="kw-cmd">SAVE ARTIFACT</span> dist <span class="kw-flag">AS LOCAL</span> dist

<span class="kw-target">docker</span>:
  <span class="kw-cmd">FROM</span> <span class="kw-string">node:26-alpine</span>
  <span class="kw-cmd">WORKDIR</span> <span class="kw-string">/app</span>
  <span class="kw-cmd">COPY</span> package*.json ./
  <span class="kw-cmd">RUN</span> npm ci <span class="kw-flag">--omit=dev</span>
  <span class="kw-cmd">COPY</span> <span class="kw-target">+build</span>/dist ./dist
  <span class="kw-cmd">CMD</span> [<span class="kw-string">"node"</span>, <span class="kw-string">"dist/index.js"</span>]
  <span class="kw-cmd">SAVE IMAGE</span> <span class="kw-flag">--push</span> <span class="kw-string">docker.io/myorg/myapp:latest</span>

<span class="kw-target">all</span>:
  <span class="kw-cmd">BUILD</span> <span class="kw-target">+test</span>
  <span class="kw-cmd">BUILD</span> <span class="kw-target">+build</span>
  <span class="kw-cmd">BUILD</span> <span class="kw-target">+docker</span>`},gha:{legacyTitle:"Standard GitHub Actions Workflow",legacyCode:`<span class="kw-prop">name</span>: <span class="kw-string">CI &amp; Release</span>
<span class="kw-prop">on</span>: [<span class="kw-string">push</span>]

<span class="kw-prop">jobs</span>:
  <span class="kw-prop">pipeline</span>:
    <span class="kw-prop">runs-on</span>: <span class="kw-string">ubuntu-26.04</span>
    <span class="kw-prop">steps</span>:
      - <span class="kw-prop">uses</span>: <span class="kw-string">actions/checkout@v4</span>

      - <span class="kw-prop">name</span>: <span class="kw-string">Run Tests</span>
        <span class="kw-prop">run</span>: npm test

      - <span class="kw-prop">name</span>: <span class="kw-string">Build Host Binary / Package</span>
        <span class="kw-prop">run</span>: npx tsc --outDir dist

      - <span class="kw-prop">uses</span>: <span class="kw-string">actions/upload-artifact@v4</span>
        <span class="kw-prop">with</span>:
          <span class="kw-prop">name</span>: <span class="kw-string">app-artifact</span>
          <span class="kw-prop">path</span>: <span class="kw-string">dist/index.js</span>

      - <span class="kw-prop">uses</span>: <span class="kw-string">docker/login-action@v3</span>
        <span class="kw-prop">with</span>:
          <span class="kw-prop">username</span>: <span class="kw-expr">\${{ secrets.DOCKER_USER }}</span>
          <span class="kw-prop">password</span>: <span class="kw-expr">\${{ secrets.DOCKER_TOKEN }}</span>

      - <span class="kw-prop">uses</span>: <span class="kw-string">docker/build-push-action@v6</span>
        <span class="kw-prop">with</span>:
          <span class="kw-prop">context</span>: <span class="kw-string">.</span>
          <span class="kw-prop">push</span>: <span class="kw-val">true</span>
          <span class="kw-prop">tags</span>: <span class="kw-string">docker.io/myorg/myapp:latest</span>`,earthfileTitle:"Clean GitHub Action with EarthBuild (10 Lines)",earthfileCode:`<span class="kw-prop">name</span>: <span class="kw-string">CI &amp; Release</span>
<span class="kw-prop">on</span>: [<span class="kw-string">push</span>]

<span class="kw-prop">jobs</span>:
  <span class="kw-prop">pipeline</span>:
    <span class="kw-prop">runs-on</span>: <span class="kw-string">ubuntu-latest</span>
    <span class="kw-prop">steps</span>:
      - <span class="kw-prop">uses</span>: <span class="kw-string">actions/checkout@v4</span>

      - <span class="kw-prop">name</span>: <span class="kw-string">Setup EarthBuild</span>
        <span class="kw-prop">uses</span>: <span class="kw-string">earthbuild/actions-setup@v2</span>

      - <span class="kw-prop">name</span>: <span class="kw-string">Test, Build Binary &amp; Push Image</span>
        <span class="kw-prop">run</span>: <span class="kw-cmd">earth</span> <span class="kw-flag">--ci</span> <span class="kw-flag">--push</span> <span class="kw-target">+all</span>
        <span class="kw-prop">env</span>:
          <span class="kw-prop">EARTH_DOCKER_CONFIG</span>: <span class="kw-expr">\${{ secrets.DOCKER_CONFIG }}</span>`}},java:{dockerfile:{legacyTitle:"Standard Dockerfile",legacyCode:`<span class="kw-cmd">FROM</span> <span class="kw-string">maven:3.9-eclipse-temurin-25-alpine</span> <span class="kw-cmd">AS</span> <span class="kw-target">deps</span>
<span class="kw-cmd">WORKDIR</span> <span class="kw-string">/app</span>
<span class="kw-cmd">COPY</span> pom.xml ./
<span class="kw-cmd">RUN</span> mvn dependency:go-offline

<span class="kw-cmd">FROM</span> <span class="kw-target">deps</span> <span class="kw-cmd">AS</span> <span class="kw-target">test</span>
<span class="kw-cmd">COPY</span> src ./src pom.xml ./
<span class="kw-cmd">RUN</span> mvn test

<span class="kw-cmd">FROM</span> <span class="kw-target">deps</span> <span class="kw-cmd">AS</span> <span class="kw-target">builder</span>
<span class="kw-cmd">COPY</span> src ./src pom.xml ./
<span class="kw-cmd">RUN</span> mvn package -DskipTests

<span class="kw-cmd">FROM</span> <span class="kw-string">eclipse-temurin:25-jre-alpine</span> <span class="kw-cmd">AS</span> <span class="kw-target">runtime</span>
<span class="kw-cmd">COPY</span> <span class="kw-flag">--from</span>=<span class="kw-target">builder</span> /app/target/app.jar /usr/local/bin/app
<span class="kw-cmd">ENTRYPOINT</span> [<span class="kw-string">"/usr/local/bin/app"</span>]`,earthfileTitle:"Earthfile (Direct Host Artifacts & Push Built-In)",earthfileCode:`<span class="kw-cmd">VERSION</span> <span class="kw-val">0.8</span>
<span class="kw-cmd">FROM</span> <span class="kw-string">maven:3.9-eclipse-temurin-25-alpine</span>
<span class="kw-cmd">WORKDIR</span> <span class="kw-string">/app</span>

<span class="kw-target">deps</span>:
  <span class="kw-cmd">COPY</span> pom.xml ./
  <span class="kw-cmd">RUN</span> mvn dependency:go-offline

<span class="kw-target">test</span>:
  <span class="kw-cmd">FROM</span> <span class="kw-target">+deps</span>
  <span class="kw-cmd">COPY</span> src ./src
  <span class="kw-cmd">RUN</span> mvn test

<span class="kw-target">build</span>:
  <span class="kw-cmd">FROM</span> <span class="kw-target">+deps</span>
  <span class="kw-cmd">COPY</span> src ./src
  <span class="kw-cmd">RUN</span> mvn package <span class="kw-flag">-DskipTests</span>
  <span class="kw-cmd">SAVE ARTIFACT</span> target/*.jar <span class="kw-flag">AS LOCAL</span> bin/app.jar

<span class="kw-target">docker</span>:
  <span class="kw-cmd">FROM</span> <span class="kw-string">eclipse-temurin:25-jre-alpine</span>
  <span class="kw-cmd">COPY</span> <span class="kw-target">+build</span>/bin/app.jar /app/app.jar
  <span class="kw-cmd">ENTRYPOINT</span> [<span class="kw-string">"java"</span>, <span class="kw-string">"-jar"</span>, <span class="kw-string">"/app/app.jar"</span>]
  <span class="kw-cmd">SAVE IMAGE</span> <span class="kw-flag">--push</span> <span class="kw-string">docker.io/myorg/myapp:latest</span>

<span class="kw-target">all</span>:
  <span class="kw-cmd">BUILD</span> <span class="kw-target">+test</span>
  <span class="kw-cmd">BUILD</span> <span class="kw-target">+build</span>
  <span class="kw-cmd">BUILD</span> <span class="kw-target">+docker</span>`},bake:{legacyTitle:"Docker Buildx Bake (Bake HCL + Dockerfile)",legacyCode:`<span class="kw-cmd">group</span> <span class="kw-string">"default"</span> {
  <span class="kw-prop">targets</span> = [<span class="kw-string">"test"</span>, <span class="kw-string">"build"</span>, <span class="kw-string">"image"</span>]
}

<span class="kw-cmd">target</span> <span class="kw-string">"test"</span> {
  <span class="kw-prop">dockerfile</span> = <span class="kw-string">"Dockerfile"</span>
  <span class="kw-prop">target</span>     = <span class="kw-string">"test"</span>
}

<span class="kw-cmd">target</span> <span class="kw-string">"build"</span> {
  <span class="kw-prop">dockerfile</span> = <span class="kw-string">"Dockerfile"</span>
  <span class="kw-prop">target</span>     = <span class="kw-string">"builder"</span>
  <span class="kw-prop">output</span>     = [<span class="kw-string">"type=local,dest=bin"</span>]
}

<span class="kw-cmd">target</span> <span class="kw-string">"image"</span> {
  <span class="kw-prop">dockerfile</span> = <span class="kw-string">"Dockerfile"</span>
  <span class="kw-prop">target</span>     = <span class="kw-string">"runtime"</span>
  <span class="kw-prop">tags</span>       = [<span class="kw-string">"docker.io/myorg/myapp:latest"</span>]
}`,earthfileTitle:"Earthfile (Self-Contained & Deterministic)",earthfileCode:`<span class="kw-cmd">VERSION</span> <span class="kw-val">0.8</span>
<span class="kw-cmd">FROM</span> <span class="kw-string">maven:3.9-eclipse-temurin-25-alpine</span>
<span class="kw-cmd">WORKDIR</span> <span class="kw-string">/app</span>

<span class="kw-target">deps</span>:
  <span class="kw-cmd">COPY</span> pom.xml ./
  <span class="kw-cmd">RUN</span> mvn dependency:go-offline

<span class="kw-target">test</span>:
  <span class="kw-cmd">FROM</span> <span class="kw-target">+deps</span>
  <span class="kw-cmd">COPY</span> src ./src
  <span class="kw-cmd">RUN</span> mvn test

<span class="kw-target">build</span>:
  <span class="kw-cmd">FROM</span> <span class="kw-target">+deps</span>
  <span class="kw-cmd">COPY</span> src ./src
  <span class="kw-cmd">RUN</span> mvn package <span class="kw-flag">-DskipTests</span>
  <span class="kw-cmd">SAVE ARTIFACT</span> target/*.jar <span class="kw-flag">AS LOCAL</span> bin/app.jar

<span class="kw-target">docker</span>:
  <span class="kw-cmd">FROM</span> <span class="kw-string">eclipse-temurin:25-jre-alpine</span>
  <span class="kw-cmd">COPY</span> <span class="kw-target">+build</span>/bin/app.jar /app/app.jar
  <span class="kw-cmd">ENTRYPOINT</span> [<span class="kw-string">"java"</span>, <span class="kw-string">"-jar"</span>, <span class="kw-string">"/app/app.jar"</span>]
  <span class="kw-cmd">SAVE IMAGE</span> <span class="kw-flag">--push</span> <span class="kw-string">docker.io/myorg/myapp:latest</span>

<span class="kw-target">all</span>:
  <span class="kw-cmd">BUILD</span> <span class="kw-target">+test</span>
  <span class="kw-cmd">BUILD</span> <span class="kw-target">+build</span>
  <span class="kw-cmd">BUILD</span> <span class="kw-target">+docker</span>`},makefile:{legacyTitle:"Makefile (Java Host Execution)",legacyCode:`<span class="kw-target">.PHONY</span>: <span class="kw-target">all</span> <span class="kw-target">test</span> <span class="kw-target">build</span> <span class="kw-target">docker</span>

<span class="kw-target">all</span>: <span class="kw-target">test</span> <span class="kw-target">build</span> <span class="kw-target">docker</span>

<span class="kw-target">test</span>:
	mvn test

<span class="kw-target">build</span>:
	mvn package -DskipTests

<span class="kw-target">docker</span>: <span class="kw-target">build</span>
	docker build <span class="kw-flag">-t</span> <span class="kw-string">docker.io/myorg/myapp:latest</span> .
	docker push <span class="kw-string">docker.io/myorg/myapp:latest</span>`,earthfileTitle:"Earthfile (Hermetic & Parallel)",earthfileCode:`<span class="kw-cmd">VERSION</span> <span class="kw-val">0.8</span>
<span class="kw-cmd">FROM</span> <span class="kw-string">maven:3.9-eclipse-temurin-25-alpine</span>
<span class="kw-cmd">WORKDIR</span> <span class="kw-string">/app</span>

<span class="kw-target">deps</span>:
  <span class="kw-cmd">COPY</span> pom.xml ./
  <span class="kw-cmd">RUN</span> mvn dependency:go-offline

<span class="kw-target">test</span>:
  <span class="kw-cmd">FROM</span> <span class="kw-target">+deps</span>
  <span class="kw-cmd">COPY</span> src ./src
  <span class="kw-cmd">RUN</span> mvn test

<span class="kw-target">build</span>:
  <span class="kw-cmd">FROM</span> <span class="kw-target">+deps</span>
  <span class="kw-cmd">COPY</span> src ./src
  <span class="kw-cmd">RUN</span> mvn package <span class="kw-flag">-DskipTests</span>
  <span class="kw-cmd">SAVE ARTIFACT</span> target/*.jar <span class="kw-flag">AS LOCAL</span> bin/app.jar

<span class="kw-target">docker</span>:
  <span class="kw-cmd">FROM</span> <span class="kw-string">eclipse-temurin:25-jre-alpine</span>
  <span class="kw-cmd">COPY</span> <span class="kw-target">+build</span>/bin/app.jar /app/app.jar
  <span class="kw-cmd">ENTRYPOINT</span> [<span class="kw-string">"java"</span>, <span class="kw-string">"-jar"</span>, <span class="kw-string">"/app/app.jar"</span>]
  <span class="kw-cmd">SAVE IMAGE</span> <span class="kw-flag">--push</span> <span class="kw-string">docker.io/myorg/myapp:latest</span>

<span class="kw-target">all</span>:
  <span class="kw-cmd">BUILD</span> <span class="kw-target">+test</span>
  <span class="kw-cmd">BUILD</span> <span class="kw-target">+build</span>
  <span class="kw-cmd">BUILD</span> <span class="kw-target">+docker</span>`},dagger:{legacyTitle:"Dagger (Java SDK)",legacyCode:`<span class="kw-cmd">package</span> io.dagger.modules.pipeline;

<span class="kw-cmd">import static</span> io.dagger.client.Dagger.dag;
<span class="kw-cmd">import</span> io.dagger.client.Container;
<span class="kw-cmd">import</span> io.dagger.client.Directory;
<span class="kw-cmd">import</span> io.dagger.client.File;
<span class="kw-cmd">import</span> io.dagger.module.annotation.Function;
<span class="kw-cmd">import</span> io.dagger.module.annotation.Object;
<span class="kw-cmd">import</span> java.util.List;

<span class="kw-decorator">@Object</span>
<span class="kw-cmd">public class</span> <span class="kw-type">Pipeline</span> {

  <span class="kw-cmd">private</span> <span class="kw-type">Container</span> <span class="kw-fn">base</span>(<span class="kw-type">Directory</span> <span class="kw-var">src</span>) {
    <span class="kw-cmd">return</span> <span class="kw-fn">dag</span>().<span class="kw-fn">container</span>()
      .<span class="kw-fn">from</span>(<span class="kw-string">"maven:3.9-eclipse-temurin-25-alpine"</span>)
      .<span class="kw-fn">withWorkdir</span>(<span class="kw-string">"/app"</span>)
      .<span class="kw-fn">withMountedDirectory</span>(<span class="kw-string">"/app"</span>, <span class="kw-var">src</span>)
      .<span class="kw-fn">withExec</span>(<span class="kw-type">List</span>.<span class="kw-fn">of</span>(<span class="kw-string">"mvn"</span>, <span class="kw-string">"dependency:go-offline"</span>));
  }

  <span class="kw-decorator">@Function</span>
  <span class="kw-cmd">public</span> <span class="kw-type">String</span> <span class="kw-fn">test</span>(<span class="kw-type">Directory</span> <span class="kw-var">src</span>) <span class="kw-cmd">throws</span> <span class="kw-type">Exception</span> {
    <span class="kw-cmd">return</span> <span class="kw-fn">base</span>(<span class="kw-var">src</span>)
      .<span class="kw-fn">withExec</span>(<span class="kw-type">List</span>.<span class="kw-fn">of</span>(<span class="kw-string">"mvn"</span>, <span class="kw-string">"test"</span>))
      .<span class="kw-fn">stdout</span>();
  }

  <span class="kw-decorator">@Function</span>
  <span class="kw-cmd">public</span> <span class="kw-type">File</span> <span class="kw-fn">build</span>(<span class="kw-type">Directory</span> <span class="kw-var">src</span>) <span class="kw-cmd">throws</span> <span class="kw-type">Exception</span> {
    <span class="kw-type">File</span> <span class="kw-var">jar</span> = <span class="kw-fn">base</span>(<span class="kw-var">src</span>)
      .<span class="kw-fn">withExec</span>(<span class="kw-type">List</span>.<span class="kw-fn">of</span>(<span class="kw-string">"mvn"</span>, <span class="kw-string">"package"</span>, <span class="kw-string">"-DskipTests"</span>))
      .<span class="kw-fn">file</span>(<span class="kw-string">"target/app.jar"</span>);
    <span class="kw-var">jar</span>.<span class="kw-fn">export</span>(<span class="kw-string">"bin/app.jar"</span>);
    <span class="kw-cmd">return</span> <span class="kw-var">jar</span>;
  }

  <span class="kw-decorator">@Function</span>
  <span class="kw-cmd">public</span> <span class="kw-type">String</span> <span class="kw-fn">publish</span>(<span class="kw-type">Directory</span> <span class="kw-var">src</span>) <span class="kw-cmd">throws</span> <span class="kw-type">Exception</span> {
    <span class="kw-type">File</span> <span class="kw-var">jar</span> = <span class="kw-fn">build</span>(<span class="kw-var">src</span>);
    <span class="kw-cmd">return</span> <span class="kw-fn">dag</span>().<span class="kw-fn">container</span>()
      .<span class="kw-fn">from</span>(<span class="kw-string">"eclipse-temurin:25-jre-alpine"</span>)
      .<span class="kw-fn">withFile</span>(<span class="kw-string">"/app/app.jar"</span>, <span class="kw-var">jar</span>)
      .<span class="kw-fn">withEntrypoint</span>(<span class="kw-type">List</span>.<span class="kw-fn">of</span>(<span class="kw-string">"java"</span>, <span class="kw-string">"-jar"</span>, <span class="kw-string">"/app/app.jar"</span>))
      .<span class="kw-fn">publish</span>(<span class="kw-string">"docker.io/myorg/myapp:latest"</span>);
  }
}`,earthfileTitle:"Earthfile",earthfileCode:`<span class="kw-cmd">VERSION</span> <span class="kw-val">0.8</span>
<span class="kw-cmd">FROM</span> <span class="kw-string">maven:3.9-eclipse-temurin-25-alpine</span>
<span class="kw-cmd">WORKDIR</span> <span class="kw-string">/app</span>

<span class="kw-target">deps</span>:
  <span class="kw-cmd">COPY</span> pom.xml ./
  <span class="kw-cmd">RUN</span> mvn dependency:go-offline

<span class="kw-target">test</span>:
  <span class="kw-cmd">FROM</span> <span class="kw-target">+deps</span>
  <span class="kw-cmd">COPY</span> src ./src
  <span class="kw-cmd">RUN</span> mvn test

<span class="kw-target">build</span>:
  <span class="kw-cmd">FROM</span> <span class="kw-target">+deps</span>
  <span class="kw-cmd">COPY</span> src ./src
  <span class="kw-cmd">RUN</span> mvn package <span class="kw-flag">-DskipTests</span>
  <span class="kw-cmd">SAVE ARTIFACT</span> target/*.jar <span class="kw-flag">AS LOCAL</span> bin/app.jar

<span class="kw-target">docker</span>:
  <span class="kw-cmd">FROM</span> <span class="kw-string">eclipse-temurin:25-jre-alpine</span>
  <span class="kw-cmd">COPY</span> <span class="kw-target">+build</span>/bin/app.jar /app/app.jar
  <span class="kw-cmd">ENTRYPOINT</span> [<span class="kw-string">"java"</span>, <span class="kw-string">"-jar"</span>, <span class="kw-string">"/app/app.jar"</span>]
  <span class="kw-cmd">SAVE IMAGE</span> <span class="kw-flag">--push</span> <span class="kw-string">docker.io/myorg/myapp:latest</span>

<span class="kw-target">all</span>:
  <span class="kw-cmd">BUILD</span> <span class="kw-target">+test</span>
  <span class="kw-cmd">BUILD</span> <span class="kw-target">+build</span>
  <span class="kw-cmd">BUILD</span> <span class="kw-target">+docker</span>`},gha:{legacyTitle:"Standard GitHub Actions Workflow",legacyCode:`<span class="kw-prop">name</span>: <span class="kw-string">CI &amp; Release</span>
<span class="kw-prop">on</span>: [<span class="kw-string">push</span>]

<span class="kw-prop">jobs</span>:
  <span class="kw-prop">pipeline</span>:
    <span class="kw-prop">runs-on</span>: <span class="kw-string">ubuntu-26.04</span>
    <span class="kw-prop">steps</span>:
      - <span class="kw-prop">uses</span>: <span class="kw-string">actions/checkout@v4</span>

      - <span class="kw-prop">name</span>: <span class="kw-string">Run Tests</span>
        <span class="kw-prop">run</span>: mvn test

      - <span class="kw-prop">name</span>: <span class="kw-string">Build Host Binary / Package</span>
        <span class="kw-prop">run</span>: mvn package -DskipTests

      - <span class="kw-prop">uses</span>: <span class="kw-string">actions/upload-artifact@v4</span>
        <span class="kw-prop">with</span>:
          <span class="kw-prop">name</span>: <span class="kw-string">app-artifact</span>
          <span class="kw-prop">path</span>: <span class="kw-string">target/app.jar</span>

      - <span class="kw-prop">uses</span>: <span class="kw-string">docker/login-action@v3</span>
        <span class="kw-prop">with</span>:
          <span class="kw-prop">username</span>: <span class="kw-expr">\${{ secrets.DOCKER_USER }}</span>
          <span class="kw-prop">password</span>: <span class="kw-expr">\${{ secrets.DOCKER_TOKEN }}</span>

      - <span class="kw-prop">uses</span>: <span class="kw-string">docker/build-push-action@v6</span>
        <span class="kw-prop">with</span>:
          <span class="kw-prop">context</span>: <span class="kw-string">.</span>
          <span class="kw-prop">push</span>: <span class="kw-val">true</span>
          <span class="kw-prop">tags</span>: <span class="kw-string">docker.io/myorg/myapp:latest</span>`,earthfileTitle:"Clean GitHub Action with EarthBuild (10 Lines)",earthfileCode:`<span class="kw-prop">name</span>: <span class="kw-string">CI &amp; Release</span>
<span class="kw-prop">on</span>: [<span class="kw-string">push</span>]

<span class="kw-prop">jobs</span>:
  <span class="kw-prop">pipeline</span>:
    <span class="kw-prop">runs-on</span>: <span class="kw-string">ubuntu-latest</span>
    <span class="kw-prop">steps</span>:
      - <span class="kw-prop">uses</span>: <span class="kw-string">actions/checkout@v4</span>

      - <span class="kw-prop">name</span>: <span class="kw-string">Setup EarthBuild</span>
        <span class="kw-prop">uses</span>: <span class="kw-string">earthbuild/actions-setup@v2</span>

      - <span class="kw-prop">name</span>: <span class="kw-string">Test, Build Binary &amp; Push Image</span>
        <span class="kw-prop">run</span>: <span class="kw-cmd">earth</span> <span class="kw-flag">--ci</span> <span class="kw-flag">--push</span> <span class="kw-target">+all</span>
        <span class="kw-prop">env</span>:
          <span class="kw-prop">EARTH_DOCKER_CONFIG</span>: <span class="kw-expr">\${{ secrets.DOCKER_CONFIG }}</span>`}},cpp:{dockerfile:{legacyTitle:"Standard Dockerfile",legacyCode:`<span class="kw-cmd">FROM</span> <span class="kw-string">alpine:3.24</span> <span class="kw-cmd">AS</span> <span class="kw-target">deps</span>
<span class="kw-cmd">WORKDIR</span> <span class="kw-string">/app</span>
<span class="kw-cmd">COPY</span> CMakeLists.txt ./
<span class="kw-cmd">RUN</span> cmake -B build -G Ninja

<span class="kw-cmd">FROM</span> <span class="kw-target">deps</span> <span class="kw-cmd">AS</span> <span class="kw-target">test</span>
<span class="kw-cmd">COPY</span> src ./src CMakeLists.txt ./
<span class="kw-cmd">RUN</span> ctest --test-dir build --output-on-failure

<span class="kw-cmd">FROM</span> <span class="kw-target">deps</span> <span class="kw-cmd">AS</span> <span class="kw-target">builder</span>
<span class="kw-cmd">COPY</span> src ./src CMakeLists.txt ./
<span class="kw-cmd">RUN</span> cmake --build build --config Release

<span class="kw-cmd">FROM</span> <span class="kw-string">alpine:3.24</span> <span class="kw-cmd">AS</span> <span class="kw-target">runtime</span>
<span class="kw-cmd">COPY</span> <span class="kw-flag">--from</span>=<span class="kw-target">builder</span> /app/build/bin/app /usr/local/bin/app
<span class="kw-cmd">ENTRYPOINT</span> [<span class="kw-string">"/usr/local/bin/app"</span>]`,earthfileTitle:"Earthfile (Direct Host Artifacts & Push Built-In)",earthfileCode:`<span class="kw-cmd">VERSION</span> <span class="kw-val">0.8</span>
<span class="kw-cmd">FROM</span> <span class="kw-string">alpine:3.24</span>
<span class="kw-cmd">RUN</span> apk add <span class="kw-flag">--no-cache</span> build-base cmake ninja
<span class="kw-cmd">WORKDIR</span> <span class="kw-string">/app</span>

<span class="kw-target">deps</span>:
  <span class="kw-cmd">COPY</span> CMakeLists.txt ./
  <span class="kw-cmd">RUN</span> cmake <span class="kw-flag">-B</span> build <span class="kw-flag">-G</span> Ninja

<span class="kw-target">test</span>:
  <span class="kw-cmd">FROM</span> <span class="kw-target">+deps</span>
  <span class="kw-cmd">COPY</span> src ./src
  <span class="kw-cmd">RUN</span> cmake <span class="kw-flag">--build</span> build <span class="kw-flag">--target</span> test

<span class="kw-target">build</span>:
  <span class="kw-cmd">FROM</span> <span class="kw-target">+deps</span>
  <span class="kw-cmd">COPY</span> src ./src
  <span class="kw-cmd">RUN</span> cmake <span class="kw-flag">--build</span> build <span class="kw-flag">--config</span> Release
  <span class="kw-cmd">SAVE ARTIFACT</span> build/bin/app <span class="kw-flag">AS LOCAL</span> bin/app

<span class="kw-target">docker</span>:
  <span class="kw-cmd">FROM</span> <span class="kw-string">alpine:3.24</span>
  <span class="kw-cmd">RUN</span> apk add <span class="kw-flag">--no-cache</span> libstdc++
  <span class="kw-cmd">COPY</span> <span class="kw-target">+build</span>/bin/app /usr/local/bin/app
  <span class="kw-cmd">ENTRYPOINT</span> [<span class="kw-string">"/usr/local/bin/app"</span>]
  <span class="kw-cmd">SAVE IMAGE</span> <span class="kw-flag">--push</span> <span class="kw-string">docker.io/myorg/myapp:latest</span>

<span class="kw-target">all</span>:
  <span class="kw-cmd">BUILD</span> <span class="kw-target">+test</span>
  <span class="kw-cmd">BUILD</span> <span class="kw-target">+build</span>
  <span class="kw-cmd">BUILD</span> <span class="kw-target">+docker</span>`},bake:{legacyTitle:"Docker Buildx Bake (Bake HCL + Dockerfile)",legacyCode:`<span class="kw-cmd">group</span> <span class="kw-string">"default"</span> {
  <span class="kw-prop">targets</span> = [<span class="kw-string">"test"</span>, <span class="kw-string">"build"</span>, <span class="kw-string">"image"</span>]
}

<span class="kw-cmd">target</span> <span class="kw-string">"test"</span> {
  <span class="kw-prop">dockerfile</span> = <span class="kw-string">"Dockerfile"</span>
  <span class="kw-prop">target</span>     = <span class="kw-string">"test"</span>
}

<span class="kw-cmd">target</span> <span class="kw-string">"build"</span> {
  <span class="kw-prop">dockerfile</span> = <span class="kw-string">"Dockerfile"</span>
  <span class="kw-prop">target</span>     = <span class="kw-string">"builder"</span>
  <span class="kw-prop">output</span>     = [<span class="kw-string">"type=local,dest=bin"</span>]
}

<span class="kw-cmd">target</span> <span class="kw-string">"image"</span> {
  <span class="kw-prop">dockerfile</span> = <span class="kw-string">"Dockerfile"</span>
  <span class="kw-prop">target</span>     = <span class="kw-string">"runtime"</span>
  <span class="kw-prop">tags</span>       = [<span class="kw-string">"docker.io/myorg/myapp:latest"</span>]
}`,earthfileTitle:"Earthfile (Self-Contained & Deterministic)",earthfileCode:`<span class="kw-cmd">VERSION</span> <span class="kw-val">0.8</span>
<span class="kw-cmd">FROM</span> <span class="kw-string">alpine:3.24</span>
<span class="kw-cmd">RUN</span> apk add <span class="kw-flag">--no-cache</span> build-base cmake ninja
<span class="kw-cmd">WORKDIR</span> <span class="kw-string">/app</span>

<span class="kw-target">deps</span>:
  <span class="kw-cmd">COPY</span> CMakeLists.txt ./
  <span class="kw-cmd">RUN</span> cmake <span class="kw-flag">-B</span> build <span class="kw-flag">-G</span> Ninja

<span class="kw-target">test</span>:
  <span class="kw-cmd">FROM</span> <span class="kw-target">+deps</span>
  <span class="kw-cmd">COPY</span> src ./src
  <span class="kw-cmd">RUN</span> cmake <span class="kw-flag">--build</span> build <span class="kw-flag">--target</span> test

<span class="kw-target">build</span>:
  <span class="kw-cmd">FROM</span> <span class="kw-target">+deps</span>
  <span class="kw-cmd">COPY</span> src ./src
  <span class="kw-cmd">RUN</span> cmake <span class="kw-flag">--build</span> build <span class="kw-flag">--config</span> Release
  <span class="kw-cmd">SAVE ARTIFACT</span> build/bin/app <span class="kw-flag">AS LOCAL</span> bin/app

<span class="kw-target">docker</span>:
  <span class="kw-cmd">FROM</span> <span class="kw-string">alpine:3.24</span>
  <span class="kw-cmd">RUN</span> apk add <span class="kw-flag">--no-cache</span> libstdc++
  <span class="kw-cmd">COPY</span> <span class="kw-target">+build</span>/bin/app /usr/local/bin/app
  <span class="kw-cmd">ENTRYPOINT</span> [<span class="kw-string">"/usr/local/bin/app"</span>]
  <span class="kw-cmd">SAVE IMAGE</span> <span class="kw-flag">--push</span> <span class="kw-string">docker.io/myorg/myapp:latest</span>

<span class="kw-target">all</span>:
  <span class="kw-cmd">BUILD</span> <span class="kw-target">+test</span>
  <span class="kw-cmd">BUILD</span> <span class="kw-target">+build</span>
  <span class="kw-cmd">BUILD</span> <span class="kw-target">+docker</span>`},makefile:{legacyTitle:"Makefile (C++ Host Execution)",legacyCode:`<span class="kw-target">.PHONY</span>: <span class="kw-target">all</span> <span class="kw-target">test</span> <span class="kw-target">build</span> <span class="kw-target">docker</span>

<span class="kw-target">all</span>: <span class="kw-target">test</span> <span class="kw-target">build</span> <span class="kw-target">docker</span>

<span class="kw-target">test</span>:
	ctest --test-dir build --output-on-failure

<span class="kw-target">build</span>:
	cmake --build build --config Release

<span class="kw-target">docker</span>: <span class="kw-target">build</span>
	docker build <span class="kw-flag">-t</span> <span class="kw-string">docker.io/myorg/myapp:latest</span> .
	docker push <span class="kw-string">docker.io/myorg/myapp:latest</span>`,earthfileTitle:"Earthfile (Hermetic & Parallel)",earthfileCode:`<span class="kw-cmd">VERSION</span> <span class="kw-val">0.8</span>
<span class="kw-cmd">FROM</span> <span class="kw-string">alpine:3.24</span>
<span class="kw-cmd">RUN</span> apk add <span class="kw-flag">--no-cache</span> build-base cmake ninja
<span class="kw-cmd">WORKDIR</span> <span class="kw-string">/app</span>

<span class="kw-target">deps</span>:
  <span class="kw-cmd">COPY</span> CMakeLists.txt ./
  <span class="kw-cmd">RUN</span> cmake <span class="kw-flag">-B</span> build <span class="kw-flag">-G</span> Ninja

<span class="kw-target">test</span>:
  <span class="kw-cmd">FROM</span> <span class="kw-target">+deps</span>
  <span class="kw-cmd">COPY</span> src ./src
  <span class="kw-cmd">RUN</span> cmake <span class="kw-flag">--build</span> build <span class="kw-flag">--target</span> test

<span class="kw-target">build</span>:
  <span class="kw-cmd">FROM</span> <span class="kw-target">+deps</span>
  <span class="kw-cmd">COPY</span> src ./src
  <span class="kw-cmd">RUN</span> cmake <span class="kw-flag">--build</span> build <span class="kw-flag">--config</span> Release
  <span class="kw-cmd">SAVE ARTIFACT</span> build/bin/app <span class="kw-flag">AS LOCAL</span> bin/app

<span class="kw-target">docker</span>:
  <span class="kw-cmd">FROM</span> <span class="kw-string">alpine:3.24</span>
  <span class="kw-cmd">RUN</span> apk add <span class="kw-flag">--no-cache</span> libstdc++
  <span class="kw-cmd">COPY</span> <span class="kw-target">+build</span>/bin/app /usr/local/bin/app
  <span class="kw-cmd">ENTRYPOINT</span> [<span class="kw-string">"/usr/local/bin/app"</span>]
  <span class="kw-cmd">SAVE IMAGE</span> <span class="kw-flag">--push</span> <span class="kw-string">docker.io/myorg/myapp:latest</span>

<span class="kw-target">all</span>:
  <span class="kw-cmd">BUILD</span> <span class="kw-target">+test</span>
  <span class="kw-cmd">BUILD</span> <span class="kw-target">+build</span>
  <span class="kw-cmd">BUILD</span> <span class="kw-target">+docker</span>`},dagger:{legacyTitle:"Dagger (Go SDK Module \u2014 No Native C++ SDK)",legacyCode:`<span class="kw-cmd">package</span> main

<span class="kw-cmd">import</span> (
  <span class="kw-string">"context"</span>
  <span class="kw-string">"dagger/pipeline/internal/dagger"</span>
)

<span class="kw-cmd">type</span> <span class="kw-type">Pipeline</span> <span class="kw-cmd">struct</span>{}

<span class="kw-cmd">func</span> (<span class="kw-var">m</span> *<span class="kw-type">Pipeline</span>) <span class="kw-fn">base</span>(<span class="kw-var">src</span> *<span class="kw-type">dagger.Directory</span>) *<span class="kw-type">dagger.Container</span> {
  <span class="kw-cmd">return</span> <span class="kw-var">dag</span>.<span class="kw-fn">Container</span>().
    <span class="kw-fn">From</span>(<span class="kw-string">"alpine:3.24"</span>).
    <span class="kw-fn">WithWorkdir</span>(<span class="kw-string">"/app"</span>).
    <span class="kw-fn">WithDirectory</span>(<span class="kw-string">"."</span>, <span class="kw-var">src</span>).
    <span class="kw-fn">WithExec</span>([]<span class="kw-type">string</span>{"sh", "-c", "cmake -B build -G Ninja"})
}

<span class="kw-cmd">func</span> (<span class="kw-var">m</span> *<span class="kw-type">Pipeline</span>) <span class="kw-fn">Test</span>(<span class="kw-var">ctx</span> <span class="kw-type">context.Context</span>, <span class="kw-var">src</span> *<span class="kw-type">dagger.Directory</span>) (<span class="kw-type">string</span>, <span class="kw-type">error</span>) {
  <span class="kw-cmd">return</span> <span class="kw-var">m</span>.<span class="kw-fn">base</span>(<span class="kw-var">src</span>).<span class="kw-fn">WithExec</span>([]<span class="kw-type">string</span>{"sh", "-c", "ctest --test-dir build --output-on-failure"}).<span class="kw-fn">Stdout</span>(<span class="kw-var">ctx</span>)
}

<span class="kw-cmd">func</span> (<span class="kw-var">m</span> *<span class="kw-type">Pipeline</span>) <span class="kw-fn">Build</span>(<span class="kw-var">ctx</span> <span class="kw-type">context.Context</span>, <span class="kw-var">src</span> *<span class="kw-type">dagger.Directory</span>) (*<span class="kw-type">dagger.File</span>, <span class="kw-type">error</span>) {
  <span class="kw-var">bin</span> := <span class="kw-var">m</span>.<span class="kw-fn">base</span>(<span class="kw-var">src</span>).
    <span class="kw-fn">WithExec</span>([]<span class="kw-type">string</span>{"sh", "-c", "cmake --build build --config Release"}).
    <span class="kw-fn">File</span>(<span class="kw-string">"build/bin/app"</span>)

  <span class="kw-cmd">if</span> <span class="kw-var">_</span>, <span class="kw-var">err</span> := <span class="kw-var">bin</span>.<span class="kw-fn">Export</span>(<span class="kw-var">ctx</span>, <span class="kw-string">"bin/app"</span>); <span class="kw-var">err</span> != <span class="kw-val">nil</span> {
    <span class="kw-cmd">return</span> <span class="kw-val">nil</span>, <span class="kw-var">err</span>
  }
  <span class="kw-cmd">return</span> <span class="kw-var">bin</span>, <span class="kw-val">nil</span>
}

<span class="kw-cmd">func</span> (<span class="kw-var">m</span> *<span class="kw-type">Pipeline</span>) <span class="kw-fn">Publish</span>(<span class="kw-var">ctx</span> <span class="kw-type">context.Context</span>, <span class="kw-var">src</span> *<span class="kw-type">dagger.Directory</span>) (<span class="kw-type">string</span>, <span class="kw-type">error</span>) {
  <span class="kw-var">bin</span>, <span class="kw-var">err</span> := <span class="kw-var">m</span>.<span class="kw-fn">Build</span>(<span class="kw-var">ctx</span>, <span class="kw-var">src</span>)
  <span class="kw-cmd">if</span> <span class="kw-var">err</span> != <span class="kw-val">nil</span> {
    <span class="kw-cmd">return</span> <span class="kw-string">""</span>, <span class="kw-var">err</span>
  }
  <span class="kw-cmd">return</span> <span class="kw-var">dag</span>.<span class="kw-fn">Container</span>().
    <span class="kw-fn">From</span>(<span class="kw-string">"alpine:3.24"</span>).
    <span class="kw-fn">WithFile</span>(<span class="kw-string">"/usr/local/bin/app"</span>, <span class="kw-var">bin</span>).
    <span class="kw-fn">WithEntrypoint</span>([]<span class="kw-type">string</span>{"/usr/local/bin/app"}).
    <span class="kw-fn">Publish</span>(<span class="kw-var">ctx</span>, <span class="kw-string">"docker.io/myorg/myapp:latest"</span>)
}`,earthfileTitle:"Earthfile",earthfileCode:`<span class="kw-cmd">VERSION</span> <span class="kw-val">0.8</span>
<span class="kw-cmd">FROM</span> <span class="kw-string">alpine:3.24</span>
<span class="kw-cmd">RUN</span> apk add <span class="kw-flag">--no-cache</span> build-base cmake ninja
<span class="kw-cmd">WORKDIR</span> <span class="kw-string">/app</span>

<span class="kw-target">deps</span>:
  <span class="kw-cmd">COPY</span> CMakeLists.txt ./
  <span class="kw-cmd">RUN</span> cmake <span class="kw-flag">-B</span> build <span class="kw-flag">-G</span> Ninja

<span class="kw-target">test</span>:
  <span class="kw-cmd">FROM</span> <span class="kw-target">+deps</span>
  <span class="kw-cmd">COPY</span> src ./src
  <span class="kw-cmd">RUN</span> cmake <span class="kw-flag">--build</span> build <span class="kw-flag">--target</span> test

<span class="kw-target">build</span>:
  <span class="kw-cmd">FROM</span> <span class="kw-target">+deps</span>
  <span class="kw-cmd">COPY</span> src ./src
  <span class="kw-cmd">RUN</span> cmake <span class="kw-flag">--build</span> build <span class="kw-flag">--config</span> Release
  <span class="kw-cmd">SAVE ARTIFACT</span> build/bin/app <span class="kw-flag">AS LOCAL</span> bin/app

<span class="kw-target">docker</span>:
  <span class="kw-cmd">FROM</span> <span class="kw-string">alpine:3.24</span>
  <span class="kw-cmd">RUN</span> apk add <span class="kw-flag">--no-cache</span> libstdc++
  <span class="kw-cmd">COPY</span> <span class="kw-target">+build</span>/bin/app /usr/local/bin/app
  <span class="kw-cmd">ENTRYPOINT</span> [<span class="kw-string">"/usr/local/bin/app"</span>]
  <span class="kw-cmd">SAVE IMAGE</span> <span class="kw-flag">--push</span> <span class="kw-string">docker.io/myorg/myapp:latest</span>

<span class="kw-target">all</span>:
  <span class="kw-cmd">BUILD</span> <span class="kw-target">+test</span>
  <span class="kw-cmd">BUILD</span> <span class="kw-target">+build</span>
  <span class="kw-cmd">BUILD</span> <span class="kw-target">+docker</span>`},gha:{legacyTitle:"Standard GitHub Actions Workflow",legacyCode:`<span class="kw-prop">name</span>: <span class="kw-string">CI &amp; Release</span>
<span class="kw-prop">on</span>: [<span class="kw-string">push</span>]

<span class="kw-prop">jobs</span>:
  <span class="kw-prop">pipeline</span>:
    <span class="kw-prop">runs-on</span>: <span class="kw-string">ubuntu-26.04</span>
    <span class="kw-prop">steps</span>:
      - <span class="kw-prop">uses</span>: <span class="kw-string">actions/checkout@v4</span>

      - <span class="kw-prop">name</span>: <span class="kw-string">Run Tests</span>
        <span class="kw-prop">run</span>: ctest --test-dir build --output-on-failure

      - <span class="kw-prop">name</span>: <span class="kw-string">Build Host Binary / Package</span>
        <span class="kw-prop">run</span>: cmake --build build --config Release

      - <span class="kw-prop">uses</span>: <span class="kw-string">actions/upload-artifact@v4</span>
        <span class="kw-prop">with</span>:
          <span class="kw-prop">name</span>: <span class="kw-string">app-artifact</span>
          <span class="kw-prop">path</span>: <span class="kw-string">build/bin/app</span>

      - <span class="kw-prop">uses</span>: <span class="kw-string">docker/login-action@v3</span>
        <span class="kw-prop">with</span>:
          <span class="kw-prop">username</span>: <span class="kw-expr">\${{ secrets.DOCKER_USER }}</span>
          <span class="kw-prop">password</span>: <span class="kw-expr">\${{ secrets.DOCKER_TOKEN }}</span>

      - <span class="kw-prop">uses</span>: <span class="kw-string">docker/build-push-action@v6</span>
        <span class="kw-prop">with</span>:
          <span class="kw-prop">context</span>: <span class="kw-string">.</span>
          <span class="kw-prop">push</span>: <span class="kw-val">true</span>
          <span class="kw-prop">tags</span>: <span class="kw-string">docker.io/myorg/myapp:latest</span>`,earthfileTitle:"Clean GitHub Action with EarthBuild (10 Lines)",earthfileCode:`<span class="kw-prop">name</span>: <span class="kw-string">CI &amp; Release</span>
<span class="kw-prop">on</span>: [<span class="kw-string">push</span>]

<span class="kw-prop">jobs</span>:
  <span class="kw-prop">pipeline</span>:
    <span class="kw-prop">runs-on</span>: <span class="kw-string">ubuntu-latest</span>
    <span class="kw-prop">steps</span>:
      - <span class="kw-prop">uses</span>: <span class="kw-string">actions/checkout@v4</span>

      - <span class="kw-prop">name</span>: <span class="kw-string">Setup EarthBuild</span>
        <span class="kw-prop">uses</span>: <span class="kw-string">earthbuild/actions-setup@v2</span>

      - <span class="kw-prop">name</span>: <span class="kw-string">Test, Build Binary &amp; Push Image</span>
        <span class="kw-prop">run</span>: <span class="kw-cmd">earth</span> <span class="kw-flag">--ci</span> <span class="kw-flag">--push</span> <span class="kw-target">+all</span>
        <span class="kw-prop">env</span>:
          <span class="kw-prop">EARTH_DOCKER_CONFIG</span>: <span class="kw-expr">\${{ secrets.DOCKER_CONFIG }}</span>`}},go:{dockerfile:{legacyTitle:"Standard Dockerfile",legacyCode:`<span class="kw-cmd">FROM</span> <span class="kw-string">golang:1.27-alpine3.24</span> <span class="kw-cmd">AS</span> <span class="kw-target">deps</span>
<span class="kw-cmd">WORKDIR</span> <span class="kw-string">/app</span>
<span class="kw-cmd">COPY</span> go.mod go.sum ./
<span class="kw-cmd">RUN</span> go mod download

<span class="kw-cmd">FROM</span> <span class="kw-target">deps</span> <span class="kw-cmd">AS</span> <span class="kw-target">test</span>
<span class="kw-cmd">COPY</span> *.go ./
<span class="kw-cmd">RUN</span> go test -v ./...

<span class="kw-cmd">FROM</span> <span class="kw-target">deps</span> <span class="kw-cmd">AS</span> <span class="kw-target">builder</span>
<span class="kw-cmd">COPY</span> *.go ./
<span class="kw-cmd">RUN</span> CGO_ENABLED=0 go build -o bin/app .

<span class="kw-cmd">FROM</span> <span class="kw-string">alpine:3.24</span> <span class="kw-cmd">AS</span> <span class="kw-target">runtime</span>
<span class="kw-cmd">COPY</span> <span class="kw-flag">--from</span>=<span class="kw-target">builder</span> /app/bin/app /usr/local/bin/app
<span class="kw-cmd">ENTRYPOINT</span> [<span class="kw-string">"/usr/local/bin/app"</span>]`,earthfileTitle:"Earthfile (Direct Host Artifacts & Push Built-In)",earthfileCode:`<span class="kw-cmd">VERSION</span> <span class="kw-val">0.8</span>
<span class="kw-cmd">FROM</span> <span class="kw-string">golang:1.27-alpine3.24</span>
<span class="kw-cmd">WORKDIR</span> <span class="kw-string">/app</span>

<span class="kw-target">deps</span>:
  <span class="kw-cmd">COPY</span> go.mod go.sum ./
  <span class="kw-cmd">RUN</span> go mod download

<span class="kw-target">test</span>:
  <span class="kw-cmd">FROM</span> <span class="kw-target">+deps</span>
  <span class="kw-cmd">COPY</span> *.go ./
  <span class="kw-cmd">RUN</span> go test <span class="kw-flag">-v</span> ./...

<span class="kw-target">build</span>:
  <span class="kw-cmd">FROM</span> <span class="kw-target">+deps</span>
  <span class="kw-cmd">COPY</span> *.go ./
  <span class="kw-cmd">RUN</span> <span class="kw-val">CGO_ENABLED=0</span> go build <span class="kw-flag">-o</span> bin/app .
  <span class="kw-cmd">SAVE ARTIFACT</span> bin/app <span class="kw-flag">AS LOCAL</span> bin/app

<span class="kw-target">docker</span>:
  <span class="kw-cmd">FROM</span> <span class="kw-string">alpine:3.24</span>
  <span class="kw-cmd">COPY</span> <span class="kw-target">+build</span>/bin/app /usr/local/bin/app
  <span class="kw-cmd">ENTRYPOINT</span> [<span class="kw-string">"/usr/local/bin/app"</span>]
  <span class="kw-cmd">SAVE IMAGE</span> <span class="kw-flag">--push</span> <span class="kw-string">docker.io/myorg/myapp:latest</span>

<span class="kw-target">all</span>:
  <span class="kw-cmd">BUILD</span> <span class="kw-target">+test</span>
  <span class="kw-cmd">BUILD</span> <span class="kw-target">+build</span>
  <span class="kw-cmd">BUILD</span> <span class="kw-target">+docker</span>`},bake:{legacyTitle:"Docker Buildx Bake (Bake HCL + Dockerfile)",legacyCode:`<span class="kw-cmd">group</span> <span class="kw-string">"default"</span> {
  <span class="kw-prop">targets</span> = [<span class="kw-string">"test"</span>, <span class="kw-string">"build"</span>, <span class="kw-string">"image"</span>]
}

<span class="kw-cmd">target</span> <span class="kw-string">"test"</span> {
  <span class="kw-prop">dockerfile</span> = <span class="kw-string">"Dockerfile"</span>
  <span class="kw-prop">target</span>     = <span class="kw-string">"test"</span>
}

<span class="kw-cmd">target</span> <span class="kw-string">"build"</span> {
  <span class="kw-prop">dockerfile</span> = <span class="kw-string">"Dockerfile"</span>
  <span class="kw-prop">target</span>     = <span class="kw-string">"builder"</span>
  <span class="kw-prop">output</span>     = [<span class="kw-string">"type=local,dest=bin"</span>]
}

<span class="kw-cmd">target</span> <span class="kw-string">"image"</span> {
  <span class="kw-prop">dockerfile</span> = <span class="kw-string">"Dockerfile"</span>
  <span class="kw-prop">target</span>     = <span class="kw-string">"runtime"</span>
  <span class="kw-prop">tags</span>       = [<span class="kw-string">"docker.io/myorg/myapp:latest"</span>]
}`,earthfileTitle:"Earthfile (Self-Contained & Deterministic)",earthfileCode:`<span class="kw-cmd">VERSION</span> <span class="kw-val">0.8</span>
<span class="kw-cmd">FROM</span> <span class="kw-string">golang:1.27-alpine3.24</span>
<span class="kw-cmd">WORKDIR</span> <span class="kw-string">/app</span>

<span class="kw-target">deps</span>:
  <span class="kw-cmd">COPY</span> go.mod go.sum ./
  <span class="kw-cmd">RUN</span> go mod download

<span class="kw-target">test</span>:
  <span class="kw-cmd">FROM</span> <span class="kw-target">+deps</span>
  <span class="kw-cmd">COPY</span> *.go ./
  <span class="kw-cmd">RUN</span> go test <span class="kw-flag">-v</span> ./...

<span class="kw-target">build</span>:
  <span class="kw-cmd">FROM</span> <span class="kw-target">+deps</span>
  <span class="kw-cmd">COPY</span> *.go ./
  <span class="kw-cmd">RUN</span> <span class="kw-val">CGO_ENABLED=0</span> go build <span class="kw-flag">-o</span> bin/app .
  <span class="kw-cmd">SAVE ARTIFACT</span> bin/app <span class="kw-flag">AS LOCAL</span> bin/app

<span class="kw-target">docker</span>:
  <span class="kw-cmd">FROM</span> <span class="kw-string">alpine:3.24</span>
  <span class="kw-cmd">COPY</span> <span class="kw-target">+build</span>/bin/app /usr/local/bin/app
  <span class="kw-cmd">ENTRYPOINT</span> [<span class="kw-string">"/usr/local/bin/app"</span>]
  <span class="kw-cmd">SAVE IMAGE</span> <span class="kw-flag">--push</span> <span class="kw-string">docker.io/myorg/myapp:latest</span>

<span class="kw-target">all</span>:
  <span class="kw-cmd">BUILD</span> <span class="kw-target">+test</span>
  <span class="kw-cmd">BUILD</span> <span class="kw-target">+build</span>
  <span class="kw-cmd">BUILD</span> <span class="kw-target">+docker</span>`},makefile:{legacyTitle:"Makefile (Go Host Execution)",legacyCode:`<span class="kw-target">.PHONY</span>: <span class="kw-target">all</span> <span class="kw-target">test</span> <span class="kw-target">build</span> <span class="kw-target">docker</span>

<span class="kw-target">all</span>: <span class="kw-target">test</span> <span class="kw-target">build</span> <span class="kw-target">docker</span>

<span class="kw-target">test</span>:
	go test -v ./...

<span class="kw-target">build</span>:
	CGO_ENABLED=0 go build -o bin/app .

<span class="kw-target">docker</span>: <span class="kw-target">build</span>
	docker build <span class="kw-flag">-t</span> <span class="kw-string">docker.io/myorg/myapp:latest</span> .
	docker push <span class="kw-string">docker.io/myorg/myapp:latest</span>`,earthfileTitle:"Earthfile (Hermetic & Parallel)",earthfileCode:`<span class="kw-cmd">VERSION</span> <span class="kw-val">0.8</span>
<span class="kw-cmd">FROM</span> <span class="kw-string">golang:1.27-alpine3.24</span>
<span class="kw-cmd">WORKDIR</span> <span class="kw-string">/app</span>

<span class="kw-target">deps</span>:
  <span class="kw-cmd">COPY</span> go.mod go.sum ./
  <span class="kw-cmd">RUN</span> go mod download

<span class="kw-target">test</span>:
  <span class="kw-cmd">FROM</span> <span class="kw-target">+deps</span>
  <span class="kw-cmd">COPY</span> *.go ./
  <span class="kw-cmd">RUN</span> go test <span class="kw-flag">-v</span> ./...

<span class="kw-target">build</span>:
  <span class="kw-cmd">FROM</span> <span class="kw-target">+deps</span>
  <span class="kw-cmd">COPY</span> *.go ./
  <span class="kw-cmd">RUN</span> <span class="kw-val">CGO_ENABLED=0</span> go build <span class="kw-flag">-o</span> bin/app .
  <span class="kw-cmd">SAVE ARTIFACT</span> bin/app <span class="kw-flag">AS LOCAL</span> bin/app

<span class="kw-target">docker</span>:
  <span class="kw-cmd">FROM</span> <span class="kw-string">alpine:3.24</span>
  <span class="kw-cmd">COPY</span> <span class="kw-target">+build</span>/bin/app /usr/local/bin/app
  <span class="kw-cmd">ENTRYPOINT</span> [<span class="kw-string">"/usr/local/bin/app"</span>]
  <span class="kw-cmd">SAVE IMAGE</span> <span class="kw-flag">--push</span> <span class="kw-string">docker.io/myorg/myapp:latest</span>

<span class="kw-target">all</span>:
  <span class="kw-cmd">BUILD</span> <span class="kw-target">+test</span>
  <span class="kw-cmd">BUILD</span> <span class="kw-target">+build</span>
  <span class="kw-cmd">BUILD</span> <span class="kw-target">+docker</span>`},dagger:{legacyTitle:"Dagger (Go SDK)",legacyCode:`<span class="kw-cmd">package</span> main

<span class="kw-cmd">import</span> (
  <span class="kw-string">"context"</span>
  <span class="kw-string">"dagger/pipeline/internal/dagger"</span>
)

<span class="kw-cmd">type</span> <span class="kw-type">Pipeline</span> <span class="kw-cmd">struct</span>{}

<span class="kw-cmd">func</span> (<span class="kw-var">m</span> *<span class="kw-type">Pipeline</span>) <span class="kw-fn">base</span>(<span class="kw-var">src</span> *<span class="kw-type">dagger.Directory</span>) *<span class="kw-type">dagger.Container</span> {
  <span class="kw-cmd">return</span> <span class="kw-var">dag</span>.<span class="kw-fn">Container</span>().
    <span class="kw-fn">From</span>(<span class="kw-string">"golang:1.27-alpine3.24"</span>).
    <span class="kw-fn">WithWorkdir</span>(<span class="kw-string">"/app"</span>).
    <span class="kw-fn">WithDirectory</span>(<span class="kw-string">"."</span>, <span class="kw-var">src</span>).
    <span class="kw-fn">WithExec</span>([]<span class="kw-type">string</span>{"sh", "-c", "go mod download"})
}

<span class="kw-cmd">func</span> (<span class="kw-var">m</span> *<span class="kw-type">Pipeline</span>) <span class="kw-fn">Test</span>(<span class="kw-var">ctx</span> <span class="kw-type">context.Context</span>, <span class="kw-var">src</span> *<span class="kw-type">dagger.Directory</span>) (<span class="kw-type">string</span>, <span class="kw-type">error</span>) {
  <span class="kw-cmd">return</span> <span class="kw-var">m</span>.<span class="kw-fn">base</span>(<span class="kw-var">src</span>).<span class="kw-fn">WithExec</span>([]<span class="kw-type">string</span>{"sh", "-c", "go test -v ./..."}).<span class="kw-fn">Stdout</span>(<span class="kw-var">ctx</span>)
}

<span class="kw-cmd">func</span> (<span class="kw-var">m</span> *<span class="kw-type">Pipeline</span>) <span class="kw-fn">Build</span>(<span class="kw-var">ctx</span> <span class="kw-type">context.Context</span>, <span class="kw-var">src</span> *<span class="kw-type">dagger.Directory</span>) (*<span class="kw-type">dagger.File</span>, <span class="kw-type">error</span>) {
  <span class="kw-var">bin</span> := <span class="kw-var">m</span>.<span class="kw-fn">base</span>(<span class="kw-var">src</span>).
    <span class="kw-fn">WithExec</span>([]<span class="kw-type">string</span>{"sh", "-c", "CGO_ENABLED=0 go build -o bin/app ."}).
    <span class="kw-fn">File</span>(<span class="kw-string">"bin/app"</span>)

  <span class="kw-cmd">if</span> <span class="kw-var">_</span>, <span class="kw-var">err</span> := <span class="kw-var">bin</span>.<span class="kw-fn">Export</span>(<span class="kw-var">ctx</span>, <span class="kw-string">"bin/app"</span>); <span class="kw-var">err</span> != <span class="kw-val">nil</span> {
    <span class="kw-cmd">return</span> <span class="kw-val">nil</span>, <span class="kw-var">err</span>
  }
  <span class="kw-cmd">return</span> <span class="kw-var">bin</span>, <span class="kw-val">nil</span>
}

<span class="kw-cmd">func</span> (<span class="kw-var">m</span> *<span class="kw-type">Pipeline</span>) <span class="kw-fn">Publish</span>(<span class="kw-var">ctx</span> <span class="kw-type">context.Context</span>, <span class="kw-var">src</span> *<span class="kw-type">dagger.Directory</span>) (<span class="kw-type">string</span>, <span class="kw-type">error</span>) {
  <span class="kw-var">bin</span>, <span class="kw-var">err</span> := <span class="kw-var">m</span>.<span class="kw-fn">Build</span>(<span class="kw-var">ctx</span>, <span class="kw-var">src</span>)
  <span class="kw-cmd">if</span> <span class="kw-var">err</span> != <span class="kw-val">nil</span> {
    <span class="kw-cmd">return</span> <span class="kw-string">""</span>, <span class="kw-var">err</span>
  }
  <span class="kw-cmd">return</span> <span class="kw-var">dag</span>.<span class="kw-fn">Container</span>().
    <span class="kw-fn">From</span>(<span class="kw-string">"alpine:3.24"</span>).
    <span class="kw-fn">WithFile</span>(<span class="kw-string">"/usr/local/bin/app"</span>, <span class="kw-var">bin</span>).
    <span class="kw-fn">WithEntrypoint</span>([]<span class="kw-type">string</span>{"/usr/local/bin/app"}).
    <span class="kw-fn">Publish</span>(<span class="kw-var">ctx</span>, <span class="kw-string">"docker.io/myorg/myapp:latest"</span>)
}`,earthfileTitle:"Earthfile",earthfileCode:`<span class="kw-cmd">VERSION</span> <span class="kw-val">0.8</span>
<span class="kw-cmd">FROM</span> <span class="kw-string">golang:1.27-alpine3.24</span>
<span class="kw-cmd">WORKDIR</span> <span class="kw-string">/app</span>

<span class="kw-target">deps</span>:
  <span class="kw-cmd">COPY</span> go.mod go.sum ./
  <span class="kw-cmd">RUN</span> go mod download

<span class="kw-target">test</span>:
  <span class="kw-cmd">FROM</span> <span class="kw-target">+deps</span>
  <span class="kw-cmd">COPY</span> *.go ./
  <span class="kw-cmd">RUN</span> go test <span class="kw-flag">-v</span> ./...

<span class="kw-target">build</span>:
  <span class="kw-cmd">FROM</span> <span class="kw-target">+deps</span>
  <span class="kw-cmd">COPY</span> *.go ./
  <span class="kw-cmd">RUN</span> <span class="kw-val">CGO_ENABLED=0</span> go build <span class="kw-flag">-o</span> bin/app .
  <span class="kw-cmd">SAVE ARTIFACT</span> bin/app <span class="kw-flag">AS LOCAL</span> bin/app

<span class="kw-target">docker</span>:
  <span class="kw-cmd">FROM</span> <span class="kw-string">alpine:3.24</span>
  <span class="kw-cmd">COPY</span> <span class="kw-target">+build</span>/bin/app /usr/local/bin/app
  <span class="kw-cmd">ENTRYPOINT</span> [<span class="kw-string">"/usr/local/bin/app"</span>]
  <span class="kw-cmd">SAVE IMAGE</span> <span class="kw-flag">--push</span> <span class="kw-string">docker.io/myorg/myapp:latest</span>

<span class="kw-target">all</span>:
  <span class="kw-cmd">BUILD</span> <span class="kw-target">+test</span>
  <span class="kw-cmd">BUILD</span> <span class="kw-target">+build</span>
  <span class="kw-cmd">BUILD</span> <span class="kw-target">+docker</span>`},gha:{legacyTitle:"Standard GitHub Actions Workflow",legacyCode:`<span class="kw-prop">name</span>: <span class="kw-string">CI &amp; Release</span>
<span class="kw-prop">on</span>: [<span class="kw-string">push</span>]

<span class="kw-prop">jobs</span>:
  <span class="kw-prop">pipeline</span>:
    <span class="kw-prop">runs-on</span>: <span class="kw-string">ubuntu-26.04</span>
    <span class="kw-prop">steps</span>:
      - <span class="kw-prop">uses</span>: <span class="kw-string">actions/checkout@v4</span>

      - <span class="kw-prop">name</span>: <span class="kw-string">Run Tests</span>
        <span class="kw-prop">run</span>: go test -v ./...

      - <span class="kw-prop">name</span>: <span class="kw-string">Build Host Binary / Package</span>
        <span class="kw-prop">run</span>: CGO_ENABLED=0 go build -o bin/app .

      - <span class="kw-prop">uses</span>: <span class="kw-string">actions/upload-artifact@v4</span>
        <span class="kw-prop">with</span>:
          <span class="kw-prop">name</span>: <span class="kw-string">app-artifact</span>
          <span class="kw-prop">path</span>: <span class="kw-string">bin/app</span>

      - <span class="kw-prop">uses</span>: <span class="kw-string">docker/login-action@v3</span>
        <span class="kw-prop">with</span>:
          <span class="kw-prop">username</span>: <span class="kw-expr">\${{ secrets.DOCKER_USER }}</span>
          <span class="kw-prop">password</span>: <span class="kw-expr">\${{ secrets.DOCKER_TOKEN }}</span>

      - <span class="kw-prop">uses</span>: <span class="kw-string">docker/build-push-action@v6</span>
        <span class="kw-prop">with</span>:
          <span class="kw-prop">context</span>: <span class="kw-string">.</span>
          <span class="kw-prop">push</span>: <span class="kw-val">true</span>
          <span class="kw-prop">tags</span>: <span class="kw-string">docker.io/myorg/myapp:latest</span>`,earthfileTitle:"Clean GitHub Action with EarthBuild (10 Lines)",earthfileCode:`<span class="kw-prop">name</span>: <span class="kw-string">CI &amp; Release</span>
<span class="kw-prop">on</span>: [<span class="kw-string">push</span>]

<span class="kw-prop">jobs</span>:
  <span class="kw-prop">pipeline</span>:
    <span class="kw-prop">runs-on</span>: <span class="kw-string">ubuntu-latest</span>
    <span class="kw-prop">steps</span>:
      - <span class="kw-prop">uses</span>: <span class="kw-string">actions/checkout@v4</span>

      - <span class="kw-prop">name</span>: <span class="kw-string">Setup EarthBuild</span>
        <span class="kw-prop">uses</span>: <span class="kw-string">earthbuild/actions-setup@v2</span>

      - <span class="kw-prop">name</span>: <span class="kw-string">Test, Build Binary &amp; Push Image</span>
        <span class="kw-prop">run</span>: <span class="kw-cmd">earth</span> <span class="kw-flag">--ci</span> <span class="kw-flag">--push</span> <span class="kw-target">+all</span>
        <span class="kw-prop">env</span>:
          <span class="kw-prop">EARTH_DOCKER_CONFIG</span>: <span class="kw-expr">\${{ secrets.DOCKER_CONFIG }}</span>`}},rust:{dockerfile:{legacyTitle:"Standard Dockerfile",legacyCode:`<span class="kw-cmd">FROM</span> <span class="kw-string">rust:1.85-alpine3.24</span> <span class="kw-cmd">AS</span> <span class="kw-target">deps</span>
<span class="kw-cmd">WORKDIR</span> <span class="kw-string">/app</span>
<span class="kw-cmd">COPY</span> Cargo.toml Cargo.lock ./
<span class="kw-cmd">RUN</span> cargo fetch

<span class="kw-cmd">FROM</span> <span class="kw-target">deps</span> <span class="kw-cmd">AS</span> <span class="kw-target">test</span>
<span class="kw-cmd">COPY</span> src ./src ./
<span class="kw-cmd">RUN</span> cargo test

<span class="kw-cmd">FROM</span> <span class="kw-target">deps</span> <span class="kw-cmd">AS</span> <span class="kw-target">builder</span>
<span class="kw-cmd">COPY</span> src ./src ./
<span class="kw-cmd">RUN</span> cargo build --release

<span class="kw-cmd">FROM</span> <span class="kw-string">alpine:3.24</span> <span class="kw-cmd">AS</span> <span class="kw-target">runtime</span>
<span class="kw-cmd">COPY</span> <span class="kw-flag">--from</span>=<span class="kw-target">builder</span> /app/target/release/app /usr/local/bin/app
<span class="kw-cmd">ENTRYPOINT</span> [<span class="kw-string">"/usr/local/bin/app"</span>]`,earthfileTitle:"Earthfile (Direct Host Artifacts & Push Built-In)",earthfileCode:`<span class="kw-cmd">VERSION</span> <span class="kw-val">0.8</span>
<span class="kw-cmd">FROM</span> <span class="kw-string">rust:1.85-alpine3.24</span>
<span class="kw-cmd">RUN</span> apk add <span class="kw-flag">--no-cache</span> musl-dev
<span class="kw-cmd">WORKDIR</span> <span class="kw-string">/app</span>

<span class="kw-target">deps</span>:
  <span class="kw-cmd">COPY</span> Cargo.toml Cargo.lock ./
  <span class="kw-cmd">RUN</span> cargo fetch

<span class="kw-target">test</span>:
  <span class="kw-cmd">FROM</span> <span class="kw-target">+deps</span>
  <span class="kw-cmd">COPY</span> src ./src
  <span class="kw-cmd">RUN</span> cargo test

<span class="kw-target">build</span>:
  <span class="kw-cmd">FROM</span> <span class="kw-target">+deps</span>
  <span class="kw-cmd">COPY</span> src ./src
  <span class="kw-cmd">RUN</span> cargo build <span class="kw-flag">--release</span>
  <span class="kw-cmd">SAVE ARTIFACT</span> target/release/app <span class="kw-flag">AS LOCAL</span> bin/app

<span class="kw-target">docker</span>:
  <span class="kw-cmd">FROM</span> <span class="kw-string">alpine:3.24</span>
  <span class="kw-cmd">COPY</span> <span class="kw-target">+build</span>/bin/app /usr/local/bin/app
  <span class="kw-cmd">ENTRYPOINT</span> [<span class="kw-string">"/usr/local/bin/app"</span>]
  <span class="kw-cmd">SAVE IMAGE</span> <span class="kw-flag">--push</span> <span class="kw-string">docker.io/myorg/myapp:latest</span>

<span class="kw-target">all</span>:
  <span class="kw-cmd">BUILD</span> <span class="kw-target">+test</span>
  <span class="kw-cmd">BUILD</span> <span class="kw-target">+build</span>
  <span class="kw-cmd">BUILD</span> <span class="kw-target">+docker</span>`},bake:{legacyTitle:"Docker Buildx Bake (Bake HCL + Dockerfile)",legacyCode:`<span class="kw-cmd">group</span> <span class="kw-string">"default"</span> {
  <span class="kw-prop">targets</span> = [<span class="kw-string">"test"</span>, <span class="kw-string">"build"</span>, <span class="kw-string">"image"</span>]
}

<span class="kw-cmd">target</span> <span class="kw-string">"test"</span> {
  <span class="kw-prop">dockerfile</span> = <span class="kw-string">"Dockerfile"</span>
  <span class="kw-prop">target</span>     = <span class="kw-string">"test"</span>
}

<span class="kw-cmd">target</span> <span class="kw-string">"build"</span> {
  <span class="kw-prop">dockerfile</span> = <span class="kw-string">"Dockerfile"</span>
  <span class="kw-prop">target</span>     = <span class="kw-string">"builder"</span>
  <span class="kw-prop">output</span>     = [<span class="kw-string">"type=local,dest=bin"</span>]
}

<span class="kw-cmd">target</span> <span class="kw-string">"image"</span> {
  <span class="kw-prop">dockerfile</span> = <span class="kw-string">"Dockerfile"</span>
  <span class="kw-prop">target</span>     = <span class="kw-string">"runtime"</span>
  <span class="kw-prop">tags</span>       = [<span class="kw-string">"docker.io/myorg/myapp:latest"</span>]
}`,earthfileTitle:"Earthfile (Self-Contained & Deterministic)",earthfileCode:`<span class="kw-cmd">VERSION</span> <span class="kw-val">0.8</span>
<span class="kw-cmd">FROM</span> <span class="kw-string">rust:1.85-alpine3.24</span>
<span class="kw-cmd">RUN</span> apk add <span class="kw-flag">--no-cache</span> musl-dev
<span class="kw-cmd">WORKDIR</span> <span class="kw-string">/app</span>

<span class="kw-target">deps</span>:
  <span class="kw-cmd">COPY</span> Cargo.toml Cargo.lock ./
  <span class="kw-cmd">RUN</span> cargo fetch

<span class="kw-target">test</span>:
  <span class="kw-cmd">FROM</span> <span class="kw-target">+deps</span>
  <span class="kw-cmd">COPY</span> src ./src
  <span class="kw-cmd">RUN</span> cargo test

<span class="kw-target">build</span>:
  <span class="kw-cmd">FROM</span> <span class="kw-target">+deps</span>
  <span class="kw-cmd">COPY</span> src ./src
  <span class="kw-cmd">RUN</span> cargo build <span class="kw-flag">--release</span>
  <span class="kw-cmd">SAVE ARTIFACT</span> target/release/app <span class="kw-flag">AS LOCAL</span> bin/app

<span class="kw-target">docker</span>:
  <span class="kw-cmd">FROM</span> <span class="kw-string">alpine:3.24</span>
  <span class="kw-cmd">COPY</span> <span class="kw-target">+build</span>/bin/app /usr/local/bin/app
  <span class="kw-cmd">ENTRYPOINT</span> [<span class="kw-string">"/usr/local/bin/app"</span>]
  <span class="kw-cmd">SAVE IMAGE</span> <span class="kw-flag">--push</span> <span class="kw-string">docker.io/myorg/myapp:latest</span>

<span class="kw-target">all</span>:
  <span class="kw-cmd">BUILD</span> <span class="kw-target">+test</span>
  <span class="kw-cmd">BUILD</span> <span class="kw-target">+build</span>
  <span class="kw-cmd">BUILD</span> <span class="kw-target">+docker</span>`},makefile:{legacyTitle:"Makefile (Rust Host Execution)",legacyCode:`<span class="kw-target">.PHONY</span>: <span class="kw-target">all</span> <span class="kw-target">test</span> <span class="kw-target">build</span> <span class="kw-target">docker</span>

<span class="kw-target">all</span>: <span class="kw-target">test</span> <span class="kw-target">build</span> <span class="kw-target">docker</span>

<span class="kw-target">test</span>:
	cargo test

<span class="kw-target">build</span>:
	cargo build --release

<span class="kw-target">docker</span>: <span class="kw-target">build</span>
	docker build <span class="kw-flag">-t</span> <span class="kw-string">docker.io/myorg/myapp:latest</span> .
	docker push <span class="kw-string">docker.io/myorg/myapp:latest</span>`,earthfileTitle:"Earthfile (Hermetic & Parallel)",earthfileCode:`<span class="kw-cmd">VERSION</span> <span class="kw-val">0.8</span>
<span class="kw-cmd">FROM</span> <span class="kw-string">rust:1.85-alpine3.24</span>
<span class="kw-cmd">RUN</span> apk add <span class="kw-flag">--no-cache</span> musl-dev
<span class="kw-cmd">WORKDIR</span> <span class="kw-string">/app</span>

<span class="kw-target">deps</span>:
  <span class="kw-cmd">COPY</span> Cargo.toml Cargo.lock ./
  <span class="kw-cmd">RUN</span> cargo fetch

<span class="kw-target">test</span>:
  <span class="kw-cmd">FROM</span> <span class="kw-target">+deps</span>
  <span class="kw-cmd">COPY</span> src ./src
  <span class="kw-cmd">RUN</span> cargo test

<span class="kw-target">build</span>:
  <span class="kw-cmd">FROM</span> <span class="kw-target">+deps</span>
  <span class="kw-cmd">COPY</span> src ./src
  <span class="kw-cmd">RUN</span> cargo build <span class="kw-flag">--release</span>
  <span class="kw-cmd">SAVE ARTIFACT</span> target/release/app <span class="kw-flag">AS LOCAL</span> bin/app

<span class="kw-target">docker</span>:
  <span class="kw-cmd">FROM</span> <span class="kw-string">alpine:3.24</span>
  <span class="kw-cmd">COPY</span> <span class="kw-target">+build</span>/bin/app /usr/local/bin/app
  <span class="kw-cmd">ENTRYPOINT</span> [<span class="kw-string">"/usr/local/bin/app"</span>]
  <span class="kw-cmd">SAVE IMAGE</span> <span class="kw-flag">--push</span> <span class="kw-string">docker.io/myorg/myapp:latest</span>

<span class="kw-target">all</span>:
  <span class="kw-cmd">BUILD</span> <span class="kw-target">+test</span>
  <span class="kw-cmd">BUILD</span> <span class="kw-target">+build</span>
  <span class="kw-cmd">BUILD</span> <span class="kw-target">+docker</span>`},dagger:{legacyTitle:"Dagger (Rust SDK Client)",legacyCode:`<span class="kw-cmd">use</span> dagger_sdk::connect;

<span class="kw-decorator">#[tokio::main]</span>
<span class="kw-cmd">async fn</span> <span class="kw-fn">main</span>() -&gt; <span class="kw-type">Result</span>&lt;(), <span class="kw-type">Box</span>&lt;<span class="kw-cmd">dyn</span> std::error::<span class="kw-type">Error</span>&gt;&gt; {
    <span class="kw-cmd">let</span> <span class="kw-var">client</span> = <span class="kw-fn">connect</span>().<span class="kw-cmd">await</span>?;

    <span class="kw-cmd">let</span> <span class="kw-var">base</span> = <span class="kw-var">client</span>
        .<span class="kw-fn">container</span>()
        .<span class="kw-fn">from</span>(<span class="kw-string">"rust:1.85-alpine"</span>)
        .<span class="kw-fn">with_workdir</span>(<span class="kw-string">"/app"</span>)
        .<span class="kw-fn">with_directory</span>(<span class="kw-string">"/app"</span>, <span class="kw-var">client</span>.<span class="kw-fn">host</span>().<span class="kw-fn">directory</span>(<span class="kw-string">"."</span>))
        .<span class="kw-fn">with_exec</span>(<span class="kw-fn">vec!</span>[<span class="kw-string">"cargo"</span>, <span class="kw-string">"fetch"</span>]);

    <span class="kw-var">base</span>.<span class="kw-fn">with_exec</span>(<span class="kw-fn">vec!</span>[<span class="kw-string">"cargo"</span>, <span class="kw-string">"test"</span>]).<span class="kw-fn">sync</span>().<span class="kw-cmd">await</span>?;

    <span class="kw-cmd">let</span> <span class="kw-var">bin</span> = <span class="kw-var">base</span>
        .<span class="kw-fn">with_exec</span>(<span class="kw-fn">vec!</span>[<span class="kw-string">"cargo"</span>, <span class="kw-string">"build"</span>, <span class="kw-string">"--release"</span>])
        .<span class="kw-fn">file</span>(<span class="kw-string">"target/release/app"</span>);
    <span class="kw-var">bin</span>.<span class="kw-fn">export</span>(<span class="kw-string">"bin/app"</span>).<span class="kw-cmd">await</span>?;

    <span class="kw-var">client</span>
        .<span class="kw-fn">container</span>()
        .<span class="kw-fn">from</span>(<span class="kw-string">"alpine:3.24"</span>)
        .<span class="kw-fn">with_file</span>(<span class="kw-string">"/usr/local/bin/app"</span>, <span class="kw-var">bin</span>)
        .<span class="kw-fn">with_entrypoint</span>(<span class="kw-fn">vec!</span>[<span class="kw-string">"/usr/local/bin/app"</span>])
        .<span class="kw-fn">publish</span>(<span class="kw-string">"docker.io/myorg/myapp:latest"</span>)
        .<span class="kw-cmd">await</span>?;

    <span class="kw-type">Ok</span>(())
}`,earthfileTitle:"Earthfile",earthfileCode:`<span class="kw-cmd">VERSION</span> <span class="kw-val">0.8</span>
<span class="kw-cmd">FROM</span> <span class="kw-string">rust:1.85-alpine3.24</span>
<span class="kw-cmd">RUN</span> apk add <span class="kw-flag">--no-cache</span> musl-dev
<span class="kw-cmd">WORKDIR</span> <span class="kw-string">/app</span>

<span class="kw-target">deps</span>:
  <span class="kw-cmd">COPY</span> Cargo.toml Cargo.lock ./
  <span class="kw-cmd">RUN</span> cargo fetch

<span class="kw-target">test</span>:
  <span class="kw-cmd">FROM</span> <span class="kw-target">+deps</span>
  <span class="kw-cmd">COPY</span> src ./src
  <span class="kw-cmd">RUN</span> cargo test

<span class="kw-target">build</span>:
  <span class="kw-cmd">FROM</span> <span class="kw-target">+deps</span>
  <span class="kw-cmd">COPY</span> src ./src
  <span class="kw-cmd">RUN</span> cargo build <span class="kw-flag">--release</span>
  <span class="kw-cmd">SAVE ARTIFACT</span> target/release/app <span class="kw-flag">AS LOCAL</span> bin/app

<span class="kw-target">docker</span>:
  <span class="kw-cmd">FROM</span> <span class="kw-string">alpine:3.24</span>
  <span class="kw-cmd">COPY</span> <span class="kw-target">+build</span>/bin/app /usr/local/bin/app
  <span class="kw-cmd">ENTRYPOINT</span> [<span class="kw-string">"/usr/local/bin/app"</span>]
  <span class="kw-cmd">SAVE IMAGE</span> <span class="kw-flag">--push</span> <span class="kw-string">docker.io/myorg/myapp:latest</span>

<span class="kw-target">all</span>:
  <span class="kw-cmd">BUILD</span> <span class="kw-target">+test</span>
  <span class="kw-cmd">BUILD</span> <span class="kw-target">+build</span>
  <span class="kw-cmd">BUILD</span> <span class="kw-target">+docker</span>`},gha:{legacyTitle:"Standard GitHub Actions Workflow",legacyCode:`<span class="kw-prop">name</span>: <span class="kw-string">CI &amp; Release</span>
<span class="kw-prop">on</span>: [<span class="kw-string">push</span>]

<span class="kw-prop">jobs</span>:
  <span class="kw-prop">pipeline</span>:
    <span class="kw-prop">runs-on</span>: <span class="kw-string">ubuntu-26.04</span>
    <span class="kw-prop">steps</span>:
      - <span class="kw-prop">uses</span>: <span class="kw-string">actions/checkout@v4</span>

      - <span class="kw-prop">name</span>: <span class="kw-string">Run Tests</span>
        <span class="kw-prop">run</span>: cargo test

      - <span class="kw-prop">name</span>: <span class="kw-string">Build Host Binary / Package</span>
        <span class="kw-prop">run</span>: cargo build --release

      - <span class="kw-prop">uses</span>: <span class="kw-string">actions/upload-artifact@v4</span>
        <span class="kw-prop">with</span>:
          <span class="kw-prop">name</span>: <span class="kw-string">app-artifact</span>
          <span class="kw-prop">path</span>: <span class="kw-string">target/release/app</span>

      - <span class="kw-prop">uses</span>: <span class="kw-string">docker/login-action@v3</span>
        <span class="kw-prop">with</span>:
          <span class="kw-prop">username</span>: <span class="kw-expr">\${{ secrets.DOCKER_USER }}</span>
          <span class="kw-prop">password</span>: <span class="kw-expr">\${{ secrets.DOCKER_TOKEN }}</span>

      - <span class="kw-prop">uses</span>: <span class="kw-string">docker/build-push-action@v6</span>
        <span class="kw-prop">with</span>:
          <span class="kw-prop">context</span>: <span class="kw-string">.</span>
          <span class="kw-prop">push</span>: <span class="kw-val">true</span>
          <span class="kw-prop">tags</span>: <span class="kw-string">docker.io/myorg/myapp:latest</span>`,earthfileTitle:"Clean GitHub Action with EarthBuild (10 Lines)",earthfileCode:`<span class="kw-prop">name</span>: <span class="kw-string">CI &amp; Release</span>
<span class="kw-prop">on</span>: [<span class="kw-string">push</span>]

<span class="kw-prop">jobs</span>:
  <span class="kw-prop">pipeline</span>:
    <span class="kw-prop">runs-on</span>: <span class="kw-string">ubuntu-latest</span>
    <span class="kw-prop">steps</span>:
      - <span class="kw-prop">uses</span>: <span class="kw-string">actions/checkout@v4</span>

      - <span class="kw-prop">name</span>: <span class="kw-string">Setup EarthBuild</span>
        <span class="kw-prop">uses</span>: <span class="kw-string">earthbuild/actions-setup@v2</span>

      - <span class="kw-prop">name</span>: <span class="kw-string">Test, Build Binary &amp; Push Image</span>
        <span class="kw-prop">run</span>: <span class="kw-cmd">earth</span> <span class="kw-flag">--ci</span> <span class="kw-flag">--push</span> <span class="kw-target">+all</span>
        <span class="kw-prop">env</span>:
          <span class="kw-prop">EARTH_DOCKER_CONFIG</span>: <span class="kw-expr">\${{ secrets.DOCKER_CONFIG }}</span>`}},zig:{dockerfile:{legacyTitle:"Standard Dockerfile",legacyCode:`<span class="kw-cmd">FROM</span> <span class="kw-string">alpine:3.24</span> <span class="kw-cmd">AS</span> <span class="kw-target">deps</span>
<span class="kw-cmd">WORKDIR</span> <span class="kw-string">/app</span>
<span class="kw-cmd">COPY</span> build.zig build.zig.zon ./
<span class="kw-cmd">RUN</span> zig build --fetch

<span class="kw-cmd">FROM</span> <span class="kw-target">deps</span> <span class="kw-cmd">AS</span> <span class="kw-target">test</span>
<span class="kw-cmd">COPY</span> src ./src build.zig build.zig.zon ./
<span class="kw-cmd">RUN</span> zig build test

<span class="kw-cmd">FROM</span> <span class="kw-target">deps</span> <span class="kw-cmd">AS</span> <span class="kw-target">builder</span>
<span class="kw-cmd">COPY</span> src ./src build.zig build.zig.zon ./
<span class="kw-cmd">RUN</span> zig build -Doptimize=ReleaseSafe

<span class="kw-cmd">FROM</span> <span class="kw-string">alpine:3.24</span> <span class="kw-cmd">AS</span> <span class="kw-target">runtime</span>
<span class="kw-cmd">COPY</span> <span class="kw-flag">--from</span>=<span class="kw-target">builder</span> /app/zig-out/bin/app /usr/local/bin/app
<span class="kw-cmd">ENTRYPOINT</span> [<span class="kw-string">"/usr/local/bin/app"</span>]`,earthfileTitle:"Earthfile (Direct Host Artifacts & Push Built-In)",earthfileCode:`<span class="kw-cmd">VERSION</span> <span class="kw-val">0.8</span>
<span class="kw-cmd">FROM</span> <span class="kw-string">alpine:3.24</span>
<span class="kw-cmd">RUN</span> apk add <span class="kw-flag">--no-cache</span> zig
<span class="kw-cmd">WORKDIR</span> <span class="kw-string">/app</span>

<span class="kw-target">deps</span>:
  <span class="kw-cmd">COPY</span> build.zig build.zig.zon ./
  <span class="kw-cmd">RUN</span> zig build <span class="kw-flag">--fetch</span>

<span class="kw-target">test</span>:
  <span class="kw-cmd">FROM</span> <span class="kw-target">+deps</span>
  <span class="kw-cmd">COPY</span> src ./src
  <span class="kw-cmd">RUN</span> zig build test

<span class="kw-target">build</span>:
  <span class="kw-cmd">FROM</span> <span class="kw-target">+deps</span>
  <span class="kw-cmd">COPY</span> src ./src
  <span class="kw-cmd">RUN</span> zig build <span class="kw-flag">-Doptimize=ReleaseSafe</span>
  <span class="kw-cmd">SAVE ARTIFACT</span> zig-out/bin/app <span class="kw-flag">AS LOCAL</span> bin/app

<span class="kw-target">docker</span>:
  <span class="kw-cmd">FROM</span> <span class="kw-string">alpine:3.24</span>
  <span class="kw-cmd">COPY</span> <span class="kw-target">+build</span>/bin/app /usr/local/bin/app
  <span class="kw-cmd">ENTRYPOINT</span> [<span class="kw-string">"/usr/local/bin/app"</span>]
  <span class="kw-cmd">SAVE IMAGE</span> <span class="kw-flag">--push</span> <span class="kw-string">docker.io/myorg/myapp:latest</span>

<span class="kw-target">all</span>:
  <span class="kw-cmd">BUILD</span> <span class="kw-target">+test</span>
  <span class="kw-cmd">BUILD</span> <span class="kw-target">+build</span>
  <span class="kw-cmd">BUILD</span> <span class="kw-target">+docker</span>`},bake:{legacyTitle:"Docker Buildx Bake (Bake HCL + Dockerfile)",legacyCode:`<span class="kw-cmd">group</span> <span class="kw-string">"default"</span> {
  <span class="kw-prop">targets</span> = [<span class="kw-string">"test"</span>, <span class="kw-string">"build"</span>, <span class="kw-string">"image"</span>]
}

<span class="kw-cmd">target</span> <span class="kw-string">"test"</span> {
  <span class="kw-prop">dockerfile</span> = <span class="kw-string">"Dockerfile"</span>
  <span class="kw-prop">target</span>     = <span class="kw-string">"test"</span>
}

<span class="kw-cmd">target</span> <span class="kw-string">"build"</span> {
  <span class="kw-prop">dockerfile</span> = <span class="kw-string">"Dockerfile"</span>
  <span class="kw-prop">target</span>     = <span class="kw-string">"builder"</span>
  <span class="kw-prop">output</span>     = [<span class="kw-string">"type=local,dest=bin"</span>]
}

<span class="kw-cmd">target</span> <span class="kw-string">"image"</span> {
  <span class="kw-prop">dockerfile</span> = <span class="kw-string">"Dockerfile"</span>
  <span class="kw-prop">target</span>     = <span class="kw-string">"runtime"</span>
  <span class="kw-prop">tags</span>       = [<span class="kw-string">"docker.io/myorg/myapp:latest"</span>]
}`,earthfileTitle:"Earthfile (Self-Contained & Deterministic)",earthfileCode:`<span class="kw-cmd">VERSION</span> <span class="kw-val">0.8</span>
<span class="kw-cmd">FROM</span> <span class="kw-string">alpine:3.24</span>
<span class="kw-cmd">RUN</span> apk add <span class="kw-flag">--no-cache</span> zig
<span class="kw-cmd">WORKDIR</span> <span class="kw-string">/app</span>

<span class="kw-target">deps</span>:
  <span class="kw-cmd">COPY</span> build.zig build.zig.zon ./
  <span class="kw-cmd">RUN</span> zig build <span class="kw-flag">--fetch</span>

<span class="kw-target">test</span>:
  <span class="kw-cmd">FROM</span> <span class="kw-target">+deps</span>
  <span class="kw-cmd">COPY</span> src ./src
  <span class="kw-cmd">RUN</span> zig build test

<span class="kw-target">build</span>:
  <span class="kw-cmd">FROM</span> <span class="kw-target">+deps</span>
  <span class="kw-cmd">COPY</span> src ./src
  <span class="kw-cmd">RUN</span> zig build <span class="kw-flag">-Doptimize=ReleaseSafe</span>
  <span class="kw-cmd">SAVE ARTIFACT</span> zig-out/bin/app <span class="kw-flag">AS LOCAL</span> bin/app

<span class="kw-target">docker</span>:
  <span class="kw-cmd">FROM</span> <span class="kw-string">alpine:3.24</span>
  <span class="kw-cmd">COPY</span> <span class="kw-target">+build</span>/bin/app /usr/local/bin/app
  <span class="kw-cmd">ENTRYPOINT</span> [<span class="kw-string">"/usr/local/bin/app"</span>]
  <span class="kw-cmd">SAVE IMAGE</span> <span class="kw-flag">--push</span> <span class="kw-string">docker.io/myorg/myapp:latest</span>

<span class="kw-target">all</span>:
  <span class="kw-cmd">BUILD</span> <span class="kw-target">+test</span>
  <span class="kw-cmd">BUILD</span> <span class="kw-target">+build</span>
  <span class="kw-cmd">BUILD</span> <span class="kw-target">+docker</span>`},makefile:{legacyTitle:"Makefile (Zig Host Execution)",legacyCode:`<span class="kw-target">.PHONY</span>: <span class="kw-target">all</span> <span class="kw-target">test</span> <span class="kw-target">build</span> <span class="kw-target">docker</span>

<span class="kw-target">all</span>: <span class="kw-target">test</span> <span class="kw-target">build</span> <span class="kw-target">docker</span>

<span class="kw-target">test</span>:
	zig build test

<span class="kw-target">build</span>:
	zig build -Doptimize=ReleaseSafe

<span class="kw-target">docker</span>: <span class="kw-target">build</span>
	docker build <span class="kw-flag">-t</span> <span class="kw-string">docker.io/myorg/myapp:latest</span> .
	docker push <span class="kw-string">docker.io/myorg/myapp:latest</span>`,earthfileTitle:"Earthfile (Hermetic & Parallel)",earthfileCode:`<span class="kw-cmd">VERSION</span> <span class="kw-val">0.8</span>
<span class="kw-cmd">FROM</span> <span class="kw-string">alpine:3.24</span>
<span class="kw-cmd">RUN</span> apk add <span class="kw-flag">--no-cache</span> zig
<span class="kw-cmd">WORKDIR</span> <span class="kw-string">/app</span>

<span class="kw-target">deps</span>:
  <span class="kw-cmd">COPY</span> build.zig build.zig.zon ./
  <span class="kw-cmd">RUN</span> zig build <span class="kw-flag">--fetch</span>

<span class="kw-target">test</span>:
  <span class="kw-cmd">FROM</span> <span class="kw-target">+deps</span>
  <span class="kw-cmd">COPY</span> src ./src
  <span class="kw-cmd">RUN</span> zig build test

<span class="kw-target">build</span>:
  <span class="kw-cmd">FROM</span> <span class="kw-target">+deps</span>
  <span class="kw-cmd">COPY</span> src ./src
  <span class="kw-cmd">RUN</span> zig build <span class="kw-flag">-Doptimize=ReleaseSafe</span>
  <span class="kw-cmd">SAVE ARTIFACT</span> zig-out/bin/app <span class="kw-flag">AS LOCAL</span> bin/app

<span class="kw-target">docker</span>:
  <span class="kw-cmd">FROM</span> <span class="kw-string">alpine:3.24</span>
  <span class="kw-cmd">COPY</span> <span class="kw-target">+build</span>/bin/app /usr/local/bin/app
  <span class="kw-cmd">ENTRYPOINT</span> [<span class="kw-string">"/usr/local/bin/app"</span>]
  <span class="kw-cmd">SAVE IMAGE</span> <span class="kw-flag">--push</span> <span class="kw-string">docker.io/myorg/myapp:latest</span>

<span class="kw-target">all</span>:
  <span class="kw-cmd">BUILD</span> <span class="kw-target">+test</span>
  <span class="kw-cmd">BUILD</span> <span class="kw-target">+build</span>
  <span class="kw-cmd">BUILD</span> <span class="kw-target">+docker</span>`},dagger:{legacyTitle:"Dagger (Go SDK Module \u2014 No Native Zig SDK)",legacyCode:`<span class="kw-cmd">package</span> main

<span class="kw-cmd">import</span> (
  <span class="kw-string">"context"</span>
  <span class="kw-string">"dagger/pipeline/internal/dagger"</span>
)

<span class="kw-cmd">type</span> <span class="kw-type">Pipeline</span> <span class="kw-cmd">struct</span>{}

<span class="kw-cmd">func</span> (<span class="kw-var">m</span> *<span class="kw-type">Pipeline</span>) <span class="kw-fn">base</span>(<span class="kw-var">src</span> *<span class="kw-type">dagger.Directory</span>) *<span class="kw-type">dagger.Container</span> {
  <span class="kw-cmd">return</span> <span class="kw-var">dag</span>.<span class="kw-fn">Container</span>().
    <span class="kw-fn">From</span>(<span class="kw-string">"alpine:3.24"</span>).
    <span class="kw-fn">WithWorkdir</span>(<span class="kw-string">"/app"</span>).
    <span class="kw-fn">WithDirectory</span>(<span class="kw-string">"."</span>, <span class="kw-var">src</span>).
    <span class="kw-fn">WithExec</span>([]<span class="kw-type">string</span>{"sh", "-c", "zig build --fetch"})
}

<span class="kw-cmd">func</span> (<span class="kw-var">m</span> *<span class="kw-type">Pipeline</span>) <span class="kw-fn">Test</span>(<span class="kw-var">ctx</span> <span class="kw-type">context.Context</span>, <span class="kw-var">src</span> *<span class="kw-type">dagger.Directory</span>) (<span class="kw-type">string</span>, <span class="kw-type">error</span>) {
  <span class="kw-cmd">return</span> <span class="kw-var">m</span>.<span class="kw-fn">base</span>(<span class="kw-var">src</span>).<span class="kw-fn">WithExec</span>([]<span class="kw-type">string</span>{"sh", "-c", "zig build test"}).<span class="kw-fn">Stdout</span>(<span class="kw-var">ctx</span>)
}

<span class="kw-cmd">func</span> (<span class="kw-var">m</span> *<span class="kw-type">Pipeline</span>) <span class="kw-fn">Build</span>(<span class="kw-var">ctx</span> <span class="kw-type">context.Context</span>, <span class="kw-var">src</span> *<span class="kw-type">dagger.Directory</span>) (*<span class="kw-type">dagger.File</span>, <span class="kw-type">error</span>) {
  <span class="kw-var">bin</span> := <span class="kw-var">m</span>.<span class="kw-fn">base</span>(<span class="kw-var">src</span>).
    <span class="kw-fn">WithExec</span>([]<span class="kw-type">string</span>{"sh", "-c", "zig build -Doptimize=ReleaseSafe"}).
    <span class="kw-fn">File</span>(<span class="kw-string">"zig-out/bin/app"</span>)

  <span class="kw-cmd">if</span> <span class="kw-var">_</span>, <span class="kw-var">err</span> := <span class="kw-var">bin</span>.<span class="kw-fn">Export</span>(<span class="kw-var">ctx</span>, <span class="kw-string">"bin/app"</span>); <span class="kw-var">err</span> != <span class="kw-val">nil</span> {
    <span class="kw-cmd">return</span> <span class="kw-val">nil</span>, <span class="kw-var">err</span>
  }
  <span class="kw-cmd">return</span> <span class="kw-var">bin</span>, <span class="kw-val">nil</span>
}

<span class="kw-cmd">func</span> (<span class="kw-var">m</span> *<span class="kw-type">Pipeline</span>) <span class="kw-fn">Publish</span>(<span class="kw-var">ctx</span> <span class="kw-type">context.Context</span>, <span class="kw-var">src</span> *<span class="kw-type">dagger.Directory</span>) (<span class="kw-type">string</span>, <span class="kw-type">error</span>) {
  <span class="kw-var">bin</span>, <span class="kw-var">err</span> := <span class="kw-var">m</span>.<span class="kw-fn">Build</span>(<span class="kw-var">ctx</span>, <span class="kw-var">src</span>)
  <span class="kw-cmd">if</span> <span class="kw-var">err</span> != <span class="kw-val">nil</span> {
    <span class="kw-cmd">return</span> <span class="kw-string">""</span>, <span class="kw-var">err</span>
  }
  <span class="kw-cmd">return</span> <span class="kw-var">dag</span>.<span class="kw-fn">Container</span>().
    <span class="kw-fn">From</span>(<span class="kw-string">"alpine:3.24"</span>).
    <span class="kw-fn">WithFile</span>(<span class="kw-string">"/usr/local/bin/app"</span>, <span class="kw-var">bin</span>).
    <span class="kw-fn">WithEntrypoint</span>([]<span class="kw-type">string</span>{"/usr/local/bin/app"}).
    <span class="kw-fn">Publish</span>(<span class="kw-var">ctx</span>, <span class="kw-string">"docker.io/myorg/myapp:latest"</span>)
}`,earthfileTitle:"Earthfile",earthfileCode:`<span class="kw-cmd">VERSION</span> <span class="kw-val">0.8</span>
<span class="kw-cmd">FROM</span> <span class="kw-string">alpine:3.24</span>
<span class="kw-cmd">RUN</span> apk add <span class="kw-flag">--no-cache</span> zig
<span class="kw-cmd">WORKDIR</span> <span class="kw-string">/app</span>

<span class="kw-target">deps</span>:
  <span class="kw-cmd">COPY</span> build.zig build.zig.zon ./
  <span class="kw-cmd">RUN</span> zig build <span class="kw-flag">--fetch</span>

<span class="kw-target">test</span>:
  <span class="kw-cmd">FROM</span> <span class="kw-target">+deps</span>
  <span class="kw-cmd">COPY</span> src ./src
  <span class="kw-cmd">RUN</span> zig build test

<span class="kw-target">build</span>:
  <span class="kw-cmd">FROM</span> <span class="kw-target">+deps</span>
  <span class="kw-cmd">COPY</span> src ./src
  <span class="kw-cmd">RUN</span> zig build <span class="kw-flag">-Doptimize=ReleaseSafe</span>
  <span class="kw-cmd">SAVE ARTIFACT</span> zig-out/bin/app <span class="kw-flag">AS LOCAL</span> bin/app

<span class="kw-target">docker</span>:
  <span class="kw-cmd">FROM</span> <span class="kw-string">alpine:3.24</span>
  <span class="kw-cmd">COPY</span> <span class="kw-target">+build</span>/bin/app /usr/local/bin/app
  <span class="kw-cmd">ENTRYPOINT</span> [<span class="kw-string">"/usr/local/bin/app"</span>]
  <span class="kw-cmd">SAVE IMAGE</span> <span class="kw-flag">--push</span> <span class="kw-string">docker.io/myorg/myapp:latest</span>

<span class="kw-target">all</span>:
  <span class="kw-cmd">BUILD</span> <span class="kw-target">+test</span>
  <span class="kw-cmd">BUILD</span> <span class="kw-target">+build</span>
  <span class="kw-cmd">BUILD</span> <span class="kw-target">+docker</span>`},gha:{legacyTitle:"Standard GitHub Actions Workflow",legacyCode:`<span class="kw-prop">name</span>: <span class="kw-string">CI &amp; Release</span>
<span class="kw-prop">on</span>: [<span class="kw-string">push</span>]

<span class="kw-prop">jobs</span>:
  <span class="kw-prop">pipeline</span>:
    <span class="kw-prop">runs-on</span>: <span class="kw-string">ubuntu-26.04</span>
    <span class="kw-prop">steps</span>:
      - <span class="kw-prop">uses</span>: <span class="kw-string">actions/checkout@v4</span>

      - <span class="kw-prop">name</span>: <span class="kw-string">Run Tests</span>
        <span class="kw-prop">run</span>: zig build test

      - <span class="kw-prop">name</span>: <span class="kw-string">Build Host Binary / Package</span>
        <span class="kw-prop">run</span>: zig build -Doptimize=ReleaseSafe

      - <span class="kw-prop">uses</span>: <span class="kw-string">actions/upload-artifact@v4</span>
        <span class="kw-prop">with</span>:
          <span class="kw-prop">name</span>: <span class="kw-string">app-artifact</span>
          <span class="kw-prop">path</span>: <span class="kw-string">zig-out/bin/app</span>

      - <span class="kw-prop">uses</span>: <span class="kw-string">docker/login-action@v3</span>
        <span class="kw-prop">with</span>:
          <span class="kw-prop">username</span>: <span class="kw-expr">\${{ secrets.DOCKER_USER }}</span>
          <span class="kw-prop">password</span>: <span class="kw-expr">\${{ secrets.DOCKER_TOKEN }}</span>

      - <span class="kw-prop">uses</span>: <span class="kw-string">docker/build-push-action@v6</span>
        <span class="kw-prop">with</span>:
          <span class="kw-prop">context</span>: <span class="kw-string">.</span>
          <span class="kw-prop">push</span>: <span class="kw-val">true</span>
          <span class="kw-prop">tags</span>: <span class="kw-string">docker.io/myorg/myapp:latest</span>`,earthfileTitle:"Clean GitHub Action with EarthBuild (10 Lines)",earthfileCode:`<span class="kw-prop">name</span>: <span class="kw-string">CI &amp; Release</span>
<span class="kw-prop">on</span>: [<span class="kw-string">push</span>]

<span class="kw-prop">jobs</span>:
  <span class="kw-prop">pipeline</span>:
    <span class="kw-prop">runs-on</span>: <span class="kw-string">ubuntu-latest</span>
    <span class="kw-prop">steps</span>:
      - <span class="kw-prop">uses</span>: <span class="kw-string">actions/checkout@v4</span>

      - <span class="kw-prop">name</span>: <span class="kw-string">Setup EarthBuild</span>
        <span class="kw-prop">uses</span>: <span class="kw-string">earthbuild/actions-setup@v2</span>

      - <span class="kw-prop">name</span>: <span class="kw-string">Test, Build Binary &amp; Push Image</span>
        <span class="kw-prop">run</span>: <span class="kw-cmd">earth</span> <span class="kw-flag">--ci</span> <span class="kw-flag">--push</span> <span class="kw-target">+all</span>
        <span class="kw-prop">env</span>:
          <span class="kw-prop">EARTH_DOCKER_CONFIG</span>: <span class="kw-expr">\${{ secrets.DOCKER_CONFIG }}</span>`}}};var Q="go",ss="dockerfile";function ns(a,s){let n=cs[a]?.[s];if(!n)return;let e=`mig-${s}`,p=document.getElementById(e);if(!p)return;let A=p.querySelector(".mig-legacy-title"),t=p.querySelector(".mig-legacy-code"),c=p.querySelector(".mig-earthfile-title"),r=p.querySelector(".mig-earthfile-code");A&&(A.textContent=n.legacyTitle),t&&(t.innerHTML=n.legacyCode),c&&(c.textContent=n.earthfileTitle),r&&(r.innerHTML=n.earthfileCode)}function Es(a){Q=a,document.querySelectorAll("#migLangTabs .race-tab-btn").forEach(n=>{n.classList.toggle("active",n.getAttribute("data-lang")===a)}),ns(Q,ss)}function xs(){let a=document.querySelectorAll(".matrix-filter-btn"),s=document.querySelectorAll(".comparison-table tbody tr");a.forEach(n=>{n.addEventListener("click",()=>{a.forEach(p=>p.classList.remove("active")),n.classList.add("active");let e=n.getAttribute("data-filter")||n.getAttribute("data-category");s.forEach(p=>{let A=p.getAttribute("data-category");e==="all"||A===e?p.style.display="":p.style.display="none"})})})}function Os(){let a=document.querySelectorAll("#migLangTabs .race-tab-btn"),s=document.querySelectorAll(".migration-tab-btn"),n=document.querySelector(".migration-container");a.forEach(e=>{e.addEventListener("click",()=>{a.forEach(A=>A.classList.remove("active")),e.classList.add("active");let p=e.getAttribute("data-lang");!p||!cs[p]||(Q=p,ns(Q,ss))})}),s.forEach(e=>{e.addEventListener("click",()=>{s.forEach(c=>c.classList.remove("active")),e.classList.add("active");let p=e.getAttribute("data-target");if(!p)return;ss=p.replace("mig-","");let A=document.getElementById(p);if(!A&&n){let c=document.getElementById(`tmpl-${p}`);if(c){let r=c.content.cloneNode(!0);n.appendChild(r),A=document.getElementById(p)}}document.querySelectorAll(".migration-panel").forEach(c=>{c.id===p?c.style.display="grid":c.style.display="none"}),ns(Q,ss)})}),ns(Q,ss)}function vs(a){let s=document.querySelectorAll("#raceLangTabs .race-tab-btn"),n=document.getElementById("raceCodePane"),e=document.getElementById("raceFileLink"),p=document.getElementById("langNavSentinel"),A=document.getElementById("raceLangNavbar");if(p&&A){let d=()=>{let o=p.getBoundingClientRect().top<=20;A.classList.toggle("is-stuck",o)};window.addEventListener("scroll",d,{passive:!0}),window.addEventListener("resize",d,{passive:!0}),d()}let t=document.getElementById("stackedWindowsDeck"),c=document.querySelectorAll(".cr-feature-card, .stacked-terminal-window");function r(d){t&&(t.setAttribute("data-front",d),c.forEach(i=>{let o=i.getAttribute("data-window")===d;i.classList.toggle("is-front",o),i.setAttribute("data-active",o?"true":"false"),i.setAttribute("aria-selected",o?"true":"false");let k=i.querySelector(".cr-card-window-content");k&&k.setAttribute("aria-hidden",o?"false":"true")}))}c.forEach(d=>{let i=d.getAttribute("data-window");if(!i)return;let o=d.querySelector(".cr-card-tab-header, .stacked-window-header");d.addEventListener("click",()=>{r(i)}),o&&o.addEventListener("click",k=>{k.stopPropagation(),r(i)}),d.addEventListener("focus",()=>{r(i)})}),s.forEach(d=>{d.addEventListener("click",()=>{s.forEach(o=>o.classList.remove("active")),d.classList.add("active");let i=d.getAttribute("data-lang");!i||!K[i]||(e&&(e.innerHTML=`<a id="exampleRepoLink" href="${K[i].repoUrl}" target="_blank" rel="noopener noreferrer">view code \u2197</a>`),n&&(n.innerHTML=`<code>${K[i].code}</code>`),a.startRace(i),Es(i))})}),r("repeat"),a.showStatic("python")}var ps=null;function os(a){let s=document.getElementById("copyToast");s||(s=document.createElement("div"),s.id="copyToast",s.className="copy-toast",s.setAttribute("role","status"),s.setAttribute("aria-live","polite"),s.innerHTML=`
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
      <span class="copy-toast-msg"></span>
    `,document.body.appendChild(s));let n=s.querySelector(".copy-toast-msg");n&&(n.textContent=a),s.classList.add("show"),ps!==null&&window.clearTimeout(ps),ps=window.setTimeout(()=>{s?.classList.remove("show"),ps=null},2200)}function ds(a,s=!0){a instanceof HTMLDetailsElement&&(a.open=!0);let n=a.closest("details");n&&(n.open=!0);let p=(a.querySelector(".section-header")||a).getBoundingClientRect().top+window.pageYOffset-32;window.scrollTo({top:Math.max(0,p),behavior:s?"smooth":"auto"})}function rs(a,s){let n=document.createElement("a");return n.href=`#${a}`,n.className="heading-anchor-btn",n.setAttribute("data-anchor-id",a),n.setAttribute("aria-label",`Copy link to "${s}"`),n.setAttribute("title",`Copy link to "${s}"`),n.innerHTML=`
    <svg class="anchor-icon-link" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
    </svg>
    <svg class="anchor-icon-check" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  `,n.addEventListener("click",async e=>{if(e.metaKey||e.ctrlKey||e.button===1)return;e.preventDefault();let p=window.location.search||"",A=`${window.location.origin}${window.location.pathname}${p}#${a}`;try{if(navigator.clipboard&&navigator.clipboard.writeText)await navigator.clipboard.writeText(A);else{let c=document.createElement("textarea");c.value=A,c.style.position="fixed",c.style.opacity="0",document.body.appendChild(c),c.select(),document.execCommand("copy"),document.body.removeChild(c)}window.history.pushState(null,"",`${p}#${a}`);let t=document.getElementById(a);t&&(ds(t,!0),t.classList.add("anchor-highlight"),setTimeout(()=>t.classList.remove("anchor-highlight"),1500)),n.classList.add("copied"),os("Link copied to clipboard!"),setTimeout(()=>{n.classList.remove("copied")},2e3)}catch(t){console.error("Failed to copy link to clipboard:",t)}}),n}function is(a,s){let n=document.createElement("span");n.className="heading-anchor-holder",n.appendChild(s),a.appendChild(n)}function Ss(){document.querySelectorAll("section[id]").forEach(p=>{let A=p.id;if(!A)return;let t=p.querySelector(".section-title");if(t&&!t.querySelector(".heading-anchor-btn")){let c=t.textContent?.trim().replace(/\s+/g," ")||A,r=rs(A,c);is(t,r)}}),document.querySelectorAll(".doc-content h2[id], .doc-content h3[id]").forEach(p=>{let A=p.id;if(!A||p.querySelector(".heading-anchor-btn"))return;let t=p.textContent?.trim().replace(/\s+/g," ")||A,c=rs(A,t);is(p,c)}),document.querySelectorAll(".faq-item[id]").forEach(p=>{let A=p.id;if(!A)return;let t=p.querySelector(".faq-summary");if(t&&!t.querySelector(".heading-anchor-btn")){let c=t.textContent?.trim().replace(/\s+/g," ")||A,r=rs(A,c),d=document.createElement("span");for(d.className="faq-question-text";t.firstChild;)d.appendChild(t.firstChild);is(d,r),t.appendChild(d)}}),document.addEventListener("click",p=>{let A=p.target?.closest('a[href*="#"]');if(!A||A.classList.contains("heading-anchor-btn")||p.metaKey||p.ctrlKey||p.button===1||A.target==="_blank")return;let t=A.getAttribute("href");if(!t)return;let c="";if(t.startsWith("#")?c=t.substring(1):t.startsWith("/#")&&(window.location.pathname==="/"||window.location.pathname==="")&&(c=t.substring(2)),c){let r=document.getElementById(c);r&&(p.preventDefault(),window.history.pushState(null,"",`#${c}`),ds(r,!0),r.classList.add("anchor-highlight"),setTimeout(()=>r.classList.remove("anchor-highlight"),1500))}});let e=(p=!0)=>{if(window.location.hash){let A=window.location.hash.substring(1);A.includes("?")&&(A=A.split("?")[0]);let t=document.getElementById(A);t&&(ds(t,p),setTimeout(()=>{t.classList.add("anchor-highlight"),setTimeout(()=>t.classList.remove("anchor-highlight"),1800)},p?250:0))}};window.addEventListener("hashchange",()=>e(!0)),window.location.hash&&(document.readyState==="complete"?setTimeout(()=>e(!1),50):window.addEventListener("load",()=>{setTimeout(()=>e(!1),50)}))}function js(){let a=new URLSearchParams(window.location.search),s=a.get("team")||a.get("teamSize"),n=a.get("builds")||a.get("buildsPerDay"),e=a.get("mins")||a.get("minutesSaved");if((!s||!n||!e)&&window.location.hash.includes("?")){let A=window.location.hash.split("?")[1],t=new URLSearchParams(A);s||(s=t.get("team")||t.get("teamSize")),n||(n=t.get("builds")||t.get("buildsPerDay")),e||(e=t.get("mins")||t.get("minutesSaved"))}let p=A=>{if(!A)return;let t=parseInt(A,10);return isNaN(t)?void 0:t};return{team:p(s),builds:p(n),mins:p(e)}}function Ts(a,s,n){let e=new URL(window.location.href);return e.searchParams.set("team",String(a)),e.searchParams.set("builds",String(s)),e.searchParams.set("mins",String(n)),e.hash="calculator",e.toString()}function Ps(){let a=document.getElementById("roiTeamSize"),s=document.getElementById("roiBuildsPerDay"),n=document.getElementById("roiMinutesSaved"),e=document.getElementById("roiTeamSizeVal"),p=document.getElementById("roiBuildsPerDayVal"),A=document.getElementById("roiMinutesSavedVal"),t=document.getElementById("roiHoursSaved"),c=document.getElementById("roiHoursPerDev"),r=document.getElementById("roiRunnerMinutesSaved"),d=document.getElementById("roiVcpuHours"),i=document.getElementById("roiCo2Saved"),o=document.getElementById("roiCo2Equivalent"),k=document.getElementById("roiCopyShareBtn"),b=js();if(a&&b.team!==void 0){let y=Math.max(1,Math.min(100,b.team));a.value=String(y)}if(s&&b.builds!==void 0){let y=Math.max(1,Math.min(25,b.builds));s.value=String(y)}if(n&&b.mins!==void 0){let y=Math.max(2,Math.min(30,b.mins));n.value=String(y)}let S=null;function D(y=!0){let T=parseInt(a?.value||"20",10),x=parseInt(s?.value||"8",10),P=parseInt(n?.value||"12",10);e&&(e.innerText=`${T} devs`),p&&(p.innerText=`${x} builds/day`),A&&(A.innerText=`${P} mins`);let R=T*x*21*P,C=Math.round(R/60),I=T>0?Math.round(C/T):0,N=Math.round(R*2/60),w=Math.round(R*15/1e3),m=Math.round(w*2);t&&(t.innerText=`${C.toLocaleString()} hrs`),c&&(c.innerText=`\u2248 ~${I.toLocaleString()} hrs saved / dev / month`),r&&(r.innerText=`${R.toLocaleString()} mins`),d&&(d.innerText=`\u2248 ${N.toLocaleString()} vCPU-hrs (2-vCPU runner baseline)`),i&&(w>=1e3?i.innerText=`${(w/1e3).toFixed(1)} t CO\u2082e`:i.innerText=`${w.toLocaleString()} kg CO\u2082e`),o&&(m>=1e3?o.innerText=`\u2248 ~${(m/1e3).toFixed(1)} MWh data center energy spared`:o.innerText=`\u2248 ~${m.toLocaleString()} kWh data center energy spared`),y&&(S!==null&&window.clearTimeout(S),S=window.setTimeout(()=>{let f=Ts(T,x,P);window.history.replaceState(null,"",f)},100))}[a,s,n].forEach(y=>{y?.addEventListener("input",()=>D(!0))}),k&&k.addEventListener("click",async()=>{let y=parseInt(a?.value||"20",10),T=parseInt(s?.value||"8",10),x=parseInt(n?.value||"12",10),P=Ts(y,T,x);try{if(navigator.clipboard&&navigator.clipboard.writeText)await navigator.clipboard.writeText(P);else{let I=document.createElement("textarea");I.value=P,I.style.position="fixed",I.style.opacity="0",document.body.appendChild(I),I.select(),document.execCommand("copy"),document.body.removeChild(I)}window.history.replaceState(null,"",P);let h=k.querySelector(".roi-copy-btn-text"),R=k.querySelector(".roi-btn-link-icon"),C=k.querySelector(".roi-btn-check-icon");k.classList.add("copied"),h&&(h.textContent="Link Copied!"),R&&(R.style.display="none"),C&&(C.style.display="inline-block"),os(`Calculator link (${y} devs, ${x}m saved) copied!`),setTimeout(()=>{k.classList.remove("copied"),h&&(h.textContent="Share Calculations"),R&&(R.style.display="inline-block"),C&&(C.style.display="none")},2200)}catch(h){console.error("Failed to copy calculator link:",h)}}),D(!!(b.team||b.builds||b.mins))}var v={brightBlue:879020,mediumBlue:2863871,brightGreen:3978097,darkGreen:2263842,brickYellow:14667423,darkStoneGrey:6583435,white:16777215},Vs="AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP//gAAD//4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB//////Hf///8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAf/////////////AAAAAAAAAAAAAAAAAHAAAAAAAAAAAAAAAAAAAAAAAAAAAB/////////////wAAAAX/8AAP8AAAAAAfwAAAAAAAAAAAAAAAAAAAAAAAAAOB////g////////AAAAD//wAAAAAAAAAAH/gAAAAAAAAAAAAAAAAAAAAAAAeP3vv/7////////+AAAAB//AAAAAAAAAAAAf8AAAAAAAAAAAAAAAAAAAAAA8+AL4f/g////////+AAAAAfvgAAAAAAAAAAAF+AAAAAAAAAAAAAAAAAAAAAH/3R////gP////////AAAAAHAAAAAAAf4AAAHP//AAAA8AAAAAAAAAAAAAAACP/5///8AAAf/////+AAAAAAAAAAAAf+AAAH////gAAD//gAAAAAAAAAAAAAf4+AN//+AAAP/////+AAAAAAAAAAAAeAAAAP///4AAAA/nAAAAAAAAAAAAAAf/B8///3wAAH/////8AAAAAAAAAAAB4AEAP//////H4AfAAAAAAAAAAAAAAA//+5/9//4AAD/////wAAAAAAAAAAAHwAHt////////8Af/AAAAA///////////////////////////////////////////////////////////+wAA//+gAOYf//1+///+AB/////4AAAAAAH/wAAB8A/v/////////////8AIDAAD///+P/////v/j///AB////+AAAAAAAf//gAAA+/////////////////P+////////////////////////////////+AAAP///wMYAAAAAAAAAAAAAAAQAB///////////////////////////////4AAAD/4AAAcAAAAAAAAAAAAAAAAATP//////////////////////////////wBAH/7AAABwAAAAAAAAAAAAAAAAA8f//////////////////////////////gHwD8AAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////APH////////////PcB/wAP/gAAfgAAAP/3/////////////////////////+ACP////////////A///gAD/AAAAAAAB//H//////////////////////////AAf///////////wAG/5AAD/AAAAAAAD//H/////////////////////////gAA////////////wAA/4QAB+AAAAAAAB//n//////////////////////D/+AAAb/zwH///////wAA/44AAAAAAAAAAB//D//////////////////////D6IAAAAv4AA///////4AB//8AAAAAAAAA4B5/B///////////////////4AYPgAAAAAH8AAD///////AAf/8AAAAAAAAA+AP+H///////////////////gAA/wAAAAAfQAAB///////wAf/+AAAAAAAAB8AO8H///////////////////AAB/wAAAAD8AAAA////////x///gAAAAAAAD8AP4H//////////////////+AAB/AAAAAGAAAAD////////z///4AAAAAAAH/AP////////////////////+yAB/gAAAAAAAAADP///////x///+AAAAAAAPfj//////////////////////+AB+AAAAAAAAAABv///////5///+AAAAAAAPfz///////////////////////AA4AAAAAAAAAAAD///////////+AAAAAAAM/////////////////////////AA4AAAAAAAAAAAH///////////MAAAAAAAA////////////////////////7AAAAAAAAAAAAAAH//////////+fgAAAAAAAj///////////////////////7AAAAAAAAAAAAAAA//////////w/wAAAAAAAf///////////////////////+gAAAAAAAAAAAAAAf/////////x/wAAAAAAAf////////7//////////////yAAAAAAAAAAAAAAAf/////////9DgAAAAAAAD////////g//////////////nAAAAAAAAAAAAAAAP//////////gAAAAAAAAD/////P/+A/////////////+GAAAAAAAAAAAAAAAP/////////4AAAAAAAAAD/////Hf8D/////////////8HQAAAAAAAAAAAAAAf////////5gAAAAAAAAP//3z/+AH+D/////////////8PwAAAAAAAAAAAAAAf////////wAAAAAAAAAH/4P5/8HB+A////////////+wfgAAAAAAAAAAAAAAf////////4AAAAAAAAAP/8M+f//n/Af///////////8AdAAAAAAAAAAAAAAAf////////gAAAAAAAAAH/gMP/////gf///////////8AcAAAAAAAAAAAAAAAP///////8AAAAAAAAAAP/AMH/P///g///////////fwAMAAAAAAAAAAAAAAAP///////8AAAAAAAAAAP/gI/Pv///A//////////+T4AYAAAAAAAAAAAAAAAH///////4AAAAAAAAAAH/A3+Hn///g///////////78C4AAAAAAAAAAAAAAAD///////4AAAAAAAAAAH8//MHH///w///////////48D4AAAAAAAAAAAAAAAB///////4AAAAAAAAAAB//+AB4P//////////////A8/4AAAAAAAAAAAAAAAB///////wAAAAAAAAAAB//+AAgP//////////////g7/gAAAAAAAAAAAAAAAAf//////AAAAAAAAAAAH///AAAB//////////////gH8AAAAAAAAAAAAAAAAAP/////8AAAAAAAAAAAP///8PAD//////////////wHwAAAAAAAAAAAAAAAAAH/////4AAAAAAAAAAAP///+f/7//////////////wDAAAAAAAAAAAAAAAAAAH/////4AAAAAAAAAAAP/////////////////////wAAAAAAAAAAAAAAAAAAAD////i8AAAAAAAAAAAf/////////////////////4AAAAAAAAAAAAAAAAAAAB///gAcAAAAAAAAAAB//////////v///////////wAAAAAAAAAAAAAAAAAAAD//+AAcgAAAAAAAAAD//////////3///////////gAAAAAAAAAAAAAAAAAAAA7/+AAdwAAAAAAAAAH///////+//9///////////AAAAAAAAAAAAAAAAAAAAAf/+AANgAAAAAAAAAH///////+//8f//////////QAAAAAAAAAAAAAAAAAAAAc/+AABgAAAAAAAAAP///////+f//4Af///////+wAAAAAAAAAAAAAAAAAAAAGf+AAcgAAAAAAAAAf////////P//+Af///////8wAAAAAAAAAAAAIAAAAAAAGf+AB/gAAAAAAAAAf////////n///AH///////wwAAAAAAAAAAAAPAAAAAAAAP+B9H4AAAAAAAAA/////////3///AD///v//8AgAAAAAAAAAAAABgAAAAAAAP+B8B8AAAAAAAAAf////////n//+AD//8P/+YAAAAAAAAAAAAAABwAAAAAAAP/B4A/4AAAAAAAAf////////z//8AA//wH/88AAAAAAAAAAAAAAAgAAAAAAAD//4B3/gAAAAAAAf////////x//8AAf/AD/+4A4AAAAAAAAAAAAAAAAAAAAAB//wAwjgAAAAAAAf////////5//4AAf/AD/+AA4AAAAAAAAAAAAAAAAAAAAAAP/0AAAAAAAAAAAf////////4//gAAf+AD//gB4AAAAAAAAAAAAAAAAAAAAAADP/gAAAAAAAAAAf////////8/+AAAf4ADf/gBwAAAAAAAAAAAAAAAAAAAAAAAH/gAAAAAAAAAA///////////wAAAP4AAf/gA4AAAAAAAAAAAAAAAAAAAAAAAD/gAAAAAAAAAAf//////////gAAAP4AAP/wA8AAAAAAAAAAAAAAAAAAAAAAAAPgAoAAAAAAAAf/////////8MAAAPwAAP/wAzAAAAAAAAAAAAAAAAAAAAAAAAHgH8AAAAAAAAf/////////x8AAAHwAAMfwBfAAAAAAAAAAAAAAAAAAAAAAAADgP//AAAAAAAH//////////8AAADwAAMfADfAAAAAAAAAAAAAAAAAAAAAAAAD/f//AAAAAAAH//////////4AAAD4AAMOAGNgAAAAAAAAAAAAAAAAAAAAAAAA////gAAAAAAD//////////4AAAD8AAOEAEPgAAAAAAAAAAAAAAAAAAAAAAAAN///wAAAAAAB//////////wAAABcAAOAAAfgAAAAAAAAAAAAAAAAAAAAAAAAA///6AAAAAAA//////////wAAAAcAAHgAMPgAAAAAAAAAAAAAAAAAAAAAAAAA////wAAAAAAP/x///////gAAAAIABzgAfBAAAAAAAAAAAAAAAAAAAAAAAAAA////4AAAAAAPuB///////AAAAAAAB7wA+AAAAAAAAAAAAAAAAAAAAAAAAAAA////4AAAAAAAAAP/////+AAAAAAAA/wD8AAAAAAAAAAAAAAAAAAAAAAAAAAB////4AAAAAAAAAH/////+AAAAAAAAfwX+AQAAAAAAAAAAAAAAAAAAAAAAAAB////+AAAAAAAAAH/////4AAAAAAAAP4f8xYAAAAAAAAAAAAAAAAAAAAAAAAH////8AAAAAAAAAH/////wAAAAAAAAHw//+YAAAAAAAAAAAAAAAAAAAAAAAAH/////wAAAAAAAAP/////gAAAAAAAADwf98bwAAAAAAAAAAAAAAAAAAAAAAAH/////8AAAAAAAAP/////AAAAAAAAAD4f58D5gAAAAAAAAAAAAAAAAAAAAAAH//////4AAAAAAAH////+AAAAAAAAAD8P7wN78AwAAAAAAAAAAAAAAAAAAAAH//////8AAAAAAAB////+AAAAAAAAAA+H55+//gcAAAAAAAAAAAAAAAAAAAAP//////+AAAAAAAB////8AAAAAAAAAA8Ap8A3/wcAAAAAAAAAAAAAAAAAAAAH///////gAAAAAAB////4AAAAAAAAAAfABsAJ/zzAAAAAAAAAAAAAAAAAAAAP///////wAAAAAAA////8AAAAAAAAAAH+AAAI//hgAAAAAAAAAAAAAAAAAAAD///////wAAAAAAA////8AAAAAAAAAAD/gAAA/8A8AAAAAAAAAAAAAAAAAAAD///////gAAAAAAA////8AAAAAAAAAAAP37wB/OAHAAAAAAAAAAAAAAAAAAAB///////gAAAAAAA////8AAAAAAAAAAAAPnAAGHgHAAAAAAAAAAAAAAAAAAAB///////AAAAAAAAf///+AAAAAAAAAAAAAmAACHgBgAAAAAAAAAAAAAAAAAAA//////+AAAAAAAAf///+AAAAAAAAAAAAAAB+HAAAAAAAAAAAAAAAAAAAAAAA//////+AAAAAAAAf///+AwAAAAAAAAAAAAD+HAAAAAAAAAAAAAAAAAAAAAAAf/////8AAAAAAAA////+B4AAAAAAAAAAAA3+HAAAAAAAAAAAAAAAAAAAAAAAf/////8AAAAAAAA////+B4AAAAAAAAAAAB/8HwAADAAAAAAAAAAAAAAAAAAAP/////8AAAAAAAB////+H4AAAAAAAAAAAD//HwAADAA////////////////////////////////////////////////////////////AAAAAAAAAAAAAAAAAA/////4AAAAAAAB////4fwAAAAAAAAAAAP///4AAAAGAAAAAAAAAAAAAAAAAAf////4AAAAAAAB////gPwAAAAAAAAAAAf///4AAAAGAAAAAAAAAAAAAAAAAAf////4AAAAAAAA////APwAAAAAAAAAAB////+AAAAAAAAAAAAAAAAAAAAAAAf////wAAAAAAAAf//+AfgAAAAAAAAAAP////+AAMAAAAAAAAAAAAAAAAAAAAf////wAAAAAAAAf///AfAAAAAAAAAAA//////AAOAAAAAAAAAAAAAAAAAAAAf////gAAAAAAAAP///AfAAAAAAAAAAB//////gADAAAAAAAAAAAAAAAAAAAAf///8AAAAAAAAAP///AfAAAAAAAAAAB//////gAAAAAAAAAAAAAAAAAAAAAAf///wAAAAAAAAAP///AfAAAAAAAAAAB//////4AAAAAAAAAAAAAAAAAAAAAAf///AAAAAAAAAAP//8AOAAAAAAAAAAB//////4AAAAAAAAAAAAAAAAAAAAAAf///AAAAAAAAAAP//4AAAAAAAAAAAAB//////8AAAAAAAAAAAAAAAAAAAAAAf///AAAAAAAAAAH//4AAAAAAAAAAAAA//////8AAAAAAAAAAAAAAAAAAAAAA////AAAAAAAAAAD//4AAAAAAAAAAAAA//////8AAAAAAAAAAAAAAAAAAAAAA///+AAAAAAAAAAB//wAAAAAAAAAAAAAf/////8AAAAAAAAAAAAAAAAAAAAAA///8AAAAAAAAAAB//gAAAAAAAAAAAAA//////8AAAAAAAAAAAAAAAAAAAAAA///4AAAAAAAAAAA//gAAAAAAAAAAAAAf/////4AAAAAAAAAAAAAAAAAAAAAA///wAAAAAAAAAAB/+AAAAAAAAAAAAAAf/w///4AAAAAAAAAAAAAAAAAAAAAA///wAAAAAAAAAAA/8AAAAAAAAAAAAAAf+AP//wAAAAAAAAAAAAAAAAAAAAAA///gAAAAAAAAAAA8AAAAAAAAAAAAAAAfIAH//wAADAAAAAAAAAAAAAAAAAAB//4AAAAAAAAAAAAAAAAAAAAAAAAAAAAOAAD//gAABgAAAAAAAAAAAAAAAAAB//8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAf/gAABwAAAAAAAAAAAAAAAAAD//4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAf/AAAA+AAAAAAAAAAAAAAAAAD//8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAf/8AAD/AAAAAAAAAAAAAAAAAP//gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAf//gAf/wAAAAAAAAAAAAAAAAAP//wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAf//wAf/wAAAAAAAAAAAAAAAAAP//4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAf//gAP/wAAAAAAAAAAAAAAAAAP//4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAf//gAP/wAAAAAAAAAAAAAAAAAP//8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAf//wAP/wAAAAAAAAAAAAAAAAAP//8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAf//wAP/wAAAAAAAAAAAAAAAAAP//8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAf//gAP/gAAAAAAAAAAAAAAAAAP//wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAf//AAP/AAAAAAAAAAAAAAAAAAP/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAf+AAAfwAAAAAAAAAAAAAAAAAAP/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAfwAAB+AAAAAAAAAAAAAAAAAAP/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAfAAAP4AAAAAAAAAAAAAAAAAAP+AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAfAAAfwAAAAAAAAAAAAAAAAAAf/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAfAAAfwAAAAAAAAAAAAAAAAAAf/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPAAAfwAAAAAAAAAAAAAAAAAAf/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPAAAf4AAAAAAAAAAAAAAAAAAf/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPAAAf+AAAAAAAAAAAAAAAAAAf/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPAAAP+AAAAAAAAAAAAAAAAAAf/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPAABP+AAAAAAAAAAAAAAAAAAf/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPAAfP+AAAAAAAAAAAAAAAAAAf+AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPAB8f+AAAAAAAAAAAAAAAAAAf8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPAB8f/AAAAAAAAAAAAAAAAAAeAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPAB8f/AAAAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPAA8f/AAAAAAAAAAAAAAAAAAHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPAA8f/AAAAAAAAAAAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPAA4f/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPAA4f/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPgAMf/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAfgAIf/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/wAP//AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHP8AD//gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAE//gAAf/4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",es=null;function Ws(){if(es)return es;let a=atob(Vs),s=a.length,n=new Uint8Array(s);for(let e=0;e<s;e++)n[e]=a.charCodeAt(e);return es=n,es}function zs(a,s){for(;s<-180;)s+=360;for(;s>=180;)s-=360;let n=Math.min(359,Math.max(0,Math.floor(s+180))),p=Math.min(179,Math.max(0,Math.floor(90-a)))*360+n,A=p>>3,t=7-(p&7);return(Ws()[A]&1<<t)!==0}function Ks(a,s){for(;s>180;)s-=360;for(;s<-180;)s+=360;return a<=-60?{type:"ice",color:v.white}:a>=60&&a<=84&&s>=-55&&s<=-20?{type:"ice",color:v.white}:a>=75?{type:"ice",color:v.white}:zs(a,s)?a>=27&&a<=36&&s>=75&&s<=98?{type:"mountain_snow",color:v.white}:a>=-45&&a<=5&&s>=-76&&s<=-68?{type:"mountain",color:v.darkStoneGrey}:a>=35&&a<=58&&s>=-120&&s<=-108?{type:"mountain",color:v.darkStoneGrey}:a>=44&&a<=48&&s>=6&&s<=15?{type:"mountain",color:v.darkStoneGrey}:a>=17&&a<=29&&s>=-13&&s<=34?{type:"desert",color:v.brickYellow}:a>=15&&a<=30&&s>=40&&s<=56?{type:"desert",color:v.brickYellow}:a<=-20&&a>=-30&&s>=120&&s<=136?{type:"desert",color:v.brickYellow}:a>=39&&a<=45&&s>=88&&s<=106?{type:"desert",color:v.brickYellow}:a>=-10&&a<=4&&s>=-72&&s<=-50?{type:"rainforest",color:v.darkGreen}:a>=-4&&a<=4&&s>=14&&s<=26?{type:"rainforest",color:v.darkGreen}:{type:"land",color:v.brightGreen}:Math.abs(a)<24&&(s>-90&&s<-62||s>108&&s<154)?{type:"reef",color:v.mediumBlue}:{type:"ocean",color:v.brightBlue}}var Gs="/js/three.min.js",$s="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";function Is(a){return new Promise(s=>{let n=document.querySelector(`script[src="${a}"]`);if(n){typeof THREE<"u"?s(!0):(n.addEventListener("load",()=>s(!0),{once:!0}),n.addEventListener("error",()=>s(!1),{once:!0}));return}let e=document.createElement("script");e.src=a,e.async=!0,e.onload=()=>s(!0),e.onerror=()=>s(!1),document.head.appendChild(e)})}async function _s(){typeof THREE<"u"||(await Is(Gs),!(typeof THREE<"u")&&await Is($s))}function qs(){try{let a=document.createElement("canvas");return!!(window.WebGLRenderingContext&&(a.getContext("webgl")||a.getContext("experimental-webgl")))}catch{return!1}}async function Ls(){let a=document.getElementById("heroEarthBackdrop"),s=document.getElementById("digitalEarthCanvas");if(!a||!s||!qs()||(typeof THREE>"u"&&await _s(),typeof THREE>"u"))return;let n=new THREE.Scene,e=a.clientWidth<768,p=new THREE.PerspectiveCamera(38,a.clientWidth/a.clientHeight,.1,100);p.position.set(0,0,e?18:15.5);let A;try{A=new THREE.WebGLRenderer({canvas:s,alpha:!0,antialias:!0,powerPreference:"high-performance"})}catch{return}if(!A)return;A.setSize(a.clientWidth,a.clientHeight),A.setPixelRatio(Math.min(window.devicePixelRatio,2)),A.toneMapping=THREE.ACESFilmicToneMapping,A.toneMappingExposure=1.05;let t=THREE.MathUtils.degToRad(-23.4),c=THREE.MathUtils.degToRad(8),r=new THREE.Group;r.rotation.z=t,r.rotation.x=c,n.add(r);let d=new THREE.Group,i=THREE.MathUtils.degToRad(75);d.rotation.y=i,r.add(d);let o=e?13.5:19.2,k=e?.38:.267,b=[],S=o*o,D=Math.ceil(o);for(let l=-D;l<=D;l++){let u=l*l,V=(l+1)*(l+1),J=(l-1)*(l-1);for(let E=-D;E<=D;E++){let $=E*E,W=(E+1)*(E+1),Z=(E-1)*(E-1),B=u+$;for(let L=-D;L<=D;L++){let U=L*L,F=B+U;if(F<=S&&(u+W+U>S||V+$+U>S||J+$+U>S||u+Z+U>S||B+(L+1)*(L+1)>S||B+(L-1)*(L-1)>S)){let M=Math.sqrt(F),G=l/M,_=E/M,q=L/M,H=Math.asin(_)*(180/Math.PI),Y=Math.atan2(G,q)*(180/Math.PI),X=Ks(H,Y);b.push({x:l*k,y:E*k,z:L*k,color:X.color})}}}}let y=new THREE.Vector3(-.6,.7,1.3).normalize(),T={value:y},x=new THREE.MeshStandardMaterial({roughness:.35,metalness:0,envMapIntensity:.75});x.customProgramCacheKey=()=>"digital-earth-day-night-v1",x.onBeforeCompile=l=>{l.uniforms.uSunDirection=T,l.vertexShader=`
      varying vec3 vGlobeNormal;
      ${l.vertexShader}
    `,l.vertexShader=l.vertexShader.replace("#include <defaultnormal_vertex>",`
      #include <defaultnormal_vertex>
      #ifdef USE_INSTANCING
        // Radial direction of the voxel from the planet center in world coordinates
        vec4 instanceCenter = vec4(instanceMatrix[3].xyz, 0.0);
        vGlobeNormal = normalize((modelMatrix * instanceCenter).xyz);
      #else
        vGlobeNormal = normalize((modelMatrix * vec4(position, 0.0)).xyz);
      #endif
      `),l.fragmentShader=`
      uniform vec3 uSunDirection;
      varying vec3 vGlobeNormal;
      ${l.fragmentShader}
    `,l.fragmentShader=l.fragmentShader.replace("#include <lights_fragment_end>",`
      #include <lights_fragment_end>

      // Celestial illumination angle (dot product with sun direction in world space)
      vec3 sunDir = normalize(uSunDirection);
      float globeSunDot = dot(vGlobeNormal, sunDir);

      // Day factor: 1.0 on day side, 0.0 on dark night side
      // Smooth terminator transition across the twilight band
      float dayFactor = smoothstep(-0.25, 0.25, globeSunDot);

      // Cut off direct sunlight on the dark night side
      reflectedLight.directDiffuse *= dayFactor;
      reflectedLight.directSpecular *= dayFactor;

      // Night side ambient tint: luminous sapphire/slate glow so continents remain visible
      vec3 nightAmbientTint = vec3(0.28, 0.40, 0.62);
      reflectedLight.indirectDiffuse = mix(reflectedLight.indirectDiffuse * nightAmbientTint * 2.2, reflectedLight.indirectDiffuse, dayFactor);

      // Warm golden atmospheric sunset / sunrise rim along the terminator
      float sunsetGlow = smoothstep(-0.20, 0.05, globeSunDot) * (1.0 - smoothstep(0.05, 0.30, globeSunDot));
      vec3 sunsetColor = vec3(1.0, 0.55, 0.20); // Golden-orange sunset/sunrise
      reflectedLight.directDiffuse += sunsetColor * (sunsetGlow * 0.55);
      `)};let P=new THREE.BoxGeometry(k,k,k),h=new THREE.InstancedMesh(P,x,b.length),R=new THREE.Matrix4,C=new THREE.Color,I=new THREE.Vector3;for(let l=0;l<b.length;l++){let u=b[l];I.set(u.x,u.y,u.z),R.setPosition(I),h.setMatrixAt(l,R),C.setHex(u.color),h.setColorAt(l,C)}h.instanceMatrix.needsUpdate=!0,h.instanceColor&&(h.instanceColor.needsUpdate=!0),d.add(h);let N=new THREE.DirectionalLight(16776168,2.2);N.position.copy(y).multiplyScalar(28),n.add(N);let w=new THREE.DirectionalLight(3718648,.65);w.position.set(20,-10,-12),n.add(w);let m=new THREE.AmbientLight(1976635,.85);n.add(m);let f=0,O=0,g=0,As=0;function Ds(l){f=l.clientX/window.innerWidth*2-1,O=-(l.clientY/window.innerHeight)*2+1}function Bs(l){if(l.touches.length>0){let u=l.touches[0];f=u.clientX/window.innerWidth*2-1,O=-(u.clientY/window.innerHeight)*2+1}}function Fs(){f=0,O=0}window.addEventListener("mousemove",Ds,{passive:!0}),window.addEventListener("touchmove",Bs,{passive:!0}),document.addEventListener("mouseleave",Fs,{passive:!0});function Ns(l){let u=p.aspect,V=Math.tan(THREE.MathUtils.degToRad(p.fov/2)),J=p.position.z,E;if(l<=0){let M=-l;E=-22*Math.pow(M,1.25)}else{let M=Math.min(l,1.4);E=-16*Math.pow(M,1.35)}let W=(J-E)*V,Z=W*u,B,L,U=THREE.MathUtils.degToRad(-5.5),F=Math.cos(U),z=Math.sin(U);if(l<=0){let M=l*(Math.PI*.5),G=Math.sin(M),_=Math.cos(M),q=Z*.9,H=W*.86,Y=q*G,X=H*(_-1);B=Y*F-X*z,L=Y*z+X*F}else{let M=Math.min(l,1.4)*(Math.PI*.5),G=Math.sin(M),_=Math.cos(M),q=Z*.95,H=W+9,Y=q*G,X=-H*(1-_);B=Y*F-X*z,L=Y*z+X*F}return{x:B,y:L,z:E}}let ks=new THREE.Clock,ts=!0,Us=2.4,ws=typeof window<"u"?window.scrollY:0,ms=ws>400,ls=ws,gs=750,Hs=gs*1.35,us=document.querySelector(".hero-section")||a;"IntersectionObserver"in window&&us&&new IntersectionObserver(u=>{u.forEach(V=>{ts=V.isIntersecting||typeof window<"u"&&window.scrollY<600,ts?(s.style.visibility="visible",a&&(a.style.visibility="visible")):(s.style.opacity="0",s.style.visibility="hidden",a&&(a.style.visibility="hidden"))})},{threshold:.02}).observe(us);let hs=window.matchMedia("(prefers-reduced-motion: reduce)"),j=hs.matches?.2:1;hs.addEventListener("change",l=>{j=l.matches?.2:1});function fs(){if(requestAnimationFrame(fs),!ts){s.style.visibility!=="hidden"&&(s.style.opacity="0",s.style.visibility="hidden",a&&(a.style.visibility="hidden"));return}let l=ks.getDelta(),u=ks.getElapsedTime();i+=l*.08*j,g=THREE.MathUtils.lerp(g,f,.05),As=THREE.MathUtils.lerp(As,O,.05);let V=-As*.22*j,J=g*.32*j,E=g*.08*j,$=0,W=1;if(!ms){let H=j<.5?1:Math.min(u/Us,1);W=1-Math.pow(1-H,3.2),$=-1+W*1,H>=1&&(ms=!0)}let Z=Math.min(window.scrollY,Hs);ls=THREE.MathUtils.lerp(ls,Z,.08);let B=Math.min(ls/gs,1.25),U=B*(2-Math.min(B,1))*1,F=Math.min(Math.max($+U,-1),1.35),z=Ns(F),M=-Math.sin(F*Math.PI*.5)*.16*j;r.rotation.x=c+V,r.rotation.z=t+E+M,d.rotation.y=i+J;let G=Math.max(0,1-Math.abs(F)*1.5)*W,_=Math.sin(u*.75)*.12*G*j,q=Math.sin(u*.4)*.08*G*j;if(r.position.set(z.x+q,z.y+_,z.z),B>.7){let H=(B-.7)/.3,Y=Math.max(0,1-H);s.style.opacity=Y.toFixed(3),Y<=.01?s.style.visibility="hidden":s.style.visibility="visible"}else s.style.opacity="1.0",s.style.visibility="visible";A.render(n,p)}fs(),s.classList.add("loaded");function Ys(){if(!a)return;let l=a.clientWidth,u=a.clientHeight;p.aspect=l/u;let V=l<768;p.position.z=V?18:15.5,p.updateProjectionMatrix(),A.setSize(l,u),A.setPixelRatio(Math.min(window.devicePixelRatio,2))}window.addEventListener("resize",Ys)}function Xs(){let a=document.getElementById("digitalEarthCanvas"),s=document.getElementById("heroEarthBackdrop");if(!a)return;let n=!!(typeof window<"u"&&window.location.hash&&window.location.hash!=="#"&&window.location.hash!=="#hero"),e=!1,p=()=>{e||(e=!0,s&&(s.style.display=""),a.style.display="",Ls())};if(n){s&&(s.style.display="none"),a.style.display="none";let A=()=>{window.scrollY<200&&(window.removeEventListener("scroll",A),p())};window.addEventListener("scroll",A,{passive:!0});return}p()}function Ms(){ys(),Rs(),Ss(),Cs(),Xs();let a=new as;vs(a),Ps(),xs(),Os(),bs()}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",Ms):Ms();})();
