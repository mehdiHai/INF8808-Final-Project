import * as preprocess from "./preprocess.js"
import Tooltip from "./tooltip.js"

let biggestCompaniesAircrafts;
let otherCompaniesAircrafts;
let colorScale = {}
const FACTOR = 5;
const COLUMN_NUMBER = 25;
const SQUARE_SIZE = 20;
const INTERGAP_SPACE = 5;

let tooltip = new Tooltip();

export function initWaffle() {
	window.onscroll = function(){
		var scrollPos = window.scrollY;

		if(scrollPos >= 4000){
			window.onscroll = null;
			d3.csv('./aircrafts.csv').then(function (files) {
				preprocess.setCompaniesAircraftsMap(files);
				drawWaffles();
			})
		}
	}
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
	colorScale = d3.scaleOrdinal().domain(domain).range(d3.schemeCategory10);
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
	[...data.entries()].forEach((d) => {
		newData.push({ category: d[0], value: d[1] });
	});
	newData.sort((a, b) => b.value - a.value)
	let othersCount = 0;
	if(newData.length > 8) {
		for(let i = 8; i < newData.length; i++){
			othersCount += newData[i].value;
		}
	}
	newData.splice(8, newData.length - 8);
	newData.push({ category: "Autres", value: othersCount })


	let totalPark = 0;
	newData.forEach((d) => {
		totalPark += d.value;
	});

	const waffles = [];
	newData.forEach((d) => {
		for (let i = 0; i < Math.round(d.value / FACTOR); i++) {
			waffles.push({category: d.category, fraction: d.value, total: totalPark});
		}
	});

	return waffles;
}

function drawWaffle(waffles, div, index) {
	div
		.selectAll('.block')
		.data(waffles)
		.enter()
		.append('div')
		.attr('background-image', 'url(\'img/plane-icon.png\')')
		.attr('class', 'block')
		.style('background-color', (d) => {return colorScale(d.category)})
		.on("mouseover", function (m, d) {
			tooltip.showTooltipAircrafts(m, d);
		})
		
	div.on("mousemove", function (m) {return tooltip.moveTooltip(m)})
		.on("mouseleave", function () {
			return tooltip.hideTooltip();
		});

}



function addLegend() {
	d3.select('#viz4').append('br')
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
