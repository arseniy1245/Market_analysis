const fs = require('fs');

const dir = './data/klines/csv/1h'
const files = fs.readdirSync(dir);

var av = 0;
var count = 3;
var perc = 0.00408;

var I = 0;

statistic();

function statistic()
{
    I++;
    var ttl_profit = 0;

    var iTtl = 0;
    var iEx = 0;
    for (let file_name of files) {
        let ARR = fs.readFileSync(dir + '/' + file_name, 'utf-8').split('\n');
    
        for (let i = 0; i < ARR.length - 1; i++) {
            let lineArr = ARR[i].split(',');
            //let random = +Math.random().toFixed(0);
    
            if(lineArr[1] * (1 + perc) <= lineArr[2]) {
                
                let o = lineArr[1] * (1 + perc);
                let p = lineArr[4] / o;

                ttl_profit += p - 1;
                //console.log(o,lineArr[2],p.toFixed(3))
                iEx++;
            }
            iTtl++;
        }
    }
    console.log(I + '. ' + (ttl_profit + 1).toFixed(3) + ', ' + iTtl + ', ' + iEx);
    av += +(ttl_profit + 1).toFixed(3);

    if(I < count) statistic();
    else console.log((av / count).toFixed(3));
}