import * as d3geo from 'd3-geo';
import * as d3geoproj from 'd3-geo-projection';
import * as d3ease from 'd3-ease';

var airportCode = {}

// CREER CLASSE
//  DISPLAY LINE
//  DISPLAY POINTS
//  CLEAN LINE
//  CLEAN POINTS
//  LOAD DATA


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

function addArea(area, frac_bgn=0, frac_end=1) {

  d3.queue()
    .defer(d3.csv, "./" + area + "/airports" + area + ".csv")
    .defer(d3.csv, "./" + area + "/flights" + area + ".csv")
    .await(ready);

  function ready(error, localairports, localflights) {

    var nb = 0
    var padding_long=73.7407989502;
    var padding_lat=-45.4706001282+45;
    for (const item of localairports) {
      airportCode[item.airport] = projection([parseFloat(item.lon)+padding_long, parseFloat(item.lat)+padding_lat]);
      nb += 1
    }

    svg.selectAll('airports')
      .data(localairports.slice(frac_bgn * nb, frac_end * nb))
      .join('circle')
      .attr('class', area)
      .attr("transform", d => `translate(${airportCode[d.airport]})`)
      .attr("r", 0)
      .style('fill', 'red')
      .transition()
      //.ease(d3.easeCubicInOut(0))
      .delay(function (d, i) { return 1000 * i / nb; })
      .duration(1000)
      .attr("r", 1)
      

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
          .style('stroke-width', 0.1)
          .style('stroke', 'rgba(0, 0, 0, 0.1)')
          .style('opacity',0.2)
  }

  return frac_end;

}


var projection = d3.geoProjection(function (x, y) {
  return [x, Math.log(Math.tan(Math.PI / 4 + y / 2))];
});
projection = d3geo.geoNaturalEarth1();
projection=d3geoproj.geoGuyou()

var centerCoord = ({ lat: 46.179336122399526, lon: 6.145677500934902 })
//projection.center([-73.7407989502,45.4706001282])
projection.rotate(centerCoord)

var svg = d3.select('#viz2')
  .append('svg')
  .attr("viewBox", "0 0 1000 1000")
// Graticule
    
var geoGenerator = d3.geoPath()
.projection(projection);
var graticule = d3.geoGraticule();

svg.selectAll('path')
   .data([graticule()])
   .enter().append('path')
   .style("fill","none")
   .style('stroke','gray')
   .attr('d',geoGenerator)
   .exit().remove();

var level = 0 // ie QC
var up = 1

addArea("QC")
svg.on("click", (d) => {
  if (up == 1) {
    level += 1;
    if (level == 2) {
      addArea("CA")
    } else if (level == 3) {
      addArea("WORLD")
      up = 0
    }
  } else {
    level -= 1;
    if (level == 1) {
      removeArea("CA")
    } else if (level == 2) {
      removeArea("WORLD")
    } else {
      up = 0
    }
  }

})


/*
svg.call(
  d3.zoom()
    .on("zoom", x => zoomed(svg, x))
);

addArea("QC", 0, 20)

let scrollGlobal = 0
let rest = 0

function zoomed(svg) {
  if (d3.event) {
    let scrollLocal = d3.event.transform.k
    const dir = - Math.sign(d3.event.sourceEvent.wheelDelta)
    scrollLocal *= dir
    scrollGlobal += scrollLocal
    if (dir > 0) {
      if (scrollGlobal < 6 && scrollGlobal > 0) {
        let rest = addArea("CA", rest, Math.min(scrollGlobal / 6.0, 1))
      }
    } else {
      removeArea("CA")
      let rest = addArea("CA", 0, Math.max(scrollGlobal / 6.0, 0))
    }

    if (scrollGlobal > 6) {
      svg.selectAll('circle')
        .style('fill', 'green')
    }
  }
}
*/