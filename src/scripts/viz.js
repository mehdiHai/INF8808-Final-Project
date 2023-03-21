
/**
 * Sets the domain and range of the X scale.
 *
 * @param {*} scale The x scale
 * @param {object[]} data The data to be used
 * @param {number} width The width of the graph
 */
export function updateGroupXScale (scale, data, width) {
  
  scale.domain(data.map(d => d.Act)).range([0, width])
}

/**
 * Sets the domain and range of the Y scale.
 *
 * @param {*} scale The Y scale
 * @param {object[]} data The data to be used
 * @param {number} height The height of the graph
 */
export function updateYScale (scale, data, height) {
  
  var maxLine = 0
  data.forEach( (act) => act.Players.forEach( (player) => maxLine = Math.max(player.Count, maxLine)))

  scale.domain([0, maxLine]).range([height, 0])
}

/**
 * Creates the groups for the grouped bar chart and appends them to the graph.
 * Each group corresponds to an act.
 *
 * @param {object[]} data The data to be used
 * @param {*} x The graph's x scale
 */
export function createGroups (data, x) {
  
  d3.select('#graph-g')
    .selectAll('.group')
    .data(data)
    .join('g')
    .attr('class', 'group')
    .attr('transform', data => 'translate(' + x(data.Act) + ')')
}

/**
 * Draws the bars inside the groups
 *
 * @param {*} y The graph's y scale
 * @param {*} xSubgroup The x scale to use to position the rectangles in the groups
 * @param {string[]} players The names of the players, each corresponding to a bar in each group
 * @param {number} height The height of the graph
 * @param {*} color The color scale for the bars
 * @param {*} tip The tooltip to show when each bar is hovered and hide when it's not
 */
export function drawBars (y, xSubgroup, players, height, color, tip) {

  d3.select('#graph-g')
    .selectAll('.group')
    .selectAll('rect')
    .data((actData) => {
      var val = actData.Players.map((playerData) => {
        playerData.Act = actData.Act
        return playerData
      })
      return val
    })
    .enter()
    .append('rect')
    .attr('x', (playerData) => xSubgroup(playerData.Player))
    .attr('y', (playerData) => y(playerData.Count))
    .attr('width', xSubgroup(players[1]) - xSubgroup(players[0]))
    .attr('height', (playerData) => height - y(playerData.Count))
    .attr('fill', (playerData) => color(playerData.Player))
    .on('mouseover', tip.show)
    .on('mouseout', tip.hide)
}
