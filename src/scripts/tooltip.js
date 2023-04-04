
export default class Tooltip {
    element;

    constructor() { 
        this.element = d3.select("body")
            .append("div")
            .style("opacity", 0)
            .attr("class", "tooltip")
            .style("background-color", "black")
            .style("border-radius", "5px")
            .style("padding", "10px")
            .style("color", "white")
            .style('position', 'absolute')        
    }

    showTooltipTop(m, d) {
        this.element
            .style("opacity", 1)
            .html(d[0] + ": " + d[1] + " vols")
            .style("left", (m.x + 30) + "px")
            .style("top", (m.pageY + 30) + "px")
            .style('width', null)

    }

    showTooltipBottom(m, d) {
        
        this.element
            .style("opacity", 1)
            .html("Prochaines 5 plus grandes compagnies: <br>" + d)
            .style("left", (m.x + 30) + "px")
            .style("top", (m.pageY + 30) + "px")
            .style('width', '300px')
    }


    showTooltipLink(m, source, target, value, level) {
        var text = "";

        switch(level) {
            case 0: 
                text = `${value} vols ${target}-courriers<br>effectués par ${source}`
                break;
            case 1:
                text = `${value} vols ${source}-courriers<br>effectués entre ${target}`
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
    }



    showTooltipNode(m, name, value, level) {
        var text = "";
        switch(level) {
            case 0: 
                text = `${value} vols effectués par ${name}`
                break;
            case 1:
                text = `${value} vols ${name}-courriers`
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
    }

    showTooltipAirport(m, d) {

        this.element
            .style("opacity", 0.7)
            .html(d[0] + "<br>" + d[2] + " - " + d[1] + "<br>"+ d[3] + " vols")
            .style("left", ((m.x > window.innerWidth * 0.5) ? (m.x - 90) : (m.x + 30)) + "px")
            .style("top", (m.pageY + 30) + "px")
    }

    showTooltipAircrafts(m, d) {

        this.element
            .style("opacity", 0.7)
            .html(d)
            .style("left", (m.x + 30) + "px")
            .style("top", (m.pageY + 30) + "px")
    }

    moveTooltip(m) {
        this.element
            .style("left", (m.x + 30) + "px")
            .style("top", (m.pageY + 30) + "px")
    }

    hideTooltip() {
        this.element.style("opacity", 0)
    }
}