import * as fs from 'node:fs';
import * as core from '@actions/core';

function getInput(name, deprecatedName, defaultValue = '') {
  return core.getInput(name) || core.getInput(deprecatedName) || defaultValue;
}

async function exchangeIdToken(baseUrl, provider, serviceAccount, audience) {
  core.info(`Requesting GitHub OIDC token for audience ${audience}...`);
  const idToken = await core.getIDToken(audience);

  core.info(`Exchanging GitHub OIDC token for a session of service account ${serviceAccount}...`);
  const response = await fetch(new URL('/api/v2/oauth/token', baseUrl), {
    method: 'POST',
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:token-exchange',
      subject_token: idToken,
      subject_token_type: 'urn:ietf:params:oauth:token-type:jwt',
      workload_identity_provider: provider,
      service_account: serviceAccount,
    }),
  });
  if (!response.ok) {
    const responseBody = await response.text();
    if (responseBody) {
      core.debug(responseBody);
    }
    throw new Error(`Token exchange failed with response status code: ${response.status}`);
  }

  const accessToken = (await response.json()).access_token;
  core.setSecret(accessToken);
  return accessToken;
}

async function run() {
  try {
    const serverHostname = getInput('server-hostname', 'serverhostname');
    const port = core.getInput('port');
    const protocol = core.getInput('protocol');
    const apiKey = getInput('api-key', 'apikey');
    core.setSecret(apiKey);
    const workloadIdentityProvider = core.getInput('workload-identity-provider');
    const serviceAccount = core.getInput('service-account');
    const oidcAudience = core.getInput('oidc-audience');
    const project = core.getInput('project');
    const projectName = getInput('project-name', 'projectname');
    const projectVersion = getInput('project-version', 'projectversion');
    const projectTags = getInput('project-tags', 'projecttags');
    const autoCreate = getInput('auto-create', 'autocreate', 'false') !== 'false';
    const bomFilename = getInput('bom-filename', 'bomfilename', 'bom.xml');
    const parent = core.getInput('parent');
    const parentName = getInput('parent-name', 'parentname');
    const parentVersion = getInput('parent-version', 'parentversion');
    const isLatest = getInput('is-latest', 'isLatest', 'false') !== 'false';

    if (protocol !== "http" && protocol !== "https") {
      throw new Error(`protocol "${protocol}" not supported, must be one of: https, http`);
    }

    const useWorkloadIdentity = workloadIdentityProvider !== "";
    if (useWorkloadIdentity === (apiKey !== "")) {
      throw new Error('either api-key or workload-identity-provider must be set');
    }

    if (useWorkloadIdentity && (serviceAccount === "" || oidcAudience === "")) {
      throw new Error('service-account + oidc-audience must be set when using workload-identity-provider');
    }

    if (!useWorkloadIdentity && (serviceAccount !== "" || oidcAudience !== "")) {
      throw new Error('service-account + oidc-audience require workload-identity-provider');
    }

    if (project === "" && (projectName === "" || projectVersion === "")) {
      throw new Error('project or project-name + project-version must be set');
    }

    if (!autoCreate && project === "") {
      throw new Error("project can't be empty if auto-create is false");
    }

    if ((parentName === "" && parentVersion !== "") || (parentName !== "" && parentVersion === "")) {
      throw new Error('parent-name + parent-version must both be set');
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

    const baseUrl = new URL(`${protocol}://${serverHostname}`);
    if (port) {
      baseUrl.port = port;
    }

    const headers = useWorkloadIdentity
      ? { 'Authorization': `Bearer ${await exchangeIdToken(baseUrl, workloadIdentityProvider, serviceAccount, oidcAudience)}` }
      : { 'X-API-Key': apiKey };

    const requestOptions = {
      method: 'POST',
      headers,
      body: form
    };

    const url = new URL('/api/v1/bom', baseUrl);

    core.info(`Uploading to Dependency-Track server ${serverHostname}...`);

    const response = await fetch(url.toString(), requestOptions);

    if (response.ok) {
      const responseJson = await response.json();
      core.setOutput('token', responseJson.token);
      if (responseJson.projectUuid) {
        core.setOutput('project-uuid', responseJson.projectUuid);

        // Deprecated, remove in next major version.
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
    core.setFailed(error instanceof Error ? error.message : String(error));
  }
}

run();
