let data = [];
let flightData = new Set();
let sankeyData = new Set();

export function setData(d) {
  data = d;
}

export function getData() {
  return [...data];
}

 /**
 * Takes the raw data and creates a set containing only the values airline, duration, departureTime, and flightRange.
 */
export function processFlightData() {
  data.forEach((d) => {
    let flight = { airline: getAirline(d), duration: getDuration(d), departureTime: getDepartureTime(d), flightRange: getFlightRange(d) };
    flightData.add(flight);
  });
  console.log('PROCESSED FLIGHT DATA');
  console.log(flightData);
}

 /**
 * Returns the airline (opérateur) of a flight.
 *
 * @param {object} d The raw data
 * @returns {string} The airline (opérateur) of a flight
 */
function getAirline(d) {
  return d.opérateur;
}

 /**
 * Calculates the duration of a flight : short, medium, or long.
 *
 * @param {object} d The raw data
 * @returns {string} The duration of a flight : short, medium, or long
 */
function getDuration(d) {
  let duration = '';
  if (d.durée <= 180) {
    duration = 'short';
  } else if (d.durée >= 181 && d.durée <= 360) {
    duration = 'medium';
  } else {
    duration = 'long';
  }
  return duration;
}

/**
 * Calculates the departure time of a flight : morning, afternoon, evening, or night.
 *
 * @param {object} d The raw data
 * @returns {string} The departure time of a flight : morning, afternoon, evening, or night
 */
function getDepartureTime(d) {
  let dateTime = new Date (d.dateDébut)
  let timeUTC = dateTime.toLocaleTimeString()
  let departureTime = ''
  if (dateTime.getHours() >= 10 && dateTime.getHours() < 16) {
    departureTime = 'morning'
  } else if (dateTime.getHours() >= 16 && dateTime.getHours() < 22) {
    departureTime = 'afternoon'
  } else if (dateTime.getHours() >= 22 && dateTime.getHours() < 2) {
    departureTime = 'evening'
  } else {
    departureTime = 'night'
  }
  return departureTime
}

/**
 * Calculates the range of a flight : Québec, Canada, or International.
 *
 * @param {object} d The raw data
 * @returns {string} The range of a flight : Québec, Canada, or International
 */
function getFlightRange(d) {
  const quebecAirports = ["CYBG", "CYBC", "CYVB", "CYCL", "CYMT", "CYBC", "CYDR", "CYFE", "CYGP", "CYND", "CYGV", "CYGR", "CYGL", "CYLR", "CYLS", "CSE4", "CYBX", "CYMW", "CYNM", "CYYY", "CYMX", "CYUL", "CYNM", "CYQB", "CYXK", "CYRJ", "CYUY", "CYSG", "CYHU", "CYZV", "CYRQ", "CYVO", "CYSJ", "CYQM", "CYHZ", "CYQY", "CYDF", "CYJT", "CYMT", "CYFT", "CYGP", "CYQX", "CYGR", "CYBG", "CYZG", "CYVB", "CYAT", "CYBC", "CYDO", "CYVB", "CYND", "CYBX", "CYHH", "CYVB", "CYHR", "CYMT", "CYIO", "CYNA", "CYOH", "CYVO", "CYNO", "CYUY", "CYOC", "CYZS", "CYOO", "CYPR", "CYQU", "CYRB", "CYRT", "CYUT", "CYRB", "CYRI", "CYRV", "CYOY", "CYUL", "CYRV", "CYVP", "CYVO", "CYVO", "CYGL", "CYVC", "CYTL", "CYJT", "CYTH", "CYTR", "CYQD", "CYVB", "CYVB", "CYVL", "CYVO", "CYVB", "CYWK", "CYHY", "CYWP", "CYWV", "CYGL", "CYXC", "CYXX", "CYXY", "CYYB", "CYYC", "CYYF", "CYYG", "CYYH", "CYYJ", "CYYN", "CYYR", "CYYT", "CYYU", "CYYW", "CYYY", "CYZF", "CYZP", "CYZR", "CYZT", "CYZU", "CYZW", "CYZX"]
  const startAirportIsQuebec = quebecAirports.includes(d.aérDépart)
  const arrivalAirportIsQuebec = quebecAirports.includes(d.aérDestin)
  const startAirportIsCanada = d.aérDépart.startsWith('C')
  const arrivalAirportIsCanada = d.aérDestin.startsWith('C')
  let flightRange = ''
  if (startAirportIsQuebec && arrivalAirportIsQuebec) {
    flightRange = 'Quebec'
  }
  else if (startAirportIsCanada || arrivalAirportIsCanada) {
    flightRange = 'Canada'
  }
  else {
    flightRange = 'International'
  }
  return flightRange
}

/**
 * Defines the sankeyData (source, target, and value) necessary to link the nodes.
 * Each airline is a node, as well as each flight duration, flight departure time, and flight range type.
 *
 */
export function getSankeyData() {
  let firstLinkCounts = {};
  flightData.forEach((flight) => {
    let key = flight.airline + "|" + flight.duration;
    firstLinkCounts[key] = (firstLinkCounts[key] || 0) + 1;
  });

  // Create array of objects with airline, duration, and count
  let airlineToDuration = Object.keys(firstLinkCounts).map((key) => {
    let [airline, duration] = key.split("|");
    return { airline, duration, count: firstLinkCounts[key] };
  });

  sankeyData.add(airlineToDuration);

  let secondLinkCounts = {};
  flightData.forEach((flight) => {
    let key = flight.duration + "|" + flight.departureTime;
    secondLinkCounts[key] = (secondLinkCounts[key] || 0) + 1;
  });

  // Create array of objects with duration, departureTime, and count
  let durationToDepartureTime = Object.keys(secondLinkCounts).map((key) => {
    let [duration, departureTime] = key.split("|");
    return { duration, departureTime, count: secondLinkCounts[key] };
  });

  sankeyData.add(durationToDepartureTime);

  let thirdLinkCounts = {};
  flightData.forEach((flight) => {
    let key = flight.departureTime + "|" + flight.flightRange;
    thirdLinkCounts[key] = (thirdLinkCounts[key] || 0) + 1;
  });

  // Create array of objects with departureTime, flightRange, and count
  let departureTimeToFlightRange = Object.keys(thirdLinkCounts).map((key) => {
    let [departureTime, flightRange] = key.split("|");
    return { departureTime, flightRange, count: thirdLinkCounts[key] };
  });

  sankeyData.add(departureTimeToFlightRange);

  console.log('SANKEY DATA');
  console.log(sankeyData);

  return sankeyData;
}