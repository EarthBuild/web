import { SupportedLanguage } from './types';

export interface MigrationFile {
  name: string;
  code: string;
}

export interface MigrationToolSample {
  legacyTitle: string;
  legacyCode: string;
  legacyFiles?: MigrationFile[];
  earthfileTitle: string;
  earthfileCode: string;
}

export type MigrationTools = 'dockerfile' | 'bake' | 'makefile' | 'dagger' | 'gha';

export type MigrationData = Record<SupportedLanguage, Record<MigrationTools, MigrationToolSample>>;

export const migrationData: MigrationData = {
  python: {
    dockerfile: {
      legacyTitle: 'Standard Dockerfile',
      legacyCode: `<span class="kw-cmd">FROM</span> <span class="kw-string">python:3.14-slim</span> <span class="kw-cmd">AS</span> <span class="kw-target">deps</span>
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
<span class="kw-cmd">ENTRYPOINT</span> [<span class="kw-string">"/usr/local/bin/app"</span>]`,
      earthfileTitle: 'Earthfile (Direct Host Artifacts & Push Built-In)',
      earthfileCode: `<span class="kw-cmd">VERSION</span> <span class="kw-val">0.8</span>
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
  <span class="kw-cmd">BUILD</span> <span class="kw-target">+docker</span>`,
    },
    bake: {
      legacyTitle: 'Docker Buildx Bake',
      legacyCode: `<span class="kw-cmd">group</span> <span class="kw-string">"default"</span> {
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
  <span class="kw-prop">push</span>       = <span class="kw-val">true</span>
}`,
      legacyFiles: [
        {
          name: 'docker-bake.hcl',
          code: `<span class="kw-cmd">group</span> <span class="kw-string">"default"</span> {
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
  <span class="kw-prop">push</span>       = <span class="kw-val">true</span>
}`,
        },
        {
          name: 'Dockerfile',
          code: `<span class="kw-cmd">FROM</span> <span class="kw-string">python:3.14-slim</span> <span class="kw-cmd">AS</span> <span class="kw-target">deps</span>
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
<span class="kw-cmd">ENTRYPOINT</span> [<span class="kw-string">"/usr/local/bin/app"</span>]`,
        },
      ],
      earthfileTitle: 'Earthfile (Self-Contained & Deterministic)',
      earthfileCode: `<span class="kw-cmd">VERSION</span> <span class="kw-val">0.8</span>
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
  <span class="kw-cmd">BUILD</span> <span class="kw-target">+docker</span>`,
    },
    makefile: {
      legacyTitle: 'Makefile (Python Host Execution)',
      legacyCode: `<span class="kw-target">.PHONY</span>: <span class="kw-target">all</span> <span class="kw-target">test</span> <span class="kw-target">build</span> <span class="kw-target">docker</span>

<span class="kw-target">all</span>: <span class="kw-target">test</span> <span class="kw-target">build</span> <span class="kw-target">docker</span>

<span class="kw-target">test</span>:
	pytest tests/

<span class="kw-target">build</span>:
	pyinstaller --onefile --distpath dist -n app src/main.py

<span class="kw-target">docker</span>: <span class="kw-target">build</span>
	docker build <span class="kw-flag">-t</span> <span class="kw-string">docker.io/myorg/myapp:latest</span> .
	docker push <span class="kw-string">docker.io/myorg/myapp:latest</span>`,
      legacyFiles: [
        {
          name: 'Makefile',
          code: `<span class="kw-target">.PHONY</span>: <span class="kw-target">all</span> <span class="kw-target">test</span> <span class="kw-target">build</span> <span class="kw-target">docker</span>

<span class="kw-target">all</span>: <span class="kw-target">test</span> <span class="kw-target">build</span> <span class="kw-target">docker</span>

<span class="kw-target">test</span>:
	pytest tests/

<span class="kw-target">build</span>:
	pyinstaller --onefile --distpath dist -n app src/main.py

<span class="kw-target">docker</span>: <span class="kw-target">build</span>
	docker build <span class="kw-flag">-t</span> <span class="kw-string">docker.io/myorg/myapp:latest</span> .
	docker push <span class="kw-string">docker.io/myorg/myapp:latest</span>`,
        },
        {
          name: 'Dockerfile',
          code: `<span class="kw-cmd">FROM</span> <span class="kw-string">python:3.14-slim</span> <span class="kw-cmd">AS</span> <span class="kw-target">deps</span>
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
<span class="kw-cmd">ENTRYPOINT</span> [<span class="kw-string">"/usr/local/bin/app"</span>]`,
        },
      ],
      earthfileTitle: 'Earthfile (Hermetic & Parallel)',
      earthfileCode: `<span class="kw-cmd">VERSION</span> <span class="kw-val">0.8</span>
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
  <span class="kw-cmd">BUILD</span> <span class="kw-target">+docker</span>`,
    },
    dagger: {
      legacyTitle: 'Dagger (Python SDK)',
      legacyCode: `<span class="kw-cmd">import</span> dagger
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
        )`,
      earthfileTitle: 'Earthfile',
      earthfileCode: `<span class="kw-cmd">VERSION</span> <span class="kw-val">0.8</span>
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
  <span class="kw-cmd">BUILD</span> <span class="kw-target">+docker</span>`,
    },
    gha: {
      legacyTitle: 'Standard GitHub Actions Workflow',
      legacyCode: `<span class="kw-prop">name</span>: <span class="kw-string">CI &amp; Release</span>
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
          <span class="kw-prop">tags</span>: <span class="kw-string">docker.io/myorg/myapp:latest</span>`,
      earthfileTitle: 'Clean GitHub Action with EarthBuild',
      earthfileCode: `<span class="kw-prop">name</span>: <span class="kw-string">CI &amp; Release</span>
<span class="kw-prop">on</span>: [<span class="kw-string">push</span>]

<span class="kw-prop">jobs</span>:
  <span class="kw-prop">pipeline</span>:
    <span class="kw-prop">runs-on</span>: <span class="kw-string">ubuntu-latest</span>
    <span class="kw-prop">steps</span>:
      - <span class="kw-prop">uses</span>: <span class="kw-string">actions/checkout@v4</span>

      - <span class="kw-prop">uses</span>: <span class="kw-string">docker/login-action@v3</span>
        <span class="kw-prop">with</span>:
          <span class="kw-prop">username</span>: <span class="kw-expr">\${{ secrets.DOCKER_USER }}</span>
          <span class="kw-prop">password</span>: <span class="kw-expr">\${{ secrets.DOCKER_TOKEN }}</span>

      - <span class="kw-prop">name</span>: <span class="kw-string">Setup EarthBuild</span>
        <span class="kw-prop">uses</span>: <span class="kw-string">earthbuild/actions-setup@v2</span>

      - <span class="kw-prop">name</span>: <span class="kw-string">Test, Build Binary &amp; Push Image</span>
        <span class="kw-prop">run</span>: <span class="kw-cmd">earth</span> <span class="kw-flag">--ci</span> <span class="kw-flag">--push</span> <span class="kw-target">+all</span>`,
    },
  },
  js: {
    dockerfile: {
      legacyTitle: 'Standard Dockerfile',
      legacyCode: `<span class="kw-cmd">FROM</span> <span class="kw-string">node:26-alpine</span> <span class="kw-cmd">AS</span> <span class="kw-target">deps</span>
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
<span class="kw-cmd">ENTRYPOINT</span> [<span class="kw-string">"/usr/local/bin/app"</span>]`,
      earthfileTitle: 'Earthfile (Direct Host Artifacts & Push Built-In)',
      earthfileCode: `<span class="kw-cmd">VERSION</span> <span class="kw-val">0.8</span>
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
  <span class="kw-cmd">BUILD</span> <span class="kw-target">+docker</span>`,
    },
    bake: {
      legacyTitle: 'Docker Buildx Bake',
      legacyCode: `<span class="kw-cmd">group</span> <span class="kw-string">"default"</span> {
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
  <span class="kw-prop">push</span>       = <span class="kw-val">true</span>
}`,
      legacyFiles: [
        {
          name: 'docker-bake.hcl',
          code: `<span class="kw-cmd">group</span> <span class="kw-string">"default"</span> {
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
  <span class="kw-prop">push</span>       = <span class="kw-val">true</span>
}`,
        },
        {
          name: 'Dockerfile',
          code: `<span class="kw-cmd">FROM</span> <span class="kw-string">node:26-alpine</span> <span class="kw-cmd">AS</span> <span class="kw-target">deps</span>
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
<span class="kw-cmd">ENTRYPOINT</span> [<span class="kw-string">"/usr/local/bin/app"</span>]`,
        },
      ],
      earthfileTitle: 'Earthfile (Self-Contained & Deterministic)',
      earthfileCode: `<span class="kw-cmd">VERSION</span> <span class="kw-val">0.8</span>
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
  <span class="kw-cmd">BUILD</span> <span class="kw-target">+docker</span>`,
    },
    makefile: {
      legacyTitle: 'Makefile (JavaScript Host Execution)',
      legacyCode: `<span class="kw-target">.PHONY</span>: <span class="kw-target">all</span> <span class="kw-target">test</span> <span class="kw-target">build</span> <span class="kw-target">docker</span>

<span class="kw-target">all</span>: <span class="kw-target">test</span> <span class="kw-target">build</span> <span class="kw-target">docker</span>

<span class="kw-target">test</span>:
	npm test

<span class="kw-target">build</span>:
	npm run build

<span class="kw-target">docker</span>: <span class="kw-target">build</span>
	docker build <span class="kw-flag">-t</span> <span class="kw-string">docker.io/myorg/myapp:latest</span> .
	docker push <span class="kw-string">docker.io/myorg/myapp:latest</span>`,
      legacyFiles: [
        {
          name: 'Makefile',
          code: `<span class="kw-target">.PHONY</span>: <span class="kw-target">all</span> <span class="kw-target">test</span> <span class="kw-target">build</span> <span class="kw-target">docker</span>

<span class="kw-target">all</span>: <span class="kw-target">test</span> <span class="kw-target">build</span> <span class="kw-target">docker</span>

<span class="kw-target">test</span>:
	npm test

<span class="kw-target">build</span>:
	npm run build

<span class="kw-target">docker</span>: <span class="kw-target">build</span>
	docker build <span class="kw-flag">-t</span> <span class="kw-string">docker.io/myorg/myapp:latest</span> .
	docker push <span class="kw-string">docker.io/myorg/myapp:latest</span>`,
        },
        {
          name: 'Dockerfile',
          code: `<span class="kw-cmd">FROM</span> <span class="kw-string">node:26-alpine</span> <span class="kw-cmd">AS</span> <span class="kw-target">deps</span>
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
<span class="kw-cmd">ENTRYPOINT</span> [<span class="kw-string">"/usr/local/bin/app"</span>]`,
        },
      ],
      earthfileTitle: 'Earthfile (Hermetic & Parallel)',
      earthfileCode: `<span class="kw-cmd">VERSION</span> <span class="kw-val">0.8</span>
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
  <span class="kw-cmd">BUILD</span> <span class="kw-target">+docker</span>`,
    },
    dagger: {
      legacyTitle: 'Dagger (TypeScript SDK)',
      legacyCode: `<span class="kw-cmd">import</span> { dag, Directory, File, object, func } <span class="kw-cmd">from</span> <span class="kw-string">"@dagger.io/dagger"</span>;

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
}`,
      earthfileTitle: 'Earthfile',
      earthfileCode: `<span class="kw-cmd">VERSION</span> <span class="kw-val">0.8</span>
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
  <span class="kw-cmd">BUILD</span> <span class="kw-target">+docker</span>`,
    },
    gha: {
      legacyTitle: 'Standard GitHub Actions Workflow',
      legacyCode: `<span class="kw-prop">name</span>: <span class="kw-string">CI &amp; Release</span>
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
          <span class="kw-prop">tags</span>: <span class="kw-string">docker.io/myorg/myapp:latest</span>`,
      earthfileTitle: 'Clean GitHub Action with EarthBuild',
      earthfileCode: `<span class="kw-prop">name</span>: <span class="kw-string">CI &amp; Release</span>
<span class="kw-prop">on</span>: [<span class="kw-string">push</span>]

<span class="kw-prop">jobs</span>:
  <span class="kw-prop">pipeline</span>:
    <span class="kw-prop">runs-on</span>: <span class="kw-string">ubuntu-latest</span>
    <span class="kw-prop">steps</span>:
      - <span class="kw-prop">uses</span>: <span class="kw-string">actions/checkout@v4</span>

      - <span class="kw-prop">uses</span>: <span class="kw-string">docker/login-action@v3</span>
        <span class="kw-prop">with</span>:
          <span class="kw-prop">username</span>: <span class="kw-expr">\${{ secrets.DOCKER_USER }}</span>
          <span class="kw-prop">password</span>: <span class="kw-expr">\${{ secrets.DOCKER_TOKEN }}</span>

      - <span class="kw-prop">name</span>: <span class="kw-string">Setup EarthBuild</span>
        <span class="kw-prop">uses</span>: <span class="kw-string">earthbuild/actions-setup@v2</span>

      - <span class="kw-prop">name</span>: <span class="kw-string">Test, Build Binary &amp; Push Image</span>
        <span class="kw-prop">run</span>: <span class="kw-cmd">earth</span> <span class="kw-flag">--ci</span> <span class="kw-flag">--push</span> <span class="kw-target">+all</span>`,
    },
  },
  typescript: {
    dockerfile: {
      legacyTitle: 'Standard Dockerfile',
      legacyCode: `<span class="kw-cmd">FROM</span> <span class="kw-string">node:26-alpine</span> <span class="kw-cmd">AS</span> <span class="kw-target">deps</span>
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
<span class="kw-cmd">ENTRYPOINT</span> [<span class="kw-string">"/usr/local/bin/app"</span>]`,
      earthfileTitle: 'Earthfile (Direct Host Artifacts & Push Built-In)',
      earthfileCode: `<span class="kw-cmd">VERSION</span> <span class="kw-val">0.8</span>
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
  <span class="kw-cmd">BUILD</span> <span class="kw-target">+docker</span>`,
    },
    bake: {
      legacyTitle: 'Docker Buildx Bake',
      legacyCode: `<span class="kw-cmd">group</span> <span class="kw-string">"default"</span> {
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
  <span class="kw-prop">push</span>       = <span class="kw-val">true</span>
}`,
      legacyFiles: [
        {
          name: 'docker-bake.hcl',
          code: `<span class="kw-cmd">group</span> <span class="kw-string">"default"</span> {
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
  <span class="kw-prop">push</span>       = <span class="kw-val">true</span>
}`,
        },
        {
          name: 'Dockerfile',
          code: `<span class="kw-cmd">FROM</span> <span class="kw-string">node:26-alpine</span> <span class="kw-cmd">AS</span> <span class="kw-target">deps</span>
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
<span class="kw-cmd">ENTRYPOINT</span> [<span class="kw-string">"/usr/local/bin/app"</span>]`,
        },
      ],
      earthfileTitle: 'Earthfile (Self-Contained & Deterministic)',
      earthfileCode: `<span class="kw-cmd">VERSION</span> <span class="kw-val">0.8</span>
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
  <span class="kw-cmd">BUILD</span> <span class="kw-target">+docker</span>`,
    },
    makefile: {
      legacyTitle: 'Makefile (TypeScript Host Execution)',
      legacyCode: `<span class="kw-target">.PHONY</span>: <span class="kw-target">all</span> <span class="kw-target">test</span> <span class="kw-target">build</span> <span class="kw-target">docker</span>

<span class="kw-target">all</span>: <span class="kw-target">test</span> <span class="kw-target">build</span> <span class="kw-target">docker</span>

<span class="kw-target">test</span>:
	npm test

<span class="kw-target">build</span>:
	npx tsc --outDir dist

<span class="kw-target">docker</span>: <span class="kw-target">build</span>
	docker build <span class="kw-flag">-t</span> <span class="kw-string">docker.io/myorg/myapp:latest</span> .
	docker push <span class="kw-string">docker.io/myorg/myapp:latest</span>`,
      legacyFiles: [
        {
          name: 'Makefile',
          code: `<span class="kw-target">.PHONY</span>: <span class="kw-target">all</span> <span class="kw-target">test</span> <span class="kw-target">build</span> <span class="kw-target">docker</span>

<span class="kw-target">all</span>: <span class="kw-target">test</span> <span class="kw-target">build</span> <span class="kw-target">docker</span>

<span class="kw-target">test</span>:
	npm test

<span class="kw-target">build</span>:
	npx tsc --outDir dist

<span class="kw-target">docker</span>: <span class="kw-target">build</span>
	docker build <span class="kw-flag">-t</span> <span class="kw-string">docker.io/myorg/myapp:latest</span> .
	docker push <span class="kw-string">docker.io/myorg/myapp:latest</span>`,
        },
        {
          name: 'Dockerfile',
          code: `<span class="kw-cmd">FROM</span> <span class="kw-string">node:26-alpine</span> <span class="kw-cmd">AS</span> <span class="kw-target">deps</span>
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
<span class="kw-cmd">ENTRYPOINT</span> [<span class="kw-string">"/usr/local/bin/app"</span>]`,
        },
      ],
      earthfileTitle: 'Earthfile (Hermetic & Parallel)',
      earthfileCode: `<span class="kw-cmd">VERSION</span> <span class="kw-val">0.8</span>
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
  <span class="kw-cmd">BUILD</span> <span class="kw-target">+docker</span>`,
    },
    dagger: {
      legacyTitle: 'Dagger (TypeScript SDK)',
      legacyCode: `<span class="kw-cmd">import</span> { dag, Directory, File, object, func } <span class="kw-cmd">from</span> <span class="kw-string">"@dagger.io/dagger"</span>;

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
}`,
      earthfileTitle: 'Earthfile',
      earthfileCode: `<span class="kw-cmd">VERSION</span> <span class="kw-val">0.8</span>
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
  <span class="kw-cmd">BUILD</span> <span class="kw-target">+docker</span>`,
    },
    gha: {
      legacyTitle: 'Standard GitHub Actions Workflow',
      legacyCode: `<span class="kw-prop">name</span>: <span class="kw-string">CI &amp; Release</span>
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
          <span class="kw-prop">tags</span>: <span class="kw-string">docker.io/myorg/myapp:latest</span>`,
      earthfileTitle: 'Clean GitHub Action with EarthBuild',
      earthfileCode: `<span class="kw-prop">name</span>: <span class="kw-string">CI &amp; Release</span>
<span class="kw-prop">on</span>: [<span class="kw-string">push</span>]

<span class="kw-prop">jobs</span>:
  <span class="kw-prop">pipeline</span>:
    <span class="kw-prop">runs-on</span>: <span class="kw-string">ubuntu-latest</span>
    <span class="kw-prop">steps</span>:
      - <span class="kw-prop">uses</span>: <span class="kw-string">actions/checkout@v4</span>

      - <span class="kw-prop">uses</span>: <span class="kw-string">docker/login-action@v3</span>
        <span class="kw-prop">with</span>:
          <span class="kw-prop">username</span>: <span class="kw-expr">\${{ secrets.DOCKER_USER }}</span>
          <span class="kw-prop">password</span>: <span class="kw-expr">\${{ secrets.DOCKER_TOKEN }}</span>

      - <span class="kw-prop">name</span>: <span class="kw-string">Setup EarthBuild</span>
        <span class="kw-prop">uses</span>: <span class="kw-string">earthbuild/actions-setup@v2</span>

      - <span class="kw-prop">name</span>: <span class="kw-string">Test, Build Binary &amp; Push Image</span>
        <span class="kw-prop">run</span>: <span class="kw-cmd">earth</span> <span class="kw-flag">--ci</span> <span class="kw-flag">--push</span> <span class="kw-target">+all</span>`,
    },
  },
  java: {
    dockerfile: {
      legacyTitle: 'Standard Dockerfile',
      legacyCode: `<span class="kw-cmd">FROM</span> <span class="kw-string">maven:3.9-eclipse-temurin-25-alpine</span> <span class="kw-cmd">AS</span> <span class="kw-target">deps</span>
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
<span class="kw-cmd">ENTRYPOINT</span> [<span class="kw-string">"/usr/local/bin/app"</span>]`,
      earthfileTitle: 'Earthfile (Direct Host Artifacts & Push Built-In)',
      earthfileCode: `<span class="kw-cmd">VERSION</span> <span class="kw-val">0.8</span>
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
  <span class="kw-cmd">BUILD</span> <span class="kw-target">+docker</span>`,
    },
    bake: {
      legacyTitle: 'Docker Buildx Bake',
      legacyCode: `<span class="kw-cmd">group</span> <span class="kw-string">"default"</span> {
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
  <span class="kw-prop">push</span>       = <span class="kw-val">true</span>
}`,
      legacyFiles: [
        {
          name: 'docker-bake.hcl',
          code: `<span class="kw-cmd">group</span> <span class="kw-string">"default"</span> {
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
  <span class="kw-prop">push</span>       = <span class="kw-val">true</span>
}`,
        },
        {
          name: 'Dockerfile',
          code: `<span class="kw-cmd">FROM</span> <span class="kw-string">maven:3.9-eclipse-temurin-25-alpine</span> <span class="kw-cmd">AS</span> <span class="kw-target">deps</span>
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
<span class="kw-cmd">ENTRYPOINT</span> [<span class="kw-string">"/usr/local/bin/app"</span>]`,
        },
      ],
      earthfileTitle: 'Earthfile (Self-Contained & Deterministic)',
      earthfileCode: `<span class="kw-cmd">VERSION</span> <span class="kw-val">0.8</span>
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
  <span class="kw-cmd">BUILD</span> <span class="kw-target">+docker</span>`,
    },
    makefile: {
      legacyTitle: 'Makefile (Java Host Execution)',
      legacyCode: `<span class="kw-target">.PHONY</span>: <span class="kw-target">all</span> <span class="kw-target">test</span> <span class="kw-target">build</span> <span class="kw-target">docker</span>

<span class="kw-target">all</span>: <span class="kw-target">test</span> <span class="kw-target">build</span> <span class="kw-target">docker</span>

<span class="kw-target">test</span>:
	mvn test

<span class="kw-target">build</span>:
	mvn package -DskipTests

<span class="kw-target">docker</span>: <span class="kw-target">build</span>
	docker build <span class="kw-flag">-t</span> <span class="kw-string">docker.io/myorg/myapp:latest</span> .
	docker push <span class="kw-string">docker.io/myorg/myapp:latest</span>`,
      legacyFiles: [
        {
          name: 'Makefile',
          code: `<span class="kw-target">.PHONY</span>: <span class="kw-target">all</span> <span class="kw-target">test</span> <span class="kw-target">build</span> <span class="kw-target">docker</span>

<span class="kw-target">all</span>: <span class="kw-target">test</span> <span class="kw-target">build</span> <span class="kw-target">docker</span>

<span class="kw-target">test</span>:
	mvn test

<span class="kw-target">build</span>:
	mvn package -DskipTests

<span class="kw-target">docker</span>: <span class="kw-target">build</span>
	docker build <span class="kw-flag">-t</span> <span class="kw-string">docker.io/myorg/myapp:latest</span> .
	docker push <span class="kw-string">docker.io/myorg/myapp:latest</span>`,
        },
        {
          name: 'Dockerfile',
          code: `<span class="kw-cmd">FROM</span> <span class="kw-string">maven:3.9-eclipse-temurin-25-alpine</span> <span class="kw-cmd">AS</span> <span class="kw-target">deps</span>
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
<span class="kw-cmd">ENTRYPOINT</span> [<span class="kw-string">"/usr/local/bin/app"</span>]`,
        },
      ],
      earthfileTitle: 'Earthfile (Hermetic & Parallel)',
      earthfileCode: `<span class="kw-cmd">VERSION</span> <span class="kw-val">0.8</span>
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
  <span class="kw-cmd">BUILD</span> <span class="kw-target">+docker</span>`,
    },
    dagger: {
      legacyTitle: 'Dagger (Java SDK)',
      legacyCode: `<span class="kw-cmd">package</span> io.dagger.modules.pipeline;

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
}`,
      earthfileTitle: 'Earthfile',
      earthfileCode: `<span class="kw-cmd">VERSION</span> <span class="kw-val">0.8</span>
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
  <span class="kw-cmd">BUILD</span> <span class="kw-target">+docker</span>`,
    },
    gha: {
      legacyTitle: 'Standard GitHub Actions Workflow',
      legacyCode: `<span class="kw-prop">name</span>: <span class="kw-string">CI &amp; Release</span>
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
          <span class="kw-prop">tags</span>: <span class="kw-string">docker.io/myorg/myapp:latest</span>`,
      earthfileTitle: 'Clean GitHub Action with EarthBuild',
      earthfileCode: `<span class="kw-prop">name</span>: <span class="kw-string">CI &amp; Release</span>
<span class="kw-prop">on</span>: [<span class="kw-string">push</span>]

<span class="kw-prop">jobs</span>:
  <span class="kw-prop">pipeline</span>:
    <span class="kw-prop">runs-on</span>: <span class="kw-string">ubuntu-latest</span>
    <span class="kw-prop">steps</span>:
      - <span class="kw-prop">uses</span>: <span class="kw-string">actions/checkout@v4</span>

      - <span class="kw-prop">uses</span>: <span class="kw-string">docker/login-action@v3</span>
        <span class="kw-prop">with</span>:
          <span class="kw-prop">username</span>: <span class="kw-expr">\${{ secrets.DOCKER_USER }}</span>
          <span class="kw-prop">password</span>: <span class="kw-expr">\${{ secrets.DOCKER_TOKEN }}</span>

      - <span class="kw-prop">name</span>: <span class="kw-string">Setup EarthBuild</span>
        <span class="kw-prop">uses</span>: <span class="kw-string">earthbuild/actions-setup@v2</span>

      - <span class="kw-prop">name</span>: <span class="kw-string">Test, Build Binary &amp; Push Image</span>
        <span class="kw-prop">run</span>: <span class="kw-cmd">earth</span> <span class="kw-flag">--ci</span> <span class="kw-flag">--push</span> <span class="kw-target">+all</span>`,
    },
  },
  cpp: {
    dockerfile: {
      legacyTitle: 'Standard Dockerfile',
      legacyCode: `<span class="kw-cmd">FROM</span> <span class="kw-string">alpine:3.24</span> <span class="kw-cmd">AS</span> <span class="kw-target">deps</span>
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
<span class="kw-cmd">ENTRYPOINT</span> [<span class="kw-string">"/usr/local/bin/app"</span>]`,
      earthfileTitle: 'Earthfile (Direct Host Artifacts & Push Built-In)',
      earthfileCode: `<span class="kw-cmd">VERSION</span> <span class="kw-val">0.8</span>
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
  <span class="kw-cmd">BUILD</span> <span class="kw-target">+docker</span>`,
    },
    bake: {
      legacyTitle: 'Docker Buildx Bake',
      legacyCode: `<span class="kw-cmd">group</span> <span class="kw-string">"default"</span> {
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
  <span class="kw-prop">push</span>       = <span class="kw-val">true</span>
}`,
      legacyFiles: [
        {
          name: 'docker-bake.hcl',
          code: `<span class="kw-cmd">group</span> <span class="kw-string">"default"</span> {
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
  <span class="kw-prop">push</span>       = <span class="kw-val">true</span>
}`,
        },
        {
          name: 'Dockerfile',
          code: `<span class="kw-cmd">FROM</span> <span class="kw-string">alpine:3.24</span> <span class="kw-cmd">AS</span> <span class="kw-target">deps</span>
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
<span class="kw-cmd">ENTRYPOINT</span> [<span class="kw-string">"/usr/local/bin/app"</span>]`,
        },
      ],
      earthfileTitle: 'Earthfile (Self-Contained & Deterministic)',
      earthfileCode: `<span class="kw-cmd">VERSION</span> <span class="kw-val">0.8</span>
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
  <span class="kw-cmd">BUILD</span> <span class="kw-target">+docker</span>`,
    },
    makefile: {
      legacyTitle: 'Makefile (C++ Host Execution)',
      legacyCode: `<span class="kw-target">.PHONY</span>: <span class="kw-target">all</span> <span class="kw-target">test</span> <span class="kw-target">build</span> <span class="kw-target">docker</span>

<span class="kw-target">all</span>: <span class="kw-target">test</span> <span class="kw-target">build</span> <span class="kw-target">docker</span>

<span class="kw-target">test</span>:
	ctest --test-dir build --output-on-failure

<span class="kw-target">build</span>:
	cmake --build build --config Release

<span class="kw-target">docker</span>: <span class="kw-target">build</span>
	docker build <span class="kw-flag">-t</span> <span class="kw-string">docker.io/myorg/myapp:latest</span> .
	docker push <span class="kw-string">docker.io/myorg/myapp:latest</span>`,
      legacyFiles: [
        {
          name: 'Makefile',
          code: `<span class="kw-target">.PHONY</span>: <span class="kw-target">all</span> <span class="kw-target">test</span> <span class="kw-target">build</span> <span class="kw-target">docker</span>

<span class="kw-target">all</span>: <span class="kw-target">test</span> <span class="kw-target">build</span> <span class="kw-target">docker</span>

<span class="kw-target">test</span>:
	ctest --test-dir build --output-on-failure

<span class="kw-target">build</span>:
	cmake --build build --config Release

<span class="kw-target">docker</span>: <span class="kw-target">build</span>
	docker build <span class="kw-flag">-t</span> <span class="kw-string">docker.io/myorg/myapp:latest</span> .
	docker push <span class="kw-string">docker.io/myorg/myapp:latest</span>`,
        },
        {
          name: 'Dockerfile',
          code: `<span class="kw-cmd">FROM</span> <span class="kw-string">alpine:3.24</span> <span class="kw-cmd">AS</span> <span class="kw-target">deps</span>
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
<span class="kw-cmd">ENTRYPOINT</span> [<span class="kw-string">"/usr/local/bin/app"</span>]`,
        },
      ],
      earthfileTitle: 'Earthfile (Hermetic & Parallel)',
      earthfileCode: `<span class="kw-cmd">VERSION</span> <span class="kw-val">0.8</span>
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
  <span class="kw-cmd">BUILD</span> <span class="kw-target">+docker</span>`,
    },
    dagger: {
      legacyTitle: 'Dagger (Go SDK)',
      legacyCode: `<span class="kw-cmd">package</span> main

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
}`,
      earthfileTitle: 'Earthfile',
      earthfileCode: `<span class="kw-cmd">VERSION</span> <span class="kw-val">0.8</span>
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
  <span class="kw-cmd">BUILD</span> <span class="kw-target">+docker</span>`,
    },
    gha: {
      legacyTitle: 'Standard GitHub Actions Workflow',
      legacyCode: `<span class="kw-prop">name</span>: <span class="kw-string">CI &amp; Release</span>
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
          <span class="kw-prop">tags</span>: <span class="kw-string">docker.io/myorg/myapp:latest</span>`,
      earthfileTitle: 'Clean GitHub Action with EarthBuild',
      earthfileCode: `<span class="kw-prop">name</span>: <span class="kw-string">CI &amp; Release</span>
<span class="kw-prop">on</span>: [<span class="kw-string">push</span>]

<span class="kw-prop">jobs</span>:
  <span class="kw-prop">pipeline</span>:
    <span class="kw-prop">runs-on</span>: <span class="kw-string">ubuntu-latest</span>
    <span class="kw-prop">steps</span>:
      - <span class="kw-prop">uses</span>: <span class="kw-string">actions/checkout@v4</span>

      - <span class="kw-prop">uses</span>: <span class="kw-string">docker/login-action@v3</span>
        <span class="kw-prop">with</span>:
          <span class="kw-prop">username</span>: <span class="kw-expr">\${{ secrets.DOCKER_USER }}</span>
          <span class="kw-prop">password</span>: <span class="kw-expr">\${{ secrets.DOCKER_TOKEN }}</span>

      - <span class="kw-prop">name</span>: <span class="kw-string">Setup EarthBuild</span>
        <span class="kw-prop">uses</span>: <span class="kw-string">earthbuild/actions-setup@v2</span>

      - <span class="kw-prop">name</span>: <span class="kw-string">Test, Build Binary &amp; Push Image</span>
        <span class="kw-prop">run</span>: <span class="kw-cmd">earth</span> <span class="kw-flag">--ci</span> <span class="kw-flag">--push</span> <span class="kw-target">+all</span>`,
    },
  },
  go: {
    dockerfile: {
      legacyTitle: 'Standard Dockerfile',
      legacyCode: `<span class="kw-cmd">FROM</span> <span class="kw-string">golang:1.27-alpine3.24</span> <span class="kw-cmd">AS</span> <span class="kw-target">deps</span>
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
<span class="kw-cmd">ENTRYPOINT</span> [<span class="kw-string">"/usr/local/bin/app"</span>]`,
      earthfileTitle: 'Earthfile (Direct Host Artifacts & Push Built-In)',
      earthfileCode: `<span class="kw-cmd">VERSION</span> <span class="kw-val">0.8</span>
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
  <span class="kw-cmd">BUILD</span> <span class="kw-target">+docker</span>`,
    },
    bake: {
      legacyTitle: 'Docker Buildx Bake',
      legacyCode: `<span class="kw-cmd">group</span> <span class="kw-string">"default"</span> {
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
  <span class="kw-prop">push</span>       = <span class="kw-val">true</span>
}`,
      legacyFiles: [
        {
          name: 'docker-bake.hcl',
          code: `<span class="kw-cmd">group</span> <span class="kw-string">"default"</span> {
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
  <span class="kw-prop">push</span>       = <span class="kw-val">true</span>
}`,
        },
        {
          name: 'Dockerfile',
          code: `<span class="kw-cmd">FROM</span> <span class="kw-string">golang:1.27-alpine3.24</span> <span class="kw-cmd">AS</span> <span class="kw-target">deps</span>
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
<span class="kw-cmd">ENTRYPOINT</span> [<span class="kw-string">"/usr/local/bin/app"</span>]`,
        },
      ],
      earthfileTitle: 'Earthfile (Self-Contained & Deterministic)',
      earthfileCode: `<span class="kw-cmd">VERSION</span> <span class="kw-val">0.8</span>
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
  <span class="kw-cmd">BUILD</span> <span class="kw-target">+docker</span>`,
    },
    makefile: {
      legacyTitle: 'Makefile (Go Host Execution)',
      legacyCode: `<span class="kw-target">.PHONY</span>: <span class="kw-target">all</span> <span class="kw-target">test</span> <span class="kw-target">build</span> <span class="kw-target">docker</span>

<span class="kw-target">all</span>: <span class="kw-target">test</span> <span class="kw-target">build</span> <span class="kw-target">docker</span>

<span class="kw-target">test</span>:
	go test -v ./...

<span class="kw-target">build</span>:
	CGO_ENABLED=0 go build -o bin/app .

<span class="kw-target">docker</span>: <span class="kw-target">build</span>
	docker build <span class="kw-flag">-t</span> <span class="kw-string">docker.io/myorg/myapp:latest</span> .
	docker push <span class="kw-string">docker.io/myorg/myapp:latest</span>`,
      legacyFiles: [
        {
          name: 'Makefile',
          code: `<span class="kw-target">.PHONY</span>: <span class="kw-target">all</span> <span class="kw-target">test</span> <span class="kw-target">build</span> <span class="kw-target">docker</span>

<span class="kw-target">all</span>: <span class="kw-target">test</span> <span class="kw-target">build</span> <span class="kw-target">docker</span>

<span class="kw-target">test</span>:
	go test -v ./...

<span class="kw-target">build</span>:
	CGO_ENABLED=0 go build -o bin/app .

<span class="kw-target">docker</span>: <span class="kw-target">build</span>
	docker build <span class="kw-flag">-t</span> <span class="kw-string">docker.io/myorg/myapp:latest</span> .
	docker push <span class="kw-string">docker.io/myorg/myapp:latest</span>`,
        },
        {
          name: 'Dockerfile',
          code: `<span class="kw-cmd">FROM</span> <span class="kw-string">golang:1.27-alpine3.24</span> <span class="kw-cmd">AS</span> <span class="kw-target">deps</span>
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
<span class="kw-cmd">ENTRYPOINT</span> [<span class="kw-string">"/usr/local/bin/app"</span>]`,
        },
      ],
      earthfileTitle: 'Earthfile (Hermetic & Parallel)',
      earthfileCode: `<span class="kw-cmd">VERSION</span> <span class="kw-val">0.8</span>
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
  <span class="kw-cmd">BUILD</span> <span class="kw-target">+docker</span>`,
    },
    dagger: {
      legacyTitle: 'Dagger (Go SDK)',
      legacyCode: `<span class="kw-cmd">package</span> main

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
}`,
      earthfileTitle: 'Earthfile',
      earthfileCode: `<span class="kw-cmd">VERSION</span> <span class="kw-val">0.8</span>
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
  <span class="kw-cmd">BUILD</span> <span class="kw-target">+docker</span>`,
    },
    gha: {
      legacyTitle: 'Standard GitHub Actions Workflow',
      legacyCode: `<span class="kw-prop">name</span>: <span class="kw-string">CI &amp; Release</span>
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
          <span class="kw-prop">tags</span>: <span class="kw-string">docker.io/myorg/myapp:latest</span>`,
      earthfileTitle: 'Clean GitHub Action with EarthBuild',
      earthfileCode: `<span class="kw-prop">name</span>: <span class="kw-string">CI &amp; Release</span>
<span class="kw-prop">on</span>: [<span class="kw-string">push</span>]

<span class="kw-prop">jobs</span>:
  <span class="kw-prop">pipeline</span>:
    <span class="kw-prop">runs-on</span>: <span class="kw-string">ubuntu-latest</span>
    <span class="kw-prop">steps</span>:
      - <span class="kw-prop">uses</span>: <span class="kw-string">actions/checkout@v4</span>

      - <span class="kw-prop">uses</span>: <span class="kw-string">docker/login-action@v3</span>
        <span class="kw-prop">with</span>:
          <span class="kw-prop">username</span>: <span class="kw-expr">\${{ secrets.DOCKER_USER }}</span>
          <span class="kw-prop">password</span>: <span class="kw-expr">\${{ secrets.DOCKER_TOKEN }}</span>

      - <span class="kw-prop">name</span>: <span class="kw-string">Setup EarthBuild</span>
        <span class="kw-prop">uses</span>: <span class="kw-string">earthbuild/actions-setup@v2</span>

      - <span class="kw-prop">name</span>: <span class="kw-string">Test, Build Binary &amp; Push Image</span>
        <span class="kw-prop">run</span>: <span class="kw-cmd">earth</span> <span class="kw-flag">--ci</span> <span class="kw-flag">--push</span> <span class="kw-target">+all</span>`,
    },
  },
  rust: {
    dockerfile: {
      legacyTitle: 'Standard Dockerfile',
      legacyCode: `<span class="kw-cmd">FROM</span> <span class="kw-string">rust:1.85-alpine3.24</span> <span class="kw-cmd">AS</span> <span class="kw-target">deps</span>
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
<span class="kw-cmd">ENTRYPOINT</span> [<span class="kw-string">"/usr/local/bin/app"</span>]`,
      earthfileTitle: 'Earthfile (Direct Host Artifacts & Push Built-In)',
      earthfileCode: `<span class="kw-cmd">VERSION</span> <span class="kw-val">0.8</span>
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
  <span class="kw-cmd">BUILD</span> <span class="kw-target">+docker</span>`,
    },
    bake: {
      legacyTitle: 'Docker Buildx Bake',
      legacyCode: `<span class="kw-cmd">group</span> <span class="kw-string">"default"</span> {
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
  <span class="kw-prop">push</span>       = <span class="kw-val">true</span>
}`,
      legacyFiles: [
        {
          name: 'docker-bake.hcl',
          code: `<span class="kw-cmd">group</span> <span class="kw-string">"default"</span> {
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
  <span class="kw-prop">push</span>       = <span class="kw-val">true</span>
}`,
        },
        {
          name: 'Dockerfile',
          code: `<span class="kw-cmd">FROM</span> <span class="kw-string">rust:1.85-alpine3.24</span> <span class="kw-cmd">AS</span> <span class="kw-target">deps</span>
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
<span class="kw-cmd">ENTRYPOINT</span> [<span class="kw-string">"/usr/local/bin/app"</span>]`,
        },
      ],
      earthfileTitle: 'Earthfile (Self-Contained & Deterministic)',
      earthfileCode: `<span class="kw-cmd">VERSION</span> <span class="kw-val">0.8</span>
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
  <span class="kw-cmd">BUILD</span> <span class="kw-target">+docker</span>`,
    },
    makefile: {
      legacyTitle: 'Makefile (Rust Host Execution)',
      legacyCode: `<span class="kw-target">.PHONY</span>: <span class="kw-target">all</span> <span class="kw-target">test</span> <span class="kw-target">build</span> <span class="kw-target">docker</span>

<span class="kw-target">all</span>: <span class="kw-target">test</span> <span class="kw-target">build</span> <span class="kw-target">docker</span>

<span class="kw-target">test</span>:
	cargo test

<span class="kw-target">build</span>:
	cargo build --release

<span class="kw-target">docker</span>: <span class="kw-target">build</span>
	docker build <span class="kw-flag">-t</span> <span class="kw-string">docker.io/myorg/myapp:latest</span> .
	docker push <span class="kw-string">docker.io/myorg/myapp:latest</span>`,
      legacyFiles: [
        {
          name: 'Makefile',
          code: `<span class="kw-target">.PHONY</span>: <span class="kw-target">all</span> <span class="kw-target">test</span> <span class="kw-target">build</span> <span class="kw-target">docker</span>

<span class="kw-target">all</span>: <span class="kw-target">test</span> <span class="kw-target">build</span> <span class="kw-target">docker</span>

<span class="kw-target">test</span>:
	cargo test

<span class="kw-target">build</span>:
	cargo build --release

<span class="kw-target">docker</span>: <span class="kw-target">build</span>
	docker build <span class="kw-flag">-t</span> <span class="kw-string">docker.io/myorg/myapp:latest</span> .
	docker push <span class="kw-string">docker.io/myorg/myapp:latest</span>`,
        },
        {
          name: 'Dockerfile',
          code: `<span class="kw-cmd">FROM</span> <span class="kw-string">rust:1.85-alpine3.24</span> <span class="kw-cmd">AS</span> <span class="kw-target">deps</span>
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
<span class="kw-cmd">ENTRYPOINT</span> [<span class="kw-string">"/usr/local/bin/app"</span>]`,
        },
      ],
      earthfileTitle: 'Earthfile (Hermetic & Parallel)',
      earthfileCode: `<span class="kw-cmd">VERSION</span> <span class="kw-val">0.8</span>
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
  <span class="kw-cmd">BUILD</span> <span class="kw-target">+docker</span>`,
    },
    dagger: {
      legacyTitle: 'Dagger (Go SDK)',
      legacyCode: `<span class="kw-cmd">package</span> main

<span class="kw-cmd">import</span> (
  <span class="kw-string">"context"</span>
  <span class="kw-string">"dagger/pipeline/internal/dagger"</span>
)

<span class="kw-cmd">type</span> <span class="kw-type">Pipeline</span> <span class="kw-cmd">struct</span>{}

<span class="kw-cmd">func</span> (<span class="kw-var">m</span> *<span class="kw-type">Pipeline</span>) <span class="kw-fn">base</span>(<span class="kw-var">src</span> *<span class="kw-type">dagger.Directory</span>) *<span class="kw-type">dagger.Container</span> {
  <span class="kw-cmd">return</span> <span class="kw-var">dag</span>.<span class="kw-fn">Container</span>().
    <span class="kw-fn">From</span>(<span class="kw-string">"rust:1.85-alpine3.24"</span>).
    <span class="kw-fn">WithWorkdir</span>(<span class="kw-string">"/app"</span>).
    <span class="kw-fn">WithDirectory</span>(<span class="kw-string">"."</span>, <span class="kw-var">src</span>).
    <span class="kw-fn">WithExec</span>([]<span class="kw-type">string</span>{<span class="kw-string">"cargo"</span>, <span class="kw-string">"fetch"</span>})
}

<span class="kw-cmd">func</span> (<span class="kw-var">m</span> *<span class="kw-type">Pipeline</span>) <span class="kw-fn">Test</span>(<span class="kw-var">ctx</span> <span class="kw-type">context.Context</span>, <span class="kw-var">src</span> *<span class="kw-type">dagger.Directory</span>) (<span class="kw-type">string</span>, <span class="kw-type">error</span>) {
  <span class="kw-cmd">return</span> <span class="kw-var">m</span>.<span class="kw-fn">base</span>(<span class="kw-var">src</span>).
    <span class="kw-fn">WithExec</span>([]<span class="kw-type">string</span>{<span class="kw-string">"cargo"</span>, <span class="kw-string">"test"</span>}).
    <span class="kw-fn">Stdout</span>(<span class="kw-var">ctx</span>)
}

<span class="kw-cmd">func</span> (<span class="kw-var">m</span> *<span class="kw-type">Pipeline</span>) <span class="kw-fn">Build</span>(<span class="kw-var">ctx</span> <span class="kw-type">context.Context</span>, <span class="kw-var">src</span> *<span class="kw-type">dagger.Directory</span>) (*<span class="kw-type">dagger.File</span>, <span class="kw-type">error</span>) {
  <span class="kw-var">bin</span> := <span class="kw-var">m</span>.<span class="kw-fn">base</span>(<span class="kw-var">src</span>).
    <span class="kw-fn">WithExec</span>([]<span class="kw-type">string</span>{<span class="kw-string">"cargo"</span>, <span class="kw-string">"build"</span>, <span class="kw-string">"--release"</span>}).
    <span class="kw-fn">File</span>(<span class="kw-string">"target/release/app"</span>)

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
    <span class="kw-fn">WithEntrypoint</span>([]<span class="kw-type">string</span>{<span class="kw-string">"/usr/local/bin/app"</span>}).
    <span class="kw-fn">Publish</span>(<span class="kw-var">ctx</span>, <span class="kw-string">"docker.io/myorg/myapp:latest"</span>)
}`,
      earthfileTitle: 'Earthfile',
      earthfileCode: `<span class="kw-cmd">VERSION</span> <span class="kw-val">0.8</span>
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
  <span class="kw-cmd">BUILD</span> <span class="kw-target">+docker</span>`,
    },
    gha: {
      legacyTitle: 'Standard GitHub Actions Workflow',
      legacyCode: `<span class="kw-prop">name</span>: <span class="kw-string">CI &amp; Release</span>
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
          <span class="kw-prop">tags</span>: <span class="kw-string">docker.io/myorg/myapp:latest</span>`,
      earthfileTitle: 'Clean GitHub Action with EarthBuild',
      earthfileCode: `<span class="kw-prop">name</span>: <span class="kw-string">CI &amp; Release</span>
<span class="kw-prop">on</span>: [<span class="kw-string">push</span>]

<span class="kw-prop">jobs</span>:
  <span class="kw-prop">pipeline</span>:
    <span class="kw-prop">runs-on</span>: <span class="kw-string">ubuntu-latest</span>
    <span class="kw-prop">steps</span>:
      - <span class="kw-prop">uses</span>: <span class="kw-string">actions/checkout@v4</span>

      - <span class="kw-prop">uses</span>: <span class="kw-string">docker/login-action@v3</span>
        <span class="kw-prop">with</span>:
          <span class="kw-prop">username</span>: <span class="kw-expr">\${{ secrets.DOCKER_USER }}</span>
          <span class="kw-prop">password</span>: <span class="kw-expr">\${{ secrets.DOCKER_TOKEN }}</span>

      - <span class="kw-prop">name</span>: <span class="kw-string">Setup EarthBuild</span>
        <span class="kw-prop">uses</span>: <span class="kw-string">earthbuild/actions-setup@v2</span>

      - <span class="kw-prop">name</span>: <span class="kw-string">Test, Build Binary &amp; Push Image</span>
        <span class="kw-prop">run</span>: <span class="kw-cmd">earth</span> <span class="kw-flag">--ci</span> <span class="kw-flag">--push</span> <span class="kw-target">+all</span>`,
    },
  },
  zig: {
    dockerfile: {
      legacyTitle: 'Standard Dockerfile',
      legacyCode: `<span class="kw-cmd">FROM</span> <span class="kw-string">alpine:3.24</span> <span class="kw-cmd">AS</span> <span class="kw-target">deps</span>
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
<span class="kw-cmd">ENTRYPOINT</span> [<span class="kw-string">"/usr/local/bin/app"</span>]`,
      earthfileTitle: 'Earthfile (Direct Host Artifacts & Push Built-In)',
      earthfileCode: `<span class="kw-cmd">VERSION</span> <span class="kw-val">0.8</span>
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
  <span class="kw-cmd">BUILD</span> <span class="kw-target">+docker</span>`,
    },
    bake: {
      legacyTitle: 'Docker Buildx Bake',
      legacyCode: `<span class="kw-cmd">group</span> <span class="kw-string">"default"</span> {
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
  <span class="kw-prop">push</span>       = <span class="kw-val">true</span>
}`,
      legacyFiles: [
        {
          name: 'docker-bake.hcl',
          code: `<span class="kw-cmd">group</span> <span class="kw-string">"default"</span> {
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
  <span class="kw-prop">push</span>       = <span class="kw-val">true</span>
}`,
        },
        {
          name: 'Dockerfile',
          code: `<span class="kw-cmd">FROM</span> <span class="kw-string">alpine:3.24</span> <span class="kw-cmd">AS</span> <span class="kw-target">deps</span>
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
<span class="kw-cmd">ENTRYPOINT</span> [<span class="kw-string">"/usr/local/bin/app"</span>]`,
        },
      ],
      earthfileTitle: 'Earthfile (Self-Contained & Deterministic)',
      earthfileCode: `<span class="kw-cmd">VERSION</span> <span class="kw-val">0.8</span>
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
  <span class="kw-cmd">BUILD</span> <span class="kw-target">+docker</span>`,
    },
    makefile: {
      legacyTitle: 'Makefile (Zig Host Execution)',
      legacyCode: `<span class="kw-target">.PHONY</span>: <span class="kw-target">all</span> <span class="kw-target">test</span> <span class="kw-target">build</span> <span class="kw-target">docker</span>

<span class="kw-target">all</span>: <span class="kw-target">test</span> <span class="kw-target">build</span> <span class="kw-target">docker</span>

<span class="kw-target">test</span>:
	zig build test

<span class="kw-target">build</span>:
	zig build -Doptimize=ReleaseSafe

<span class="kw-target">docker</span>: <span class="kw-target">build</span>
	docker build <span class="kw-flag">-t</span> <span class="kw-string">docker.io/myorg/myapp:latest</span> .
	docker push <span class="kw-string">docker.io/myorg/myapp:latest</span>`,
      legacyFiles: [
        {
          name: 'Makefile',
          code: `<span class="kw-target">.PHONY</span>: <span class="kw-target">all</span> <span class="kw-target">test</span> <span class="kw-target">build</span> <span class="kw-target">docker</span>

<span class="kw-target">all</span>: <span class="kw-target">test</span> <span class="kw-target">build</span> <span class="kw-target">docker</span>

<span class="kw-target">test</span>:
	zig build test

<span class="kw-target">build</span>:
	zig build -Doptimize=ReleaseSafe

<span class="kw-target">docker</span>: <span class="kw-target">build</span>
	docker build <span class="kw-flag">-t</span> <span class="kw-string">docker.io/myorg/myapp:latest</span> .
	docker push <span class="kw-string">docker.io/myorg/myapp:latest</span>`,
        },
        {
          name: 'Dockerfile',
          code: `<span class="kw-cmd">FROM</span> <span class="kw-string">alpine:3.24</span> <span class="kw-cmd">AS</span> <span class="kw-target">deps</span>
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
<span class="kw-cmd">ENTRYPOINT</span> [<span class="kw-string">"/usr/local/bin/app"</span>]`,
        },
      ],
      earthfileTitle: 'Earthfile (Hermetic & Parallel)',
      earthfileCode: `<span class="kw-cmd">VERSION</span> <span class="kw-val">0.8</span>
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
  <span class="kw-cmd">BUILD</span> <span class="kw-target">+docker</span>`,
    },
    dagger: {
      legacyTitle: 'Dagger (Go SDK Module — No Native Zig SDK)',
      legacyCode: `<span class="kw-cmd">package</span> main

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
}`,
      earthfileTitle: 'Earthfile',
      earthfileCode: `<span class="kw-cmd">VERSION</span> <span class="kw-val">0.8</span>
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
  <span class="kw-cmd">BUILD</span> <span class="kw-target">+docker</span>`,
    },
    gha: {
      legacyTitle: 'Standard GitHub Actions Workflow',
      legacyCode: `<span class="kw-prop">name</span>: <span class="kw-string">CI &amp; Release</span>
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
          <span class="kw-prop">tags</span>: <span class="kw-string">docker.io/myorg/myapp:latest</span>`,
      earthfileTitle: 'Clean GitHub Action with EarthBuild',
      earthfileCode: `<span class="kw-prop">name</span>: <span class="kw-string">CI &amp; Release</span>
<span class="kw-prop">on</span>: [<span class="kw-string">push</span>]

<span class="kw-prop">jobs</span>:
  <span class="kw-prop">pipeline</span>:
    <span class="kw-prop">runs-on</span>: <span class="kw-string">ubuntu-latest</span>
    <span class="kw-prop">steps</span>:
      - <span class="kw-prop">uses</span>: <span class="kw-string">actions/checkout@v4</span>

      - <span class="kw-prop">uses</span>: <span class="kw-string">docker/login-action@v3</span>
        <span class="kw-prop">with</span>:
          <span class="kw-prop">username</span>: <span class="kw-expr">\${{ secrets.DOCKER_USER }}</span>
          <span class="kw-prop">password</span>: <span class="kw-expr">\${{ secrets.DOCKER_TOKEN }}</span>

      - <span class="kw-prop">name</span>: <span class="kw-string">Setup EarthBuild</span>
        <span class="kw-prop">uses</span>: <span class="kw-string">earthbuild/actions-setup@v2</span>

      - <span class="kw-prop">name</span>: <span class="kw-string">Test, Build Binary &amp; Push Image</span>
        <span class="kw-prop">run</span>: <span class="kw-cmd">earth</span> <span class="kw-flag">--ci</span> <span class="kw-flag">--push</span> <span class="kw-target">+all</span>`,
    },
  },
};
