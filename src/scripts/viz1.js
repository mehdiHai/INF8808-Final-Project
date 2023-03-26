import d3Tip from 'd3-tip'
import * as preprocess from './preprocess.js'

const BUCKET_HEIGHT = 300;
const BUCKET_WIDTH = 200;



export function displayBucketGraph(topCompanyNumber) {
  const companiesFlightArray = getCompaniesFlightCount(preprocess.getData())
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


function getCompaniesFlightCount(data) {
  const bigCompanies = new Map()
  data.forEach((d) => {
    if(!bigCompanies.get(d.opérateur)) {
      bigCompanies.set(d.opérateur, 1)
    }
    else {
      bigCompanies.set(d.opérateur, bigCompanies.get(d.opérateur) + 1)
    }
  })
  bigCompanies.delete('NULL')
  bigCompanies.delete('')
  fixSemanticBugs(bigCompanies)
  return [...bigCompanies.entries()].sort((a, b) => b[1] - a[1])
}

function fixSemanticBugs(bigCompanies){
  bigCompanies.set("AIR CANADA", bigCompanies.get("AIR CANADA ") + bigCompanies.get("AIR CANADA"))
  bigCompanies.delete("AIR CANADA ")
}


function displayTopBucket(topBucket, heightScale) {
  d3.select("#topSVG")
  .selectAll('.topCompany')
  .data(topBucket)
  .enter()
  .append('g')
  .append('rect')
  .attr('class', 'topCompany')
  .attr('y', function(c, index) {
    let y = BUCKET_HEIGHT;
    for(let i =0; i <= index; i++){
      y -= heightScale(topBucket[i][1])
    }
    return y;
  })
  .attr('fill', function(c, i) {
    if(i %2 == 0 ){
      return 'blue'
    }
    else {
      return 'red'
    }
  })
  .attr('fill-opacity', 0.7)
  .attr('height', function(c) { 
    return heightScale(c[1])})
  .attr('width', BUCKET_WIDTH)
  .on("mouseover", showTooltipTop )
  .on("mousemove", moveTooltip )
  .on("mouseleave", hideTooltip )
}

function displayBottomBucket(bottomBucket, heightScale) {
  const height = heightScale(d3.sum(bottomBucket, function(c) {return c[1]}))
  let top5Company = ""
  for(let i = 0; i < 5; i++){
    top5Company += (i+1) + '.' + ' ' + bottomBucket[i][0] + ': ' + bottomBucket[i][1] + ' vols <br>'
  }
  d3.select("#bottomSVG")
    .append('g')
    .attr('width', BUCKET_WIDTH)
    .style('text-align', 'center')
    .attr('class', 'bottomCompany')
    .append('rect')
    .attr('y', function(c, index) {
      return BUCKET_HEIGHT - height;
    })
    .attr('fill', "gray")
    .attr('height', function(c) { 
      return height})
    .attr('width', BUCKET_WIDTH)
    .on("mouseover", function(m) { return showTooltipBottom(m, top5Company) })
    .on("mousemove", moveTooltip )
    .on("mouseleave", hideTooltip )
  d3.select('.bottomCompany').append('text').attr('y', function() {
      return BUCKET_HEIGHT - height/2;
    })
    .attr('x', function() {return BUCKET_WIDTH / 2})
    .attr('font-size', '18px')
    .attr('text-anchor', 'middle')
    .style('pointer-events', 'none')
    .text('Restes des compagnies')
}

export function createHeightScale (topCompanies) {
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

var showTooltipTop = function(m, d) {
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
var showTooltipBottom = function(m, d) {
  const tooltip = d3.select('#viz1').select('.tooltip');

  tooltip
    .style("opacity", 1)
    .html("Prochaines 5 plus grandes compagnies: <br>" + d)
    .style("left", (m.x+30) + "px")
    .style("top", (m.y+30) + "px")
    .style('width', '300px')
}
var moveTooltip = function(m) {
  const tooltip = d3.select('#viz1').select('.tooltip');
  console.log(m.x);
  tooltip
    .style("left", (m.x+30) + "px")
    .style("top", (m.y+30) + "px")
}
var hideTooltip = function() {
  const tooltip = d3.select('#viz1').select('.tooltip');
  tooltip
    .style("opacity", 0)
}