/**
 * Draws a legend in the area at the bottom of the screen, corresponding to the bars' colors
 *
 * @param {string[]} data The data to be used to draw the legend elements
 * @param {*} color The color scale used throughout the visualisation
 */
export function draw (data, color) {

  var d = d3.select('.legend')
  .selectAll('div')
  .data(data)
  .enter()
  .append('div')
  .attr('class', 'legend-element')

d.append('div')
  .attr('class', 'legend-element')
  .style('width', 15)
  .style('height', 15)
  .style('background-color', name => color(name))
  .style('border', "1px solid black")
  .style('display', 'inline-block')
  .style('margin-right', '3px')

d.append('text')
  .text(name => name);

}
