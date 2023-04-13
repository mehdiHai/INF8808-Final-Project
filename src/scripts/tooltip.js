
export default class Tooltip {
    element;

    constructor(attachElement = "body") {
        this.element = d3.select(attachElement)
            .append("div")
            .attr("class", "tooltip")
            .style("background-color", "black")
            .style("border-radius", "5px")
            .style("padding", "10px")
            .style("color", "white")
            .style('position', 'absolute')
            .style("display", "none")
    }

    showTooltipTop(m, d) {
        this.element
            .style("opacity", 1)
            .html(d[0] + ": " + d[1] + " vols")
            .style("left", (m.x + 30) + "px")
            .style("top", (m.pageY + 30) + "px")
            .style('width', null)
            .style("display", "block")
    }

    addAirportLegendNetwork(level, text, color, status=false) {
        const svg = this.element
            .select("#legAirportsBlock")
            .append('svg')
            .attr("class", "legAirport_" + level)
            .attr("height", "40px")
            .attr("visibility",  status ? "visible": "hidden")

        svg.append("circle")
            .transition()
            .duration(300)
            .attr("r", 9)
            .attr("cx", 10)
            .attr("cy", 10)
            .attr("fill", color)
            .attr('stroke', 'black')
            .attr('stroke-width', '1')

        svg.append("text")
            .transition()
            .duration(300)
            .text("Aéroport " + text)
            .attr("x", 30)
            .attr("y", 15)
    }

    delFlightLegendNetwork() {
        d3.selectAll(".legFlight")
            .transition()
            .duration(300)
            .remove()
    }

    addFlightLegendNetwork(text, color, status=false) {
        const svg = this.element
            .select("#legFlightsBlock")
            .append('svg')
            .attr("class", "legFlight")
            .attr("height", "40px")
            .attr("visibility", status ? "visible": "hidden")

        svg.append("rect")
            .transition()
            .duration(300)
            .attr("width", 30)
            .attr("height", 10)
            .attr("x", -5)
            .attr("y", 5)
            .attr("fill", color)

        svg.append("text")
            .transition()
            .duration(300)
            .text(text)
            .attr("x", 30)
            .attr("y", 15)
    }

    delAirportLegendNetwork(level) {
        d3.selectAll(".legAirport_" + level)
            .transition()
            .duration(300)
            .remove()
    }

    createLegendNetwork() {
        this.element
            .style("background", "rgba(0,0,0,0.2)")
            .style("left", "3px")
            .style("top", "60px")
            .style('width', "0px")
            .style('height', "500px")
            .attr('id', "infoNetwork")

        this.element
            .append("div")
            .attr("id", "legAirportsBlock")

        this.element.append('br')
        this.element.append('br')

        this.element
            .append("div")
            .attr("id", "legFlightsBlock")
    }

    showLegendNetwork() {
        this.element
            .transition()
            .ease(d3.easePolyInOut)
            .duration(300)
            .style("display", "block")
            .style("width", "300px")

        this.element
            .selectAll("* *")
            .transition()
            .delay(200)
            .ease(d3.easePolyInOut)
            .duration(300)
            .attr("visibility", "visible")

    }

    hiddenLegendNetwork() {
        this.element
            .transition()
            .ease(d3.easePolyInOut)
            .duration(300)
            .style("width", "0px")

        this.element
            .transition()
            .delay(200)
            .duration(0)
            .style("display", "none")

        this.element
            .selectAll("* *")
            .transition()
            .delay(100)
            .ease(d3.easePolyInOut)
            .duration(300)
            .attr("visibility", "hidden")
    }

    showTooltipBottom(m, d) {
        this.element
            .style("opacity", 1)
            .html("Prochaines 5 plus grandes compagnies: <br>" + d)
            .style("left", (m.x + 30) + "px")
            .style("top", (m.pageY + 30) + "px")
            .style('width', '300px')
            .style("display", "block")
    }


    showTooltipLink(m, source, target, value, level) {
        var text = "";

        switch(level) {
            case 0: 
                text = `${value} vols ${target.toLowerCase()}-courriers<br>effectués par ${source}`
                break;
            case 1:
                text = `${value} vols ${source.toLowerCase()}-courriers<br>effectués entre ${target}`
                break;
            case 2: 
                text = `${value} vols effectués<br>entre ${source} de desserte ${target}`
                break;
        }

        this.element
            .style("opacity", 0.7)
            .html(text)
            .style("left", (m.x + 30) + "px")
            .style("top", (m.pageY + 30) + "px")
            .style("display", "block")
    }



    showTooltipNode(m, name, value, level) {
        var text = "";
        switch(level) {
            case 0: 
                text = `${value} vols effectués par ${name}`
                break;
            case 1:
                text = `${value} vols ${name.toLowerCase()}-courriers`
                break;
            case 2: 
                text = `${value} vols effectués entre ${name}`
                break;
            default:
                text = `${value} vols de desserte ${name}`
                break;
        }

        this.element
            .style("opacity", 0.7)
            .html(text)
            .style("left", (m.x + 30) + "px")
            .style("top", (m.pageY + 30) + "px")
            .style("display", "block")
    }

    showTooltipAirport(m, d) {
        this.element
            .style("opacity", 0.7)
            .html(d[0] + "<br>" + d[2] + " - " + d[1] + "<br>"+ d[3] + " vols")
            .style("left", ((m.x > window.innerWidth * 0.5) ? (m.layerX - 90) : (m.layerX + 30)) + "px")
            .style("top", (m.layerY + 20) + "px")
            .style("display", "block")
    }

    showTooltipAircrafts(m, d) {

        this.element
            .style("opacity", 1)
            .html('Aéronef de type: ' + d.category + '<br>' + 'Quantité: ' + d.fraction + ' / ' + d.total)
            .style("left", (m.x + 30) + "px")
            .style("top", (m.pageY + 30) + "px")
            .style("display", "block")
    }

    moveTooltip(m) {
        this.element
            .style("left", (m.x + 30) + "px")
            .style("top", (m.pageY + 30) + "px")
    }

    hideTooltip() {
        this.element.style("display", "none")
    }
}