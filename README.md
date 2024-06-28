# Upload BOM to Dependency-Track action

This action uploads a software bill of materials file to a Dependency-Track server.

## Inputs

### `serverHostname`

**Required** Dependency-Track hostname

### `port`

Defaults to 443

### `protocol`

Can be `https` or `http`

Defaults to `https`

### `apiKey`

**Required** Dependency-Track API key

### `project`

**Required, unless projectname and projectversion are provided** Project uuid in Dependency-Track

### `projectName`

**Required, unless project is provided** Project name in Dependency-Track

### `projectVersion`

**Required, unless project is provided** Project version in Dependency-Track

### `autoCreate`

Automatically create project and version in Dependency-Track, default `false`

### `bomFilename`

Path and filename of the BOM, default `bom.xml`

### `parent`

Parent project uuid in Dependency-Track

### `parentName`

**Parent version is also required** Parent project name in Dependency-Track

### `parentVersion`

**Parent name is also required** Parent project version in Dependency-Track

## Outputs

### `token`

`token` reponse from Dependency-Track server after SBOM file has been uploaded

## Example usage

With project name and version:
```
uses: DependencyTrack/gh-upload-sbom@v2.0.0
with:
  serverHostname: 'example.com'
  apiKey: ${{ secrets.DEPENDENCYTRACK_APIKEY }}
  projectName: 'Example Project'
  projectVersion: 'master'
  bomFilename: "/path/to/bom.xml"
  autoCreate: true
```

With protocol, port and project name:
```
  - name: SBOM zu DependencyTrack senden
    uses: DependencyTrack/gh-upload-sbom@v2.0.0
    with:
      protocol: ${{ secrets.DEPENDENCYTRACK_PROTOCOL }}
      serverHostname: ${{ secrets.DEPENDENCYTRACK_HOSTNAME }}
      port: ${{ secrets.DEPENDENCYTRACK_PORT }}
      apiKey: ${{ secrets.DEPENDENCYTRACK_APIKEY }}
      projectName: 'Example Project'
      projectVersion: 'master'
      bomFilename: "/path/to/bom.xml"
      autoCreate: true
```

With project uuid:
```
uses: DependencyTrack/gh-upload-sbom@v2.0.0
with:
  serverHostname: 'example.com'
  apiKey: ${{ secrets.DEPENDENCYTRACK_APIKEY }}
  project: 'dadec8ad-7053-4e8c-8044-7b6ef698e08d'
```

With protocol, port, project name and parent name:
```
  - name: SBOM zu DependencyTrack senden
    uses: DependencyTrack/gh-upload-sbom@v2.0.0
    with:
      protocol: ${{ secrets.DEPENDENCYTRACK_PROTOCOL }}
      serverHostname: ${{ secrets.DEPENDENCYTRACK_HOSTNAME }}
      port: ${{ secrets.DEPENDENCYTRACK_PORT }}
      apiKey: ${{ secrets.DEPENDENCYTRACK_APIKEY }}
      projectName: 'Example Project'
      projectVersion: 'master'
      bomFilename: "/path/to/bom.xml"
      autoCreate: true
      parentName: 'Example Parent'
      parentVersion: 'master'
```

With parent uuid:
```
uses: DependencyTrack/gh-upload-sbom@v2.0.0
with:
  serverHostname: 'example.com'
  apiKey: ${{ secrets.DEPENDENCYTRACK_APIKEY }}
  project: 'dadec8ad-7053-4e8c-8044-7b6ef698e08d'
  parent: '6a5a3c33-3f8b-42ee-8d50-594bfd95dd32'
```

