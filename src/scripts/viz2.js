import * as d3geo from 'd3-geo';
import * as d3geoproj from 'd3-geo-projection';

// chargement des données
d3.csv('./volsQuebec2022.csv').then(function (data, error) {
  //console.log(data)
  var Gen= d3.line()
  var svg = d3.select('#viz2').append('svg')
            .attr('height', '1000px')
            .attr('width', '1000px');
  var projection = d3.geoProjection(function (x, y) {
    return [x, Math.log(Math.tan(Math.PI / 4 + y / 2))];
  });


  //projection=d3geo.geoAzimuthalEqualArea();
  //projection=d3geo.geoOrthographic();
  var padding_long=73.7407989502;
  var padding_lat=-45.4706001282+45;
  projection=d3geoproj.geoGuyou();
  //projection=d3geoproj.geoCylindricalEqualArea();
  //projection.center([-73.7407989502,45.4706001282]);
  projection=projection.translate([250,250])
  svg.selectAll('circle').data(data.slice(1,1000)).join('circle')
    //.attr("transform", d => `translate(${projection([d.longIn+73.7407989502, d.latIn-45.4706001282])})`)
    .attr("transform",function(d){
      var long=parseFloat(d.longIn)+73.7407989502;
      var lat=parseFloat(d.latIn)-45.4706001282+45;
      //long=parseFloat(d.longIn);
      //lat=parseFloat(d.latIn);
      
      
      //console.log((long,lat));
      if(Math.abs(projection([long, lat])[0])>=projection([-180, lat])[0]){
        
        //console.log(projection([-180,-90]))
      }
      if(long/180>1){
        //long=-180+long%180;
      }
      if(lat/(-90)>1){
        //lat=90-lat%90;
      }
      return `translate(${projection([long, lat])})`
    })
    .attr("r", 3)
    .style('fill',function(d){
      if(d.subdOut=="Quebec"){
        if (d.aérDestin=="CYUL"){
          return 'green'
        }
        else{
        return 'blue'
        }
      }
      else{
        return 'red'
      }
    })
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
  
  
  svg.selectAll('line').data(data.slice(1,100)).join('line')
    //.attr("transform", d => `translate(${projection([d.longIn, d.latIn])})`)
    //.attr("r", 1)
    
    .attr('x1',d => projection([parseFloat(d.longIn)+padding_long, parseFloat(d.latIn)+padding_lat])[0])
    .attr('y1',d => projection([parseFloat(d.longIn)+padding_long, parseFloat(d.latIn)+padding_lat])[1])
    .attr('x2',d => projection([parseFloat(d.longOut)+padding_long, parseFloat(d.latOut)+padding_lat])[0])
    .attr('y2',d => projection([parseFloat(d.longOut)+padding_long, parseFloat(d.latOut)+padding_lat])[1])
    .style('stroke-width',1)
    .style('stroke','black')
    .style('opacity',0.3)
  
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