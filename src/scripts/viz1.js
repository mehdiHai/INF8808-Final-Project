d3.csv('./volsQuebec2022.csv').then(function (data) {
  console.log(data)

  const bigCompanies = getBigCompanies(data);
})


function getBigCompanies(data) {
  const bigCompanies = new Map()
  data.forEach((d) => {
    if(!bigCompanies.get(d.opérateur)) {
      bigCompanies.set(d.opérateur, 1)
    }
    else {
      bigCompanies.set(d.opérateur, bigCompanies.get(d.opérateur) + 1)
    }
  })
  bigCompanies.delete('NULL')
  bigCompanies.delete('')
  console.log(bigCompanies);
  return [...bigCompanies.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5)
}