import Tooltip from '../tooltip';
import * as preprocess from '../preprocess.js';

/**
 * Création d'un objet Network
 * @param {*} svg balise du DOM contenant le graphique généré
 * @param {integer} ratio rapport long/larg de la taille disponible
 */
export default class Network {

/**
 * Création d'un objet Network
 * @param {*} svg balise du DOM contenant le graphique généré
 * @param {integer} ratio rapport long/larg de la taille disponible
 */
  constructor(svg, ratio = 1) {
    this.tooltip = new Tooltip("#viz2")
    this.tooltipLegend = new Tooltip("#viz2")
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
    this.isFlightShow = false;

    this.createLegend();
  }

  /**
   * Affiche les différents aéroports d'un niveau 
   * @param {*} val valeur subissant la transformation
   */
  scaleSize(val) {
    return 2 * (parseFloat(val) / 10E4 + Math.log(val) / 5);
  }

  /**
   * Met à jour le status géographique courant 
   * @param {*} val valeur d'incrément
   */
  updateCurrentState(val) {
    this.currentGeo = this.levelGeo[this.levelGeo[this.currentGeo] + val];
  }


  /**
   * Affiche les différents aéroports d'un niveau 
   * donné selon l'état interne du système.
   */
  createLegend() {
    var self = this

    self.tooltipLegend.createLegendNetwork()
    var infoButtion_siCliked = false
    d3.select("#infoNetworkButton")
      .style("cursor", "help")
      .on("click", function () {
        infoButtion_siCliked = !infoButtion_siCliked;
        if (infoButtion_siCliked) {
          return self.tooltipLegend.showLegendNetwork();
        } else {
          return self.tooltipLegend.hiddenLegendNetwork();
        }
      }).on("mouseover", function () {
        d3.select(this).style("color", "blue")
      }).on("mouseleave", function () {
        d3.select(this).style("color", "black")
      })
  }

  createLegend() {
    var self = this

    self.tooltipLegend.createLegendNetwork()
    var infoButtion_siCliked = false
    d3.select("#infoNetworkButton")
      .style("cursor", "help")
      .on("click", function () {
        infoButtion_siCliked = !infoButtion_siCliked;
        if (infoButtion_siCliked) {
          return self.tooltipLegend.showLegendNetwork();
        } else {
          return self.tooltipLegend.hiddenLegendNetwork();
        }
      }).on("mouseover", function () {
        d3.select(this).style("color", "blue")
      }).on("mouseleave", function () {
        d3.select(this).style("color", "black")
      })
  }


  /**
   * Affiche les différents aéroports d'un niveau 
   * donné selon l'état interne du système.
   */
  displayAirports() {

    var readAirports = function (localairports) {

      switch (this.currentGeo) {
        case "QC":
          this.tooltipLegend.addAirportLegendNetwork(this.currentGeo, "québécois", 'rgba(255, 0, 0, 0.6)', this.isFlightShow);
          break;
        case "CA":
          this.tooltipLegend.addAirportLegendNetwork(this.currentGeo, "américain non québécois", this.ccolor['America'] + '0.6)', this.isFlightShow);
          break;
        case "WORLD":
          for (let cont of [["Africa", "africain"], ["Europe", "européen"], ["Asia", "asiatique"], ["Oceania", "océanien"]]) {
            this.tooltipLegend.addAirportLegendNetwork(this.currentGeo, cont[1], this.ccolor[cont[0]] + '0.6)', this.isFlightShow);
          }
          break;
      }

      var nb = localairports.length
      var minMaxX = d3.extent(localairports, d => parseFloat(d.lat))
      var minMaxY = d3.extent(localairports, d => parseFloat(d.lon) / this.ratio)
      // Mise à jour des données selon les dimensions de l'écran disponible
      localairports.forEach(item => this.airportCode[item.airport] = [parseFloat(item.lat), parseFloat(item.lon) / this.ratio])

      minMaxX = [Math.min(minMaxX[0] - 10, this.minMaxXGlobal[0]), Math.max(minMaxX[1] + 10, this.minMaxXGlobal[1])]
      minMaxY = [Math.min(minMaxY[0] - 10, this.minMaxYGlobal[0]), Math.max(minMaxY[1] + 10, this.minMaxYGlobal[1])]

      if (this.limits[this.levelGeo[this.currentGeo]] === undefined) {
        this.limits[this.levelGeo[this.currentGeo]] = `${minMaxX[0]},${minMaxY[0]},${minMaxX[1] - minMaxX[0]},${minMaxY[1] - minMaxY[0]}`
      }

      this.minMaxXGlobal, this.minMaxYGlobal = minMaxX, minMaxY

      var self = this

      this.svg.transition()
        .ease(d3.easePolyInOut)
        .duration(800)
        .attr("viewBox", this.limits[this.levelGeo[this.currentGeo]])
        .attr("transform-box", "content-box")

      // Gestion de l'affichage
      var circles = this.svg.selectAll('airports')
        .data(localairports)
        .join('circle')

      if (this.currentGeo !== "WORLD") {
        circles.on("mouseover", function (m, data) {
          d3.select(this)
            .attr("r", d => 1.5 * self.scaleSize(d.freq))
            .attr('stroke-width', '.4')
          return self.tooltip.showTooltipAirport(m, [data.airport, data.country, data.city, data.freq])
        })
          .on("mouseleave", function (e) {
            d3.select(this)
              .attr("r", d => self.scaleSize(d.freq))
              .attr('stroke-width', '.1')
            return self.tooltip.hideTooltip()
          })
      }

      // Affichage des cercles visibles
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

        // Création des cercles d'interaction, plus larges
        circlesTooltips.attr("r", d => Math.max(8, self.scaleSize(d.freq)))
          .attr("transform", d => `translate(${this.airportCode[d.airport]})`)
          .attr("opacity", 0)
          .attr("class", d => this.currentGeo + " " + d.continent + " " + d.airport + " tooltipsCircle")
          .on("mouseover", function (m, data) {
            d3.select("." + data.airport)
              .attr("r", 1.5 * self.scaleSize(data.freq))
              .attr('stroke-width', '.4')
            return self.tooltip.showTooltipAirport(m, [data.airport, data.country, data.city, data.freq])
          })
          .on("mouseleave", function (m, data) {
            d3.select("." + data.airport).attr("r", d => Math.log(d.freq + 1) / 4)
              .attr('stroke-width', '.1')
            return self.tooltip.hideTooltip()
          })
      }

      this.updateCurrentState(1)

    }

