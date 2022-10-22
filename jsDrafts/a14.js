const fs = require('fs');

var dir = `./data/klines/BTCUSDT/csv/1h`;
const Files = fs.readdirSync(dir);

const PERC_from = 0.00060; 
const PERC_to =   0.00999;


var maxSum = 0;
var pDrop = 0;
var pUp = 0;
c(PERC_from,PERC_to);
function c(PERC_from,PERC_to) {
    for (let PERCdrop = PERC_from; PERCdrop <= PERC_to; PERCdrop += 0.0001) {
        for (let PERCup = PERC_from; PERCup <= PERC_to; PERCup += 0.0001) {
            var sum = 1;
            for (let FileName of Files) {
                let ar = FileName.split('-');
                if(ar[2] == '2022' && ar[3] == '10') {
                    let ARR = fs.readFileSync(dir +'/'+ FileName, 'utf-8').split('\n');
                    for (let i = 0; i < ARR.length - 1; i++) {
                        var lineArr = ARR[i].split(',');
                
                        var time = Number(lineArr[0])
                        var open = Number(lineArr[1]);
                        var max = Number(lineArr[2]);
                        var min = Number(lineArr[3]);
                        var close = Number(lineArr[4]);
    
                        var ShortClose = Number((open * (1 - PERCdrop)).toFixed(2));
                        var LongClose = Number((ShortClose * (1 + PERCup)).toFixed(2));
    
                        if (min <= ShortClose) {
                            sum += ((1 - (ShortClose / open)) * sum);
    
                            if(max >= LongClose) {
                                sum += (((LongClose / ShortClose) - 1) * sum);
                            }
                            else {
                                sum += (((close / ShortClose) - 1) * sum);
                            }
                        }
                        else {
                            sum -= (((close / open) - 1) * sum);
                        }
                    }
                }
            }
            if(maxSum < sum) {
                maxSum = sum;
                pDrop = PERCdrop;
                pUp = PERCup;
            }
        }
    }
}
c(pDrop-0.00011,pUp+0.00011);
console.log(((maxSum - 1)*100).toFixed(1),pDrop.toFixed(5),pUp.toFixed(5));