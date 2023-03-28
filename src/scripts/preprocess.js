let data = [];
let companiesFlightArray = [];

export function setData(newData) {
  data = newData
  companiesFlightArray = getCompaniesFlightCount();
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
    if(!topCompanies.get(d.company)) {
      topCompanies.set(d.company, parseFloat(d.number))
    }
    else {
      topCompanies.set(d.company, topCompanies.get(d.company) + parseFloat(d.number))
    }
  })
  console.log(topCompanies)
  topCompanies.delete('NULL')
  topCompanies.delete('')
  fixSemanticBugs(topCompanies) // effectif ?

  let numOthers = topCompanies.get("Others")
  topCompanies.delete("Others")

  let sortedCompanies = [...topCompanies.entries()].sort((a, b) => b[1] - a[1])

  sortedCompanies.push(["Others", numOthers])
  return sortedCompanies
}

function fixSemanticBugs(topCompanies){
  topCompanies.set("AIR CANADA", topCompanies.get("AIR CANADA ") + topCompanies.get("AIR CANADA"))
  topCompanies.delete("AIR CANADA ")
  topCompanies.set("AIR FRANCE", topCompanies.get("AIR FRANS") + topCompanies.get("AIR FRANCE"))
  topCompanies.delete("AIR FRANS")
  topCompanies.set("AIR TRANSAT", topCompanies.get("TRANSAT") + topCompanies.get("AIR TRANSAT"))
  topCompanies.delete("TRANSAT")
}
