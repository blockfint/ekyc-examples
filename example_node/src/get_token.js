const axios = require('axios');
const crypto = require('crypto');
const dotenv = require('dotenv');

dotenv.config();

async function getToken() {
  // Load configuration from .env
  const apiUrl = process.env.GENERATE_TOKEN_API_URL;

  if (!apiUrl) {
    console.error('GENERATE_TOKEN_API_URL not provided in .env');
    process.exit(1);
  }

  const accessKey = process.env.ACCESS_KEY;
  const secretKey = process.env.SECRET_KEY;
  const validityPeriod = parseInt(process.env.VALIDITY_PERIOD ?? '3600');
  
  if (!accessKey || !secretKey) {
    console.error('Access key or secret key not provided in .env');
    process.exit(1);
  }

  const timestamp = Date.now() + 300000; // 300 seconds after current time
  const combined = accessKey + secretKey + timestamp;
  const signature = crypto.createHash('sha256').update(combined).digest('hex');

  const requestData = {
    accessKey,
    timestamp: timestamp.toString(),
    signature,
    periodSecond: validityPeriod.toString()
  };

  try {
    const response = await axios.post(apiUrl, requestData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    return response.data.data.token;
  } catch (error) {
    throw new Error('Failed to generate token: ' + error.message);
  }
}

module.exports = {
  getToken,
}
