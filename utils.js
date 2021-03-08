const propertiesToKeep = ['Nr. crt',
    'Denumire furnizor',
    'Energie regenerabila',
    'Contravaloare certificate verzi (lei/kWh)',
    'Taxa cogenerare inalta eficienta (lei/kWh)',
    'Pret energie – inclusiv Tg (lei/kWh)',
    'Valoare componenta fixa (lei/zi)',
    'Tarif transport TL (lei/kWh)',
    'Tarif serviciu sistem (lei/kWh)',
    'Tarif serviciu distributie (lei/kWh)',
    'Acciza (lei/kWh)',
    'TVA (%)',
    'Valoare unitara factura (lei/kwh)',
]

function mapDataToNewProperties(data) {
    const mappedData = {};
    mappedData.id = +data['Nr. crt'];
    mappedData.furnizor = data['Denumire furnizor'];
    mappedData.energieRegenerabila = data['Energie regenerabila'];
    mappedData.valCompFix = +data['Valoare componenta fixa (lei/zi)'];
    mappedData.tarifTransport = +data['Tarif transport TL (lei/kWh)'];
    mappedData.tarifSistem = +data['Tarif serviciu sistem (lei/kWh)'];
    mappedData.tarifDistributie = +data['Tarif serviciu distributie (lei/kWh)'];
    mappedData.pretCertificateVerzi = +data['Contravaloare certificate verzi (lei/kWh)'];
    mappedData.taxaCogenerare = +data['Taxa cogenerare inalta eficienta (lei/kWh)'];
    mappedData.pretEnergie = +data['Pret energie – inclusiv Tg (lei/kWh)'];
    mappedData.tarifFinal = +data['Valoare unitara factura (lei/kwh)'];
    mappedData.acciza = +data['Acciza (lei/kWh)'];
    mappedData.tva = +data['TVA (%)'];
    return mappedData;
}

function filterData(data) {
    const newData = {}
    propertiesToKeep.forEach((property) => {
        newData[property] = data[property];
    });
    return newData;

}

module.exports = { filterData, mapDataToNewProperties }