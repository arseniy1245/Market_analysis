const fs = require('fs');

var dir = './data/klines/BTCUSDT/csv/';
var requireScript = '../jsDrafts/'

const PERC_from = 0.00060; 
const PERC_to =   0.00999;
const TF =        '1h';
const pattern =   '9999';
const month =     ['2022', '09'];


var maxSum = 0;
var P = 0;
var S = 0;
var L = 0;
var T = 0;

const Files = fs.readdirSync(dir + TF);
c(PERC_from,PERC_to);
function c(PERC_from,PERC_to) {
    for (let PERC = PERC_from; PERC <= PERC_to; PERC += 0.0001) {
        var sum = 1;
        var succ = 0;
        var loss = 0;
        var ttl = 0;
        for (let FileName of Files) {
            let m = FileName.split('-');
            if(m[2] === month[0] && m[3] === month[1]) {
                let ARR = fs.readFileSync(dir + TF +'/'+ FileName, 'utf-8').split('\n');
                for (let i = 0; i < ARR.length - 1; i++) {
                    var a = ARR[i].split(',');
    
                    let arr = require(requireScript + pattern)
                    (Number(a[0]),Number(a[1]),Number(a[2]),Number(a[3]),Number(a[4]),PERC,sum,succ,loss,ttl);
    
                    sum = arr[0];
                    succ = arr[1];
                    loss = arr[2];
                    ttl = arr[3];
                }
            }

        }
        if(maxSum < sum) {
            maxSum = sum;
            P = PERC;
            S = succ;
            L = loss;
            T = ttl;
        }
    }
}
c(P-0.00011,P+0.00011);
console.log('Profit: ' + ((maxSum - 1)*100).toFixed(1)+'%' +
'\nPerc: ' + P.toFixed(5) +
'\nSuccess: ' + S + 
'\nLoss: ' + L + 
'\nTotal: ' + T);