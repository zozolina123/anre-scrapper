const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
const port = process.env.PORT || 3002;
const { scrapData } = require('./scrapper');
var cron = require('node-cron');
let scrappedData = [];


cron.schedule('* * * * *', () => {
    (async() => {
        while (!scrappedData.length > 0) scrappedData = await scrapData();
        console.log('running a task every minute');
        console.log(scrappedData);
    })();
});

app.get('/', (req, res) => {
    console.log(scrappedData)
    res.send(scrappedData);
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
    (async() => { scrappedData = await scrapData() })
})