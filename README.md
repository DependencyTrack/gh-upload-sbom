# Upload BOM to Dependency-Track action

This action uploads a software bill of materials file to a Dependency-Track server.

## Inputs

### `serverhostname`

**Required** Dependency-Track hostname

### `port`

Defaults to 443

### `protocol`

Can be `https` or `http`

Defaults to `https`

### `apikey`

**Required** Dependency-Track API key

### `project`

**Required, unless projectname and projectversion are provided** Project uuid in Dependency-Track

### `projectname`

**Required, unless project is provided** Project name in Dependency-Track

### `projectversion`

**Required, unless project is provided** Project version in Dependency-Track

### `autocreate`

Automatically create project and version in Dependency-Track, default `false`

### `bomfilename`

Path and filename of the BOM, default `bom.xml`

## Example usage

With project name and version:
```
uses: DependencyTrack/gh-upload-sbom@v1.0.0
with:
  serverhostname: 'example.com'
  apikey: ${{ secrets.DEPENDENCYTRACK_APIKEY }}
  projectname: 'Example Project'
  projectversion: 'master'
```

With project uuid:
```
uses: DependencyTrack/gh-upload-sbom@v1.0.0
with:
  serverhostname: 'example.com'
  apikey: ${{ secrets.DEPENDENCYTRACK_APIKEY }}
  project: 'dadec8ad-7053-4e8c-8044-7b6ef698e08d'
```
