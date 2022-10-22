const fs = require('fs');

var dir = `./data/klines/BTCUSDT/csv/1h`;
const Files = fs.readdirSync(dir);

const PERC_from = 0.00060;  //0.00060
const PERC_to =   0.00999;    //0.00700


var MaxSum = 0;
var BestPercUP = 0;
var BestPercDrop = 0;
var Succ = 0;
var Loss = 0;
var Ttl = 0;

// var sumAll = 1;

// for (let FolderName of Foldres) {
    //let Files = fs.readdirSync(dir+'/'+FolderName);
    MaxSum = 0;
    BestPercUP = 0;
    BestPercDrop = 0;

    for (let PERCup = PERC_from; PERCup <= PERC_to; PERCup += 0.0001) {
        let p = 0;
        var I_succ = 0;
        var I_loss = 0;
        var I_ttl = 0;
        var sum = 1;
        for (let PERC = PERC_from; PERC <= PERC_to; PERC += 0.0001) {
            p = PERC;
            for (let FileName of Files) {
                // let ARR = fs.readFileSync(dir + '/' +FolderName+'/'+ FileName, 'utf-8').split('\n');
                let ARR = fs.readFileSync(dir +'/'+ FileName, 'utf-8').split('\n');

                for (let i = 0; i < ARR.length - 1; i++) {
                    var lineArr = ARR[i].split(',');

                    var open = Number(lineArr[1]);
                    var max = Number(lineArr[2]);
                    var min = Number(lineArr[3]);
                    var close = Number(lineArr[4]);

                    var shortSell = +(open * (1- PERC)).toFixed(2);
                    var longSell = +(shortSell * (1 + PERCup)).toFixed(2);

                    if(min <= shortSell) {
                        sum += (1 - (shortSell / open)) * sum;
                        if(max > longSell) {
                            sum += ((longSell / shortSell) - 1) * sum;
                            I_succ++;
                        }
                        else {
                            sum += ((close / shortSell) - 1) * sum;
                        }
                        

                        // sumAll += (1 - (shortSell / open)) * sumAll;
                        // sumAll += ((longSell / shortSell) - 1) * sumAll;
                    }
                    else {
                        sum -= ((close / open) -1) * sum;
                        // sumAll -= ((close / open) -1) * sumAll;

                        I_loss++;
                    }
                    I_ttl++;
                }
            }
        }
        if(MaxSum < sum) {
            MaxSum = sum;
            BestPercDrop = p;
            BestPercUP = PERCup;
            Succ = I_succ;
            Loss = I_loss;
            Ttl = I_ttl;
        }
    }
    console.log(FolderName.split('.').join('-')+'\t'+ ((MaxSum - 1)*100).toFixed(1) + '%'+'\t'+BestPercUP.toFixed(5),BestPercDrop.toFixed(5))
// }
// console.log(((MaxSum - 1)*100).toFixed(1) + '%')