import * as waffles from './scripts/viz4.js'
import * as preprocess from './scripts/preprocess.js'

export let data = [];

d3.csv('./volsQuebec2022.csv').then(function (data) {
    preprocess.setData(data);
    const biggestCompaniesFlights = preprocess.getCompaniesFlightArray(data);
    const companiesAircrafts = preprocess.getCompaniesAircraftsMap(data);

    waffles.drawWaffles(biggestCompaniesFlights, companiesAircrafts);
})