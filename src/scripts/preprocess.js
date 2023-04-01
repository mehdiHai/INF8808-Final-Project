let data = [];
let companiesFlightArray = [];
let topCompaniesCount = 0;
let companiesAircrafts;

let topCompaniesSet = new Set();

export function setData(newData) {
  data = newData
  companiesFlightArray = setCompaniesFlightCount();
}

export function getData() {
  return [...data];
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

function setCompaniesFlightCount() {
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