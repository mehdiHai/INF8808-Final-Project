import * as d3geo from 'd3-geo';
import * as d3ease from 'd3-ease';

var airportCode = {}

function removeArea(area) {

  svg.selectAll('circle.' + area)
    .transition()
    .duration(1000)
    .attr("r", 0)
    .remove()

  svg.selectAll('line.' + area)
    .transition()
    .duration(1000)
    .style('stroke', 'rgba(0, 0, 0, 0.0)')
    .remove()

}

function addArea(area) {

  d3.queue()
    .defer(d3.csv, "./" + area + "/airports" + area + ".csv")
    .defer(d3.csv, "./" + area + "/flights" + area + ".csv")
    .await(ready);

  function ready(error, localairports, localflights) {

    var nb = 0
    for (const item of localairports) {
      airportCode[item.airport] = projection([item.lon, item.lat]);
      nb += 1
    }

    svg.selectAll('airports')
      .data(localairports)
      .join('circle')
      .attr('class', area)
      .attr("transform", d => `translate(${airportCode[d.airport]})`)
      .attr("r", 0)
      .style('fill', 'red')
      .transition()
      //.ease(d3.easeCubicInOut(0))
      .delay(function (d, i) { return 1000 * i / nb; })
      .duration(1000)
      .attr("r", 0.5)


    svg.selectAll('flights')
      .data(localflights)
      .join('line')
      .attr('class', area)
      .attr('x1', d => airportCode[d.airportIn][0])
      .attr('y1', d => airportCode[d.airportIn][1])
      .attr('x2', d => airportCode[d.airportIn][0])
      .attr('y2', d => airportCode[d.airportIn][1])
      .transition()
      .delay(1000)
      .duration(5000)
      .attr('x2', d => airportCode[d.airportOut][0])
      .attr('y2', d => airportCode[d.airportOut][1])
      .style('stroke-width', 0.5)
      .style('stroke', 'rgba(0, 0, 0, 0.1)')
  }

}


var projection = d3.geoProjection(function (x, y) {
  return [x, Math.log(Math.tan(Math.PI / 4 + y / 2))];
});
projection = d3geo.geoNaturalEarth1();

var svg = d3.select('#viz2')
  .append('svg')
  .attr("viewBox", "0 0 1000 1000")

var level = 0 // ie QC

/*
addArea("QC")
addArea("CA")
svg.on("click", (d) => {
  removeArea("CA")
});
*/
addArea("QC")
svg.on("click", (d) => {
  level += 1;
  if (level == 2) {
    addArea("CA")
  } else if (level == 3) {
    addArea("WORLD")
  }
})


/*
svg.on("click", (d) => {
  addArea("CA")
  svg.on("click", (d) => {
    addArea("WORLD")
  });
});
*/