# Upload BOM to Dependency-Track action

This action uploads a software bill of materials file to a Dependency-Track server.

## Inputs

### `serverHostname`

**Required** Dependency-Track hostname

### `port`

Defaults to `443`

### `protocol`

Can be `https` or `http`

Defaults to `https`

### `apiKey`

**Required** Dependency-Track API key

### `project`

**Required, unless projectName and projectVersion are provided** Project uuid in Dependency-Track

### `projectName`

**Required, unless project is provided** Project name in Dependency-Track

### `projectVersion`

**Required, unless project is provided** Project version in Dependency-Track

### `projectTags`

Comma-separated list of tags (available in DT v4.12 and later)

### `autoCreate`

Automatically create project and version in Dependency-Track, default `false`

### `bomFilename`

Path and filename of the BOM, default `bom.xml`

### `parent`

Parent project uuid in Dependency-Track (available in DT v4.8 and later)

### `parentName`

**parentVersion is also required** Parent project name in Dependency-Track (available in DT v4.8 and later)

### `parentVersion`

**parentName is also required** Parent project version in Dependency-Track (available in DT v4.8 and later)

## Example usage

With project name and version:
```yml
uses: DependencyTrack/gh-upload-sbom@v3
with:
  serverHostname: 'example.com'
  apiKey: ${{ secrets.DEPENDENCYTRACK_APIKEY }}
  projectName: 'Example Project'
  projectVersion: 'master'
  bomFilename: "/path/to/bom.xml"
  autoCreate: true
```

With project name, version and tags:
```yml
uses: DependencyTrack/gh-upload-sbom@v3
with:
  serverHostname: 'example.com'
  apiKey: ${{ secrets.DEPENDENCYTRACK_APIKEY }}
  projectName: 'Example Project'
  projectVersion: 'master'
  projectTags: 'tag1,tag2'
  bomFilename: "/path/to/bom.xml"
  autoCreate: true
```

With protocol, port and project name:
```yml
uses: DependencyTrack/gh-upload-sbom@v3
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
```yml
uses: DependencyTrack/gh-upload-sbom@v3
with:
  serverHostname: 'example.com'
  apiKey: ${{ secrets.DEPENDENCYTRACK_APIKEY }}
  project: 'dadec8ad-7053-4e8c-8044-7b6ef698e08d'
```

With protocol, port, project name and parent name:
```yml
uses: DependencyTrack/gh-upload-sbom@v3
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
```yml
uses: DependencyTrack/gh-upload-sbom@v3
with:
  serverHostname: 'example.com'
  apiKey: ${{ secrets.DEPENDENCYTRACK_APIKEY }}
  project: 'dadec8ad-7053-4e8c-8044-7b6ef698e08d'
  parent: '6a5a3c33-3f8b-42ee-8d50-594bfd95dd32'
```

