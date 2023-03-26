import d3Tip from 'd3-tip'
import * as preprocess from './preprocess.js'

const BUCKET_HEIGHT = 300;
const BUCKET_WIDTH = 200;



export function displayBucketGraph(topCompanyNumber) {
  const companiesFlightArray = preprocess.getCompaniesFlightArray();
  const heightScale = createHeightScale(companiesFlightArray);
  const bottomBucket = [...companiesFlightArray];
  const topBucket = bottomBucket.splice(0, topCompanyNumber);

  setUpSlider()
  displayTopBucket(topBucket, heightScale);
  displayBottomBucket(bottomBucket, heightScale);
  setTooltips(); 
}

export function setUpSlider(){
  var	slider=document.getElementById("slider");
	var sliderValue=document.getElementById("slider-value");
	sliderValue.innerHTML=slider.value;
	slider.onchange=function(){
		sliderValue.innerHTML=this.value;
    d3.select('#topSVG').selectAll('*').remove();
    d3.select('#bottomSVG').selectAll('*').remove();
    displayBucketGraph(this.value);
	}
}

function displayTopBucket(topBucket, heightScale) {
  d3.select("#topSVG")
    .selectAll('.topCompany')
    .data(topBucket)
    .enter()
    .append('g')
    .attr('class', 'topCompany')
    .append('rect')
    .attr('y', function(c, index) {
      let y = BUCKET_HEIGHT;
      for(let i =0; i <= index; i++){
        y -= heightScale(topBucket[i][1])
      }
      return y;
    })
    .attr('fill', 'rgb(75, 115, 47)')
    .attr('height', function(c) { 
      return heightScale(c[1])})
    .attr('width', BUCKET_WIDTH)
    .attr('stroke', 'rgb(40, 63, 25)')
    .attr('stroke-width', '2px')
    .on("mouseover", function(m, d) {
      d3.select(this)
        .attr('fill', 'rgb(124, 191, 78)')
      return showTooltipTop(m, d) }
    )
    .on("mousemove", moveTooltip )
    .on("mouseleave", function() {
      d3.select(this)
        .attr('fill', 'rgb(75, 115, 47)')

      return hideTooltip()
    } )
  d3.selectAll('.topCompany')
    .append('text')
    .attr('y', function(c, index) {
      let y = BUCKET_HEIGHT;
      for(let i =0; i <= index; i++){
        y -= heightScale(topBucket[i][1])
      }
      y +=heightScale(c[1])/2
      console.log('hahahaah')
      return y;
    })
    .attr('x', function() {return BUCKET_WIDTH / 2})
    .attr('font-size', '18px')
    .attr('text-anchor', 'middle')
    .attr('fill', 'white')
    .style('pointer-events', 'none')
    .style('user-select', 'none')
    .text(function(c) {
      const height = heightScale(c[1]);
      if(height > 20){
        return c[0];
      }
      else if (height > 7) {
        return "..."
      }
      return ""
    })
}

function displayBottomBucket(bottomBucket, heightScale) {
  const height = heightScale(d3.sum(bottomBucket, function(c) {return c[1]}))
  let toolTipDisplay = ""
  let flightTotal = 0;
  for(let i = 0; i < 5; i++){
    toolTipDisplay += (i+1) + '.' + ' ' + bottomBucket[i][0] + ': ' + bottomBucket[i][1] + ' vols <br>'
    flightTotal += bottomBucket[i][1];
  }
  toolTipDisplay += '<br><b>Nombre total de vols: ' + flightTotal + ' vols</b>'
  d3.select("#bottomSVG")
    .append('g')
    .attr('width', BUCKET_WIDTH)
    .style('text-align', 'center')
    .attr('class', 'bottomCompany')
    .append('rect')
    .attr('y', function(c, index) {
      return BUCKET_HEIGHT - height;
    })
    .attr('fill', "rgb(59, 56, 56)")
    .attr('height', function(c) { 
      return height})
    .attr('width', BUCKET_WIDTH)
    .attr('stroke-width', '2px')
    .attr('stroke', 'rgb(44, 42, 42)')
    .on("mouseover", function(m) { 
      d3.select(this).style('fill', 'rgb(96, 91, 91)')
      
      return showTooltipBottom(m, toolTipDisplay) })
    .on("mousemove", moveTooltip )
    .on("mouseleave", function() {
      d3.select(this).style('fill', 'rgb(59, 56, 56)')
      return hideTooltip()
    } )
  d3.select('.bottomCompany').append('text').attr('y', function() {
      return BUCKET_HEIGHT - height/2;
    })
    .attr('x', function() {return BUCKET_WIDTH / 2})
    .attr('font-size', '18px')
    .attr('text-anchor', 'middle')
    .attr('fill', 'white')
    .style('pointer-events', 'none')
    .style('user-select', 'none')
    .text('Autres compagnies')
}

function createHeightScale (topCompanies) {
  const maxHeight = d3.sum(topCompanies, c => c[1])
  return d3.scaleLinear().domain([d3.min(topCompanies, function(d) {return d[1]}), maxHeight]).range([0, BUCKET_HEIGHT])
}

function setTooltips(){
  d3.select("#viz1")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "black")
    .style("border-radius", "5px")
    .style("padding", "10px")
    .style("color", "white")
    .style('position', 'absolute')
}

const showTooltipTop = function(m, d) {
  const tooltip = d3.select('#viz1').select('.tooltip');
  tooltip
    .transition()
    .duration(100)
  tooltip
    .style("opacity", 1)
    .html(d[0] + ": " + d[1])
    .style("left", (m.x+30) + "px")
    .style("top", (m.y+30) + "px")
    .style('width', null)

}
const showTooltipBottom = function(m, d) {
  const tooltip = d3.select('#viz1').select('.tooltip');

  tooltip
    .style("opacity", 1)
    .html("Prochaines 5 plus grandes compagnies: <br>" + d )
    .style("left", (m.x+30) + "px")
    .style("top", (m.y+30) + "px")
    .style('width', '300px')
}
const moveTooltip = function(m) {
  const tooltip = d3.select('#viz1').select('.tooltip');
  tooltip
    .style("left", (m.x+30) + "px")
    .style("top", (m.y+30) + "px")
}
const hideTooltip = function() {
  const tooltip = d3.select('#viz1').select('.tooltip');
  tooltip
    .style("opacity", 0)
}