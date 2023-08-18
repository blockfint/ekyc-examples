const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

async function getLivenessLicense(accessToken) {
  // Load configuration from .env
  const apiUrl = process.env.LIVENESS_GET_LICENSE_URL;

  if (!apiUrl) {
    console.error('LIVENESS_GET_LICENSE_URL not provided in .env');
    process.exit(1);
  }

  const applicationId = process.env.LIVENESS_APPLICATION_ID;
  const licenseEffectiveSeconds = parseInt(process.env.LIVENESS_LICENSE_EFFECTIVE_SECONDS ?? '86400');
  
  if (!applicationId) {
    console.error('LIVENESS_APPLICATION_ID not provided in .env');
    process.exit(1);
  }

  const requestData = {
    licenseEffectiveSeconds,
    applicationId,
  };

  try {
    const response = await axios.post(apiUrl, requestData, {
      headers: {
        'Content-Type': 'application/json',
        'X-ACCESS-TOKEN': accessToken,
      }
    });

    return response.data.data.license;
  } catch (error) {
    throw new Error('Failed to generate token: ' + error.message);
  }
}

module.exports = {
  getLivenessLicense,
};
