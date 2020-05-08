const request = require('request');

const fetchMyIP = function(callback) {
  const input =  `https://api.ipify.org/?format=json`;
  request(input, (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }

    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }

    callback(error, body);
  });
};

const fetchCoordsByIP = function(ip, callback) {
    request(`https://ipvigilante.com/json/${ip}`, (error, response, body) => {
      if (error) {
        callback(error, null);
        return;
      }
  
      if (response.statusCode !== 200) {
        callback(Error(`Status Code ${response.statusCode} when fetching Coordinates for IP: ${body}`), null);
        return;
      }
      const { latitude, longitude, } = JSON.parse(body).data;


      callback(null, { latitude, longitude });

    });
  };

  const fetchISSFlyOverTimes = function(coords, callback) {

    const newCoords = `http://api.open-notify.org/iss-pass.json?lat=${coords.latitude}&lon=${coords.longitude}`

    request(newCoords, (error, response, body) => {

        if (error) {
            callback(error, null);
            return;
          }
        
        if (response.statusCode !== 200) {
            callback(Error(`Status Code ${response.statusCode} when fetching Coordinates for IP: ${body}`), null);
            return;
         }

        const responseCoord = JSON.parse(body)['response']


        callback(null, responseCoord)

    });
  }

  const nextISSTimesForMyLocation = function(callback) {
    fetchMyIP((error, ip) => {
      if (error) {
        return callback(error, null);
      }

      const newIP = JSON.parse(ip)
      console.log('It worked! Returned IP:' , newIP['ip']);
  
      fetchCoordsByIP(newIP['ip'], (error, loc) => {
        if (error) {
          return callback(error, null);
        }
  
        fetchISSFlyOverTimes(loc, (error, nextPasses) => {
          if (error) {
            return callback(error, null);
          }
  
          callback(null, nextPasses);
        });
      });
    });
  };
  
  
module.exports = { nextISSTimesForMyLocation };

