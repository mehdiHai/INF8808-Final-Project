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
  topCompanies.delete('NULL')
  topCompanies.delete('')

  let numOthers = topCompanies.get("OTHERS")
  topCompanies.delete("OTHERS")

  let sortedCompanies = [...topCompanies.entries()].sort((a, b) => b[1] - a[1])

  sortedCompanies.push(["OTHERS", numOthers])
  return sortedCompanies
}