    d3.csv(`./${this.currentGeo}/airports${this.currentGeo}.csv`)
      .then(readAirports.bind(this))

  }

  /**
   * Affiche les différents vols d'un niveau 
   * donné selon l'état interne du système.
   */
  displayFlights() {

    var readFlights = function (localflights) {

      if (this.currentGeo == "QC") {
        this.isFlightShow = true;
        this.tooltipLegend.addFlightLegendNetwork("Vols des principales compagnies", 'rgba(0, 0, 0, 0.2)', this.isFlightShow);
        this.tooltipLegend.addFlightLegendNetwork("Autres vols", 'rgba(187, 40, 255, 0.2)', this.isFlightShow);
      }

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
        .style('stroke', d => (d.company !== "OTHERS") ? 'rgba(187, 40, 255, 0.2)' : 'rgba(0, 0, 0, 0.04)')

      this.updateCurrentState(1)
      this.svg.selectAll('circle').raise()
    }

    this.updateCurrentState(-1)
    d3.csv(`./${this.currentGeo}/flights${this.currentGeo}.csv`)
      .then(preprocess.groupByMainCompanies)
      .then(readFlights.bind(this))
  }

  /**
   * Supprime les différents aéroports d'un niveau 
   * donnée selon l'état interne du système.
   * @param {boolean} firstTransition permière transition
   */
  removeAirports(firstTransition = false) {
    this.updateCurrentState(-1)

    if (!firstTransition) {
      this.tooltipLegend.delAirportLegendNetwork(this.currentGeo)

      this.svg.transition()
        .duration(1000)
        .attr("viewBox", this.limits[this.levelGeo[this.currentGeo] - 1])

      this.svg.selectAll('circle.' + this.currentGeo)
        .transition()
        .duration(1000)
        .attr("r", 0)
        .remove()

    } else {
      // supprime l'ensemble des données affichées
      // Efface l'ensemble des données
      this.currentGeo = "QC";

      ["WORLD", "CA", "QC"].forEach(lvl => {
        this.tooltipLegend.delAirportLegendNetwork(lvl)

        this.svg.selectAll('line.' + lvl)
          .transition()
          .duration(1000)
          .style('stroke', 'rgba(0, 0, 0, 0.0)')
          .remove()

        this.svg.selectAll('circle.' + lvl)
          .transition()
          .duration(1000)
          .attr("r", 0)
          .remove()
      });
    }
  }

  /**
   * Supprime les différents vols d'un niveau 
   * donnée selon l'état interne du système.
   */
  removeFlights() {

    if (this.levelGeo[this.levelGeo[this.currentGeo] - 1] === "QC") {
      this.isFlightShow = true;
      this.tooltipLegend.delFlightLegendNetwork();
    }

    this.svg.selectAll('line.' + this.levelGeo[this.levelGeo[this.currentGeo] - 1])
      .transition()
      .duration(1000)
      .style('stroke', 'rgba(0, 0, 0, 0.0)')
      .remove()
  }
}