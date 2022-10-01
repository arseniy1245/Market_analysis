const fs = require('fs');

const PERC_from = 0.00060;  //0.00060
const PERC_to = 0.00060;    //0.00700
// const PAIR = 'BTCUSDT';
// const TF = '1h';
const CSV = true;

const csvResults = './csvResults/';
// const dir = `./data/klines/${PAIR}/csv/${TF}`
// const files = fs.readdirSync(dir);


const dirPairs = `./data/klines/`
const filesPairs = fs.readdirSync(dirPairs);
var csvResultFileName = `${Date.parse(new Date)}.csv`;

if(CSV === true) {
    let header = `PAIR;15m;%;1d;%;1h;%;1m;%;2h;%;30m;%;3m;%;5m;%\n`;
    fs.writeFileSync(`${csvResults}${csvResultFileName}`,header)
}

for (let fileNamePairs of filesPairs) {
    //console.log(fileNamePairs)
    let LINE = fileNamePairs;
    let PAIR = fileNamePairs;
    let filesTF = fs.readdirSync(dirPairs + fileNamePairs + '/csv');
    for (let fileNameTF of filesTF) {
        //console.log(fileNameTF)

        let TF = fileNameTF;
        let filesCSV = fs.readdirSync(dirPairs + fileNamePairs + '/csv/' + fileNameTF);

        // console.log('All files diff ' + PAIR + '\nFrom: ' + PERC_from + ' to: ' + PERC_to + '\nTF: ' + TF);
        var max = 0;
        var p = 0;
        var succ = 0;
        var loss = 0;
        for (let PERC = PERC_from; PERC <= PERC_to; PERC += 0.00001) {
            var sum = 100;
            var I_succ = 0;
            var I_loss = 0;
            for (let file_name of filesCSV) {
                let ARR = fs.readFileSync(dirPairs + fileNamePairs + '/csv/' + fileNameTF + '/' + file_name, 'utf-8').split('\n');
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
        // console.log('----\nEnd sum: ' + (max).toFixed(1) + 'USDT',
        // '\nBest perc: ' + p.toFixed(5) + '\nSucc/Loss: ' + succ +'/'+ loss, '~'+(succ / (succ + loss) * 100).toFixed(1)+'%\n\n');

        console.log(PAIR, TF, '\nEnd sum: ' + (max).toFixed(1) + '\nBest perc: ' + p.toFixed(5) + '\nSucc/Loss: ' + succ +'/'+ loss, '~'+(succ / (succ + loss) * 100).toFixed(1)+'%\n\n')

        LINE = LINE + ';' + (max).toFixed(1) + ';' + p.toFixed(5);

        // if(CSV === true) {
        //     let header = `PAIR;15m;%;1d;%;1h;%;1m;%;2h;%;30m;%;3m;%;5m;%`;
        //     let line = `${PAIR};`;
        //     //fs.writeFileSync(`${csvResults}${PAIR}-${TF}-${Date.parse(new Date)}.csv`,)

        //     fs.appendFileSync(csvResults)

        // }

    }
    if(CSV === true) {
        fs.appendFileSync(csvResults + csvResultFileName,LINE + '\n')
    }

}


