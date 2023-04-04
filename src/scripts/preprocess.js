let data = [];
let sankeyData = [];
let alluvialData = [];
let filteredAlluvialData = [];
let companiesFlightArray = [];
let topCompaniesCount = 0;
let companiesAircrafts;

let topCompaniesSet = new Set();

export function setData(newData) {
  data = newData
  companiesFlightArray = setCompaniesFlightCount(data);
}

export function setAlluvialData(data) {
  alluvialData = [];
  data.forEach(d => {
    alluvialData.push({airline: d.airline, duration: d.duration, departureTime: d.departureTime, flightRange: d.flightRange, count: parseInt(d.count)});
  });
}

export function filterAlluvialData() {
  filteredAlluvialData = [];

  alluvialData.forEach(d => {
    let index = companiesFlightArray.findIndex(company => company[0] === d.airline);
    if (index >= 0 && index < topCompaniesCount) {
      filteredAlluvialData.push(d);
    } else {
      let found = filteredAlluvialData.find(f => f.duration === d.duration && f.departureTime === d.departureTime && f.flightRange === d.flightRange && f.airline === 'OTHERS');
      if (found) {
        found.count += d.count;
      } else {
        filteredAlluvialData.push({airline: 'OTHERS', duration: d.duration, departureTime: d.departureTime, flightRange: d.flightRange, count: d.count});
      }
    }
  });

  let index = companiesFlightArray.findIndex(company => company === 'OTHERS');
  if (index >= 0 && index < topCompaniesCount) {
    let found = filteredAlluvialData.find(f => f.airline === 'OTHERS');
    if (found) {
      found.count += otherCount;
    } else {
      filteredAlluvialData.push({airline: 'OTHERS', duration: '', departureTime: '', flightRange: '', count: otherCount});
    }
  }

  setSankeyData();
}


export function setSankeyData() {
  // 'filteredAlluvialData' is the array of objects containing airline, duration, departureTime, and flightRange

  sankeyData = [];
  // count objects with same airline and duration
  const airlineDurationCounts = {};
  filteredAlluvialData.forEach(d => {
    const key = `${d.airline}_${d.duration}`;
    if (!airlineDurationCounts[key]) {
      airlineDurationCounts[key] = 0;
    }
    airlineDurationCounts[key] += d.count;
  });

  // count objects with same duration and departureTime
  const durationDepartureCounts = {};
  filteredAlluvialData.forEach(d => {
    const key = `${d.duration}_${d.departureTime}`;
    if (!durationDepartureCounts[key]) {
      durationDepartureCounts[key] = 0;
    }
    durationDepartureCounts[key] += d.count;
  });

  // count objects with same departureTime and flightRange
  const departureFlightCounts = {};
  filteredAlluvialData.forEach(d => {
    const key = `${d.departureTime}_${d.flightRange}`;
    if (!departureFlightCounts[key]) {
      departureFlightCounts[key] = 0;
    }
    departureFlightCounts[key] += d.count;
  });

  Object.keys(airlineDurationCounts).forEach(key => {
    const [airline, duration] = key.split('_');
    const source = airline;
    const target = duration;
    const count = airlineDurationCounts[key];
    sankeyData.push({source, target, count, level: 0});
  });
  Object.keys(durationDepartureCounts).forEach(key => {
    const [duration, departureTime] = key.split('_');
    const source = duration;
    const target = departureTime;
    const count = durationDepartureCounts[key];
    sankeyData.push({source, target, count, level: 1});
  });
  Object.keys(departureFlightCounts).forEach(key => {
    const [departureTime, flightRange] = key.split('_');
    const source = departureTime;
    const target = flightRange;
    const count = departureFlightCounts[key];
    sankeyData.push({source, target, count, level: 2});
  });

  return sankeyData;
}

export function getData() {
  return [...data];
}

export function getSankeyData() {
  return [...sankeyData];
}

export function getAlluvialData() {
  return [...alluvialData];
}

export function getFilteredAlluvialData() {
  return [...filteredAlluvialData];
}

export function getCompaniesFlightArray() {
  return [...companiesFlightArray];
}

export function getTopCompaniesCount(){
  return topCompaniesCount;
}

export function setTopCompaniesCount(count){
  topCompaniesCount = count;
}

export function getCompaniesAircraftsMap() {
  return companiesAircrafts;
}


export function groupByMainCompanies(data) {
  let agg = new Map()
  data.forEach(function (x) {
    if (topCompaniesSet.has(x.company)) { } else {
      x.company = "OTHERS"
    }
    let key = [x.company, x.airportIn, x.airportOut]
    let keyBis = [x.company, x.airportOut, x.airportIn]

    if (agg.get(key)) {
      agg.set(key, agg.get(key) + parseFloat(x.number))
    } else if (agg.get(keyBis)) {  
      agg.set(keyBis, agg.get(keyBis) + parseFloat(x.number))
    } else {
      agg.set(key, parseFloat(x.number))
    }
  })
  let flyArray = []
  agg.forEach(function (value, key) {
    flyArray.push({ company: key[0], airportIn: key[1], airportOut: key[2], number: value})
  })
  return new Promise((resolve, reject) => resolve(flyArray))
}

export function resizeTopCompagnies(bottomBucket) {
  let selection = bottomBucket.splice(0,   topCompaniesCount);
  selection.forEach(d => topCompaniesSet.add(d[0]))
  return selection;
}

function setCompaniesFlightCount(data) {
  const topCompanies = new Map()
  data.forEach((d) => {
    if (!topCompanies.get(d.company)) {
      topCompanies.set(d.company, parseFloat(d.number))
    }
    else {
      topCompanies.set(d.company, topCompanies.get(d.company) + parseFloat(d.number))
    }
  })
  topCompanies.delete('NULL')
  topCompanies.delete('')
  let numOthers = topCompanies.get("OTHERS")
  topCompanies.delete("OTHERS")

  let sortedCompanies = [...topCompanies.entries()].sort((a, b) => b[1] - a[1])

  sortedCompanies.push(["OTHERS", numOthers])
  return sortedCompanies
}

export function setCompaniesAircraftsMap(aircraftsData) {
  const aircrafts = new Map();

  aircraftsData.forEach((d) => {
      let opName = d.company;

      if (opName == "" || opName == "NULL") return;

      if (!aircrafts.get(opName)) {
          if (opName)
          aircrafts.set(opName, new Map());
      }

      let type = d.type == '' || d.type == 'NULL' ? 'Inconnu' : d.type;

      if (!aircrafts.get(opName).get(type)) {
          aircrafts.get(opName).set(type, 1);
      }

      else {
          aircrafts.get(opName).set(type, aircrafts.get(opName).get(type) + 1);
      }
  })
  companiesAircrafts = aircrafts;

  return aircrafts;
  
}