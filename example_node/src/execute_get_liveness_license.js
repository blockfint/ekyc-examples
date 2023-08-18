const { getToken } = require('./get_token');
const { getLivenessLicense } = require('./get_liveness_license');

getToken()
  .then(getLivenessLicense)
  .then(license => {
    console.log(license);
  })
  .catch(error => {
    console.error(error.message);
  })