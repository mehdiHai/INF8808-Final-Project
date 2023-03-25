const BUCKET_HEIGHT = 300;
const BUCKET_WIDTH = 200;

export function getCompaniesFlightCount(data) {
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

export function displayBucketGraph(companiesFlightArray, topCompanyNumber, heightScale) {
  const bottomBucket = [...companiesFlightArray];
  const topBucket = bottomBucket.splice(0, topCompanyNumber);

  displayTopBucket(topBucket, heightScale);
  displayBottomBucket(bottomBucket, heightScale);
 
}
function displayTopBucket(topBucket, heightScale) {
  d3.select("#top").append('svg')
  .attr('class', 'topSVG')
  .attr('height', BUCKET_HEIGHT + 'px')
  .attr('width', BUCKET_WIDTH + 'px')
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
  .attr('height', function(c) { 
    return heightScale(c[1])})
  .attr('width', BUCKET_WIDTH)
}

function displayBottomBucket(bottomBucket, heightScale) {
  const height = heightScale(d3.sum(bottomBucket, function(c) {return c[1]}))
  d3.select("#bottom").append('svg')
    .attr('class', 'bottomSVG')
    .attr('height', BUCKET_HEIGHT + 'px')
    .attr('width', BUCKET_WIDTH + 'px')
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
  d3.select('.bottomCompany').append('text').attr('y', function() {
      return BUCKET_HEIGHT - height/2;
    })
    .attr('x', function() {return BUCKET_WIDTH / 2})
    .attr('font-size', '18px')
    .attr('text-anchor', 'middle')
    .text('Restes des compagnies')
}

export function createHeightScale (topCompanies) {
  const maxHeight = d3.sum(topCompanies, c => c[1])
  return d3.scaleLinear().domain([d3.min(topCompanies, function(d) {return d[1]}), maxHeight]).range([0, BUCKET_HEIGHT])
}
