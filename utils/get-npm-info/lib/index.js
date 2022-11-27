'use strict';

const axios = require('axios');
const urlJoin = require('url-join');
const semver = require('semver');

const { getCoreData, versions } = require('./mockData');
// console.log('getCoreData: ', getCoreData);

function getNpmInfo(npmName, registry) {
  // console.log('registry: ', registry);
  // console.log('npmName: ', npmName);
  if (!npmName) {
    return null;
  }
  const registryUrl = registry || getDefaultRegistry();
  // const testNpmName = '@snowlepoard520/core'
  const npmInfoUrl = urlJoin(registryUrl, npmName);
  // const npmInfoUrl = urlJoin(registryUrl, testNpmName);
  // console.log('请求 npmInfoUrl: ', npmInfoUrl);
  // return new Promise(resolve => resolve(getCoreData));
  return axios.get(npmInfoUrl).then(response => {
    console.log(`请求${npmName}npm数据信息成功`);
    if(response.status === 200) {
      // console.log(response, 'response');
      return response.data;
    }
    return null;
  }).catch(
    err => {
      console.error('err: ', err);
      return Promise.reject(err);
    }
  );
}

function getDefaultRegistry(isOriginal = false) {
  return isOriginal ? 'https://registry.npmjs.org/': 'https://registry.npmmirror.com/'
}

async function getNpmVersions(npmName, registry){
  // return versions;
  const data = await getNpmInfo(npmName);
  if (data) {
    return Object.keys(data.versions);
  } else {
    return [];
  }
}


async function getNpmSemverVersions(baseVersion, npmName, registry) {
  const versions = await getNpmVersions(npmName, registry);
  console.log(versions, 'versions');
 //  console.log(baseVersion, 'baseVersion');
  const semverVersions = getSemverVersions(baseVersion, versions);
  // console.log('semverVersions: ', semverVersions);
  // if (semverVersions && semverVersions.length ) {
  //    return semverVersions[0];
  // }
  return semverVersions;
 }

async function getNpmLatestVersion(npmName, registry) {
  let versions = await getNpmVersions(npmName, registry);
  if (versions) {
    return versions.sort(
      (a, b) => {
        // console.log(semver.gt(b, a), 'semver.gt(b, a)');
        return semver.gt(b, a) ? 0 : -1;
      }
    )[0];
  }
  return null;
}

function getSemverVersions(baseVersion, versions) {
  versions = versions
  .filter(version => {
    return semver.satisfies(version, `^${baseVersion}`);
  })
  .sort((a, b) => {
    return semver.gt(b, a) ? 0 : -1;
  });
  return versions;
}

module.exports = { 
  getNpmInfo,
  getNpmSemverVersions,
  getNpmVersions,
  getDefaultRegistry,
  getNpmLatestVersion
};