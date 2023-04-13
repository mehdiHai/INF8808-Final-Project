import scrollama from "../../node_modules/scrollama";
import Network from "./viz/network.js";

var scrolly = d3.select("#scrolly");
var figure = scrolly.select("figure");
var article = scrolly.select("article");
var step = article.selectAll(".step");

var figureHeight = 4 * window.innerHeight / 5;

// Initialise le scrolly-telling
var scroller = scrollama();

const svg = d3.select('#viz2')
    .append('svg')

const figWidth = d3.select("figure")
    .node()
    .getBoundingClientRect()
    .width

const network = new Network(svg, figWidth / figureHeight);

/**
 * Gère l'affichage des différents phases de la construction du réseau
 * @param {*} response phase du scrolling
 */
function handleStepEnter(response) {
    if (response.direction === 'down') {
        if (response.index % 2 === 0 && response.index !== 6) {
            network.displayAirports()
        } else if (response.index % 2 === 1) {
            network.displayFlights()
        }
    } else {
        if ((response.index % 2 === 1) && response.index !== 5) {
            network.removeAirports()
        } else if ((response.index % 2 === 0) && response.index !== 6) {
            network.removeFlights()
        }
    }
}

/**
* Redimensionne la visualisation à la taille de l'écran
*/
function handleResize() {
    const stepH = Math.floor(window.innerHeight * 0.75);
    step.style("height", stepH + "px");
    const figureMarginTop = (window.innerHeight - figureHeight) / 2;

    figure.style("height", figureHeight + "px")
        .style("top", figureMarginTop + "px");

    scroller.resize();
}

/**
 * Efface l'ensemble des données lors de la sortie 
 * du scrolly-telling par le haut
 * @param {*} response phase du scrolling
 */
function handleStepExit(response) {
    if (response.direction === 'up' && response.index === 0) {
        network.removeAirports(true);
    }
}


/**
 * Initialise la création du réseau
 */
export function initNetwork() {

    handleResize();
    scroller
        .setup({
            step: "#scrolly article .step",
            offset: 0.33,
            debug: false
        })
        .onStepExit(handleStepExit)
        .onStepEnter(handleStepEnter);
}