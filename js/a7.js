const fs = require('fs');

const dir = './data/klines/csv/1h'
const files = fs.readdirSync(dir);

var ttlProfit = 0;
var I = 0;
var I_loss = 0;
var ttlLoss = 0;
var ttlSucc = 0;

const PERC = 0.00160;
const year = '2022';
const month = '08';

for (let file_name of files) {
    let name = file_name.split('-');

    if(name[2] == year && name[3] == month) {
        let ARR = fs.readFileSync(dir + '/' + file_name, 'utf-8').split('\n');

        for (let i = 0; i < ARR.length - 1; i++) {
            let lineArr = ARR[i].split(',');
            let sell = Number(lineArr[1]) * (1 + PERC);
            if(Number(lineArr[2]) >= sell) {
                ttlProfit += sell / Number(lineArr[1]) - 1;
                ttlSucc += sell / Number(lineArr[1]) - 1;
            }
            else {
                ttlProfit += Number(lineArr[4]) / Number(lineArr[1]) - 1;
                I_loss++;
                ttlLoss += Number(lineArr[4]) / Number(lineArr[1]) - 1;
            }
            I++;
        }
    }
}
console.log((ttlProfit + 1).toFixed(3), I, I_loss, (ttlLoss - 1).toFixed(3),(ttlSucc + 1).toFixed(3));