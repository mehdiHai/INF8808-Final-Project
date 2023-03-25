import * as d3geoproj from 'd3-geo-projection';

export default class Network {

  constructor(svg) {
    this.projection = d3geoproj.geoGuyou()
    this.projection.rotate({ lat: 46.179336122399526, lon: 6.145677500934902 })
    this.svg = svg;
    this.airportCode = {};
    this.levelGeo = { 1: "QC", 2: "CA", 3: "WORLD", 4: null, "QC": 1, "CA": 2, "WORLD": 3, null: 4 };
    this.color = {"QC": 'rgba(0, 255, 0,', "CA": 'rgba(255, 0, 0,', "WORLD": 'rgba(0, 0, 255,'};
    this.currentGeo = "QC";
    this.limits = [];
    this.minMaxXGlobal = [1000000, 0];
    this.minMaxYGlobal = [1000000, 0];
  }

  displayCpt() {
    console.log(this.currentGeo);
  }

  displayAirports() {

    var readAirports = function (error, localairports) {

      var nb = 0
      var padding = [73.7407989502, -45.4706001282 + 45];
      var minMaxX = [1000000, 0]
      var minMaxY = [1000000, 0]
      
      for (const item of localairports) {
        var pos = this.projection([parseFloat(item.lon) + padding[0], parseFloat(item.lat) + padding[1]]);
        this.airportCode[item.airport] = pos;
        minMaxX = [Math.min(pos[0], minMaxX[0]), Math.max(pos[0], minMaxX[1])]
        minMaxY = [Math.min(pos[1], minMaxY[0]), Math.max(pos[1], minMaxY[1])]
        nb += 1;
      }

      minMaxX = [Math.min(minMaxX[0] - 10, this.minMaxXGlobal[0]), Math.max(minMaxX[1] + 10, this.minMaxXGlobal[1])]
      minMaxY = [Math.min(minMaxY[0] - 10, this.minMaxYGlobal[0]), Math.max(minMaxY[1] + 10, this.minMaxYGlobal[1])]

      if (this.limits[this.levelGeo[this.currentGeo]] === undefined) {
        this.limits[this.levelGeo[this.currentGeo]] = minMaxX[0].toString() + "," + minMaxY[0].toString() + "," + (minMaxX[1] - minMaxX[0]).toString() + "," + (minMaxY[1] - minMaxY[0]).toString()
      }

      this.minMaxXGlobal = minMaxX
      this.minMaxYGlobal = minMaxY

      this.svg.transition()
        .ease(d3.easePolyInOut)
        .duration(800)
        .attr("viewBox", this.limits[this.levelGeo[this.currentGeo]])

      this.svg.selectAll('airports')
        .data(localairports)
        .join('circle')
        .on("mouseover", function(e){
          d3.select(this)
          .attr("r", d => Math.log(d.freq + 1) / 3)
          .attr('stroke-width', '.4')
          .style('fill', this.color[this.currentGeo] + ' 1)')
        })
        .on("mouseout", function(e){
          d3.select(this)
          .attr("r", d => Math.log(d.freq + 1) / 4)
          .attr('stroke-width', '.1')
          .style('fill', this.color[this.currentGeo] + ' 0.6)')
        })
        .attr('stroke', 'black')
        .attr('stroke-width', '.1')
        .attr('class', this.currentGeo)
        .attr("transform", d => `translate(${this.airportCode[d.airport]})`)
        .attr("r", 0)
        .transition()
        .ease(d3.easeCubicOut)
        .delay(function (d, i) { return 100 * i / nb; })
        .duration(800)
        .attr("r", d => Math.log(d.freq + 1) / 4)
        .style('fill', this.color[this.currentGeo] + ' 0.6)')

      this.currentGeo = this.levelGeo[this.levelGeo[this.currentGeo] + 1];
    }

    d3.queue()
      .defer(d3.csv, `./${this.currentGeo}/airports${this.currentGeo}.csv`)
      .await(readAirports.bind(this))
  }

  displayFlights() {

    var readFlights = function (error, localflights) {

      this.svg.selectAll('flights')
        .data(localflights)
        .join('line')
        .attr('class', this.currentGeo)
        .attr('x1', d => this.airportCode[d.airportIn][0])
        .attr('y1', d => this.airportCode[d.airportIn][1])
        .attr('x2', d => this.airportCode[d.airportIn][0])
        .attr('y2', d => this.airportCode[d.airportIn][1])
        .style('stroke-width', d => Math.log(d.number + 1)/3)
        .transition()
        .ease(d3.easeCubicInOut)
        .duration(800)
        .attr('x2', d => this.airportCode[d.airportOut][0])
        .attr('y2', d => this.airportCode[d.airportOut][1])
        .style('stroke', 'rgba(0, 0, 0, 0.1)')
      
      this.currentGeo = this.levelGeo[this.levelGeo[this.currentGeo] + 1];
      this.svg.selectAll('circle').raise()
    }

    this.currentGeo = this.levelGeo[this.levelGeo[this.currentGeo] - 1];

    d3.queue()
      .defer(d3.csv, `./${this.currentGeo}/flights${this.currentGeo}.csv`)
      .await(readFlights.bind(this))
  }

  removeAirports() {
    this.currentGeo = this.levelGeo[this.levelGeo[this.currentGeo] - 1];

    this.svg.transition()
      .duration(1000)
      .attr("viewBox", this.limits[this.levelGeo[this.currentGeo] - 1])

    this.svg.selectAll('circle.' + this.currentGeo)
      .transition()
      .duration(1000)
      .attr("r", 0)
      .remove()
  }

  removeFlights() {
    this.svg.selectAll('line.' + this.levelGeo[this.levelGeo[this.currentGeo] - 1])
      .transition()
      .duration(1000)
      .style('stroke', 'rgba(0, 0, 0, 0.0)')
      .remove()
  }
}