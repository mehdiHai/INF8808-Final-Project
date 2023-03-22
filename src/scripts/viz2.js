import * as d3geo from 'd3-geo';

var airportCode = {}

function addArea(area) {

  d3.queue()
    .defer(d3.csv, "./" + area + "/airports" + area + ".csv")
    .defer(d3.csv, "./" + area + "/flights" + area + ".csv")
    .await(ready);

  function ready(error, localairports, localflights) {

    for (const item of localairports) {
      airportCode[item.airport] = projection([item.lon, item.lat]);
    }

    svg.selectAll('circle')
      .data(localairports)
      .join('circle')
      .attr('class', area)
      .attr("transform", d => `translate(${airportCode[d.airport]})`)
      .attr("r", 1)
      .style('fill', 'red')

    svg.selectAll('line')
      .data(localflights)
      .join('line')
      .transition()
      .duration(1000)
      .attr('class', area)
      .attr('x1', d => airportCode[d.airportIn][0])
      .attr('y1', d => airportCode[d.airportIn][1])
      .attr('x2', d => airportCode[d.airportOut][0])
      .attr('y2', d => airportCode[d.airportOut][1])
      .style('stroke-width', 1)
      .style('stroke', d => 'rgba(0, 0, 0, 0.1)')

  }

}


const area = "QC" // "WORLD" , "QC", "CA"

var projection = d3.geoProjection(function (x, y) {
  return [x, Math.log(Math.tan(Math.PI / 4 + y / 2))];
});
projection = d3geo.geoNaturalEarth1();

var svg = d3.select('#viz2')
  .append('svg')
  .attr("viewBox", "0 0 1000 1000")*

addArea("QC")

