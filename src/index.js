'use strict'

import * as buckets from './scripts/viz1.js'
import * as preprocess from './scripts/preprocess.js'

export let data = [];

d3.queue()
    .defer(d3.csv, './volsQuebec2022.csv')
    .await(function (error, data) {
        preprocess.setData(data);
        buckets.displayBucketGraph(5);
        buckets.setUpSlider();
    } )
// d3.csv('./volsQuebec2022.csv').then(function (data) {
    
//     // const bigCompanies = buckets.getCompaniesFlightCount(data)
//     // const heightScale = buckets.createHeightScale(bigCompanies);
//     preprocess.setData(data);
//     console.log(data)
//     buckets.displayBucketGraph(5);
//     buckets.setUpSlider();

// })