let data = [];
let companiesFlightArray = [];

export function setData(newData) {
  data = newData
  companiesFlightArray =getCompaniesFlightCount();
}

export function getData() {
  return [...data];
}

export function getCompaniesFlightArray(){
  return [...companiesFlightArray];
}

function getCompaniesFlightCount() {
  const topCompanies = new Map()
  data.forEach((d) => {
    if(!topCompanies.get(d.opérateur)) {
      topCompanies.set(d.opérateur, 1)
    }
    else {
      topCompanies.set(d.opérateur, topCompanies.get(d.opérateur) + 1)
    }
  })
  topCompanies.delete('NULL')
  topCompanies.delete('')
  fixSemanticBugs(topCompanies)
  return [...topCompanies.entries()].sort((a, b) => b[1] - a[1])
}

function fixSemanticBugs(topCompanies){
  topCompanies.set("AIR CANADA", topCompanies.get("AIR CANADA ") + topCompanies.get("AIR CANADA"))
  topCompanies.delete("AIR CANADA ")
}

export function getCompaniesAircraftsMap(data) {
    const aircrafts = new Map();

    data.forEach((d) => {
        let opName = d.opérateur;

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

    return aircrafts;
}