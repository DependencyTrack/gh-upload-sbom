const fs = require('fs');
const https = require('https');
const core = require('@actions/core');

try {
  const serverHostname = core.getInput('serverhostname');
  const port = core.getInput('port');
  const apiKey = core.getInput('apikey');
  const projectName = core.getInput('projectname');
  const projectVersion = core.getInput('projectversion');
  const autoCreate = core.getInput('autocreate') != 'false';
  const bomFilename = core.getInput('bomfilename');

  console.log(`Reading BOM: ${bomFilename}...`);
  const bomContents = fs.readFileSync(bomFilename);
  let encodedBomContents = Buffer.from(bomContents).toString('base64');
  if (encodedBomContents.startsWith('77u/')) {
    encodedBomContents = encodedBomContents.substring(4);
  }

  const bomPayload = {
    projectName: projectName,
    projectVersion: projectVersion,
    autoCreate: autoCreate,
    bom: encodedBomContents
  }

  const postData = JSON.stringify(bomPayload);
  console.log(`Post data: ${postData}`);

  const requestOptions = {
    hostname: serverHostname,
    port: port,
    path: '/api/v1/bom',
    method: 'PUT',
    headers: {
      'X-API-Key': apiKey,
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  }

  console.log(`Uploading to Dependency-Track server ${serverHostname}...`);

  const req = https.request(requestOptions, (res) => {
    console.log('Response status code:', res.statusCode);
    if (res.statusCode >= 200 && res.statusCode < 300) {
      console.log('Finished uploading BOM to Dependency-Track server.')
    } else {
      core.setFailed('Failed response status code:' + res.statusCode);
    }
  });

  req.on('error', (e) => {
    console.error(`Problem with request: ${e.message}`);
    core.setFailed(e.message);
  });
  
  req.write(postData);
  req.end();

} catch (error) {
  core.setFailed(error.message);
}