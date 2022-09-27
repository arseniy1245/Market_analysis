const fs = require('fs');

const dir = './data/klines/csv/1h'
const files = fs.readdirSync(dir);

var lastKline = 1;
var ttlProfit = 0;
var monthlyProfit = 0;
var lastMonth = '';
for (let file_name of files) {
    let month = file_name.split('-')[3];
    if(lastMonth != month) {
        let consoleProfit = Number((monthlyProfit * 100).toFixed(2));
        if(consoleProfit < 0) consoleProfit = ' ' + consoleProfit;
        console.log(lastMonth + ': ' + consoleProfit +'%')
        lastMonth = month;
        monthlyProfit = 0;
    }

    let ARR = fs.readFileSync(dir + '/' + file_name, 'utf-8').split('\n');

    for (let i = 0; i < ARR.length - 1; i++) {
        let lineArr = ARR[i].split(',');

        if(lastKline === 1) {
            let pr = Number((Number(lineArr[4]) / Number(lineArr[1]) - 1).toFixed(4));
            ttlProfit += pr;
            monthlyProfit += pr;
            lastKline = 0;
        }
        else {
            lastKline = 1;
        }
    }
}
let consoleProfit = Number((monthlyProfit * 100).toFixed(2));
        if(consoleProfit < 0) consoleProfit = ' ' + consoleProfit;
        console.log(lastMonth + ': ' + consoleProfit +'%')

console.log(ttlProfit.toFixed(2));