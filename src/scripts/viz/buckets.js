import * as preprocess from '../preprocess.js'
import * as alluvial from './alluvial.js'
import * as waffle from './waffles.js'

import Tooltip from '../tooltip.js'

const BUCKET_HEIGHT = 300;
const BUCKET_WIDTH = 200;

let tooltip = new Tooltip();

/**
 * Affichage des seaux
 */
export function displayBucketGraph() {
  const companiesFlightArray = preprocess.getCompaniesFlightArray();
  const heightScale = createHeightScale(companiesFlightArray);
  const bottomBucket = [...companiesFlightArray];
  const topBucket = preprocess.resizeTopCompagnies(bottomBucket);
  setUpSlider()
  displayTopBucket(topBucket, heightScale);
  displayBottomBucket(bottomBucket, heightScale);
  setAnimation()

}

/**
 * Mise à jour du slider des seaux et des visualisations
 * subséquentes à ce changement
 */
export function setUpSlider() {
  const	slider=document.getElementById("slider")
  const sliderValue=document.getElementById("slider-value")
  sliderValue.innerHTML=slider.value
  preprocess.filterAlluvialData()
	slider.oninput=function() {
      sliderValue.innerHTML=this.value
      d3.select('#topSVG').selectAll('*').remove()
      d3.select('#bottomSVG').selectAll('*').remove()
      preprocess.setTopCompaniesCount(this.value)
      displayBucketGraph()
      preprocess.filterAlluvialData()
      if(preprocess.getCompaniesAircraftsMap().length !== 0)
        waffle.modifyData();
    
	}
  alluvial.createAlluvialViz();
}

/**
 * Affiche le seau des plus grandes compagnies
 * @param {*} topBucket	objet contenant une liste de compagnies et leur nombre total de vols
 * @param {*} heightScale échelle d3 permettant de choisir la hauteur appropriée
 */
function displayTopBucket(topBucket, heightScale) {
  d3.select("#topSVG")
    .selectAll('.topCompany')
    .data(topBucket)
    .enter()
    .append('g')
    .attr('class', 'topCompany')
    .append('rect')
    .attr('class', 'bucket-tile')
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
      return tooltip.showTooltipTop(m, d) }
    )
    .on("mousemove", function(m) { return tooltip.moveTooltip(m) })
    .on("mouseleave", function() {
      d3.select(this)
        .attr('fill', 'rgb(75, 115, 47)')

      return tooltip.hideTooltip()
    } )
  d3.selectAll('.topCompany')
    .append('text')
    .attr('y', function(c, index) {
      let y = BUCKET_HEIGHT;
      for(let i =0; i <= index; i++){
        y -= heightScale(topBucket[i][1])
      }
      y +=heightScale(c[1])/2
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
      if(height > 22){
        return c[0];
      }
      else if (height > 7) {
        return "..."
      }
      return ""
    })
    .attr('dy', function() {
      return this.textContent === '...' ? null : '0.35em'
    })
}

/**
 * Affiche le seau des autres compagnies
 * @param {*} bottomBucket	objet contenant une liste de compagnies et leur nombre total de vols
 * @param {*} heightScale échelle d3 permettant de choisir la hauteur appropriée
 */
function displayBottomBucket(bottomBucket, heightScale) {
  const height = heightScale(d3.sum(bottomBucket, function(c) {return c[1]}))
  let toolTipDisplay = ""
  let flightTotal = 0;
  for (let i = 0; i < bottomBucket.length; i++) {
    if (i < 5)
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
    .attr('class', 'bucket-tile')
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
      return tooltip.showTooltipBottom(m, toolTipDisplay) })
    .on("mousemove", function(m) { return tooltip.moveTooltip(m) })
    .on("mouseleave", function() {
      d3.select(this).style('fill', 'rgb(59, 56, 56)')
      return tooltip.hideTooltip()
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

/**
 * Crée l'échelle d3 qui permet de choisir la hauteur appropriée d'une compagnie dans un seau
 * @param {*} topCompanies données pour lesquelles on crée une échelle de hauteur
 * @returns {*} l'échelle en question
 */
function createHeightScale (topCompanies) {
  const maxHeight = d3.sum(topCompanies, c => c[1])
  return d3.scaleLinear().domain([d3.min(topCompanies, function(d) {return d[1]}), maxHeight]).range([0, BUCKET_HEIGHT])
}

/**
 * Crée l'animation qui permet de lever et fermer le hublot contenant les noms des créateurs de ce projet
 */
function setAnimation() {
  const hublot = document.getElementById('right-hublot-cover');
  const lid = document.getElementById('lid');
  const handle = document.getElementById('handle');
  let open = false;
  document.getElementById('right-hublot').onclick = function () {
    if(!open) {
      hublot.classList.remove('closeLid');
      lid.classList.remove('pullHandle');
      handle.classList.remove('pullHandle');
      hublot.classList.add('openLid');
      lid.classList.add('liftHandle');
      handle.classList.add('liftHandle');
    }
    else {
      hublot.classList.remove('openLid');
      lid.classList.remove('liftHandle');
      handle.classList.remove('liftHandle');
      hublot.classList.add('closeLid');
      lid.classList.add('pullHandle');
      handle.classList.add('pullHandle');

    }
    open = !open;
    
  }
}