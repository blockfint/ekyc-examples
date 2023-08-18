const { getToken } = require('./get_token');

getToken()
  .then(token => {
    console.log(token);
  })
  .catch(error => {
    console.error(error.message);
  });
