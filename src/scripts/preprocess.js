let data = [];
let companiesFlightArray = [];
let topCompaniesSet = new Set();

export function setData(newData) {
  data = newData
  companiesFlightArray = getCompaniesFlightCount();
}

export function getData() {
  return [...data];
}

export function getCompaniesFlightArray() {
  return [...companiesFlightArray];
}

export function resizeTopCompagnies(bottomBucket, topCompanyNumber) {
  topCompaniesSet.clear();
  let selection = bottomBucket.splice(0, topCompanyNumber);
  selection.forEach(d => topCompaniesSet.add(d[0]))
  return selection;
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

function getCompaniesFlightCount() {
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
