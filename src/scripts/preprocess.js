import { values } from "d3";


/**
 * Sanitizes the names from the data in the "Player" column.
 *
 * Ensures each word in the name begins with an uppercase letter followed by lowercase letters.
 *
 * @param {object[]} data The dataset with unsanitized names
 * @returns {object[]} The dataset with properly capitalized names
 */
export function cleanNames (data) {
  data.map(cleanRow)
  return data
}


/**
 * Sanitizes the names from the data in the "Player" column.
 *
 * Ensures each word in the name begins with an uppercase letter followed by lowercase letters with memorization.
 *
 * @param {object[]} row A row of the dataset with unsanitized names
 * @returns {object[]} The row with properly capitalized names
 */
let convert_dict = {};

function cleanRow(row) {
  
  if ( !(row.Player in convert_dict)) {
    convert_dict[row.Player] = row.Player.split(/(\s+)/) // separation by blank
    .filter(item => item.trim()) // delete string with a single blank
    .reduce( (prev, item) => prev + " " + item[0] + item.slice(1).toLowerCase(), "") // change cases
    .slice(1); // remove first character : a blank
  }
  row.Player = convert_dict[row.Player];
  return row;
}


/**
 * Finds the names of the 5 players with the most lines in the play.
 *
 * @param {object[]} data The dataset containing all the lines of the play
 * @returns {string[]} The names of the top 5 players with most lines
 */
export function getTopPlayers (data) {

  var list_players = [];
  
  d3.group(data, d => d.Player).forEach( (value, key) => list_players.push([key, value.length]));

  return list_players.sort( (a, b) => b[1] - a[1]).slice(0, 5).map( (player) => player[0]);
}


/**
 * Transforms the data by nesting it, grouping by act and then by player, indicating the line count
 * for each player in each act.
 *
 * The resulting data structure ressembles the following :
 *
 * [
 *  { Act : ___,
 *    Players : [
 *     {
 *       Player : ___,
 *       Count : ___
 *     }, ...
 *    ]
 *  }, ...
 * ]
 *
 * The number of the act (starting at 1) follows the 'Act' key. The name of the player follows the
 * 'Player' key. The number of lines that player has in that act follows the 'Count' key.
 *
 * @param {object[]} data The dataset
 * @returns {object[]} The nested data set grouping the line count by player and by act
 */
export function summarizeLines (data) {

  let dico = [];
    /**
   * For an act, add the correct structure.
   * Warning : depends of dict "dico"
   * 
   * @param {object[]} value
   * @param {string[]} key
   */
  function createDict(value, act) {
    var local_dico = {Act: act, Players: []};
    value.forEach( (lines, name) => local_dico.Players.push({Player: name, Count: lines.length}));
    dico.push(local_dico)
  }

  d3.group(data, d => d.Act, d => d.Player).forEach(createDict);
  
  return dico;
}


/**
 * For each act, replaces the players not in the top 5 with a player named 'Other',
 * whose line count corresponds to the sum of lines uttered in the act by players other
 * than the top 5 players.
 *
 * @param {object[]} data The dataset containing the count of lines of all players
 * @param {string[]} top The names of the top 5 players with the most lines in the play
 * @returns {object[]} The dataset with players not in the top 5 summarized as 'Other'
 */
export function replaceOthers (data, top) {

  /**
   * Modifies a row of dataset to reduce data with 'Other' attribute.
   * Warning : depends of top parameter
   * 
   * @param {object[]} value
   * @param {string[]} key
   */
  function dataFilter(value, key) {
    let ttCount = value.Players.filter( x => ! top.includes(x.Player)).reduce( (prec, player) => prec + player.Count, 0)
    value.Players = value.Players.filter( x => top.includes(x.Player))
    value.Players.push({Player: "Other", Count: ttCount})
  }

  data.forEach(dataFilter);
  
  return data
}
