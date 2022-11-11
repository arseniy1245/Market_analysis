const fs = require('fs');

const dir = './data/klines/BTCUSDT/csv/1m'
const files = fs.readdirSync(dir);

var w = 0;
var allArr = [];
for (let FileName of files) {
    var hArr = [];
    let m = FileName.split('-');
   if(m[2] === '2022' && m[3] === '09') {
        let ARR = fs.readFileSync(dir +'/'+ FileName, 'utf-8').split('\n');
        for (let i = 0; i < ARR.length - 1; i++) {
            var lineArr = ARR[i].split(',');
    
            // var time = Number(lineArr[0]);

            var open = Number(lineArr[1]);
            // var max = Number(lineArr[2]);
            // var min = Number(lineArr[3]);
            var close = Number(lineArr[4]);

            if(close < open) hArr.push(0)
            else hArr.push(1)

            if((i) % 60 === 0) {
                hArr = [];
            }
            if((i+1) % 60 === 0) {
                allArr.push(hArr);
            }
        }
    }
}
// console.log(allArr)

var AA = [];
for (let i = 0; i < allArr.length; i++) {
    var count = 0;
    AA.push([i,0]);
    var A1 = JSON.stringify(allArr[i]);
    for (let i2 = 0; i2 < allArr.length; i2++) {
        if(i != i2) {
            var A2 = JSON.stringify(allArr[i2]);
            if(A1 == A2) {
                // console.log('a');
                count++;
            }
        }
    }
    AA[AA.length - 1][1] = count;
}
console.log(AA)

for (let i = 0; i < AA.length; i++) {
    if(AA[i][1] != 0) console.log(i,AA[i][2])
}
// console.log(JSON.stringify([1,0,0,0]) == JSON.stringify([0,0,0,1]))