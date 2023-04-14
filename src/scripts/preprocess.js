let bucketsData = [];
let sankeyData = [];
let alluvialData = [];
let filteredAlluvialData = [];
let companiesFlightArray = [];
let topCompaniesCount = 0;
let companiesAircrafts = [];

let topCompaniesSet = new Set();

/**
 * Prépare les données pour la visualisation de seaux
 * @param {*} newData données brutes initiales
 */
export function setBucketsData(newData) {
  bucketsData = newData
  setCompaniesFlightCount(bucketsData);
}

/**
 * Prépare les données pour le diagramme alluvial
 * @param {*} newData données brutes initiales
 */
export function setAlluvialData(newData) {
  alluvialData = [];
  newData.forEach(d => {
    alluvialData.push({airline: d.airline, duration: d.duration, departureTime: d.departureTime, flightRange: d.flightRange, count: parseInt(d.count)});
  });
}

/**
 * Filtre les données pour le diagramme alluvial
 */
export function filterAlluvialData() {
  filteredAlluvialData = [];

  alluvialData.forEach(d => {
    let index = companiesFlightArray.findIndex(company => company[0] === d.airline);
    if (index >= 0 && index < topCompaniesCount) {
      filteredAlluvialData.push(d);
    } else {
      let found = filteredAlluvialData.find(f => f.duration === d.duration && f.departureTime === d.departureTime && f.flightRange === d.flightRange && f.airline === 'AUTRES');
      if (found) {
        found.count += d.count;
      } else {
        filteredAlluvialData.push({airline: 'AUTRES', duration: d.duration, departureTime: d.departureTime, flightRange: d.flightRange, count: d.count});
      }
    }
  });

  let index = companiesFlightArray.findIndex(company => company === 'AUTRES');
  if (index >= 0 && index < topCompaniesCount) {
    let found = filteredAlluvialData.find(f => f.airline === 'AUTRES');
    if (found) {
      found.count += otherCount;
    } else {
      filteredAlluvialData.push({airline: 'AUTRES', duration: '', departureTime: '', flightRange: '', count: otherCount});
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
}

/**
 * Renvoie les données du diagramme de Sankey sous forme de tableau
 */

export function getSankeyData() {
  return [...sankeyData];
}

/**
 * Renvoie les données du diagramme alluvial sous forme de tableau
 */

export function getAlluvialData() {
  return [...alluvialData];
}

/**
 * Renvoie les données du diagramme alluvial filtrées en fonction des sélections de l'utilisateur
 */

export function getFilteredAlluvialData() {
  return [...filteredAlluvialData];
}

/**
 * Renvoie les données sur le nombre de vols par compagnie sous forme de tableau
 */

export function getCompaniesFlightArray() {
  return [...companiesFlightArray];
}

/**
 * Renvoie le nombre de compagnies affichées dans le graphique en barres de gauche
 */

export function getTopCompaniesCount(){
  return topCompaniesCount;
}

/**
 * Met à jour le nombre de compagnies affichées dans le graphique en barres de gauche
 * @param {*} count nouveau nombre de compagnies à afficher
 */

export function setTopCompaniesCount(count){
  topCompaniesCount = count;
}

/**
 * Renvoie un dictionnaire faisant correspondre chaque compagnie à la liste de ses types d'aéronefs et leur compte respectif
 */

export function getCompaniesAircraftsMap() {
  return companiesAircrafts;
}

/**
 * Groupement des données en fonction des principales compagnies aériennes
 * @param {*} data données à traiter
 * @returns Promise pour un tableau d'objets avec les propriétés 'company', 'airportIn', 'airportOut' et 'number'
 */

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

/**
 * Réduit le nombre de compagnies affichées dans le graphique en barres de gauche
 * @param {*} bottomBucket tableau contenant toutes les compagnies triées par nombre de vols décroissant
 * @returns tableau contenant les n premières compagnies triées par nombre de vols décroissant, où n est le nombre de compagnies souhaité à afficher
 */

export function resizeTopCompagnies(bottomBucket) {
  let selection = bottomBucket.splice(0,   topCompaniesCount);
  selection.forEach(d => topCompaniesSet.add(d[0]))
  return selection;
}

/**
 * Crée un dictionnaire qui fait la correspondance entre une compagnie et leur nombre total de vols
 * @param {*} aircraftsData données brutes initiales
 */
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

  companiesFlightArray = [...topCompanies.entries()].sort((a, b) => b[1] - a[1])
  companiesFlightArray.push(["OTHERS", numOthers])
}

/**
 * Crée un dictionnaire qui fait la correspondance entre une compagnie et une liste de leurs types d'aéronef et leur compte
 * @param {*} aircraftsData données brutes initiales
 */
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
}