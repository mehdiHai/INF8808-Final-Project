import * as preprocess from "../preprocess.js"
import Tooltip from "../tooltip.js";

let sankeyData = [];
let alluvialData = [];

let graph = {
  nodes: [],
  links: [],
};

const width = 1500;
const height = 1000;

const tooltip = new Tooltip();

export function loadData() {
  d3.select("#viz3").on("mouseover", null)
  d3.csv('./alluvial_data.csv')
    .then(files => {
      preprocess.setAlluvialData(files[0]);
      createAlluvialViz();
    })
}

/* 
  A ajuster
*/
function extractTimes(name) {
  switch(name) {
    case "Matin":
      return "4h-10h"
    case "Après-midi":
      return "10h-16h"
    case "Soir":
      return "16h-22h"
    case "Nuit":
      return "22h-4h"
    case "International":
      return "internationale"
    case "Quebec":
      return "quebecoise"
    case "Canada":
      return "canadienne"
    default:
      return name
  }
}


export function createAlluvialViz() {

  sankeyData = preprocess.getSankeyData();

  graph.nodes = [];
  graph.links = [];

  d3.select("#alluvialChart").remove();

  const svg = d3.select("#viz3")
    .append("svg")
    .attr("id", "alluvialChart")
    .attr("width", "70%")

  const sankey = d3.sankey()
    .nodeSort(null)
    .nodeWidth(15)
    .nodePadding(10)
    .size([width, height]);

  sankeyData.forEach(d => {
    const sourceIndex = graph.nodes.findIndex(
      node => node.name === d.source
    );
    const targetIndex = graph.nodes.findIndex(
      node => node.name === d.target
    );

    const sourceNode = { name: d.source };
    const targetNode = { name: d.target };

    if (sourceIndex === -1) graph.nodes.push(sourceNode);
    if (targetIndex === -1) graph.nodes.push(targetNode);

    graph.links.push({
      source: sourceIndex === -1 ? sourceNode : graph.nodes[sourceIndex],
      target: targetIndex === -1 ? targetNode : graph.nodes[targetIndex],
      value: d.count,
      level: d.level
    });
  });

  sankey(graph);

  const node = svg.append("g")
    .selectAll(".node")
    .data(graph.nodes)
    .enter()
    .append("g")
    .attr("class", "node")
    .attr("transform", d => `translate(${d.x0},${d.y0})`);

  const lastNode = node.filter((d, i) => i === graph.nodes.length - 1);
  const lastNodeHeight = lastNode.node().getBoundingClientRect().height;

  node.append("rect")
    .attr("height", d => d.y1 - d.y0)
    .attr("width", d => d.x1 - d.x0)
    .on("mouseover", (event, d) => {
      showAlluvialNode(d.name);
      return tooltip.showTooltipNode(event, extractTimes(d.name), d.value, d.layer)
    })
    .on("mousemove", function(event) {
      return tooltip.moveTooltip(event)
    })
    .on("mouseout", function() {
      tooltip.hideTooltip()
      resetAlluvial()
    })
    .style("fill", "#a52a2a");

  node
    .append("text")
    .attr('class', 'alluvial-labels')
    .attr("x", d => d.x0 < width / 2 ? 25 : -10)
    .attr("y", d => (d.y1 - d.y0) / 2)
    .attr("dy", "0.35em")
    .style("padding-top", 10)
    .attr("text-anchor", d => d.x0 < width / 2 ? "start" : "end")
    .text(d => d.name)
    .style("font-size", "18px");

  const link = svg
    .append("g")
    .attr("fill", "none")
    .attr("stroke-opacity", 0.5)
    .selectAll("g")
    .data(graph.links)
    .join("g")
    .attr("stroke", "gray");

  link
    .attr("id", d => 'link-' + d.index)
    .append("path")
    .attr("d", d3.sankeyLinkHorizontal())
    .attr("stroke-width", d => Math.max(1, d.width))
    .on("mouseover", (event, d) => {
      showAlluvialLink(d.source.name, d.target.name);
      return tooltip.showTooltipLink(event, extractTimes(d.source.name), extractTimes(d.target.name), d.value, d.level)
    })
    .on("mouseout", resetAlluvial)

  // Get the bounding box of all the g elements
  const bbox = svg.select("g").node().getBBox();

  // Set the viewBox attribute on the svg element
  svg.attr("viewBox", `${bbox.x} ${bbox.y} ${bbox.width} ${bbox.height}`);
}


