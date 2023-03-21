import d3 from "d3"

/**
 * Defines the contents of the tooltip.
 *
 * @param {object} d The data associated to the hovered element
 * @returns {string} The tooltip contents
 */
export function getContents (d) {
  
  const toolTipContent = 
  `<div id='tooltip-title'>${d.target.__data__.Player}</div>` +
  "<br>" +
  `<div class='tooltip-value'>${d.target.__data__.Count} lines</div>`
  
  return toolTipContent
}
