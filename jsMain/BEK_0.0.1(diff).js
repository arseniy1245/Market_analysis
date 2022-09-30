const fs = require('fs');

const PERC_from = 0.00060;  //0.00060
const PERC_to = 0.00700;    //0.00700
const PAIR = 'BTCUSDT';
const TF = '1h';


const dir = `./data/klines/${PAIR}/csv/${TF}`
const files = fs.readdirSync(dir);

console.log('All files diff ' + PAIR + '\nFrom: ' + PERC_from + ' to: ' + PERC_to + '\nTF: ' + TF);
var max = 0;
var p = 0;
var succ = 0;
var loss = 0;


for (let PERC = PERC_from; PERC <= PERC_to; PERC += 0.00001) {
    var sum = 100;
    var I_succ = 0;
    var I_loss = 0;

    for (let file_name of files) {
        let ARR = fs.readFileSync(dir + '/' + file_name, 'utf-8').split('\n');

        for (let i = 0; i < ARR.length - 1; i++) {
            var lineArr = ARR[i].split(',');
            var sell = Number(lineArr[1]) * (1 + PERC);
            var open = Number(lineArr[1]);

            if(Number(lineArr[2]) >= sell) {
                sum = sum / open * sell;
                I_succ++;
            }
            else {
                let close = Number(lineArr[4]);
                sum = sum / open * close;
                I_loss++;
            }
        }
    }
    if(max < sum) {
        max = sum;
        p = PERC;
        succ = I_succ;
        loss = I_loss;
    }
}
console.log('----\nEnd sum: ' + (max).toFixed(1) + 'USDT',
 '\nBest perc: ' + p.toFixed(5) + '\nSucc/Loss: ' + succ +'/'+ loss, '~'+(succ / (succ + loss) * 100).toFixed(1)+'%');