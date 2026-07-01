import * as fs from 'node:fs';
import * as core from '@actions/core';

async function run() {
  try {
    const serverHostname = core.getInput('serverhostname');
    const port = core.getInput('port');
    const protocol = core.getInput('protocol');
    const apiKey = core.getInput('apikey');
    core.setSecret(apiKey);
    const project = core.getInput('project');
    const projectName = core.getInput('projectname');
    const projectVersion = core.getInput('projectversion');
    const projectTags = core.getInput('projecttags');
    const autoCreate = core.getInput('autocreate') !== 'false';
    const bomFilename = core.getInput('bomfilename');
    const parent = core.getInput('parent');
    const parentName = core.getInput('parentname');
    const parentVersion = core.getInput('parentversion');
    const isLatest = core.getInput('isLatest') !== 'false';

    if (protocol !== "http" && protocol !== "https") {
      throw 'protocol "' + protocol + '" not supported, must be one of: https, http'
    }

    if (project === "" && (projectName === "" || projectVersion === "")) {
      throw 'project or projectName + projectVersion must be set'
    }

    if (!autoCreate && project === "") {
      throw 'project can\'t be empty if autoCreate is false'
    }

    if (project === "" && (projectName === "" || projectVersion === "")) {
      throw 'project or projectName + projectVersion must be set'
    }

    if ((parentName === "" && parentVersion !== "") || (parentName !== "" && parentVersion === "")) {
      throw 'parentName + parentVersion must both be set'
    }

    core.info(`Reading BOM: ${bomFilename}...`);
    let bomContents = fs.readFileSync(bomFilename);

    // Remove UTF-8 byte order mark.
    // NB: Unclear if this is really necessary, but it's existing behavior so ¯\_(ツ)_/¯
    if (bomContents[0] === 0xef && bomContents[1] === 0xbb && bomContents[2] === 0xbf) {
      bomContents = bomContents.subarray(3);
    }

    const form = new FormData();
    form.append('bom', new Blob([bomContents]), 'bom');
    if (autoCreate) {
      form.append('projectName', projectName);
      form.append('projectVersion', projectVersion);
      form.append('autoCreate', 'true');
      if (projectTags) {
        form.append('projectTags', projectTags.split(',').map(tag => tag.trim()).join(','));
      }
    } else {
      form.append('project', project);
    }

    if (isLatest) {
      form.append('isLatest', 'true');
    }

    if (parent && parent.trim().length > 0) {
      form.append('parentUUID', parent);
    } else if (parentName && parentName.trim().length > 0 && parentVersion && parentVersion.trim().length > 0) {
      form.append('parentName', parentName);
      form.append('parentVersion', parentVersion);
    }

    const requestOptions = {
      method: 'POST',
      headers: {
        'X-API-Key': apiKey,
      },
      body: form
    };

    const url = new URL(`${protocol}://${serverHostname}`);
    if (port) {
      url.port = port;
    }
    url.pathname = '/api/v1/bom';

    core.info(`Uploading to Dependency-Track server ${serverHostname}...`);

    const response = await fetch(url.toString(), requestOptions);

    if (response.ok) {
      const responseJson = await response.json();
      core.setOutput('token', responseJson.token);
      if (responseJson.projectUuid) {
        core.setOutput('projectUuid', responseJson.projectUuid);
      }
      core.info('Finished uploading BOM to Dependency-Track server.');
    } else {
      const responseBody = await response.text();
      if (responseBody) {
        core.debug(responseBody);
      }
      core.setFailed('Failed response status code:' + response.status);
    }

  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
