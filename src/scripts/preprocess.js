let data = [];
let flightData = [];
let sankeyData = [];

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
    flightData.push(flight);
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
  const startAirportIsCanada = d.aérDépart.startsWith('CY')
  const arrivalAirportIsCanada = d.aérDestin.startsWith('CY')
  let flightRange = ''
  if (startAirportIsQuebec && arrivalAirportIsQuebec) {
    flightRange = 'Quebec'
  }
  else if (startAirportIsCanada && arrivalAirportIsCanada) {
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
  // assume that 'data' is the array of objects containing airline, duration, departureTime, and flightRange

  // count objects with same airline and duration
  const airlineDurationCounts = {};
  flightData.forEach(d => {
    const key = `${d.airline}_${d.duration}`;
    if (!airlineDurationCounts[key]) {
      airlineDurationCounts[key] = 0;
    }
    airlineDurationCounts[key]++;
  });

  // count objects with same duration and departureTime
  const durationDepartureCounts = {};
  flightData.forEach(d => {
    const key = `${d.duration}_${d.departureTime}`;
    if (!durationDepartureCounts[key]) {
      durationDepartureCounts[key] = 0;
    }
    durationDepartureCounts[key]++;
  });

  // count objects with same departureTime and flightRange
  const departureFlightCounts = {};
  flightData.forEach(d => {
    const key = `${d.departureTime}_${d.flightRange}`;
    if (!departureFlightCounts[key]) {
      departureFlightCounts[key] = 0;
    }
    departureFlightCounts[key]++;
  });

  // create array of objects with source, target, and count attributes
  const links = [];
  Object.keys(airlineDurationCounts).forEach(key => {
    const [airline, duration] = key.split('_');
    const source = airline;
    const target = duration;
    const count = airlineDurationCounts[key];
    links.push({source, target, count});
  });
  Object.keys(durationDepartureCounts).forEach(key => {
    const [duration, departureTime] = key.split('_');
    const source = duration;
    const target = departureTime;
    const count = durationDepartureCounts[key];
    links.push({source, target, count});
  });
  Object.keys(departureFlightCounts).forEach(key => {
    const [departureTime, flightRange] = key.split('_');
    const source = departureTime;
    const target = flightRange;
    const count = departureFlightCounts[key];
    links.push({source, target, count});
  });

  console.log(links); // array of objects with source, target, and count attributes

  return links;
}

/**
 * Defines the alluvialData (airline, duration, departureTime, flightRange, and value) necessary to show the flow between all the nodes.
 * Each airline is a node, as well as each flight duration, flight departure time, and flight range type.
 *
 */
export function getAlluvialData() {
  const countFlights = flightData.reduce((counts, flight) => {
    const key = JSON.stringify({ airline: flight.airline, duration: flight.duration, departureTime: flight.departureTime, flightRange: flight.flightRange });
    counts[key] = (counts[key] || 0) + 1;
    return counts;
  }, {});
  
  const links = Object.keys(countFlights).map((key) => {
    const { airline, duration, departureTime, flightRange } = JSON.parse(key);
    const count = countFlights[key];
    return { airline, duration, departureTime, flightRange, count };
  });

  console.log('ALLUVIAL DATA');
  console.log(links);

  return links;
}