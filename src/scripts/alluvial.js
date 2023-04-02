import * as preprocess from "./preprocess.js"

let sankeyData = [];
let alluvialData = [];

const graph = {
  nodes: [],
  links: [],
};

const width = 2000;
const height = 2000;

const svg = d3.select("#viz3")
  .append("svg").attr("id", "alluvialChart")
  .attr("width", width).attr("height", height);

const sankey = d3
  .sankey()
  .nodeSort(null)
  .nodeWidth(15)
  .nodePadding(10)
  .size([width, height]);

export function createAlluvialViz() {
  sankeyData = preprocess.getSankeyData();

  console.log('DATA RECEIVED')
  console.log(sankeyData)
  
  sankeyData.forEach((d) => {
    const sourceIndex = graph.nodes.findIndex(
      (node) => node.name === d.source
    );
    const targetIndex = graph.nodes.findIndex(
      (node) => node.name === d.target
    );
  
    const sourceNode = { name: d.source };
    const targetNode = { name: d.target };
  
    if (sourceIndex === -1) graph.nodes.push(sourceNode);
    if (targetIndex === -1) graph.nodes.push(targetNode);
  
    graph.links.push({
      source: sourceIndex === -1 ? sourceNode : graph.nodes[sourceIndex],
      target: targetIndex === -1 ? targetNode : graph.nodes[targetIndex],
      value: d.count,
    });
  });

  
  console.log(graph)
  sankey(graph);
  
  const node = svg
    .append("g")
    .selectAll(".node")
    .data(graph.nodes)
    .enter()
    .append("g")
    .attr("class", "node")
    .attr("transform", (d) => `translate(${d.x0},${d.y0})`);
  
  node
    .append("rect")
    .attr("height", (d) => d.y1 - d.y0)
    .attr("width", (d) => d.x1 - d.x0)
    .style("fill", "#a52a2a");
  
  node
    .append("text")
    .attr("x", (d) => (d.x0 < width / 2 ? 6 : -6))
    .attr("y", (d) => (d.y1 - d.y0) / 2)
    .attr("dy", "0.35em")
    .attr("text-anchor", (d) => (d.x0 < width / 2 ? "start" : "end"))
    .text((d) => d.name);
  
  const link = svg
    .append("g")
    .attr("fill", "none")
    .attr("stroke-opacity", 0.5)
    .selectAll("g")
    .data(graph.links)
    .join("g")
    .attr("stroke", "gray");
  
  link
    .attr("id", (d) => 'link-' + d.index)
    .append("path")
    .attr("d", d3.sankeyLinkHorizontal())
    .attr("stroke-width", (d) => Math.max(1, d.width))
    .on("mouseover", (event, d) => {
      showAlluvial(d.source.name, d.target.name);
    })
    .on("mouseout", (event, d) => {
      resetAlluvial();
    })
  
  link
    .append("title")
    .text(
      (d) =>
        `${d.source.name} → ${d.target.name}\n${d3.format(",.0f")(d.value)}`
    );
}

function showAlluvial(sourceName, targetName) {
  console.log(sourceName);
  console.log(targetName);
  alluvialData = preprocess.getAlluvialData();
  let filteredAlluvialData = []; 
  let filteredSankeyData = []; 

  // Filter the alluvialData to include only the relevant connections
  alluvialData.forEach((d) => {
    if (d['airline'] == sourceName || d['duration'] == sourceName || d['departureTime'] == sourceName || d['flightRange'] == sourceName) {
      if (d['airline'] == targetName || d['duration'] == targetName || d['departureTime'] == targetName || d['flightRange'] == targetName) {
        filteredAlluvialData.push(d);
      }
    }
  });

  console.log('FILTERED ALLUVIAL DATA');
  console.log(filteredAlluvialData);

  // Filter the sankeyData to include only the relevant connections
  filteredAlluvialData.forEach((ad) => {
    sankeyData.forEach((sd) => {
      if (sd['source'] == ad['airline'] || sd['source'] == ad['duration'] || sd['source'] == ad['departureTime'] || sd['source'] == ad['flightRange']) {
        if (sd['target'] == ad['airline'] || sd['target'] == ad['duration'] || sd['target'] == ad['departureTime'] || sd['target'] == ad['flightRange']) {
          if (!filteredSankeyData.includes(sd)) filteredSankeyData.push(sd);
        }
      }
    });
  });
  
  filteredSankeyData.forEach((sd) => {
    let sum = 0;
    filteredAlluvialData.forEach((ad) => {
      if ((ad['airline'] == sd['source'] && ad['duration'] == sd['target']) ||
          (ad['duration'] == sd['source'] && ad['departureTime'] == sd['target']) ||
          (ad['departureTime'] == sd['source'] && ad['flightRange'] == sd['target'])) {
        sum += parseInt(ad['count']);
      }
    });
    sd['count'] = sum;

    graph.links.forEach((link) => {
      if (link['source'].name == sd['source'] && link['target'].name == sd['target']) {
        const linkToModify = d3.select("#link-" + link.index);
        const linkPath = linkToModify.select("path");
        const colorPercentage = sd['count']/link['value'];

        linkPath.attr("stroke-opacity", 0.5)
          .attr("stroke", "red")
          .attr("stroke-width", (d) => Math.max(1, d.width*colorPercentage));
      }
    });
  });

  console.log('FILTERED SANKEY DATA');
  console.log(filteredSankeyData);
}

function resetAlluvial() {
  graph.links.forEach((link) => {
    const linkToModify = d3.select("#link-" + link.index);
    const linkPath = linkToModify.select("path");
    linkPath.attr("stroke", "gray")
      .attr("stroke-opacity", 0.5)
      .attr("stroke-width", (d) => Math.max(1, d.width));
  });
}