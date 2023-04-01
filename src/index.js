import * as waffles from './scripts/viz4.js'
import * as buckets from './scripts/viz1.js'
import * as preprocess from './scripts/preprocess.js'
import { init } from './scripts/scrolly.js'

window.onbeforeunload = function () {
    window.scrollTo(0, 0);
  }

window.onload = () => {

    Promise.all([
        d3.csv('./WORLD/flightsWORLD.csv'),
        d3.csv('./CA/flightsCA.csv'),
        d3.csv('./QC/flightsQC.csv'),
        d3.csv('./aircrafts.csv'),
        d3.csv('./sankey_data.csv'),
        d3.csv('./alluvial_data.csv')
    ]).then(function (files) {
        preprocess.setData(files[0].concat(files[1], files[2]));
        preprocess.setTopCompaniesCount(5);
        buckets.displayBucketGraph();
        buckets.setUpSlider();
        preprocess.setCompaniesAircraftsMap(files[3])
        waffles.drawWaffles();

    })

    init()
};




