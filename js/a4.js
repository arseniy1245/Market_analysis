const fs = require('fs');

const dir = './data/klines/csv/1m'
const files = fs.readdirSync(dir);

var greenPrev = 400;
var redPerv = 100;

var greenLast = 40;
var redLast = 10;

var ThisKline = 0;


var matchGreen = 0;
var matchRed = 0;

var ttlHours = 0;

for (let file_name of files) {
    let ARR = fs.readFileSync(dir + '/' + file_name, 'utf-8').split('\n');

    if(ARR.length == 1441) {
        var hourOpenPrev = 0;

        for (let i = 0; i < ARR.length - 1; i++) {
            let lineArr = ARR[i].split(',');
            if(i%60 == 0) {
                ttlHours++;
                if(hourOpenPrev < Number(lineArr[1])) ThisKline = 1;
                else ThisKline = 0;
                //console.log(ThisKline, greenPrev, redPerv)
                hourOpenPrev = lineArr[1];
                if(greenPrev < redPerv && ThisKline == 1) matchGreen++;
                if(greenPrev > redPerv && ThisKline == 0) matchRed++;
                greenPrev = greenLast;
                redPerv = redLast;

                greenLast = 0;
                redLast = 0;
            }

            if(lineArr[1] < lineArr[4]) greenLast++
            else redLast++;
        }
    }
}
console.log(matchGreen,matchRed, ttlHours)