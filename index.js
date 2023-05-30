const fs = require('fs');
const http = require('http');
const https = require('https');
const core = require('@actions/core');
const { execSync } = require('child_process');

core.info('Dependency-Track BOM Upload Action');

try {
  execSync('npm ci');
} catch (error) {
  console.error('Error installing dependencies:', error.message);
  process.exit(1);
}

try {
  const serverHostname = core.getInput('serverHostname');
  const port = core.getInput('port');
  const protocol = core.getInput('protocol');
  const apiKey = core.getInput('apiKey');
  const project = core.getInput('project');
  const projectName = core.getInput('projectName');
  const projectVersion = core.getInput('projectVersion');
  const autoCreate = core.getInput('autoCreate') !== 'false';
  const bomFilename = core.getInput('bomFilename');

  if (protocol !== "http" && protocol !== "https") {
    throw new Error('protocol "' + protocol + '" not supported, must be one of: https, http')
  }
  const client = (protocol === "http") ? http : https

  if (autoCreate && (projectName === "" || projectVersion === "")) {
    throw new Error('If autoCreate is set projectName and projectVersion are required')
  }

  if (!autoCreate && project === "") {
    throw new Error('project can\'t be empty if autoCreate is false')
  }

  if (project === "" && (projectName === "" || projectVersion === "")) {
    throw new Error('project or projectName + projectVersion must be set')
  }

  core.info(`Reading BOM: ${bomFilename}...`);
  const bomContents = fs.readFileSync(bomFilename);
  let encodedBomContents = Buffer.from(bomContents).toString('base64');
  if (encodedBomContents.startsWith('77u/')) {
    encodedBomContents = encodedBomContents.substring(4);
  }

  let bomPayload;
  if (autoCreate) {
    bomPayload = {
      projectName: projectName,
      projectVersion: projectVersion,
      autoCreate: autoCreate,
      bom: encodedBomContents
    }
  } else {
    bomPayload = {
      project: project,
      bom: encodedBomContents
    }
  }

  const postData = JSON.stringify(bomPayload);

  const requestOptions = {
    hostname: serverHostname,
    port: port,
    protocol: protocol + ':',
    path: '/api/v1/bom',
    method: 'PUT',
    headers: {
      'X-API-Key': apiKey,
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  }

  core.info(`Uploading to Dependency-Track server ${serverHostname}...`);

  const req = client.request(requestOptions, (res) => {
    core.info('Response status code:' + res.statusCode);
    if (res.statusCode >= 200 && res.statusCode < 300) {
      core.info('Finished uploading BOM to Dependency-Track server.')
    } else {
      core.setFailed('Failed with response status code:' + res.statusCode
          + ' and status message: ' + res.statusMessage);
    }
  });

  req.on('error', (e) => {
    core.error(`Problem with request: ${e.message}`);
    core.setFailed(e.message);
  });

  req.write(postData);
  req.end();

} catch (error) {
  core.setFailed(error.message);
}
