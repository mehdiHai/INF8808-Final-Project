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
];

const width = 960;
const height = 500;

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

dataset.forEach((d) => {
  const sourceIndex = graph.nodes.findIndex(
    (node) => node.name === d.Airline
  );
  const targetIndex = graph.nodes.findIndex(
    (node) => node.name === d.Duration
  );

  const sourceNode = { name: d.Airline };
  const targetNode = { name: d.Duration };

  if (sourceIndex === -1) graph.nodes.push(sourceNode);
  if (targetIndex === -1) graph.nodes.push(targetNode);

  graph.links.push({
    source: sourceIndex === -1 ? sourceNode : graph.nodes[sourceIndex],
    target: targetIndex === -1 ? targetNode : graph.nodes[targetIndex],
    value: d.Count,
  });
});

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

