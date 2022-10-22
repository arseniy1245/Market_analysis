const fs = require('fs');

var dir = './data/klines/BTCUSDT/monthly/';
var requireScript = '../jsDrafts/'

const PERC_from = 0.00060; 
const PERC_to =   0.00999;
const TF =        '1h';
const pattern =   '9998';


var maxSum = 0;
var P1 = 0;
var P2 = 0;
var S = 0;
var L = 0;
var T = 0;

const Folders = fs.readdirSync(dir + TF);
for (let FolderName of Folders) {
    maxSum = 0;
    c(PERC_from,PERC_to,FolderName);
    function c(PERC_from,PERC_to,FolderName) {
        var Files = fs.readdirSync(dir + TF + '/' + FolderName);
        for (let PERC1 = PERC_from; PERC1 <= PERC_to; PERC1 += 0.0001) {
            for (let PERC2 = PERC_from; PERC2 <= PERC_to; PERC2 += 0.0001) {
                var sum = 1;
                var succ = 0;
                var loss = 0;
                var ttl = 0;
                for (let FileName of Files) {
                    let ARR = fs.readFileSync(dir + TF + '/' + FolderName +'/'+ FileName, 'utf-8').split('\n');
                    pa = dir + TF + '/' + FolderName +'/'+ FileName
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
    if(P1 < P2) c(P1-0.00011,P2+0.00011,FolderName);
    else c(P2-0.00011,P1+0.00011,FolderName);
    console.log(FolderName,((maxSum - 1)*100).toFixed(1)+'%', P1.toFixed(5),P2.toFixed(5),S,L,T)
}