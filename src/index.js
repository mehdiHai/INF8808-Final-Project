import * as waffles from './scripts/viz4.js'
import * as buckets from './scripts/viz1.js'
import * as preprocess from './scripts/preprocess.js'
import * as network from './scripts/scrolly.js'

window.onbeforeunload = function () {
    window.scrollTo(0, 0);
}

window.onload = () => {

    Promise.all([
        d3.csv('./WORLD/flightsWORLD.csv'),
        d3.csv('./CA/flightsCA.csv'),
        d3.csv('./QC/flightsQC.csv'),
        d3.csv('./alluvial_data.csv')
    ]).then(function (files) {
        preprocess.setBucketsData(files[0].concat(files[1], files[2]));
        preprocess.setAlluvialData(files[3]);
        preprocess.setTopCompaniesCount(5);
        buckets.displayBucketGraph();
        buckets.setUpSlider();
    })

    network.initNetwork()
    waffles.initWaffle()
};




