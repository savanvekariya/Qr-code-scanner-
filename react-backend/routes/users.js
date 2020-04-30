var express = require('express');
const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');
const XLSX = require('xlsx');
const path = require('path');
var router = express.Router();

/* GET users listing. */

function qr(req, res, next) {
   request(req.query.qrvalue, function (error, response, html) {
      if (!error && response.statusCode == 200) {
         const $ = cheerio.load(html);

         //   const lable = $('.main label input');
         //   console.log(lable.val());

         let dataArrVal = [];
         let dataArrName = [];
         dataObj = {};

         $('.main label').each((i, el) => {
            const spanName = $(el).text().replace(/\s\s+/g, '');
            const item = $(el).children('span').next().val();
            //console.log(i + ')' + spanName + ': ' + item);
            dataArrName[i] = spanName;
            dataArrVal[i] = item;
         });

         //   var tool = new NodeXls();
         // columns will be ordered by ["stux", "foo", "boom"]; column "boom" will be named "hello"

         var wb = XLSX.utils.book_new();
         wb.SheetNames.push('Test Sheet');
         var ws_data = [dataArrName, dataArrVal];
         var ws = XLSX.utils.aoa_to_sheet(ws_data);
         wb.Sheets['Test Sheet'] = ws;
         var wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });

         fs.writeFileSync('output.xlsx', wbout, 'binary');
      }
   });

   next();
}
router.get('/', qr, function (req, res, next) {
   //  const p = path.join(__dirname + '../');
   //  res.download(p + '/output.xlsx');
   res.redirect('http://localhost:3000');
});

module.exports = router;
