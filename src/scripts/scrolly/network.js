import Tooltip from '../tooltip';
import { groupByMainCompanies } from '../preprocess.js';

export default class Network {

  constructor(svg, ratio = 1) {
    this.tooltip = new Tooltip()
    this.ratio = ratio
    this.svg = svg;
    this.airportCode = {};
    this.levelGeo = { 1: "QC", 2: "CA", 3: "WORLD", 4: null, "QC": 1, "CA": 2, "WORLD": 3, null: 4 };
    this.ccolor = {
      "Africa": 'rgba(0, 0, 255,',
      "America": 'rgba(151, 18, 18,',
      "Europe": 'rgba(0, 255, 0,',
      "Asia": 'rgba(0, 255, 255,',
      "Oceania": 'rgba(255, 0, 255,'
    }
    this.currentGeo = "QC";
    this.limits = [];
    this.minMaxXGlobal = [1000000, 0];
    this.minMaxYGlobal = [1000000, 0];
  }

  scaleSize(data) {
    return 2 * (parseFloat(data) / 10E4 + Math.log(data) / 5);
  }

  displayAirports() {

    var readAirports = function (localairports) {

      var nb = 0
      var minMaxX = d3.extent(localairports, d => parseFloat(d.lat))
      var minMaxY = d3.extent(localairports, d => parseFloat(d.lon) / this.ratio)

      for (const item of localairports) {
        this.airportCode[item.airport] = [item.lat, item.lon / this.ratio]
         nb += 1;
      }

      minMaxX = [Math.min(minMaxX[0] - 10, this.minMaxXGlobal[0]), Math.max(minMaxX[1] + 10, this.minMaxXGlobal[1])]
      minMaxY = [Math.min(minMaxY[0] - 10, this.minMaxYGlobal[0]), Math.max(minMaxY[1] + 10, this.minMaxYGlobal[1])]

      if (this.limits[this.levelGeo[this.currentGeo]] === undefined) {
        this.limits[this.levelGeo[this.currentGeo]] = `${minMaxX[0]},${minMaxY[0]},${minMaxX[1] - minMaxX[0]},${minMaxY[1] - minMaxY[0]}`
      }

      this.minMaxXGlobal = minMaxX
      this.minMaxYGlobal = minMaxY

      var ratio2 = minMaxY[1] - minMaxY[0]

      for (let item in this.airportCode) {
        this.airportCode[item].lon = this.airportCode[item].lon * (this.ratio / ratio2);
      }

      var self = this

      this.svg.transition()
        .ease(d3.easePolyInOut)
        .duration(800)
        .attr("viewBox", this.limits[this.levelGeo[this.currentGeo]])
        .attr("transform-box", "content-box")

      var circles = this.svg.selectAll('airports')
        .data(localairports)
        .join('circle')

      if (this.currentGeo !== "WORLD") {
        circles.on("mouseover", function (m, data) {
          d3.select(this)
            .attr("r", d => 1.5 * self.scaleSize(d.freq))
            .attr('stroke-width', '.4')
          return self.tooltip.showTooltipAirport(m, [data.airport, data.sub, data.freq])
        })
          .on("mouseleave", function (e) {
            d3.select(this)
              .attr("r", d => self.scaleSize(d.freq))
              .attr('stroke-width', '.1')
            return self.tooltip.hideTooltip()
          })
      }

      circles.attr('stroke', 'black')
        .attr('stroke-width', '.1')
        .attr('class', d => this.currentGeo + " " + d.continent + " " + d.airport)
        .attr("transform", d => `translate(${this.airportCode[d.airport]})`)
        .attr("r", 0)
        .transition()
        .ease(d3.easeCubicOut)
        .delay(function (d, i) { return 100 * i / nb; })
        .duration(800)
        .attr("r", d => this.scaleSize(d.freq))
        .style('fill', d => (this.currentGeo == "QC") ? 'rgba(255, 0, 0, 0.6)' : (this.ccolor[d.continent] + ' 0.6)'))

      if (this.currentGeo === "WORLD") {

        var circlesTooltips = this.svg.selectAll('airports')
          .data(localairports)
          .join('circle')

        circlesTooltips.attr("r", d => Math.max(8, self.scaleSize(d.freq)))
          .attr("transform", d => `translate(${this.airportCode[d.airport]})`)
          .attr("opacity", 0)
          .on("mouseover", function (m, data) {
            d3.select("." + data.airport)
              .attr("r", 1.5 * self.scaleSize(data.freq))
              .attr('stroke-width', '.4')
            return self.tooltip.showTooltipAirport(m, [data.airport, data.sub, data.freq])
          })
          .on("mouseleave", function (m, data) {
            d3.select("." + data.airport).attr("r", d => Math.log(d.freq + 1) / 4)
              .attr('stroke-width', '.1')
            return self.tooltip.hideTooltip()
          })
      }

      this.currentGeo = this.levelGeo[this.levelGeo[this.currentGeo] + 1];
    }

    d3.csv(`./${this.currentGeo}/airports${this.currentGeo}.csv`)
      .then(readAirports.bind(this))
  }

  displayFlights() {

    var readFlights = function (localflights) {

      this.svg.selectAll('flights')
        .data(localflights)
        .join('line')
        .attr('class', this.currentGeo)
        .attr('x1', d => this.airportCode[d.airportIn][0])
        .attr('y1', d => this.airportCode[d.airportIn][1])
        .attr('x2', d => this.airportCode[d.airportIn][0])
        .attr('y2', d => this.airportCode[d.airportIn][1])
        .style('stroke-width', d => 2 * this.scaleSize(d.number))
        .transition()
        .ease(d3.easeCubicInOut)
        .duration(800)
        .attr('x2', d => this.airportCode[d.airportOut][0])
        .attr('y2', d => this.airportCode[d.airportOut][1])
        .style('stroke', d => (d.company === "OTHERS") ? 'rgba(255, 0, 0, 0.02)' : 'rgba(0, 0, 0, 0.2)')

      this.currentGeo = this.levelGeo[this.levelGeo[this.currentGeo] + 1];
      this.svg.selectAll('circle').raise()
    }

    this.currentGeo = this.levelGeo[this.levelGeo[this.currentGeo] - 1];
    d3.csv(`./${this.currentGeo}/flights${this.currentGeo}.csv`)
      .then(groupByMainCompanies)
      .then(readFlights.bind(this))
  }

  removeAirports(db = true) {
    this.currentGeo = this.levelGeo[this.levelGeo[this.currentGeo] - 1];

    if (db) {
      this.svg.transition()
      .duration(1000)
      .attr("viewBox", this.limits[this.levelGeo[this.currentGeo] - 1])
    }

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