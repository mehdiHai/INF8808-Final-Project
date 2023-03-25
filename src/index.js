'use strict'

import * as buckets from './scripts/viz1.js'


d3.csv('./volsQuebec2022.csv').then(function (data) {
    const bigCompanies = buckets.getCompaniesFlightCount(data)
    const heightScale = buckets.createHeightScale(bigCompanies);

    buckets.displayBucketGraph(bigCompanies, 5, heightScale)

})