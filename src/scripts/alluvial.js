export function createAlluvialViz(d) {
  let sankeyData = d;

  console.log('DATA RECEIVED')
  console.log(sankeyData)

  const dataset = [
    {
      Airline: "Airline A",
      Duration: "short",
      Departuretime: "morning",
      Type: "regional",
      Count: 1500,
    },
    {
      Airline: "Airline B",
      Duration: "long",
      Departuretime: "afternoon",
      Type: "national",
      Count: 3000,
    },
    {
      Airline: "Airline C",
      Duration: "medium",
      Departuretime: "evening",
      Type: "international",
      Count: 4500,
    },
    {
      Airline: "Airline C",
      Duration: "long",
      Departuretime: "evening",
      Type: "international",
      Count: 4500,
    },
  ];
  
  const width = 960;
  const height = 5000;
  
  const svg = d3.select("svg").attr("width", width).attr("height", height);
  
  const sankey = d3
    .sankey()
    .nodeSort(null)
    .nodeWidth(15)
    .nodePadding(10)
    .size([width, height]);
  
  const graph = {
    nodes: [],
    links: [],
  };
  
  sankeyData.forEach((d) => {
    const airlineIndex = graph.nodes.findIndex((node) => node.name === d.airline);
    const durationIndex = graph.nodes.findIndex((node) => node.name === d.duration);
    const departureTimeIndex = graph.nodes.findIndex((node) => node.name === d.departureTime);
    const flightRangeIndex = graph.nodes.findIndex((node) => node.name === d.flightRange);
  
    const airlineNode = { name: d.airline };
    const durationNode = { name: d.duration };
    const departureTimeNode = { name: d.departureTime };
    const flightRangeNode = { name: d.flightRange };
  
    if (airlineIndex === -1) graph.nodes.push(airlineNode);
    if (durationIndex === -1) {
      graph.nodes.push(durationNode);
      // add link from airline to duration
      graph.links.push({
        source: airlineNode,
        target: durationNode,
        value: 0,
      });
    }
    // if (departureTimeIndex === -1) {
    //   graph.nodes.push(departureTimeNode);
    //   // add link from duration to departureTime
    //   graph.links.push({
    //     source: durationNode,
    //     target: departureTimeNode,
    //     value: 0,
    //   });
    // }
    // if (flightRangeIndex === -1) {
    //   graph.nodes.push(flightRangeNode);
    //   // add link from departureTime to flightRange
    //   graph.links.push({
    //     source: departureTimeNode,
    //     target: flightRangeNode,
    //     value: 0,
    //   });
    // }
  
    graph.links.push({
      source: airlineIndex === -1 ? airlineNode : graph.nodes[airlineIndex],
      target: durationIndex === -1 ? durationNode : graph.nodes[durationIndex],
      value: d.count,
    });
  
    // graph.links.push({
    //   source: durationIndex === -1 ? durationNode : graph.nodes[durationIndex],
    //   target: departureTimeIndex === -1 ? departureTimeNode : graph.nodes[departureTimeIndex],
    //   value: 1,
    // });
  
    // graph.links.push({
    //   source: departureTimeIndex === -1 ? departureTimeNode : graph.nodes[departureTimeIndex],
    //   target: flightRangeIndex === -1 ? flightRangeNode : graph.nodes[flightRangeIndex],
    //   value: 1,
    // });
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
    .attr("fill", "gray");
  
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
    .append("path")
    .attr("d", d3.sankeyLinkHorizontal())
    .attr("stroke-width", (d) => Math.max(1, d.width));
  
  link
    .append("title")
    .text(
      (d) =>
        `${d.source.name} → ${d.target.name}\n${d3.format(",.0f")(d.value)}`
    );
}


