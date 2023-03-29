import * as preprocess from './scripts/preprocess.js'
import * as alluvial from './scripts/alluvial.js'

d3.csv('./volsQuebec2022.csv').then(function (data) {
    preprocess.setData(data)
    preprocess.processFlightData()
    let sankeyData = preprocess.getSankeyData()

    // Créer le diagramme en envoyant la variable sankeyData
    alluvial.createAlluvialViz(sankeyData)
})
