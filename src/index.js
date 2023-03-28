import * as preprocess from './scripts/preprocess.js'

d3.csv('./volsQuebec2022.csv').then(function (data) {
    preprocess.setData(data)
    preprocess.processFlightData()
    let sankeyData = preprocess.getSankeyData()

    // TODO : Créer le diagramme en envoyant la variable sankeyData
})
