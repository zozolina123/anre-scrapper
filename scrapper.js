const puppeteer = require('puppeteer')
const { filterData, mapDataToNewProperties } = require('./utils');
const consum_lunar = '1';
const judet = '2';
const nivel_tensiune = 'JT_';
const tip_pret = 'nediferentiat';
const tip_produs = '0';
const factura_electronica = '0';
const frecventa_emitere_factura = '0';
const frecventa_citire_contor = '0';
const perioada_contract = '0';
const energie_regenerabila = '0';
const data_start_aplicare = new Date().toISOString().split('T')[0];

async function scrapData() {
    try {
        return await (async() => {
            const browser = await puppeteer.launch({ headless: false, args: ['--no-sandbox', '--disable-setuid-sandbox'] })
            const page = await browser.newPage()
            await page.setViewport({ width: 1366, height: 768 });
            await page.goto('https://www.anre.ro/ro/info-consumatori/comparator-de-tarife', { waitUntil: 'networkidle2' })
            await page.waitForSelector('#consum_lunar')
            await page.waitFor(500)
            await page.select('#judet', judet)
            await page.type('#consum_lunar', consum_lunar)
            await page.select('#nivel_tensiune', nivel_tensiune)
            await page.select('#tip_pret', tip_pret)
            await page.select('#tip_produs', tip_produs)
            await page.evaluate((data_start_aplicare) => {
                document.querySelector('#data_start_aplicare').value = data_start_aplicare;
            }, data_start_aplicare)
            await page.waitForSelector('#compara');
            await page.waitFor(1500);
            await page.click('#compara');
            await page.$eval('#compara', el => el.click());
            await page.waitForSelector('tr', { timeout: 35000 })

            const data = await page.evaluate(() => {
                const dataObject = [];
                const tableHeader = Array.from(document.querySelectorAll('table tr')[0].cells)
                let tableBody = Array.from(document.querySelectorAll('table tr'));
                const details = Array.from(document.querySelectorAll('.detalii-comparator-inner')).map(node => node.children[5].children);
                const detailsObject = {};
                details.forEach((el, index) => {
                    detailsObject[index] = {};
                    Array.from(el).forEach(htmlEl => {
                        const textArray = htmlEl.innerText.split(':');
                        const propertyName = textArray[0];
                        const propertValue = textArray[1];
                        detailsObject[index][propertyName] = propertValue;
                    })
                })
                tableBody.shift(); //remove header
                const headerArray = [];

                tableHeader.forEach(cell => {
                    headerArray.push(cell.childNodes[0].data)
                })

                tableBody.forEach((cells, i) => {
                    dataObject[i] = {}
                    if (i % 2 == 0) {
                        const cellArray = Array.from(cells.cells);
                        cellArray.forEach((cell, index) => {
                            dataObject[i][headerArray[index]] = cell.innerText
                        })
                    } else { //get details
                        const cellArray = Array.from(cells.cells[0].children[0].children).slice(3, 11);
                        cellArray.forEach((cell, index) => {
                            const textArray = cell.innerText.split(':');
                            const propertyName = textArray[0];
                            const propertValue = textArray[1];
                            dataObject[i - 1][propertyName] = propertValue;
                        })
                    }
                })
                const filteredDataObject = dataObject.filter(value => Object.keys(value).length !== 0);
                const fullData = filteredDataObject.map((object, index) => Object.assign(object, detailsObject[index]));
                // console.log(fullData);
                return fullData;
            })
            const filteredData = data.map(el => filterData(el));
            const mappedData = filteredData.map(el => mapDataToNewProperties(el));
            browser.close();
            return mappedData;
        })()
    } catch (err) {
        console.error(err)
        browser.close();
        return [];
    }
}

module.exports = { scrapData }