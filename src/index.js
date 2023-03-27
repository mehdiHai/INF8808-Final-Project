import * as waffles from './scripts/viz4.js'
import * as buckets from './scripts/viz1.js'
import * as preprocess from './scripts/preprocess.js'

export let data = [];

d3.csv('./volsQuebec2022.csv').then(function (data) {
    preprocess.setData(data);

    buckets.displayBucketGraph(5);
    buckets.setUpSlider();
    
    waffles.drawWaffles(preprocess.getCompaniesFlightArray(), preprocess.getCompaniesAircraftsMap(data));
})