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
  const countFlights = flightData.reduce((counts, flight) => {
    const key = JSON.stringify({ airline: flight.airline, duration: flight.duration, departureTime: flight.departureTime, flightRange: flight.flightRange });
    counts[key] = (counts[key] || 0) + 1;
    return counts;
  }, {});
  
  const result = Object.keys(countFlights).map((key) => {
    const { airline, duration, departureTime, flightRange } = JSON.parse(key);
    const count = countFlights[key];
    return { airline, duration, departureTime, flightRange, count };
  });

  console.log('SANKEY DATA');
  console.log(result);

  return result;
}