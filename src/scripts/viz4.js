import * as preprocess from "./preprocess.js"
import distinctColors from 'distinct-colors'
import Tooltip from "./tooltip.js"
import { color } from "d3";

let biggestCompaniesAircrafts;
let otherCompaniesAircrafts;
let colorScale = {}
let factor = 5;

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
}

export function modifyData() {
	d3.select('#viz4').select('#waffleChart').remove();
	d3.select('#viz4').select('#waffleGroup').remove();
	d3.select('#viz4').select('.legend').remove();

	separateBigFromOthers();
	
	drawOtherCompaniesWaffle();
	drawTopCompaniesWaffles();
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
	addLegend(colorScale)
}

function calculateWaffleDimensions(data, factor) {
	const width = 1024;
	const height = 500;
	const squareSize = 20;
	const offset = 5;
	const total = data.reduce((acc, d) => acc + d.value, 0);
	let cols = Math.floor(Math.sqrt(((total / factor) * width) / height));
	if(cols === 0) cols = 1
	const rows = Math.ceil(total / factor / cols);

	return {
		width: cols * squareSize + cols * offset,
		height: rows * squareSize + rows * offset,
		rows,
		cols,
		squareSize,
		offset,
	};
}

function drawOtherCompaniesWaffle() {
	const data = waffleify(otherCompaniesAircrafts);
	const svg = d3.select("#viz4").append('div').attr('class', 'otherCompaniesWaffleContainer')
		.append('div').attr('id', 'otherCompaniesWaffle')
		.append("svg").attr("id", "waffleChart");
	createScale(data);
	drawWaffle(data, svg);
}

function drawTopCompaniesWaffles() {
	d3.select("#viz4")
		.append("div")
		.attr("id", "waffleGroup");

	biggestCompaniesAircrafts.forEach((company) => {
		const svg = d3.select("#waffleGroup")
		.append('div')
		.attr('class', 'bigCompanyWaffle')
		.append("svg")
		.attr("id", company)
		.style('stroke', 'black')
		

		drawWaffle(waffleify(company), svg);
	});
}

function waffleify(data) {
	const newData = [];
	newData.push({ category: "Autres", value: 0 });
	[...data.entries()].forEach((d) => {
		if (d[1] < factor) {
			newData[0].value += d[1];
		} else {
			newData.push({ category: d[0], value: d[1] });
		}
	});
	const autres = newData.splice(newData.findIndex((d) => { return d.category === "Autre"}), 1)
	newData.sort((a, b) => b.value - a.value)
	newData.push(autres[0])
	return newData;
}

function drawWaffle(data, svg) {
	const dimensions = calculateWaffleDimensions(data, factor);
	svg.attr("width", dimensions.width + dimensions.offset).attr("height", dimensions.height+2*dimensions.offset);
	data.forEach((d) => {
		d.value = Math.round(d.value / factor);
	});

	const waffles = [];
	data.forEach((d) => {
		for (let i = 0; i < d.value; i++) {
			waffles.push(d.category);
		}
	});

	let count = 0;
	for (var i = 0; i < dimensions.rows; i++) {
		for (var j = 0; j < dimensions.cols; j++) {
			const category = waffles[count];
			svg.append("rect")
				.attr(
					"x",
					j * dimensions.squareSize +
						(j - 1) * dimensions.offset +
						dimensions.offset
				)
				.attr(
					"y",
					i * dimensions.squareSize +
						(i - 1) * dimensions.offset +
						dimensions.offset
				)
				.attr("width", dimensions.squareSize)
				.attr("height", dimensions.squareSize)
				.style("fill", function () {
					return colorScale(category);
				})
				.style("opacity", function () {
					return category != undefined ? 1 : 0;
				})
				.attr("stroke", "black")
				.on("mouseover", function (m) {
					if(category)
						tooltip.showTooltipAirport(m, category);
					else 
						tooltip.hideTooltip();
				})
				.on("mousemove", function (m) {return tooltip.moveTooltip(m)})
			svg.on("mouseleave", function () {
					return tooltip.hideTooltip();
				});

			count++;
		}
	}
}



function addLegend(scale) {
	const legendContainer = d3.select('.otherCompaniesWaffleContainer')
		.append('svg')
		.attr('class', 'legend')
		.attr('height', function() { 
			return colorScale.domain().length * 25;
		})
		.attr('width', '110')
		.attr('transform', 'translate(0, -100)')
		.append('g')
		.attr('class', 'legend-container')
		.attr('transform', 'translate(10, 10)')
		

	const legendItems = legendContainer.selectAll('.legend-item')
		.data(colorScale.domain())
		.enter()
		.append('g')
		.attr('class', 'legend-item')
		.attr('transform', (d, i) => `translate(0, ${i * 20})`);

	legendItems.append('rect')
		.attr('width', 15)
		.attr('height', 15)
		.attr('margin-bottom', '3px')
		.style('fill', d => colorScale(d));

	legendItems.append('text')
		.attr('x', 20)
		.attr('y', 15)
		.style('font-size', 'medium')
		.style('fill', 'white')
		.text(d => d);

}
