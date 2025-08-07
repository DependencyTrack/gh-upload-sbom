# Upload BOM to Dependency-Track action

This action uploads a software bill of materials file to a Dependency-Track server.

## Inputs

### `serverhostname`

**Required** Dependency-Track hostname

### `port`

Defaults to `443`

### `protocol`

Can be `https` or `http`

Defaults to `https`

### `apikey`

**Required** Dependency-Track API key

### `project`

**Required, unless projectName and projectVersion are provided** Project uuid in Dependency-Track

### `projectname`

**Required, unless project is provided** Project name in Dependency-Track

### `projectversion`

**Required, unless project is provided** Project version in Dependency-Track

### `projecttags`

Comma-separated list of tags (available in DT v4.12 and later)

### `autocreate`

Automatically create project and version in Dependency-Track, default `false`

### `bomfilename`

Path and filename of the BOM, default `bom.xml`

### `parent`

Parent project uuid in Dependency-Track (available in DT v4.8 and later)

### `parentname`

**parentVersion is also required** Parent project name in Dependency-Track (available in DT v4.8 and later)

### `parentversion`

**parentName is also required** Parent project version in Dependency-Track (available in DT v4.8 and later)

## Example usage

With project name and version:
```yml
uses: DependencyTrack/gh-upload-sbom@v3
with:
  serverhostname: 'example.com'
  apikey: ${{ secrets.DEPENDENCYTRACK_APIKEY }}
  projectname: 'Example Project'
  projectversion: 'master'
  bomfilename: "/path/to/bom.xml"
  autocreate: true
```

With project name, version and tags:
```yml
uses: DependencyTrack/gh-upload-sbom@v3
with:
  serverhostname: 'example.com'
  apikey: ${{ secrets.DEPENDENCYTRACK_APIKEY }}
  projectname: 'Example Project'
  projectversion: 'master'
  projecttags: 'tag1,tag2'
  bomfilename: "/path/to/bom.xml"
  autocreate: true
```

With protocol, port and project name:
```yml
uses: DependencyTrack/gh-upload-sbom@v3
with:
  protocol: ${{ secrets.DEPENDENCYTRACK_PROTOCOL }}
  serverhostname: ${{ secrets.DEPENDENCYTRACK_HOSTNAME }}
  port: ${{ secrets.DEPENDENCYTRACK_PORT }}
  apikey: ${{ secrets.DEPENDENCYTRACK_APIKEY }}
  projectname: 'Example Project'
  projectversion: 'master'
  bomfilename: "/path/to/bom.xml"
  autocreate: true
```

With project uuid:
```yml
uses: DependencyTrack/gh-upload-sbom@v3
with:
  serverhostname: 'example.com'
  apikey: ${{ secrets.DEPENDENCYTRACK_APIKEY }}
  project: 'dadec8ad-7053-4e8c-8044-7b6ef698e08d'
```

With protocol, port, project name and parent name:
```yml
uses: DependencyTrack/gh-upload-sbom@v3
with:
  protocol: ${{ secrets.DEPENDENCYTRACK_PROTOCOL }}
  serverhostname: ${{ secrets.DEPENDENCYTRACK_HOSTNAME }}
  port: ${{ secrets.DEPENDENCYTRACK_PORT }}
  apikey: ${{ secrets.DEPENDENCYTRACK_APIKEY }}
  projectname: 'Example Project'
  projectversion: 'master'
  bomfilename: "/path/to/bom.xml"
  autocreate: true
  parentname: 'Example Parent'
  parentversion: 'master'
```

With parent uuid:
```yml
uses: DependencyTrack/gh-upload-sbom@v3
with:
  serverhostname: 'example.com'
  apikey: ${{ secrets.DEPENDENCYTRACK_APIKEY }}
  project: 'dadec8ad-7053-4e8c-8044-7b6ef698e08d'
  parent: '6a5a3c33-3f8b-42ee-8d50-594bfd95dd32'
```

