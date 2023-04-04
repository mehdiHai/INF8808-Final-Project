import * as preprocess from "./preprocess.js"
import distinctColors from 'distinct-colors'
import Tooltip from "./tooltip.js"
import { color } from "d3";

let biggestCompaniesAircrafts;
let otherCompaniesAircrafts;
let colorScale = {}
const FACTOR = 5;
const COLUMN_NUMBER = 25;
const SQUARE_SIZE = 20;
const INTERGAP_SPACE = 5;


let otherCompaniesWaffleHeight;

let tooltip = new Tooltip();

export function loadData(){
	d3.select("#viz4").on("mouseover", null)
	d3.csv('./aircrafts.csv').then(function (files) {
		preprocess.setCompaniesAircraftsMap(files);
        drawWaffles();
  })
  }

  export function initWaffle() {
	d3.select("#viz4").on("mouseover", loadData)
  }

export function drawWaffles() {
	separateBigFromOthers();
	
	drawOtherCompaniesWaffle();
	drawTopCompaniesWaffles();
	addLegend();

}

export function modifyData() {
	d3.select('#viz4').select('#topWaffles').remove();
	d3.select('#viz4').select('#otherWaffle').remove();
	d3.select('#viz4').select('.legend').remove();

	separateBigFromOthers();
	
	drawOtherCompaniesWaffle();
	drawTopCompaniesWaffles();
	addLegend();

}

function separateBigFromOthers() {
	const biggestCompaniesFlights = preprocess.getCompaniesFlightArray();
	const companiesAircrafts = preprocess.getCompaniesAircraftsMap();
	biggestCompaniesAircrafts = new Map();
	otherCompaniesAircrafts = new Map();
	biggestCompaniesFlights.forEach((d, index) => {
		if(index < preprocess.getTopCompaniesCount())
			biggestCompaniesAircrafts.set(d[0], companiesAircrafts.get(d[0]))
		else {
			for (const typeCount of companiesAircrafts.get(d[0])) {
				const name = typeCount[0];

				if (!otherCompaniesAircrafts.get(name))
					otherCompaniesAircrafts.set(name, 0);
				otherCompaniesAircrafts.set(
					name,
					otherCompaniesAircrafts.get(name) + typeCount[1]
				);
			}
		}
	})
}

function createScale(data) {
	const domain = data.map((d) => {
		return d.category;
	});
	colorScale = d3.scaleOrdinal().domain(domain).range(distinctColors({count: 12}).reverse());
}

function calculateWaffleDimensions(data, FACTOR) {
	const total = data.reduce((acc, d) => acc + d.value, 0);
	// let cols = Math.floor(Math.sqrt(((total / FACTOR) * width) / height));
	//if(cols === 0) cols = 1
	const rows = Math.ceil(total / FACTOR / 25);
	otherCompaniesWaffleHeight =  rows * SQUARE_SIZE + rows * INTERGAP_SPACE;
	
	return {
		width: COLUMN_NUMBER * SQUARE_SIZE + COLUMN_NUMBER * INTERGAP_SPACE,
		height: otherCompaniesWaffleHeight,
		rows,
		cols: COLUMN_NUMBER,
		squareSize: SQUARE_SIZE,
		offset: INTERGAP_SPACE,
	};
}

function drawOtherCompaniesWaffle() {
	const data = waffleify(otherCompaniesAircrafts);
	const div = d3.select("#viz4").append('div').attr('id', 'otherWaffle').append('div').attr('class', 'waffle')
		
	createScale(data);
	drawWaffle(data, div);
	d3.select("#otherWaffle").append('p').attr('class', 'waffleLabel').html("AUTRES COMPAGNIES");

}

function drawTopCompaniesWaffles() {
	d3.select("#viz4")
		.append("div")
		.attr('id', 'topWaffles')
	

	console.log(otherCompaniesWaffleHeight)

	let index = 0;
	biggestCompaniesAircrafts.forEach((companyMap, name) => {
		const div = d3.select("#topWaffles")
		.append("div")
		.attr("class", 'waffle')

		drawWaffle(waffleify(companyMap), div, index);
		d3.select("#topWaffles").append('p').attr('class', 'waffleLabel').html(name);
		index++;
	});

}

function waffleify(data) {
	const newData = [];
	newData.push({ category: "Autres", value: 0 });
	[...data.entries()].forEach((d) => {
		if (d[1] < FACTOR) {
			newData[0].value += d[1];
		} else {
			newData.push({ category: d[0], value: d[1] });
		}
	});
	const autres = newData.splice(newData.findIndex((d) => { return d.category === "Autres"}), 1)
	newData.sort((a, b) => b.value - a.value)
	newData.push(autres[0])
	return newData;
}

function drawWaffle(data, div, index) {
	data.forEach((d) => {
		d.value = Math.round(d.value / FACTOR);
	});

	const waffles = [];
	data.forEach((d) => {
		for (let i = 0; i < d.value; i++) {
			if(d.category)
			waffles.push(d.category);
		}
	});
	div
		.selectAll('.block')
		.data(waffles)
		.enter()
		.append('div')
		.attr('class', 'block')
		.style('background-color', (d) => {return colorScale(d)})
		.on("mouseover", function (m, category) {
			if(category)
				tooltip.showTooltipAircrafts(m, category);
			else 
				tooltip.hideTooltip();
		})
		.on("mousemove", function (m) {return tooltip.moveTooltip(m)})
	div.on("mouseleave", function () {
			return tooltip.hideTooltip();
		});

}



function addLegend() {
	const legendContainer = d3.select('#viz4')
		.append('svg')
		.attr('class', 'legend')
		.attr('height', '50')
		.attr('width',  function() { 
			return colorScale.domain().length * 50 + 50;
		})
		.append('g')
		.attr('class', 'legend-container')
		.attr('transform', 'translate(10, 10)')
		

	const legendItems = legendContainer.selectAll('.legend-item')
		.data(colorScale.domain())
		.enter()
		.append('g')
		.attr('class', 'legend-item')
		.attr('transform', (d, i) => `translate(${i * 50}, 0)`);

	legendItems.append('rect')
		.attr('width', 15)
		.attr('height', 15)
		.attr('margin-bottom', '3px')
		.style('fill', d => colorScale(d));

	legendItems.append('text')
		.attr('x', 20)
		.attr('y', 15)
		.style('font-size', 'medium')
		.text(d => d);

}
