const express = require('express');
const app = express();
const puppeteer = require('puppeteer');
const http = require('http');
const url = require('url');

app.get('/pdf', (req,res) => {

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/pdf');
    const queryObject = url.parse(req.url, true).query;
    //const path = `${queryObject.url}?job_analyst=${queryObject.job_analyst}&report_name=${queryObject.report_name}&facility=${queryObject.facility}&analysis_date=${queryObject.analysis_date}&pave_survey_invite=${queryObject.pave_survey_invite}&token=${queryObject.token}`
    //console.log(path);
    console.log(queryObject.url);
    //path = 'https://www.google.com.ar';
    //console.log(path);

    printPDF(queryObject.url).then((pdf) => {
        res.end(pdf);
    })
});

async function printPDF(url) {
    try {
      const browser = await puppeteer.launch({ headless: true, args: [
        '--no-sandbox', 
        '--disable-setuid-sandbox',
        '--headless', 
        '--disable-gpu', 
        '--disable-dev-shm-usage',
        '--unlimited-storage',
        '--full-memory-crash-report'
      ]});
      
      const page = await browser.newPage();
      console.log(url);
      const resp = await page.goto(url, { waitUntil: 'networkidle0', timeout: 0 });
      console.log('PAGE LOG:', page.content());
      const pdf = await page.pdf(
        {
          format: 'A4',
          printBackground: true
        }
      );
  
      await browser.close();
      return pdf;
      
    } catch (e) {
      console.log(e);
      return 'response default';
    }
  };

app.set('port', process.env.PORT || 4000);
const server = app.listen(app.get('port'), function () {
   console.log('Server listening on port ' + app.get('port'));
});
