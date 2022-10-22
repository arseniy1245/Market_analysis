const fs = require('fs');

var dir = './data/klines/BTCUSDT/csv/';
var requireScript = '../jsDrafts/'

const PERC_from = 0.00060; 
const PERC_to =   0.00999;
const TF =        '1h';
const pattern =   '15';


var maxSum = 0;
var P1 = 0;
var P2 = 0;
var S = 0;
var L = 0;
var T = 0;

const Files = fs.readdirSync(dir + TF);
c(PERC_from,PERC_to);
function c(PERC_from,PERC_to) {
    for (let PERC1 = PERC_from; PERC1 <= PERC_to; PERC1 += 0.0005) {
        for (let PERC2 = PERC_from; PERC2 <= PERC_to; PERC2 += 0.0005) {
            var sum = 1;
            var succ = 0;
            var loss = 0;
            var ttl = 0;
            for (let FileName of Files) {
                let ARR = fs.readFileSync(dir + TF +'/'+ FileName, 'utf-8').split('\n');
                for (let i = 0; i < ARR.length - 1; i++) {
                    var a = ARR[i].split(',');

                    let arr = require(requireScript + pattern)
                    (Number(a[0]),Number(a[1]),Number(a[2]),Number(a[3]),Number(a[4]),PERC1,PERC2,sum,succ,loss,ttl);

                    sum = arr[0];
                    succ = arr[1];
                    loss = arr[2];
                    ttl = arr[3];
                }
            }
            if(maxSum < sum) {
                maxSum = sum;
                P1 = PERC1;
                P2 = PERC2;
                S = succ;
                L = loss;
                T = ttl;
            }
        }
    }
}
if(P1 < P2) c(P1-0.00091,P2+0.00091);
else c(P2-0.00091,P1+0.00091);

console.log('Profit: ' + ((maxSum - 1)*100).toFixed(1)+'%' +
'\nPerc1: ' + P1.toFixed(5) +
'\nPerc2: ' + P2.toFixed(5) + 
'\nSuccess: ' + S + 
'\nLoss: ' + L + 
'\nTotal: ' + T);