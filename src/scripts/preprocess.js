let data = [];
let companiesFlightArray = [];
let topCompaniesCount = 0;
let companiesAircrafts;


export function setData(newData) {
  data = newData
  companiesFlightArray = setCompaniesFlightCountArray();
}

export function getData() {
  return [...data];
}

export function getCompaniesFlightArray(){
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

function setCompaniesFlightCountArray() {
  const topCompanies = new Map()
  data.forEach((d) => {
    if(!topCompanies.get(d.company)) {
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