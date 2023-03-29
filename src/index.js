'use strict'

import * as buckets from './scripts/viz1.js'
import * as preprocess from './scripts/preprocess.js'
import { init } from './scripts/scrolly.js'

export let data = [];

window.onbeforeunload = function () {
    window.scrollTo(0, 0);
  }

window.onload = () => {

    Promise.all([
        d3.csv('./WORLD/flightsWORLD.csv'),
        d3.csv('./CA/flightsCA.csv'),
        d3.csv('./QC/flightsQC.csv')
    ]).then(function (files) {
        preprocess.setData(files[0].concat(files[1], files[2]));
        buckets.displayBucketGraph(5);
        buckets.setUpSlider();
    })

    init()
};




