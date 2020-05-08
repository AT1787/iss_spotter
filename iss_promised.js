const request = require('request-promise-native');


const fetchMyIP = () => {
    return request(`https://api.ipify.org/?format=json`)
}

const fetchCoordsByIP = function(body) {
    const newIP = JSON.parse(body)
    return request(`https://ipvigilante.com/json/${newIP['ip']}`)
}

const fetchISSFlyOverTimes = function(body) {
    const { latitude, longitude } = JSON.parse(body).data;
    const newCoords = `http://api.open-notify.org/iss-pass.json?lat=${latitude}&lon=${longitude}`
    return request(newCoords)
}

const nextISSTimesForMyLocation = function() {
    return fetchMyIP()
      .then(fetchCoordsByIP)
      .then(fetchISSFlyOverTimes)
      .then((data) => {
        const { response } = JSON.parse(data);
        return response;
      });
  };
  
module.exports = { nextISSTimesForMyLocation };

