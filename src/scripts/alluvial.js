// Fake dataset of test purpose 

const dataset = [
    { 
      Airline: "Airline A", 
      Duration: "short",
      DepartureTime: "morning",
      Type: "regional",
      Count: 1500
    },
    { 
      Airline: "Airline B", 
      Duration: "long",
      DepartureTime: "afternoon",
      Type: "national",
      Count: 3000
    },
    { 
      Airline: "Airline C", 
      Duration: "medium",
      DepartureTime: "evening",
      Type: "international",
      Count: 4500
    },
    { 
      Airline: "Airline D", 
      Duration: "short",
      DepartureTime: "night",
      Type: "regional",
      Count: 600
    },
    { 
      Airline: "Airline E", 
      Duration: "medium",
      DepartureTime: "morning",
      Type: "national",
      Count: 1200
    },
    { 
      Airline: "Airline F", 
      Duration: "long",
      DepartureTime: "evening",
      Type: "international",
      Count: 9000
    },
    { 
      Airline: "Airline G", 
      Duration: "short",
      DepartureTime: "afternoon",
      Type: "regional",
      Count: 800
    },
    { 
      Airline: "Airline H", 
      Duration: "long",
      DepartureTime: "night",
      Type: "national",
      Count: 1500
    },
    { 
      Airline: "Airline I", 
      Duration: "medium",
      DepartureTime: "morning",
      Type: "international",
      Count: 2000
    },
    { 
      Airline: "Airline J", 
      Duration: "short",
      DepartureTime: "evening",
      Type: "regional",
      Count: 1000
    }
  ];
  
// Load data from CSV file
    // Create a nested array with the data
    data = dataset
    var nested_data = d3.nest()
      .key(function(d) { return d.Airline; })
      .key(function(d) { return d.Duration; })
      .key(function(d) { return d.Departuretime; })
      .key(function(d) { return d.Type; })
      .rollup(function(v) { return d3.sum(v, function(d) { return d.Count; }); })
      .entries(data);
  
    // Convert nested data to alluvial diagram format
    var nodes = [];
    var links = [];
    nested_data.forEach(function(airline, airline_index) {
      var source_index = airline_index * 3;
      nodes.push({name: airline.key});
      airline.values.forEach(function(duration, duration_index) {
        var duration_name = duration.key;
        var target_index = source_index + duration_index;
        nodes.push({name: duration_name});
        duration.values.forEach(function(departure, departure_index) {
          var departure_name = departure.key;
          var target_index_2 = target_index + departure_index;
          nodes.push({name: departure_name});
          departure.values.forEach(function(type, type_index) {
            var type_name = type.key;
            var target_index_3 = target_index_2 + type_index;
            nodes.push({name: type_name});
            links.push({
              source: source_index,
              target: target_index,
              value: duration.value
            });
            links.push({
              source: target_index,
              target: target_index_2,
              value: departure.value
            });
            links.push({
              source: target_index_2,
              target: target_index_3,
              value: type.value
            });
          });
        });
      });
    });
  
    // Set up the alluvial diagram
    var margin = {top: 30, right: 10, bottom: 10, left: 10};
    var width = 960 - margin.left - margin.right;
    var height = 500 - margin.top - margin.bottom;
  
    var chart = d3.select("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  
    var sankey = d3.sankey()
      .nodeWidth(15)
      .nodePadding(10)
      .extent([[1, 1], [width - 1, height - 5]]);
  
    var {nodes, links} = sankey({
      nodes: nodes.map(d => Object.assign({}, d)),
      links: links.map(d => Object.assign({}, d))
    });

      // Draw the alluvial diagram
  chart.append("g")
  .selectAll("rect")
  .data(nodes)
  .join("rect")
  .attr("x", d => d.x0)
  .attr("y", d => d.y0)
  .attr("height", d => d.y1 - d.y0)
  .attr("width", d => d.x1 - d.x0)
  .attr("fill", "#ddd")
  .append("title")
  .text(d => `${d.name}\n${d.value.toLocaleString()}`);

chart.append("g")
  .attr("fill", "none")
  .selectAll("g")
  .data(links)
  .join("path")
  .attr("d", d3.sankeyLinkHorizontal())
  .attr("stroke", d => d.source.color)
  .attr("stroke-width", d => Math.max(1, d.width))
  .attr("stroke-opacity", 0.5)
  .append("title")
  .text(d => `${d.source.name} → ${d.target.name}\n${d.value.toLocaleString()}`);

chart.append("g")
  .style("font", "10px sans-serif")
  .selectAll("text")
  .data(nodes)
  .join("text")
  .attr("x", d => d.x0 < width / 2 ? d.x1 + 6 : d.x0 - 6)
  .attr("y", d => (d.y1 + d.y0) / 2)
  .attr("dy", "0.35em")
  .attr("text-anchor", d => d.x0 < width / 2 ? "start" : "end")
  .text(d => d.name)
  .append("tspan")
  .attr("fill-opacity", 0.7)
  .text(d => ` ${d.value.toLocaleString()}`);

