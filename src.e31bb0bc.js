// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"scripts/preprocess.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.filterAlluvialData = filterAlluvialData;
exports.getAlluvialData = getAlluvialData;
exports.getCompaniesAircraftsMap = getCompaniesAircraftsMap;
exports.getCompaniesFlightArray = getCompaniesFlightArray;
exports.getData = getData;
exports.getFilteredAlluvialData = getFilteredAlluvialData;
exports.getSankeyData = getSankeyData;
exports.getTopCompaniesCount = getTopCompaniesCount;
exports.groupByMainCompanies = groupByMainCompanies;
exports.resizeTopCompagnies = resizeTopCompagnies;
exports.setAlluvialData = setAlluvialData;
exports.setCompaniesAircraftsMap = setCompaniesAircraftsMap;
exports.setData = setData;
exports.setSankeyData = setSankeyData;
exports.setTopCompaniesCount = setTopCompaniesCount;
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
var data = [];
var sankeyData = [];
var alluvialData = [];
var filteredAlluvialData = [];
var companiesFlightArray = [];
var topCompaniesCount = 0;
var companiesAircrafts = [];
var topCompaniesSet = new Set();
function setData(newData) {
  data = newData;
  companiesFlightArray = setCompaniesFlightCount(data);
}
function setAlluvialData(data) {
  alluvialData = [];
  data.forEach(function (d) {
    alluvialData.push({
      airline: d.airline,
      duration: d.duration,
      departureTime: d.departureTime,
      flightRange: d.flightRange,
      count: parseInt(d.count)
    });
  });
}
function filterAlluvialData() {
  filteredAlluvialData = [];
  alluvialData.forEach(function (d) {
    var index = companiesFlightArray.findIndex(function (company) {
      return company[0] === d.airline;
    });
    if (index >= 0 && index < topCompaniesCount) {
      filteredAlluvialData.push(d);
    } else {
      var found = filteredAlluvialData.find(function (f) {
        return f.duration === d.duration && f.departureTime === d.departureTime && f.flightRange === d.flightRange && f.airline === 'OTHERS';
      });
      if (found) {
        found.count += d.count;
      } else {
        filteredAlluvialData.push({
          airline: 'OTHERS',
          duration: d.duration,
          departureTime: d.departureTime,
          flightRange: d.flightRange,
          count: d.count
        });
      }
    }
  });
  var index = companiesFlightArray.findIndex(function (company) {
    return company === 'OTHERS';
  });
  if (index >= 0 && index < topCompaniesCount) {
    var found = filteredAlluvialData.find(function (f) {
      return f.airline === 'OTHERS';
    });
    if (found) {
      found.count += otherCount;
    } else {
      filteredAlluvialData.push({
        airline: 'OTHERS',
        duration: '',
        departureTime: '',
        flightRange: '',
        count: otherCount
      });
    }
  }
  setSankeyData();
}
function setSankeyData() {
  // 'filteredAlluvialData' is the array of objects containing airline, duration, departureTime, and flightRange

  sankeyData = [];
  // count objects with same airline and duration
  var airlineDurationCounts = {};
  filteredAlluvialData.forEach(function (d) {
    var key = "".concat(d.airline, "_").concat(d.duration);
    if (!airlineDurationCounts[key]) {
      airlineDurationCounts[key] = 0;
    }
    airlineDurationCounts[key] += d.count;
  });

  // count objects with same duration and departureTime
  var durationDepartureCounts = {};
  filteredAlluvialData.forEach(function (d) {
    var key = "".concat(d.duration, "_").concat(d.departureTime);
    if (!durationDepartureCounts[key]) {
      durationDepartureCounts[key] = 0;
    }
    durationDepartureCounts[key] += d.count;
  });

  // count objects with same departureTime and flightRange
  var departureFlightCounts = {};
  filteredAlluvialData.forEach(function (d) {
    var key = "".concat(d.departureTime, "_").concat(d.flightRange);
    if (!departureFlightCounts[key]) {
      departureFlightCounts[key] = 0;
    }
    departureFlightCounts[key] += d.count;
  });
  Object.keys(airlineDurationCounts).forEach(function (key) {
    var _key$split = key.split('_'),
      _key$split2 = _slicedToArray(_key$split, 2),
      airline = _key$split2[0],
      duration = _key$split2[1];
    var source = airline;
    var target = duration;
    var count = airlineDurationCounts[key];
    sankeyData.push({
      source: source,
      target: target,
      count: count,
      level: 0
    });
  });
  Object.keys(durationDepartureCounts).forEach(function (key) {
    var _key$split3 = key.split('_'),
      _key$split4 = _slicedToArray(_key$split3, 2),
      duration = _key$split4[0],
      departureTime = _key$split4[1];
    var source = duration;
    var target = departureTime;
    var count = durationDepartureCounts[key];
    sankeyData.push({
      source: source,
      target: target,
      count: count,
      level: 1
    });
  });
  Object.keys(departureFlightCounts).forEach(function (key) {
    var _key$split5 = key.split('_'),
      _key$split6 = _slicedToArray(_key$split5, 2),
      departureTime = _key$split6[0],
      flightRange = _key$split6[1];
    var source = departureTime;
    var target = flightRange;
    var count = departureFlightCounts[key];
    sankeyData.push({
      source: source,
      target: target,
      count: count,
      level: 2
    });
  });
  return sankeyData;
}
function getData() {
  return _toConsumableArray(data);
}
function getSankeyData() {
  return _toConsumableArray(sankeyData);
}
function getAlluvialData() {
  return _toConsumableArray(alluvialData);
}
function getFilteredAlluvialData() {
  return _toConsumableArray(filteredAlluvialData);
}
function getCompaniesFlightArray() {
  return _toConsumableArray(companiesFlightArray);
}
function getTopCompaniesCount() {
  return topCompaniesCount;
}
function setTopCompaniesCount(count) {
  topCompaniesCount = count;
}
function getCompaniesAircraftsMap() {
  return companiesAircrafts;
}
function groupByMainCompanies(data) {
  var agg = new Map();
  data.forEach(function (x) {
    if (topCompaniesSet.has(x.company)) {} else {
      x.company = "OTHERS";
    }
    var key = [x.company, x.airportIn, x.airportOut];
    var keyBis = [x.company, x.airportOut, x.airportIn];
    if (agg.get(key)) {
      agg.set(key, agg.get(key) + parseFloat(x.number));
    } else if (agg.get(keyBis)) {
      agg.set(keyBis, agg.get(keyBis) + parseFloat(x.number));
    } else {
      agg.set(key, parseFloat(x.number));
    }
  });
  var flyArray = [];
  agg.forEach(function (value, key) {
    flyArray.push({
      company: key[0],
      airportIn: key[1],
      airportOut: key[2],
      number: value
    });
  });
  return new Promise(function (resolve, reject) {
    return resolve(flyArray);
  });
}
function resizeTopCompagnies(bottomBucket) {
  var selection = bottomBucket.splice(0, topCompaniesCount);
  selection.forEach(function (d) {
    return topCompaniesSet.add(d[0]);
  });
  return selection;
}
function setCompaniesFlightCount(data) {
  var topCompanies = new Map();
  data.forEach(function (d) {
    if (!topCompanies.get(d.company)) {
      topCompanies.set(d.company, parseFloat(d.number));
    } else {
      topCompanies.set(d.company, topCompanies.get(d.company) + parseFloat(d.number));
    }
  });
  topCompanies.delete('NULL');
  topCompanies.delete('');
  var numOthers = topCompanies.get("OTHERS");
  topCompanies.delete("OTHERS");
  var sortedCompanies = _toConsumableArray(topCompanies.entries()).sort(function (a, b) {
    return b[1] - a[1];
  });
  sortedCompanies.push(["OTHERS", numOthers]);
  return sortedCompanies;
}
function setCompaniesAircraftsMap(aircraftsData) {
  var aircrafts = new Map();
  aircraftsData.forEach(function (d) {
    var opName = d.company;
    if (opName == "" || opName == "NULL") return;
    if (!aircrafts.get(opName)) {
      if (opName) aircrafts.set(opName, new Map());
    }
    var type = d.type == '' || d.type == 'NULL' ? 'Inconnu' : d.type;
    if (!aircrafts.get(opName).get(type)) {
      aircrafts.get(opName).set(type, 1);
    } else {
      aircrafts.get(opName).set(type, aircrafts.get(opName).get(type) + 1);
    }
  });
  companiesAircrafts = aircrafts;
  return aircrafts;
}
},{}],"scripts/tooltip.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
var Tooltip = /*#__PURE__*/function () {
  function Tooltip() {
    _classCallCheck(this, Tooltip);
    _defineProperty(this, "element", void 0);
    this.element = d3.select("body").append("div").style("opacity", 0).attr("class", "tooltip").style("background-color", "black").style("border-radius", "5px").style("padding", "10px").style("color", "white").style('position', 'absolute');
  }
  _createClass(Tooltip, [{
    key: "showTooltipTop",
    value: function showTooltipTop(m, d) {
      this.element.style("opacity", 1).html(d[0] + ": " + d[1] + " vols").style("left", m.x + 30 + "px").style("top", m.pageY + 30 + "px").style('width', null);
    }
  }, {
    key: "showTooltipBottom",
    value: function showTooltipBottom(m, d) {
      this.element.style("opacity", 1).html("Prochaines 5 plus grandes compagnies: <br>" + d).style("left", m.x + 30 + "px").style("top", m.pageY + 30 + "px").style('width', '300px');
    }
  }, {
    key: "showTooltipLink",
    value: function showTooltipLink(m, source, target, value, level) {
      var text = "";
      switch (level) {
        case 0:
          text = "".concat(value, " vols ").concat(target, "-courriers<br>effectu\xE9s par ").concat(source);
          break;
        case 1:
          text = "".concat(value, " vols ").concat(source, "-courriers<br>effectu\xE9s entre ").concat(target);
          break;
        case 2:
          text = "".concat(value, " vols effectu\xE9s<br>entre ").concat(source, " de desserte ").concat(target);
          break;
      }
      this.element.style("opacity", 0.7).html(text).style("left", m.x + 30 + "px").style("top", m.pageY + 30 + "px");
    }
  }, {
    key: "showTooltipNode",
    value: function showTooltipNode(m, name, value, level) {
      var text = "";
      switch (level) {
        case 0:
          text = "".concat(value, " vols effectu\xE9s par ").concat(name);
          break;
        case 1:
          text = "".concat(value, " vols ").concat(name, "-courriers");
          break;
        case 2:
          text = "".concat(value, " vols effectu\xE9s entre ").concat(name);
          break;
        default:
          text = "".concat(value, " vols de desserte ").concat(name);
          break;
      }
      this.element.style("opacity", 0.7).html(text).style("left", m.x + 30 + "px").style("top", m.pageY + 30 + "px");
    }
  }, {
    key: "showTooltipAirport",
    value: function showTooltipAirport(m, d) {
      this.element.style("opacity", 0.7).html(d[0] + "<br>" + d[2] + " - " + d[1] + "<br>" + d[3] + " vols").style("left", (m.x > window.innerWidth * 0.5 ? m.x - 90 : m.x + 30) + "px").style("top", m.pageY + 30 + "px");
    }
  }, {
    key: "showTooltipAircrafts",
    value: function showTooltipAircrafts(m, d) {
      this.element.style("opacity", 1).html('Aéronef de type: ' + d.category + '<br>' + 'Quantité: ' + d.fraction + ' / ' + d.total).style("left", m.x + 30 + "px").style("top", m.pageY + 30 + "px");
    }
  }, {
    key: "moveTooltip",
    value: function moveTooltip(m) {
      this.element.style("left", m.x + 30 + "px").style("top", m.pageY + 30 + "px");
    }
  }, {
    key: "hideTooltip",
    value: function hideTooltip() {
      this.element.style("opacity", 0);
    }
  }]);
  return Tooltip;
}();
exports.default = Tooltip;
},{}],"scripts/viz4.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.drawWaffles = drawWaffles;
exports.initWaffle = initWaffle;
exports.loadData = loadData;
exports.modifyData = modifyData;
var preprocess = _interopRequireWildcard(require("./preprocess.js"));
var _tooltip = _interopRequireDefault(require("./tooltip.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
var biggestCompaniesAircrafts;
var otherCompaniesAircrafts;
var colorScale = {};
var FACTOR = 5;
var COLUMN_NUMBER = 25;
var SQUARE_SIZE = 20;
var INTERGAP_SPACE = 5;
var tooltip = new _tooltip.default();
function loadData() {
  d3.select("#viz4").on("mouseover", null);
  d3.csv('./aircrafts.csv').then(function (files) {
    preprocess.setCompaniesAircraftsMap(files);
    drawWaffles();
  });
}
function initWaffle() {
  d3.select("#viz4").on("mouseover", loadData);
}
function drawWaffles() {
  separateBigFromOthers();
  drawOtherCompaniesWaffle();
  drawTopCompaniesWaffles();
  addLegend();
}
function modifyData() {
  d3.select('#viz4').select('#topWaffles').remove();
  d3.select('#viz4').select('#otherWaffle').remove();
  d3.select('#viz4').select('.legend').remove();
  separateBigFromOthers();
  drawOtherCompaniesWaffle();
  drawTopCompaniesWaffles();
  addLegend();
}
function separateBigFromOthers() {
  var biggestCompaniesFlights = preprocess.getCompaniesFlightArray();
  var companiesAircrafts = preprocess.getCompaniesAircraftsMap();
  biggestCompaniesAircrafts = new Map();
  otherCompaniesAircrafts = new Map();
  biggestCompaniesFlights.forEach(function (d, index) {
    if (index < preprocess.getTopCompaniesCount()) biggestCompaniesAircrafts.set(d[0], companiesAircrafts.get(d[0]));else {
      var _iterator = _createForOfIteratorHelper(companiesAircrafts.get(d[0])),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var typeCount = _step.value;
          var name = typeCount[0];
          if (!otherCompaniesAircrafts.get(name)) otherCompaniesAircrafts.set(name, 0);
          otherCompaniesAircrafts.set(name, otherCompaniesAircrafts.get(name) + typeCount[1]);
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }
  });
}
function createScale(data) {
  var domain = data.map(function (d) {
    return d.category;
  });
  colorScale = d3.scaleOrdinal().domain(domain).range(d3.schemeCategory10);
}
function calculateWaffleDimensions(data, FACTOR) {
  var total = data.reduce(function (acc, d) {
    return acc + d.value;
  }, 0);
  // let cols = Math.floor(Math.sqrt(((total / FACTOR) * width) / height));
  //if(cols === 0) cols = 1
  var rows = Math.ceil(total / FACTOR / 25);
  otherCompaniesWaffleHeight = rows * SQUARE_SIZE + rows * INTERGAP_SPACE;
  return {
    width: COLUMN_NUMBER * SQUARE_SIZE + COLUMN_NUMBER * INTERGAP_SPACE,
    height: otherCompaniesWaffleHeight,
    rows: rows,
    cols: COLUMN_NUMBER,
    squareSize: SQUARE_SIZE,
    offset: INTERGAP_SPACE
  };
}
function drawOtherCompaniesWaffle() {
  var data = waffleify(otherCompaniesAircrafts);
  var div = d3.select("#viz4").append('div').attr('id', 'otherWaffle').append('div').attr('class', 'waffle');
  createScale(data);
  drawWaffle(data, div);
  d3.select("#otherWaffle").append('p').attr('class', 'waffleLabel').html("AUTRES COMPAGNIES");
}
function drawTopCompaniesWaffles() {
  d3.select("#viz4").append("div").attr('id', 'topWaffles');
  var index = 0;
  biggestCompaniesAircrafts.forEach(function (companyMap, name) {
    var div = d3.select("#topWaffles").append("div").attr("class", 'waffle');
    drawWaffle(waffleify(companyMap), div, index);
    d3.select("#topWaffles").append('p').attr('class', 'waffleLabel').html(name);
    index++;
  });
}
function waffleify(data) {
  var newData = [];
  _toConsumableArray(data.entries()).forEach(function (d) {
    newData.push({
      category: d[0],
      value: d[1]
    });
  });
  newData.sort(function (a, b) {
    return b.value - a.value;
  });
  var othersCount = 0;
  if (newData.length > 8) {
    for (var i = 8; i < newData.length; i++) {
      othersCount += newData[i].value;
    }
  }
  newData.splice(8, newData.length - 8);
  newData.push({
    category: "Autres",
    value: othersCount
  });
  var totalPark = 0;
  newData.forEach(function (d) {
    totalPark += d.value;
  });
  var waffles = [];
  newData.forEach(function (d) {
    for (var _i = 0; _i < Math.round(d.value / FACTOR); _i++) {
      waffles.push({
        category: d.category,
        fraction: d.value,
        total: totalPark
      });
    }
  });
  return waffles;
}
function drawWaffle(waffles, div, index) {
  div.selectAll('.block').data(waffles).enter().append('div').attr('background-image', 'url(\'img/plane-icon.png\')').attr('class', 'block').style('background-color', function (d) {
    return colorScale(d.category);
  }).on("mouseover", function (m, d) {
    tooltip.showTooltipAircrafts(m, d);
  });
  div.on("mousemove", function (m) {
    return tooltip.moveTooltip(m);
  }).on("mouseleave", function () {
    return tooltip.hideTooltip();
  });
}
function addLegend() {
  var legendContainer = d3.select('#viz4').append('svg').attr('class', 'legend').attr('height', '50').attr('width', function () {
    return colorScale.domain().length * 50 + 50;
  }).append('g').attr('class', 'legend-container').attr('transform', 'translate(10, 10)');
  var legendItems = legendContainer.selectAll('.legend-item').data(colorScale.domain()).enter().append('g').attr('class', 'legend-item').attr('transform', function (d, i) {
    return "translate(".concat(i * 50, ", 0)");
  });
  legendItems.append('rect').attr('width', 15).attr('height', 15).attr('margin-bottom', '3px').style('fill', function (d) {
    return colorScale(d);
  });
  legendItems.append('text').attr('x', 20).attr('y', 15).style('font-size', 'medium').text(function (d) {
    return d;
  });
}
},{"./preprocess.js":"scripts/preprocess.js","./tooltip.js":"scripts/tooltip.js"}],"scripts/alluvial.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createAlluvialViz = createAlluvialViz;
exports.initAlluvial = initAlluvial;
exports.loadData = loadData;
var preprocess = _interopRequireWildcard(require("./preprocess.js"));
var _tooltip = _interopRequireDefault(require("./tooltip.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
var sankeyData = [];
var alluvialData = [];
var graph = {
  nodes: [],
  links: []
};
var width = 1500;
var height = 1000;
var tooltip = new _tooltip.default();
function loadData() {
  d3.select("#viz3").on("mouseover", null);
  d3.csv('./alluvial_data.csv').then(function (files) {
    preprocess.setAlluvialData(files[0]);
    createAlluvialViz();
  });
}
function initAlluvial() {
  d3.select("#viz3").on("mouseover", loadData);
}

/* Ne correspond à rien 
A MODIFIER
*/
function extractTimes(name) {
  switch (name) {
    case "matin":
      return "4h-10h";
    case "après-midi":
      return "10h-16h";
    case "soire":
      return "16h-22h";
    case "nuit":
      return "22h-4h";
    default:
      return name;
  }
}
function createAlluvialViz() {
  sankeyData = preprocess.getSankeyData();
  graph.nodes = [];
  graph.links = [];
  d3.select("#alluvialChart").remove();
  var svg = d3.select("#viz3").append("svg").attr("id", "alluvialChart").attr("width", "70%").attr("height", "auto");
  var sankey = d3.sankey().nodeSort(null).nodeWidth(15).nodePadding(10).size([width, height]);
  sankeyData.forEach(function (d) {
    var sourceIndex = graph.nodes.findIndex(function (node) {
      return node.name === d.source;
    });
    var targetIndex = graph.nodes.findIndex(function (node) {
      return node.name === d.target;
    });
    var sourceNode = {
      name: d.source
    };
    var targetNode = {
      name: d.target
    };
    if (sourceIndex === -1) graph.nodes.push(sourceNode);
    if (targetIndex === -1) graph.nodes.push(targetNode);
    graph.links.push({
      source: sourceIndex === -1 ? sourceNode : graph.nodes[sourceIndex],
      target: targetIndex === -1 ? targetNode : graph.nodes[targetIndex],
      value: d.count,
      level: d.level
    });
  });
  sankey(graph);
  var node = svg.append("g").selectAll(".node").data(graph.nodes).enter().append("g").attr("class", "node").attr("transform", function (d) {
    return "translate(".concat(d.x0, ",").concat(d.y0, ")");
  });
  var lastNode = node.filter(function (d, i) {
    return i === graph.nodes.length - 1;
  });
  var lastNodeHeight = lastNode.node().getBoundingClientRect().height;
  svg.attr("height", height + lastNodeHeight);
  node.append("rect").attr("height", function (d) {
    return d.y1 - d.y0;
  }).attr("width", function (d) {
    return d.x1 - d.x0;
  }).on("mouseover", function (event, d) {
    showAlluvialNode(d.name);
    return tooltip.showTooltipNode(event, extractTimes(d.name), d.value, d.layer);
  }).on("mouseout", resetAlluvial).style("fill", "#a52a2a");
  node.append("text").attr("x", function (d) {
    return d.x0 < width / 2 ? 25 : -10;
  }).attr("y", function (d) {
    return (d.y1 - d.y0) / 2;
  }).attr("dy", "0.35em").style("padding-top", 10).attr("text-anchor", function (d) {
    return d.x0 < width / 2 ? "start" : "end";
  }).text(function (d) {
    return d.name;
  }).style("font-size", "18px");
  var link = svg.append("g").attr("fill", "none").attr("stroke-opacity", 0.5).selectAll("g").data(graph.links).join("g").attr("stroke", "gray");
  link.attr("id", function (d) {
    return 'link-' + d.index;
  }).append("path").attr("d", d3.sankeyLinkHorizontal()).attr("stroke-width", function (d) {
    return Math.max(1, d.width);
  }).on("mouseover", function (event, d) {
    showAlluvialLink(d.source.name, d.target.name);
    return tooltip.showTooltipLink(event, extractTimes(d.source.name), extractTimes(d.target.name), d.value, d.level);
  }).on("mouseout", resetAlluvial);

  // Get the bounding box of all the g elements
  var bbox = svg.select("g").node().getBBox();

  // Set the viewBox attribute on the svg element
  svg.attr("viewBox", "".concat(bbox.x, " ").concat(bbox.y, " ").concat(bbox.width, " ").concat(bbox.height));
}
function highlightLinks(alluvialToHighlight, sankeyToHighlight) {
  sankeyToHighlight.forEach(function (sd) {
    var sum = 0;
    alluvialToHighlight.forEach(function (ad) {
      if (ad['airline'] == sd['source'] && ad['duration'] == sd['target'] || ad['duration'] == sd['source'] && ad['departureTime'] == sd['target'] || ad['departureTime'] == sd['source'] && ad['flightRange'] == sd['target']) {
        sum += ad['count'];
      }
    });
    sd['count'] = sum;
    graph.links.forEach(function (link) {
      var linkToModify = d3.select("#link-" + link.index);
      var linkPath = linkToModify.select("path");
      if (link['source'].name == sd['source'] && link['target'].name == sd['target']) {
        var colorPercentage = sd['count'] / link['value'];
        linkPath.attr("stroke-opacity", 0.5).attr("stroke", "red").attr("stroke-width", function (d) {
          return Math.max(1, d.width * colorPercentage);
        });
      }
    });
  });
}
function showAlluvialLink(sourceName, targetName) {
  alluvialData = preprocess.getFilteredAlluvialData();
  var alluvialToHighlight = [];
  var sankeyToHighlight = [];

  // Filter the alluvialData to include only the relevant connections
  alluvialData.forEach(function (d) {
    var nameArray = [d['airline'], d['duration'], d['departureTime'], d['flightRange']];
    if (nameArray.includes(sourceName) && nameArray.includes(targetName)) {
      alluvialToHighlight.push(d);
    }
  });

  // Filter the sankeyData to include only the relevant connections
  alluvialToHighlight.forEach(function (ad) {
    var nameArray = [ad['airline'], ad['duration'], ad['departureTime'], ad['flightRange']];
    sankeyData.forEach(function (sd) {
      if (nameArray.includes(sd['source']) && nameArray.includes(sd['target'])) {
        if (!sankeyToHighlight.includes(sd)) {
          sankeyToHighlight.push(sd);
        }
      }
    });
  });
  highlightLinks(alluvialToHighlight, sankeyToHighlight);
}
function showAlluvialNode(nodeName) {
  alluvialData = preprocess.getFilteredAlluvialData();
  var alluvialToHighlight = [];
  var sankeyToHighlight = [];

  // Filter the alluvialData to include only the relevant connections
  alluvialData.forEach(function (d) {
    var nameArray = [d['airline'], d['duration'], d['departureTime'], d['flightRange']];
    if (nameArray.includes(nodeName)) {
      alluvialToHighlight.push(d);
    }
  });

  // Filter the sankeyData to include only the relevant connections
  alluvialToHighlight.forEach(function (ad) {
    sankeyData.forEach(function (sd) {
      if (sd['source'] == ad['airline'] && sd['target'] == ad['duration'] || sd['source'] == ad['duration'] && sd['target'] == ad['departureTime'] || sd['source'] == ad['departureTime'] && sd['target'] == ad['flightRange']) {
        if (!sankeyToHighlight.includes(sd)) {
          sankeyToHighlight.push(sd);
        }
      }
    });
  });
  highlightLinks(alluvialToHighlight, sankeyToHighlight);
}
function resetAlluvial() {
  graph.links.forEach(function (link) {
    var linkToModify = d3.select("#link-" + link.index);
    var linkPath = linkToModify.select("path");
    linkPath.attr("stroke", "gray").attr("stroke-opacity", 0.5).attr("stroke-width", function (d) {
      return Math.max(1, d.width);
    });
  });
}
},{"./preprocess.js":"scripts/preprocess.js","./tooltip.js":"scripts/tooltip.js"}],"scripts/viz1.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.displayBucketGraph = displayBucketGraph;
exports.setUpSlider = setUpSlider;
var preprocess = _interopRequireWildcard(require("./preprocess.js"));
var alluvial = _interopRequireWildcard(require("./alluvial.js"));
var waffle = _interopRequireWildcard(require("./viz4.js"));
var _tooltip = _interopRequireDefault(require("./tooltip.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
var BUCKET_HEIGHT = 300;
var BUCKET_WIDTH = 200;
var tooltip = new _tooltip.default();
function displayBucketGraph() {
  var companiesFlightArray = preprocess.getCompaniesFlightArray();
  var heightScale = createHeightScale(companiesFlightArray);
  var bottomBucket = _toConsumableArray(companiesFlightArray);
  var topBucket = preprocess.resizeTopCompagnies(bottomBucket);
  setUpSlider();
  displayTopBucket(topBucket, heightScale);
  displayBottomBucket(bottomBucket, heightScale);
}
function setUpSlider() {
  var slider = document.getElementById("slider");
  var sliderValue = document.getElementById("slider-value");
  sliderValue.innerHTML = slider.value;
  preprocess.filterAlluvialData();
  slider.oninput = function () {
    sliderValue.innerHTML = this.value;
    d3.select('#topSVG').selectAll('*').remove();
    d3.select('#bottomSVG').selectAll('*').remove();
    preprocess.setTopCompaniesCount(this.value);
    displayBucketGraph();
    preprocess.filterAlluvialData();
    if (preprocess.getCompaniesAircraftsMap().length != 0) waffle.modifyData();
  };
  alluvial.createAlluvialViz();
}
function displayTopBucket(topBucket, heightScale) {
  d3.select("#topSVG").selectAll('.topCompany').data(topBucket).enter().append('g').attr('class', 'topCompany').append('rect').attr('class', 'bucket-tile').attr('y', function (c, index) {
    var y = BUCKET_HEIGHT;
    for (var i = 0; i <= index; i++) {
      y -= heightScale(topBucket[i][1]);
    }
    return y;
  }).attr('fill', 'rgb(75, 115, 47)').attr('height', function (c) {
    return heightScale(c[1]);
  }).attr('width', BUCKET_WIDTH).attr('stroke', 'rgb(40, 63, 25)').attr('stroke-width', '2px').on("mouseover", function (m, d) {
    d3.select(this).attr('fill', 'rgb(124, 191, 78)');
    return tooltip.showTooltipTop(m, d);
  }).on("mousemove", function (m) {
    return tooltip.moveTooltip(m);
  }).on("mouseleave", function () {
    d3.select(this).attr('fill', 'rgb(75, 115, 47)');
    return tooltip.hideTooltip();
  });
  d3.selectAll('.topCompany').append('text').attr('y', function (c, index) {
    var y = BUCKET_HEIGHT;
    for (var i = 0; i <= index; i++) {
      y -= heightScale(topBucket[i][1]);
    }
    y += heightScale(c[1]) / 2;
    return y;
  }).attr('x', function () {
    return BUCKET_WIDTH / 2;
  }).attr('font-size', '18px').attr('text-anchor', 'middle').attr('fill', 'white').style('pointer-events', 'none').style('user-select', 'none').text(function (c) {
    var height = heightScale(c[1]);
    if (height > 22) {
      return c[0];
    } else if (height > 7) {
      return "...";
    }
    return "";
  });
}
function displayBottomBucket(bottomBucket, heightScale) {
  var height = heightScale(d3.sum(bottomBucket, function (c) {
    return c[1];
  }));
  var toolTipDisplay = "";
  var flightTotal = 0;
  for (var i = 0; i < 5; i++) {
    toolTipDisplay += i + 1 + '.' + ' ' + bottomBucket[i][0] + ': ' + bottomBucket[i][1] + ' vols <br>';
    flightTotal += bottomBucket[i][1];
  }
  toolTipDisplay += '<br><b>Nombre total de vols: ' + flightTotal + ' vols</b>';
  d3.select("#bottomSVG").append('g').attr('width', BUCKET_WIDTH).style('text-align', 'center').attr('class', 'bottomCompany').append('rect').attr('class', 'bucket-tile').attr('y', function (c, index) {
    return BUCKET_HEIGHT - height;
  }).attr('fill', "rgb(59, 56, 56)").attr('height', function (c) {
    return height;
  }).attr('width', BUCKET_WIDTH).attr('stroke-width', '2px').attr('stroke', 'rgb(44, 42, 42)').on("mouseover", function (m) {
    d3.select(this).style('fill', 'rgb(96, 91, 91)');
    return tooltip.showTooltipBottom(m, toolTipDisplay);
  }).on("mousemove", function (m) {
    return tooltip.moveTooltip(m);
  }).on("mouseleave", function () {
    d3.select(this).style('fill', 'rgb(59, 56, 56)');
    return tooltip.hideTooltip();
  });
  d3.select('.bottomCompany').append('text').attr('y', function () {
    return BUCKET_HEIGHT - height / 2;
  }).attr('x', function () {
    return BUCKET_WIDTH / 2;
  }).attr('font-size', '18px').attr('text-anchor', 'middle').attr('fill', 'white').style('pointer-events', 'none').style('user-select', 'none').text('Autres compagnies');
}
function createHeightScale(topCompanies) {
  var maxHeight = d3.sum(topCompanies, function (c) {
    return c[1];
  });
  return d3.scaleLinear().domain([d3.min(topCompanies, function (d) {
    return d[1];
  }), maxHeight]).range([0, BUCKET_HEIGHT]);
}
},{"./preprocess.js":"scripts/preprocess.js","./alluvial.js":"scripts/alluvial.js","./viz4.js":"scripts/viz4.js","./tooltip.js":"scripts/tooltip.js"}],"../node_modules/scrollama/build/scrollama.js":[function(require,module,exports) {
var define;
var global = arguments[3];
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.scrollama = factory());
}(this, (function () { 'use strict';

  // DOM helper functions

  // public
  function selectAll(selector, parent = document) {
    if (typeof selector === 'string') {
      return Array.from(parent.querySelectorAll(selector));
    } else if (selector instanceof Element) {
      return [selector];
    } else if (selector instanceof NodeList) {
      return Array.from(selector);
    } else if (selector instanceof Array) {
      return selector;
    }
    return [];
  }

  // SETUP
  function create(className) {
  	const el = document.createElement("div");
  	el.className = `scrollama__debug-step ${className}`;
  	el.style.position = "fixed";
  	el.style.left = "0";
  	el.style.width = "100%";
  	el.style.zIndex = "9999";
  	el.style.borderTop = "2px solid black";
  	el.style.borderBottom = "2px solid black";

  	const p = document.createElement("p");
  	p.style.position = "absolute";
  	p.style.left = "0";
  	p.style.height = "1px";
  	p.style.width = "100%";
  	p.style.borderTop = "1px dashed black";

  	el.appendChild(p);
  	document.body.appendChild(el);
  	return el;
  }

  // UPDATE
  function update({ id, step, marginTop }) {
  	const { index, height } = step;
  	const className = `scrollama__debug-step--${id}-${index}`;
  	let el = document.querySelector(`.${className}`);
  	if (!el) el = create(className);

  	el.style.top = `${marginTop * -1}px`;
  	el.style.height = `${height}px`;
  	el.querySelector("p").style.top = `${height / 2}px`;
  }

  function generateId() {
      const alphabet = "abcdefghijklmnopqrstuvwxyz";
      const date = Date.now();
      const result = [];
      for (let i = 0; i < 6; i += 1) {
        const char = alphabet[Math.floor(Math.random() * alphabet.length)];
        result.push(char);
      }
      return `${result.join("")}${date}`;
    }

  function err$1(msg) {
  	console.error(`scrollama error: ${msg}`);
  }

  function getIndex(node) {
  	return +node.getAttribute("data-scrollama-index");
  }

  function createProgressThreshold(height, threshold) {
      const count = Math.ceil(height / threshold);
      const t = [];
      const ratio = 1 / count;
      for (let i = 0; i < count + 1; i += 1) {
        t.push(i * ratio);
      }
      return t;
    }

  function parseOffset(x) {
  	if (typeof x === "string" && x.indexOf("px") > 0) {
  		const v = +x.replace("px", "");
  		if (!isNaN(v)) return { format: "pixels", value: v };
  		else {
  			err("offset value must be in 'px' format. Fallback to 0.5.");
  			return { format: "percent", value: 0.5 };
  		}
  	} else if (typeof x === "number" || !isNaN(+x)) {
  		if (x > 1) err("offset value is greater than 1. Fallback to 1.");
  		if (x < 0) err("offset value is lower than 0. Fallback to 0.");
  		return { format: "percent", value: Math.min(Math.max(0, x), 1) };
  	}
  	return null;
  }

  function indexSteps(steps) {
  	steps.forEach((step) =>
  		step.node.setAttribute("data-scrollama-index", step.index)
  	);
  }

  function getOffsetTop(node) {
    const { top } = node.getBoundingClientRect();
    const scrollTop = window.pageYOffset;
    const clientTop = document.body.clientTop || 0;
    return top + scrollTop - clientTop;
  }

  let currentScrollY;
  let comparisonScrollY;
  let direction;

  function onScroll(container) {
  	const scrollTop = container ? container.scrollTop : window.pageYOffset;

  	if (currentScrollY === scrollTop) return;
  	currentScrollY = scrollTop;
  	if (currentScrollY > comparisonScrollY) direction = "down";
  	else if (currentScrollY < comparisonScrollY) direction = "up";
  	comparisonScrollY = currentScrollY;
  }

  function setupScroll(container) {
  	currentScrollY = 0;
  	comparisonScrollY = 0;
  	document.addEventListener("scroll", () => onScroll(container));
  }

  function scrollama() {
  	let cb = {};

  	let id = generateId();
  	let steps = [];
  	let globalOffset;
  	let containerElement;
  	let rootElement;

  	let progressThreshold = 0;

  	let isEnabled = false;
  	let isProgress = false;
  	let isDebug = false;
  	let isTriggerOnce = false;

  	let exclude = [];

  	/* HELPERS */
  	function reset() {
  		cb = {
  			stepEnter: () => { },
  			stepExit: () => { },
  			stepProgress: () => { },
  		};
  		exclude = [];
  	}

  	function handleEnable(shouldEnable) {
  		if (shouldEnable && !isEnabled) updateObservers();
  		if (!shouldEnable && isEnabled) disconnectObservers();
  		isEnabled = shouldEnable;
  	}

  	/* NOTIFY CALLBACKS */
  	function notifyProgress(element, progress) {
  		const index = getIndex(element);
  		const step = steps[index];
  		if (progress !== undefined) step.progress = progress;
  		const response = { element, index, progress, direction };
  		if (step.state === "enter") cb.stepProgress(response);
  	}

  	function notifyStepEnter(element, check = true) {
  		const index = getIndex(element);
  		const step = steps[index];
  		const response = { element, index, direction };

  		step.direction = direction;
  		step.state = "enter";

  		// if (isPreserveOrder && check && direction !== "up")
  		//   notifyOthers(index, "above");
  		// if (isPreserveOrder && check && direction === "up")
  		//   notifyOthers(index, "below");

  		if (!exclude[index]) cb.stepEnter(response);
  		if (isTriggerOnce) exclude[index] = true;
  	}

  	function notifyStepExit(element, check = true) {
  		const index = getIndex(element);
  		const step = steps[index];

  		if (!step.state) return false;

  		const response = { element, index, direction };

  		if (isProgress) {
  			if (direction === "down" && step.progress < 1) notifyProgress(element, 1);
  			else if (direction === "up" && step.progress > 0)
  				notifyProgress(element, 0);
  		}

  		step.direction = direction;
  		step.state = "exit";

  		cb.stepExit(response);
  	}

  	/* OBSERVERS - HANDLING */
  	function resizeStep([entry]) {
  		const index = getIndex(entry.target);
  		const step = steps[index];
  		const h = entry.target.offsetHeight;
  		if (h !== step.height) {
  			step.height = h;
  			disconnectObserver(step);
  			updateStepObserver(step);
  			updateResizeObserver(step);
  		}
  	}

  	function intersectStep([entry]) {
  		onScroll(containerElement);

  		const { isIntersecting, target } = entry;
  		if (isIntersecting) notifyStepEnter(target);
  		else notifyStepExit(target);
  	}

  	function intersectProgress([entry]) {
  		const index = getIndex(entry.target);
  		const step = steps[index];
  		const { isIntersecting, intersectionRatio, target } = entry;
  		if (isIntersecting && step.state === "enter")
  			notifyProgress(target, intersectionRatio);
  	}

  	/*  OBSERVERS - CREATION */
  	function disconnectObserver({ observers }) {
  		Object.keys(observers).map((name) => {
  			observers[name].disconnect();
  		});
  	}

  	function disconnectObservers() {
  		steps.forEach(disconnectObserver);
  	}

  	function updateResizeObserver(step) {
  		const observer = new ResizeObserver(resizeStep);
  		observer.observe(step.node);
  		step.observers.resize = observer;
  	}

  	function updateResizeObservers() {
  		steps.forEach(updateResizeObserver);
  	}

  	function updateStepObserver(step) {
  		const h = window.innerHeight;
  		const off = step.offset || globalOffset;
  		const factor = off.format === "pixels" ? 1 : h;
  		const offset = off.value * factor;
  		const marginTop = step.height / 2 - offset;
  		const marginBottom = step.height / 2 - (h - offset);
  		const rootMargin = `${marginTop}px 0px ${marginBottom}px 0px`;
  		const root = rootElement;

  		const threshold = 0.5;
  		const options = { rootMargin, threshold, root };
  		const observer = new IntersectionObserver(intersectStep, options);

  		observer.observe(step.node);
  		step.observers.step = observer;

  		if (isDebug) update({ id, step, marginTop, marginBottom });
  	}

  	function updateStepObservers() {
  		steps.forEach(updateStepObserver);
  	}

  	function updateProgressObserver(step) {
  		const h = window.innerHeight;
  		const off = step.offset || globalOffset;
  		const factor = off.format === "pixels" ? 1 : h;
  		const offset = off.value * factor;
  		const marginTop = -offset + step.height;
  		const marginBottom = offset - h;
  		const rootMargin = `${marginTop}px 0px ${marginBottom}px 0px`;

  		const threshold = createProgressThreshold(step.height, progressThreshold);
  		const options = { rootMargin, threshold };
  		const observer = new IntersectionObserver(intersectProgress, options);

  		observer.observe(step.node);
  		step.observers.progress = observer;
  	}

  	function updateProgressObservers() {
  		steps.forEach(updateProgressObserver);
  	}

  	function updateObservers() {
  		disconnectObservers();
  		updateResizeObservers();
  		updateStepObservers();
  		if (isProgress) updateProgressObservers();
  	}

  	/* SETUP */
  	const S = {};

  	S.setup = ({
  		step,
  		parent,
  		offset = 0.5,
  		threshold = 4,
  		progress = false,
  		once = false,
  		debug = false,
  		container = undefined,
  		root = null
  	}) => {

  		setupScroll(container);

  		steps = selectAll(step, parent).map((node, index) => ({
  			index,
  			direction: undefined,
  			height: node.offsetHeight,
  			node,
  			observers: {},
  			offset: parseOffset(node.dataset.offset),
  			top: getOffsetTop(node),
  			progress: 0,
  			state: undefined,
  		}));

  		if (!steps.length) {
  			err$1("no step elements");
  			return S;
  		}

  		isProgress = progress;
  		isTriggerOnce = once;
  		isDebug = debug;
  		progressThreshold = Math.max(1, +threshold);
  		globalOffset = parseOffset(offset);
  		containerElement = container;
  		rootElement = root;

  		reset();
  		indexSteps(steps);
  		handleEnable(true);
  		return S;
  	};

  	S.enable = () => {
  		handleEnable(true);
  		return S;
  	};

  	S.disable = () => {
  		handleEnable(false);
  		return S;
  	};

  	S.destroy = () => {
  		handleEnable(false);
  		reset();
  		return S;
  	};

  	S.resize = () => {
  		updateObservers();
  		return S;
  	};

  	S.offset = (x) => {
  		if (x === null || x === undefined) return globalOffset.value;
  		globalOffset = parseOffset(x);
  		updateObservers();
  		return S;
  	};

  	S.onStepEnter = (f) => {
  		if (typeof f === "function") cb.stepEnter = f;
  		else err$1("onStepEnter requires a function");
  		return S;
  	};

  	S.onStepExit = (f) => {
  		if (typeof f === "function") cb.stepExit = f;
  		else err$1("onStepExit requires a function");
  		return S;
  	};

  	S.onStepProgress = (f) => {
  		if (typeof f === "function") cb.stepProgress = f;
  		else err$1("onStepProgress requires a function");
  		return S;
  	};
  	return S;
  }

  return scrollama;

})));

},{}],"scripts/scrolly/network.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _tooltip = _interopRequireDefault(require("../tooltip"));
var _preprocess = require("../preprocess.js");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
var Network = /*#__PURE__*/function () {
  function Network(svg) {
    var ratio = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
    _classCallCheck(this, Network);
    this.tooltip = new _tooltip.default();
    this.ratio = ratio;
    this.svg = svg;
    this.airportCode = {};
    this.levelGeo = {
      1: "QC",
      2: "CA",
      3: "WORLD",
      4: null,
      "QC": 1,
      "CA": 2,
      "WORLD": 3,
      null: 4
    };
    this.ccolor = {
      "Africa": 'rgba(0, 0, 255,',
      "America": 'rgba(151, 18, 18,',
      "Europe": 'rgba(0, 255, 0,',
      "Asia": 'rgba(0, 255, 255,',
      "Oceania": 'rgba(255, 0, 255,'
    };
    this.currentGeo = "QC";
    this.limits = [];
    this.minMaxXGlobal = [1000000, 0];
    this.minMaxYGlobal = [1000000, 0];
  }
  _createClass(Network, [{
    key: "scaleSize",
    value: function scaleSize(data) {
      return 2 * (parseFloat(data) / 10E4 + Math.log(data) / 5);
    }
  }, {
    key: "displayAirports",
    value: function displayAirports() {
      var readAirports = function readAirports(localairports) {
        var _this = this;
        var nb = localairports.length;
        var minMaxX = d3.extent(localairports, function (d) {
          return parseFloat(d.lat);
        });
        var minMaxY = d3.extent(localairports, function (d) {
          return parseFloat(d.lon) / _this.ratio;
        });
        localairports.forEach(function (item) {
          return _this.airportCode[item.airport] = [parseFloat(item.lat), parseFloat(item.lon) / _this.ratio];
        });
        minMaxX = [Math.min(minMaxX[0] - 10, this.minMaxXGlobal[0]), Math.max(minMaxX[1] + 10, this.minMaxXGlobal[1])];
        minMaxY = [Math.min(minMaxY[0] - 10, this.minMaxYGlobal[0]), Math.max(minMaxY[1] + 10, this.minMaxYGlobal[1])];
        if (this.limits[this.levelGeo[this.currentGeo]] === undefined) {
          this.limits[this.levelGeo[this.currentGeo]] = "".concat(minMaxX[0], ",").concat(minMaxY[0], ",").concat(minMaxX[1] - minMaxX[0], ",").concat(minMaxY[1] - minMaxY[0]);
        }
        this.minMaxXGlobal, this.minMaxYGlobal = minMaxX, minMaxY;
        var self = this;
        this.svg.transition().ease(d3.easePolyInOut).duration(800).attr("viewBox", this.limits[this.levelGeo[this.currentGeo]]).attr("transform-box", "content-box");
        var circles = this.svg.selectAll('airports').data(localairports).join('circle');
        if (this.currentGeo !== "WORLD") {
          circles.on("mouseover", function (m, data) {
            d3.select(this).attr("r", function (d) {
              return 1.5 * self.scaleSize(d.freq);
            }).attr('stroke-width', '.4');
            return self.tooltip.showTooltipAirport(m, [data.airport, data.country, data.city, data.freq]);
          }).on("mouseleave", function (e) {
            d3.select(this).attr("r", function (d) {
              return self.scaleSize(d.freq);
            }).attr('stroke-width', '.1');
            return self.tooltip.hideTooltip();
          });
        }
        circles.attr('stroke', 'black').attr('stroke-width', '.1').attr('class', function (d) {
          return _this.currentGeo + " " + d.continent + " " + d.airport;
        }).attr("transform", function (d) {
          return "translate(".concat(_this.airportCode[d.airport], ")");
        }).attr("r", 0).transition().ease(d3.easeCubicOut).delay(function (d, i) {
          return 100 * i / nb;
        }).duration(800).attr("r", function (d) {
          return _this.scaleSize(d.freq);
        }).style('fill', function (d) {
          return _this.currentGeo == "QC" ? 'rgba(255, 0, 0, 0.6)' : _this.ccolor[d.continent] + ' 0.6)';
        });
        if (this.currentGeo === "WORLD") {
          var circlesTooltips = this.svg.selectAll('airports').data(localairports).join('circle');
          circlesTooltips.attr("r", function (d) {
            return Math.max(8, self.scaleSize(d.freq));
          }).attr("transform", function (d) {
            return "translate(".concat(_this.airportCode[d.airport], ")");
          }).attr("opacity", 0).attr("class", function (d) {
            return _this.currentGeo + " " + d.continent + " " + d.airport + " tooltipsCircle";
          }).on("mouseover", function (m, data) {
            d3.select("." + data.airport).attr("r", 1.5 * self.scaleSize(data.freq)).attr('stroke-width', '.4');
            return self.tooltip.showTooltipAirport(m, [data.airport, data.country, data.city, data.freq]);
          }).on("mouseleave", function (m, data) {
            d3.select("." + data.airport).attr("r", function (d) {
              return Math.log(d.freq + 1) / 4;
            }).attr('stroke-width', '.1');
            return self.tooltip.hideTooltip();
          });
        }
        this.currentGeo = this.levelGeo[this.levelGeo[this.currentGeo] + 1];
      };
      d3.csv("./".concat(this.currentGeo, "/airports").concat(this.currentGeo, ".csv")).then(readAirports.bind(this));
    }
  }, {
    key: "displayFlights",
    value: function displayFlights() {
      var readFlights = function readFlights(localflights) {
        var _this2 = this;
        this.svg.selectAll('flights').data(localflights).join('line').attr('class', this.currentGeo).attr('x1', function (d) {
          return _this2.airportCode[d.airportIn][0];
        }).attr('y1', function (d) {
          return _this2.airportCode[d.airportIn][1];
        }).attr('x2', function (d) {
          return _this2.airportCode[d.airportIn][0];
        }).attr('y2', function (d) {
          return _this2.airportCode[d.airportIn][1];
        }).style('stroke-width', function (d) {
          return 2 * _this2.scaleSize(d.number);
        }).transition().ease(d3.easeCubicInOut).duration(800).attr('x2', function (d) {
          return _this2.airportCode[d.airportOut][0];
        }).attr('y2', function (d) {
          return _this2.airportCode[d.airportOut][1];
        }).style('stroke', function (d) {
          return d.company === "OTHERS" ? 'rgba(255, 0, 0, 0.02)' : 'rgba(0, 0, 0, 0.2)';
        });
        this.currentGeo = this.levelGeo[this.levelGeo[this.currentGeo] + 1];
        this.svg.selectAll('circle').raise();
      };
      this.currentGeo = this.levelGeo[this.levelGeo[this.currentGeo] - 1];
      d3.csv("./".concat(this.currentGeo, "/flights").concat(this.currentGeo, ".csv")).then(_preprocess.groupByMainCompanies).then(readFlights.bind(this));
    }
  }, {
    key: "removeAirports",
    value: function removeAirports() {
      var _this3 = this;
      var db = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      this.currentGeo = this.levelGeo[this.levelGeo[this.currentGeo] - 1];
      if (db) {
        this.svg.transition().duration(1000).attr("viewBox", this.limits[this.levelGeo[this.currentGeo] - 1]);
        this.svg.selectAll('circle.' + this.currentGeo).transition().duration(1000).attr("r", 0).remove();
      } else {
        this.currentGeo = "QC";
        ["WORLD", "CA", "QC"].forEach(function (lvl) {
          _this3.svg.selectAll('line.' + lvl).transition().duration(1000).style('stroke', 'rgba(0, 0, 0, 0.0)').remove();
          _this3.svg.selectAll('circle.' + lvl).transition().duration(1000).attr("r", 0).remove();
        });
      }
    }
  }, {
    key: "removeFlights",
    value: function removeFlights() {
      this.svg.selectAll('line.' + this.levelGeo[this.levelGeo[this.currentGeo] - 1]).transition().duration(1000).style('stroke', 'rgba(0, 0, 0, 0.0)').remove();
    }
  }]);
  return Network;
}();
exports.default = Network;
},{"../tooltip":"scripts/tooltip.js","../preprocess.js":"scripts/preprocess.js"}],"scripts/scrolly.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initNetwork = initNetwork;
var _scrollama = _interopRequireDefault(require("scrollama"));
var _network = _interopRequireDefault(require("./scrolly/network.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
// using d3 for convenience
var main = d3.select("main");
var scrolly = main.select("#scrolly");
var figure = scrolly.select("figure");
var article = scrolly.select("article");
var step = article.selectAll(".step");
var figureHeight = 4 * window.innerHeight / 5;

// initialize the scrollama
var scroller = (0, _scrollama.default)();
var svg = d3.select('#viz2').append('svg');
function handleResize() {
  var stepH = Math.floor(window.innerHeight * 0.75);
  step.style("height", stepH + "px");
  var figureMarginTop = (window.innerHeight - figureHeight) / 2;
  figure.style("height", figureHeight + "px").style("top", figureMarginTop + "px");
  scroller.resize();
}
var figWidth = d3.select("figure").node().getBoundingClientRect().width;
var network = new _network.default(svg, figWidth / figureHeight);
function handleStepEnter(response) {
  if (response.direction === 'down') {
    if (response.index % 2 === 0 && response.index !== 6) {
      network.displayAirports();
    } else if (response.index % 2 === 1) {
      network.displayFlights();
    }
  } else {
    if (response.index % 2 === 1 && response.index !== 5) {
      network.removeAirports();
    } else if (response.index % 2 === 0 && response.index !== 6) {
      network.removeFlights();
    }
  }
}
function handleStepExit(response) {
  if (response.direction === 'up' && response.index === 0) {
    network.removeAirports(false);
  }
}
function initNetwork() {
  handleResize();
  scroller.setup({
    step: "#scrolly article .step",
    offset: 0.33,
    debug: false
  }).onStepExit(handleStepExit).onStepEnter(handleStepEnter);
}
},{"scrollama":"../node_modules/scrollama/build/scrollama.js","./scrolly/network.js":"scripts/scrolly/network.js"}],"index.js":[function(require,module,exports) {
"use strict";

var waffles = _interopRequireWildcard(require("./scripts/viz4.js"));
var alluvial = _interopRequireWildcard(require("./scripts/alluvial.js"));
var buckets = _interopRequireWildcard(require("./scripts/viz1.js"));
var preprocess = _interopRequireWildcard(require("./scripts/preprocess.js"));
var network = _interopRequireWildcard(require("./scripts/scrolly.js"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
window.onbeforeunload = function () {
  window.scrollTo(0, 0);
};
window.onload = function () {
  Promise.all([d3.csv('./WORLD/flightsWORLD.csv'), d3.csv('./CA/flightsCA.csv'), d3.csv('./QC/flightsQC.csv'), d3.csv('./alluvial_data.csv')]).then(function (files) {
    preprocess.setData(files[0].concat(files[1], files[2]));
    preprocess.setAlluvialData(files[3]);
    preprocess.setTopCompaniesCount(5);
    buckets.displayBucketGraph();
    buckets.setUpSlider();
  });
  network.initNetwork();
  // alluvial.initAlluvial()
  waffles.initWaffle();
};
},{"./scripts/viz4.js":"scripts/viz4.js","./scripts/alluvial.js":"scripts/alluvial.js","./scripts/viz1.js":"scripts/viz1.js","./scripts/preprocess.js":"scripts/preprocess.js","./scripts/scrolly.js":"scripts/scrolly.js"}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;
function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}
module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "53633" + '/');
  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);
    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);
          if (didAccept) {
            handled = true;
          }
        }
      });

      // Enable HMR for CSS by default.
      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });
      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }
    if (data.type === 'reload') {
      ws.close();
      ws.onclose = function () {
        location.reload();
      };
    }
    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }
    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}
function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);
  if (overlay) {
    overlay.remove();
  }
}
function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID;

  // html encode message and stack trace
  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}
function getParents(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return [];
  }
  var parents = [];
  var k, d, dep;
  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];
      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }
  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }
  return parents;
}
function hmrApply(bundle, asset) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }
  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}
function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }
  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }
  if (checkedAssets[id]) {
    return;
  }
  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }
  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}
function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};
  if (cached) {
    cached.hot.data = bundle.hotData;
  }
  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }
  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });
    return true;
  }
}
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","index.js"], null)
//# sourceMappingURL=/src.e31bb0bc.js.map