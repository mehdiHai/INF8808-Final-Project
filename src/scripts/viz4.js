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
  const sequence = (length) => Array.apply(null, {length: length}).map((d, i) => i);
  const waffleScale = d3.scaleBand()
    .domain(sequence(10))
    .range([0, 600])
    .padding(0.1)
  const color = d3.scaleOrdinal(d3.schemeTableau10)
    .domain(sequence(otherCompaniesAircrafts.length))
  
  const chartData =   [...otherCompaniesAircrafts.entries()]
  const whole = true;
  const width = 1024;
  const height = 600;
  const isRect = true;

  const waffles = [];
  const max = chartData.length; 
  let index = 0, curr = 1;
  const accu = Math.round(chartData[0][0])
  const waffle = [];
  
  for (let y = 9; y >= 0; y--)
    for (let x = 0; x < 10; x ++) {
      if (curr > accu && index < max) {
        let r = Math.round(chartData[++index][0]);
        while(r === 0 && index < max) r = Math.round(chartData[++index][0]);
        accu += r;
      }
      waffle.push({x, y, index});
      curr++;
    } 
  waffles.push(waffle);
 
  console.log(waffles)

  const svg = d3.select('#waffleChart').attr("viewBox", [0, 0, width, height])

  const g = svg
      .selectAll('.waffle')
      .data(waffles)
      .enter()
      .append("g")
      .attr("class", "waffle");

  const cellSize = waffleScale.bandwidth();
  const half = cellSize / 2;
  const cells = g.append("g")
    .selectAll('rect')
    .data(d => d)
    .enter()
    .append('rect')
    .attr("fill", d => d.index === -1 ? "#ddd" : color(d.index));

  cells.attr("x", d => waffleScale(d.x))
    .attr("y", d => whole ?  0 : waffleScale(d.y))
    .attr("rx", 3).attr("ry", 3)
    .attr("width", cellSize).attr("height", cellSize)      

  cells.transition()
    .duration(d => d.y * 100)
    .ease(d3.easeBounce)
    .attr(isRect ? "y" : "cy", d => waffleScale(d.y) + (isRect ? 0 : half));
    svg.transition().delay(550)

  svg.node();
    
}