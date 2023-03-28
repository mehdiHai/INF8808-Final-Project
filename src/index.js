import * as waffles from './scripts/viz4.js'
import * as buckets from './scripts/viz1.js'
import * as preprocess from './scripts/preprocess.js'
import {init} from './scripts/scrolly.js'

Promise.all([
    d3.csv('./WORLD/flightsWORLD.csv'),
    d3.csv('./CA/flightsCA.csv'),
    d3.csv('./QC/flightsQC.csv'),
    d3.csv('./airplanes.csv')
]).then( function(files) {
    
    preprocess.setData(files[0].concat(files[1], files[2]));
    buckets.displayBucketGraph(5);
    buckets.setUpSlider();
    waffles.drawWaffles(preprocess.getCompaniesFlightArray(), preprocess.getCompaniesAircraftsMap(files[3]));
})

init()
