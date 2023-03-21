import * as d3geo from 'd3-geo';

// chargement des données
d3.csv('./volsQuebec2022.csv').then(function (data, error) {
  //console.log(data)
  var Gen= d3.line()
  var svg = d3.select('#viz2').append('svg')
            .attr('height', '500px')
            .attr('width', '500px');
  var projection = d3.geoProjection(function (x, y) {
    return [x, Math.log(Math.tan(Math.PI / 4 + y / 2))];
  });
  projection=d3geo.geoNaturalEarth1();
  
  svg.selectAll('circle').data(data.slice(1,100)).join('circle')
    .attr("transform", d => `translate(${projection([d.longIn, d.latIn])})`)
    .attr("r", 3)
    .style('fill','red')
  
    svg.selectAll('line').data(data.slice(1,100)).join('line')
    //.attr("transform", d => `translate(${projection([d.longIn, d.latIn])})`)
    //.attr("r", 1)
    .attr('x1',d => projection([d.longIn, d.latIn])[0])
    .attr('y1',d => projection([d.longIn, d.latIn])[1])
    .attr('x2',d => projection([d.longOut, d.latOut])[0])
    .attr('y2',d => projection([d.longOut, d.latOut])[1])
    .style('stroke-width',1)
    .style('stroke','black')

})
/*
export function draw (data, color) {

  
  var d = d3.select('.legend')
  .selectAll('div')
  .data(data)
  .enter()
  .append('div')
  .attr('class', 'legend-element')

d.append('div')
  .attr('class', 'legend-element')
  .style('width', 15)
  .style('height', 15)
  .style('background-color', name => color(name))
  .style('border', "1px solid black")
  .style('display', 'inline-block')
  .style('margin-right', '3px')

d.append('text')
  .text(name => name);

}
*/