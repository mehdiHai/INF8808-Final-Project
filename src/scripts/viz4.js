const NUMBER_OF_COMPANIES = 5;
const biggestCompaniesAircrafts = new Map();
let otherCompaniesAircrafts = new Map();

export function drawWaffles(biggestCompaniesFlights, companiesAircrafts) {
    separateBigFromOthers(biggestCompaniesFlights, companiesAircrafts);

    setTooltip();
    drawOtherCompaniesWaffle();
    drawTopCompaniesWaffle();
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

}

function calculateWaffleDimensions(data, factor) {
  const width = 1024;
  const height = 500;
  const squareSize = 20;
  const offset = 5;
  const total = data.reduce((acc, d) => acc + d.value, 0);;
  const cols = Math.floor(Math.sqrt(total/factor * width / height));
  const rows = Math.ceil(total/factor / cols);
  return {
    width: cols * squareSize + cols * offset,
    height: rows * squareSize + rows * offset,
    rows,
    cols,
    squareSize,
    offset
  };
}


function drawOtherCompaniesWaffle() {
  const data = waffleify(otherCompaniesAircrafts);
  
  const domain = data.map((d) => {return d.category})

  const factor = 100;
  const colorScale = d3.scaleOrdinal().domain(domain).range(d3.schemeTableau10)
  const dimensions = calculateWaffleDimensions(data, factor); 
  const svg = d3.select("#waffleChart")
    .attr('width', dimensions.width)
    .attr('height', dimensions.height);
  data.forEach((d) => {d.value = Math.round(d.value/factor)})

  const waffles = [];
  data.forEach((d) => {
    for(let i = 0; i< d.value; i++){
      waffles.push(d.category)
    }
  })

  let count = 0;
  for (var i = 0; i < dimensions.rows; i++) {
    for (var j = 0; j < dimensions.cols; j++) {
      const category = waffles[count];
      svg.append("rect")
        .attr("x", j * dimensions.squareSize + (j-1)*dimensions.offset + dimensions.offset)
        .attr("y", i * dimensions.squareSize + (i-1)*dimensions.offset + dimensions.offset)
        .attr("width", dimensions.squareSize)
        .attr("height", dimensions.squareSize)
        .style("fill", function () {
          return colorScale(category)
        })
        .style('opacity', function() {
          return category != undefined? 1: 0
        })
        .attr('stroke', 'black')
        .on("mouseover", function(m) { 
          d3.select(this).style('fill', 'rgb(96, 91, 91)')
          return showTooltip(m, category) })
        .on("mousemove", moveTooltip )
        .on("mouseleave", function() {
          d3.select(this).style('fill', 'rgb(59, 56, 56)')
          return hideTooltip()
        } )

      count++;
    }
  }
}

function drawTopCompaniesWaffle() {
  biggestCompaniesAircrafts.forEach((company) => {
  })
  // for (const companyAircrafts of biggestCompaniesAircrafts) {
  //   console.log(companyAircrafts.value);
  //   drawTopCompanyWaffle(waffleify(biggestCompaniesAircrafts.get(companyAircrafts)));
  // }
}

function drawTopCompanyWaffle(data) {
}

function waffleify(data){
  const newData = [];
  newData.push({category: "Autre", value:0});
  [...data.entries()].forEach((d) => {
    if(d[1] < 100){
      newData[0].value += d[1];
    }
    else {
      newData.push({category: d[0], value: d[1]})
    }
  })

  return newData;
}

  
function setTooltip(){
  d3.select("#viz4")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "black")
    .style("border-radius", "5px")
    .style("padding", "10px")
    .style("color", "white")
    .style('position', 'absolute')
}

const showTooltip = function(m, d) {
  const tooltip = d3.select('#viz4').select('.tooltip');
  tooltip
    .transition()
    .duration(100)
  tooltip
    .style("opacity", 1)
    .html(": " + d + " vols")
    .style("left", (m.x+30) + "px")
    .style("top", (m.y+30) + "px")
    .style('width', null)

}
const moveTooltip = function(m) {
  const tooltip = d3.select('#viz4').select('.tooltip');
  tooltip
    .style("left", (m.x+30) + "px")
    .style("top", (m.y+30) + "px")
}
const hideTooltip = function() {
  const tooltip = d3.select('#viz4').select('.tooltip');
  tooltip
    .style("opacity", 0)
}