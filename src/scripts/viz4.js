const NUMBER_OF_COMPANIES = 5;
const biggestCompaniesAircrafts = new Map();
let otherCompaniesAircrafts = new Map();

export function drawWaffles(biggestCompaniesFlights, companiesAircrafts) {
    separateBigFromOthers(biggestCompaniesFlights, companiesAircrafts);

    drawBigWaffle();
}

function separateBigFromOthers (biggestCompaniesFlights, companiesAircrafts) {
  for (let i = 0; i < biggestCompaniesFlights.length; i++) {
  const company = biggestCompaniesFlights[i][0];

    if (i < NUMBER_OF_COMPANIES)
      biggestCompaniesAircrafts.set(company, companiesAircrafts.get(company));
    else {
      for (const typeCount of companiesAircrafts.get(company)) {
        const name = typeCount[0];

        if (!otherCompaniesAircrafts.get(name)) otherCompaniesAircrafts.set(name, 0);

        otherCompaniesAircrafts.set(name, otherCompaniesAircrafts.get(name) + typeCount[1]);
      }
    }
  }

  console.log(otherCompaniesAircrafts);
}

function drawBigWaffle() {
  // const svg = d3.select('#viz4')
  //   .append('svg')
  //   .style('cursor', 'default')
  //   .attr('width', 500)
  //   .attr('height', 500)
  //   .selectAll('.waffle')
  //   .data(otherCompaniesAircrafts)
  //   .join('g')
  //   .attr('class', 'waffle')
  //   .attr('x', function (d, i) {
  //     return (i % 10) * 500 / 10
  //   })
  //   .attr('y', function (d, i) {
  //     return (i % 10) * 500 / 10
  //   });
}