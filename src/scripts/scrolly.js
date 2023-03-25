import scrollama from "scrollama";
import Network from "./scrolly/network.js";

// using d3 for convenience
var main = d3.select("main");
var scrolly = main.select("#scrolly");
var figure = scrolly.select("figure");
var article = scrolly.select("article");
var step = article.selectAll(".step");

// initialize the scrollama
var scroller = scrollama();

var svg = d3.select('#viz2')
    .append('svg')
    //.attr("viewBox", "0 0 1000 1000")

// generic window resize listener event
function handleResize() {
    // 1. update height of step elements
    var stepH = Math.floor(window.innerHeight * 0.75);
    step.style("height", stepH + "px");

    var figureHeight = 4 * window.innerHeight / 5;
    var figureMarginTop = (window.innerHeight - figureHeight) / 2;

    figure.style("height", figureHeight + "px")
        .style("top", figureMarginTop + "px");

    // 3. tell scrollama to update new element dimensions
    scroller.resize();
}

var network = new Network(svg);
// scrollama event handlers
function handleStepEnter(response) {
    if (response.direction === 'down') {
        if (response.index%2 === 0) {
            network.displayAirports()
        }
        if (response.index%2 === 1) {
            // network.displayFlights()
        }
    } else {
        if ((response.index%2 === 1) && response.index != 5) {
            network.removeAirports()
        }
    }
    // add color to current step only
    step.classed("is-active", function (d, i) {
        return i === response.index;
    });

    // update graphic based on step
    figure.select("p").text(response.index + 1);
}

function handleStepExit(response) {
    if (response.direction === 'up' && response.index === 0) {
        network.removeAirports();
    }
}

function init() {

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

// kick things off
init();