
export default class Tooltip {
    element;

    constructor(attachElement = "body") {
        this.element = d3.select(attachElement)
            .append("div")
            //.style("opacity", 0)
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

    addAirportLegendNetwork(level, text, color) {
        const svg = d3.select("#infoNetwork")
            .append('svg')
            .attr("class", "legAirport_" + level)

        svg.append("circle")
            .attr("r", 10)
            .attr("cx", 10)
            .attr("cy", 10)
            .attr("fill", color)
        svg.append("text")
            .text("Aéroport " + text)
            .attr("x", 30)
            .attr("y", 15)
    }

    delAirportLegendNetwork(level) {
        d3.selectAll(".legAirport_" + level).remove()
    }

    createLegendNetwork() {
        this.element
            .style("background", "rgba(255,255,255,0.5)")
            .style("left", 3 + "px")
            .style("top", 35 + "px")
            .style('width', '300px')
            .style('height', '500px')
            .attr('id', 'infoNetwork')
            //.attr("display","none")
            .style("opacity", 0)
    }

    showLegendNetwork() {
        this.element
            .style("opacity", 1)
            .style("display", "block")
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

    showTooltipAirport(m, d) {
        this.element
            .style("opacity", 0.7)
            .html(d[0] + "<br>" + d[2] + " - " + d[1] + "<br>" + d[3] + " vols")
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