function highlightLinks(alluvialToHighlight, sankeyToHighlight) {


  graph.links.forEach(link => {
    const linkPath = d3.select("#link-" + link.index + " path");
    linkPath.attr("stroke-width", 0);
  });

  sankeyToHighlight.forEach(sd => {
    let sum = 0;
    alluvialToHighlight.forEach(ad => {
      if ((ad['airline'] == sd['source'] && ad['duration'] == sd['target']) ||
        (ad['duration'] == sd['source'] && ad['departureTime'] == sd['target']) ||
        (ad['departureTime'] == sd['source'] && ad['flightRange'] == sd['target'])) {
        sum += ad['count'];
      }
    });
    sd['count'] = sum;

    graph.links.forEach(link => {
      const linkPath =  d3.select("#link-" + link.index + " path");
      if (link['source'].name == sd['source'] && link['target'].name == sd['target']) {
        const colorPercentage = sd['count'] / link['value'];
        linkPath.attr("stroke-opacity", 0.5)
          .attr("stroke", "red")
          .attr("stroke-width", d => Math.max(1, d.width * colorPercentage))
          .on("mousemove", function(event) {
            return tooltip.moveTooltip(event)
          })
          .on("mouseout", function() {
            resetAlluvial();
            return tooltip.hideTooltip();
          })
          
      }
    });
  });
}

function showAlluvialLink(sourceName, targetName) {
  alluvialData = preprocess.getFilteredAlluvialData();
  let alluvialToHighlight = [];
  let sankeyToHighlight = [];

  // Filter the alluvialData to include only the relevant connections
  alluvialData.forEach(d => {
    const nameArray = [d['airline'], d['duration'], d['departureTime'], d['flightRange']]
    if ( nameArray.includes(sourceName) && nameArray.includes(targetName)) {
      alluvialToHighlight.push(d);
    }
  });

  // Filter the sankeyData to include only the relevant connections
  alluvialToHighlight.forEach(ad => {
    const nameArray = [ad['airline'], ad['duration'], ad['departureTime'], ad['flightRange']]
    sankeyData.forEach(sd => {
      if (nameArray.includes(sd['source']) && nameArray.includes(sd['target'])) {
        if (!sankeyToHighlight.includes(sd)) {
          sankeyToHighlight.push(sd);
        }
      }
    });
  });

  highlightLinks(alluvialToHighlight, sankeyToHighlight);
}

function showAlluvialNode(nodeName) {
  alluvialData = preprocess.getFilteredAlluvialData();
  let alluvialToHighlight = [];
  let sankeyToHighlight = [];

  // Filter the alluvialData to include only the relevant connections
  alluvialData.forEach(d => {
    const nameArray = [d['airline'], d['duration'], d['departureTime'], d['flightRange']]
    if (nameArray.includes(nodeName)) {
      alluvialToHighlight.push(d);
    }
  });

  // Filter the sankeyData to include only the relevant connections
  alluvialToHighlight.forEach(ad => {
    sankeyData.forEach(sd => {
      if ((sd['source'] == ad['airline'] && sd['target'] == ad['duration']) || (sd['source'] == ad['duration'] && sd['target'] == ad['departureTime']) ||
        (sd['source'] == ad['departureTime'] && sd['target'] == ad['flightRange'])) {
        if (!sankeyToHighlight.includes(sd)) {
          sankeyToHighlight.push(sd);
        }
      }
    });
  });

  highlightLinks(alluvialToHighlight, sankeyToHighlight);
}

function resetAlluvial() {
  graph.links.forEach(link => {
    const linkPath =  d3.select("#link-" + link.index + " path");
    linkPath.attr("stroke", "gray")
      .attr("stroke-opacity", 0.5)
      .attr("stroke-width", d => Math.max(1, d.width));
  });
}