class SankeyDiagram {
  constructor(selector, data) {
    this.selector = selector;
    this.data = data;
    this.width = 500;
    this.height = 500;
    this.svg = d3.select(this.selector)
      .append("svg")
      .attr("width", this.width)
      .attr("height", this.height);
    this.sankey = d3.sankey()
      .nodeWidth(15)
      .nodePadding(10)
      .size([this.width, this.height]);
    this.graph = this.sankey({
      nodes: this.data.nodes,
      links: this.data.links
    });
  }

  // function to draw links between categories

  drawLinks() {
    this.svg.append("g")
      .attr("stroke", "#000")
      .selectAll("path")
      .data(this.graph.links)
      .join("path")
      .attr("d", d3.sankeyLinkHorizontal())
      .attr("stroke-width", d => Math.max(1, d.width))
      .classed("link", true);
  }

    // function to draw links between categories

  drawNodes() {
    const node = this.svg.append("g")
      .attr("stroke", "#000")
      .selectAll(".node")
      .data(this.graph.nodes)
      .join("g")
      .classed("node", true)
      .attr("transform", d => `translate(${d.x},${d.y})`);

    node.append("rect")
      .attr("height", d => d.dy)
      .attr("width", this.sankey.nodeWidth())
      .attr("fill", "#aaa")
      .attr("stroke", "#000");

    node.append("text")
      .attr("x", -6)
      .attr("y", d => d.dy / 2)
      .attr("dy", "0.35em")
      .attr("text-anchor", "end")
      .text(d => d.name)
      .filter(d => d.x < this.width / 2)
      .attr("x", 6 + this.sankey.nodeWidth())
      .attr("text-anchor", "start");
  }

  drawDiagram() {
    this.drawLinks();
    this.drawNodes();
  }
}

// Pseudo code to which we need to attach the real dataset

const data = {
  nodes: [
    {name: "Company"},
    {name: "Type"},
    {name: "Service"},
    {name: "Time Period"}
  ],
  links: [
    {source: 0, target: 1, value: 50},
    {source: 0, target: 2, value: 30},
    {source: 1, target: 2, value: 20},
    {source: 1, target: 3, value: 30},
    {source: 2, target: 3, value: 10}
  ]
};

const diagram = new SankeyDiagram("#chart", data);
diagram.drawDiagram();
