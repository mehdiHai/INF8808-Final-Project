import scrollama from "scrollama";
import Network from "./scrolly/network.js";
import Tooltip from './tooltip';

// using d3 for convenience
var main = d3.select("main");
var scrolly = main.select("#scrolly");
var figure = scrolly.select("figure");
var article = scrolly.select("article");
var step = article.selectAll(".step");

var figureHeight = 4 * window.innerHeight / 5;

// initialize the scrollama
var scroller = scrollama();

const svg = d3.select('#viz2')
    .append('svg')

function handleResize() {

    const stepH = Math.floor(window.innerHeight * 0.75);
    step.style("height", stepH + "px");
    const figureMarginTop = (window.innerHeight - figureHeight) / 2;

    figure.style("height", figureHeight + "px")
        .style("top", figureMarginTop + "px");

    scroller.resize();
}

const figWidth = d3.select("figure")
    .node()
    .getBoundingClientRect()
    .width

const network = new Network(svg, figWidth / figureHeight);

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

function handleStepExit(response) {
    if (response.direction === 'up' && response.index === 0) {
        network.removeAirports(false);
    }
}

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