const fs = require('fs');

const dir = './data/klines/BTCUSDT/csv/1h/'
const files = fs.readdirSync(dir);

var tGreen = 0;
var tRed = 0;

var day_next = 0;
var ne_day_next = 0;

var check = false;
for (let file_name of files) {
    let ARR = fs.readFileSync(dir + '/' + file_name, 'utf-8').split('\n');

    let isFirst = true;
    let green = 0;
    let red = 0;
    
    let op;

    let daykline = 0;
    let firstKline = 0;
    let lastKline = 0;
    let nextKline = 0;

    for (let i = 0; i < ARR.length - 1; i++) {
        let lineArr = ARR[i].split(',');
        let open = Number(lineArr[1]);
        let close = Number(lineArr[4]);

        if(i == 0 ) {
            op = open;
            if(open < close) firstKline = 1;
        }
        if(i == ARR.length - 2) {
            if(op < close) daykline = 1;
            if(open < close) lastKline = 1;
        }
        if(open < close) green++
        else red++;

        if(check === true) {
            if(open < close) {
                tGreen++;
                // console.log('green');
                nextKline = 1;
                // console.log(1)
            }
            else {
                tRed++;
                // console.log(0);
            }
            check = false;
            isFirst = false;
            // break;
        }

        if(red == green && isFirst == true) {
            if(open < close) nextKline = 1;
            check = true;
            // isFirst = false
            // console.log(file_name)
        }
    }

    if(lastKline == nextKline) day_next++
    else ne_day_next++;
}
console.log(day_next, ne_day_next);