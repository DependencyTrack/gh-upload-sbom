# Upload BOM to Dependency-Track action

This action uploads a software bill of materials file to a Dependency-Track server.

> [!WARNING]
> All inputs and outputs were renamed to kebab-case (e.g. `project-name` instead of `projectname`) in v4.2.0.
> The old names still work, but are deprecated and will be removed in the next major release.
> Using them causes a deprecation warning. See [Deprecations](#deprecations).

## Inputs

### `server-hostname`

**Required** Dependency-Track hostname

### `port`

Defaults to `443`

### `protocol`

Can be `https` or `http`

Defaults to `https`

### `api-key`

**Required, unless workload-identity-provider is provided** Dependency-Track API key

### `workload-identity-provider`

**service-account and oidc-audience are also required** Name of the workload identity provider in Dependency-Track.
Authenticates with the job's GitHub OIDC token instead of an API key (available in DT v5.2.0 and later).
See [Workload identity federation](#workload-identity-federation).

### `service-account`

**workload-identity-provider and oidc-audience are also required** Name of the service account in Dependency-Track to act as

### `oidc-audience`

**workload-identity-provider and service-account are also required** Audience of the GitHub OIDC token.
Must match the audience of the workload identity provider

### `project`

**Required, unless project-name and project-version are provided** Project uuid in Dependency-Track

### `project-name`

**Required, unless project is provided** Project name in Dependency-Track

### `project-version`

**Required, unless project is provided** Project version in Dependency-Track

### `project-tags`

Comma-separated list of tags (available in DT v4.12 and later)

### `auto-create`

Automatically create project and version in Dependency-Track, default `false`

### `bom-filename`

Path and filename of the BOM, default `bom.xml`

### `parent`

Parent project uuid in Dependency-Track (available in DT v4.8 and later)

### `parent-name`

**parent-version is also required** Parent project name in Dependency-Track (available in DT v4.8 and later)

### `parent-version`

**parent-name is also required** Parent project version in Dependency-Track (available in DT v4.8 and later)

### `is-latest`

Mark the uploaded version as latest, default `false`

## Outputs

### `token`

`token` response from Dependency-Track server after SBOM file has been uploaded

### `project-uuid`

UUID of the project the BOM was uploaded to (available in Dependency-Track v5.0.0 and later)

## Deprecations

The following names are deprecated as of v4.2.0 and **will be removed in the next major release**.
Setting a deprecated input causes the action to emit a warning.
If both names are set, the current one wins.

| Deprecated input | Use instead       |
|------------------|-------------------|
| `serverhostname` | `server-hostname` |
| `apikey`         | `api-key`         |
| `projectname`    | `project-name`    |
| `projectversion` | `project-version` |
| `projecttags`    | `project-tags`    |
| `autocreate`     | `auto-create`     |
| `bomfilename`    | `bom-filename`    |
| `parentname`     | `parent-name`     |
| `parentversion`  | `parent-version`  |
| `isLatest`       | `is-latest`       |

| Deprecated output | Use instead    |
|-------------------|----------------|
| `projectUuid`     | `project-uuid` |

Both outputs are still populated, so existing workflows keep working until the next major release.

## Workload identity federation

> [!IMPORTANT]
> Workload identity federation requires Dependency-Track v5.2.0 or later.
> Older versions reject the token exchange.

Instead of storing an API key as a secret, the action can exchange the job's GitHub OIDC token
for a short-lived Dependency-Track session.
See [Workload identity federation](https://dependencytrack.github.io/docs/next/concepts/workload-identity-federation/) for how it works,
and [Configuring workload identity federation](https://dependencytrack.github.io/docs/next/guides/administration/configuring-workload-identity-federation/#github-actions)
for how to set it up for GitHub Actions.

```yml
permissions:
  id-token: write
  contents: read
steps:
  - uses: DependencyTrack/gh-upload-sbom@v4
    with:
      server-hostname: 'example.com'
      workload-identity-provider: 'github-actions'
      service-account: 'ci'
      oidc-audience: 'https://dependency-track.example.com'
      project-name: 'Example Project'
      project-version: 'master'
      bom-filename: "/path/to/bom.xml"
      auto-create: true
```

## Example usage

With project name and version:
```yml
uses: DependencyTrack/gh-upload-sbom@v4
with:
  server-hostname: 'example.com'
  api-key: ${{ secrets.DEPENDENCYTRACK_APIKEY }}
  project-name: 'Example Project'
  project-version: 'master'
  bom-filename: "/path/to/bom.xml"
  auto-create: true
```

With project name, version and tags:
```yml
uses: DependencyTrack/gh-upload-sbom@v4
with:
  server-hostname: 'example.com'
  api-key: ${{ secrets.DEPENDENCYTRACK_APIKEY }}
  project-name: 'Example Project'
  project-version: 'master'
  project-tags: 'tag1,tag2'
  bom-filename: "/path/to/bom.xml"
  auto-create: true
```

With protocol, port and project name:
```yml
uses: DependencyTrack/gh-upload-sbom@v4
with:
  protocol: ${{ secrets.DEPENDENCYTRACK_PROTOCOL }}
  server-hostname: ${{ secrets.DEPENDENCYTRACK_HOSTNAME }}
  port: ${{ secrets.DEPENDENCYTRACK_PORT }}
  api-key: ${{ secrets.DEPENDENCYTRACK_APIKEY }}
  project-name: 'Example Project'
  project-version: 'master'
  bom-filename: "/path/to/bom.xml"
  auto-create: true
```

With project uuid:
```yml
uses: DependencyTrack/gh-upload-sbom@v4
with:
  server-hostname: 'example.com'
  api-key: ${{ secrets.DEPENDENCYTRACK_APIKEY }}
  project: 'dadec8ad-7053-4e8c-8044-7b6ef698e08d'
```

With protocol, port, project name and parent name:
```yml
uses: DependencyTrack/gh-upload-sbom@v4
with:
  protocol: ${{ secrets.DEPENDENCYTRACK_PROTOCOL }}
  server-hostname: ${{ secrets.DEPENDENCYTRACK_HOSTNAME }}
  port: ${{ secrets.DEPENDENCYTRACK_PORT }}
  api-key: ${{ secrets.DEPENDENCYTRACK_APIKEY }}
  project-name: 'Example Project'
  project-version: 'master'
  bom-filename: "/path/to/bom.xml"
  auto-create: true
  parent-name: 'Example Parent'
  parent-version: 'master'
```

With parent uuid:
```yml
uses: DependencyTrack/gh-upload-sbom@v4
with:
  server-hostname: 'example.com'
  api-key: ${{ secrets.DEPENDENCYTRACK_APIKEY }}
  project: 'dadec8ad-7053-4e8c-8044-7b6ef698e08d'
  parent: '6a5a3c33-3f8b-42ee-8d50-594bfd95dd32'
```
