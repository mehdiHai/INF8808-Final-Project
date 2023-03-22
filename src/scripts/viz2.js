import * as d3geo from 'd3-geo';

d3.queue()
  .defer(d3.csv, "./airports.csv")
  .defer(d3.csv, "./flights.csv")
  .await(ready);

function ready(error, airports, flights) {

  var projection = d3.geoProjection(function (x, y) {
    return [x, Math.log(Math.tan(Math.PI / 4 + y / 2))];
  });
  projection = d3geo.geoNaturalEarth1();


  var airportCode = {}
  for (const item of airports) {
    airportCode[item.airport] = projection([item.lon, item.lat]);
  }

  var svg = d3.select('#viz2')
    .append('svg')
    .attr("viewBox", "0 0 1000 1000")
  
  svg.selectAll('circle')
    .data(airports)
    .join('circle')
    .attr("transform", d => `translate(${airportCode[d.airport]})`)
    .attr("r", 1)
    .style('fill', 'red')

  svg.selectAll('line')
    .data(flights)
    .join('line')
    .attr('x1', d => airportCode[d.airportIn][0])
    .attr('y1', d => airportCode[d.airportIn][1])
    .attr('x2', d => airportCode[d.airportOut][0])
    .attr('y2', d => airportCode[d.airportOut][1])
    .style('stroke-width', 1)
    .style('stroke', d => 'rgba(0, 0, 0,' + d.number / 100 + ')')
    
}