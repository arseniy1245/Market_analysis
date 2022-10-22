const fs = require('fs');

const PERC_from = 0.00290;  //0.00060
const PERC_to = 0.00290;    //0.00700
// const PAIR = 'BTCUSDT';
// const TF = '1h';
const CSV = false;
const IsFix = false; //* false - сложные проценты, true - каждый период стартовая сумма
const arrNeedPairs = 
[
    'BTCUSDT'
];
const arrNeedTF = 
[
    '15m'
]




const csvResults = './csvResults/';
// const dir = `./data/klines/${PAIR}/csv/${TF}`
// const files = fs.readdirSync(dir);


const dirPairs = `./data/klines/`
const filesPairs = fs.readdirSync(dirPairs);
var csvResultFileName = `${Date.parse(new Date)}.csv`;

if(CSV === true) {
    //let header = `PAIR;15m;%;1d;%;1h;%;1m;%;2h;%;30m;%;3m;%;5m;%\n`;
    let header = '';
    fs.writeFileSync(`${csvResults}${csvResultFileName}`,header)
}


var IsFirst = true;
var ArrBestMonthPerc = [];

for (let fileNamePairs of filesPairs) {
    if(arrNeedPairs.indexOf(fileNamePairs) > -1 || arrNeedPairs[0] === 'all') {
        let LINE = fileNamePairs;
        let PAIR = fileNamePairs;
        let filesTF = fs.readdirSync(dirPairs + fileNamePairs + '/csv');
    
        if(CSV === true) {
            fs.appendFileSync(csvResults + csvResultFileName,LINE + '\n')
        }
    
        for (let fileNameTF of filesTF) {
            if(arrNeedTF.indexOf(fileNameTF) > -1 || arrNeedTF[0] === 'all') {
                var monthPrev = '03';
                var stSum = 100;
                console.log(PAIR,fileNameTF);
        
                // let TF = fileNameTF;
                let filesCSV = fs.readdirSync(dirPairs + fileNamePairs + '/csv/' + fileNameTF);
        
                var max = 0;
                var p = 0;
                // var succ = 0;
                // var loss = 0;
                for (let PERC = PERC_from; PERC <= PERC_to; PERC += 0.00001) {
                    // console.log(PERC.toFixed(5))
                    var sum = 100;
                    var I_succ = 0;
                    var I_loss = 0;

                    var IMonth = 0;
                    for (let file_name of filesCSV) {
        
                        if(IsFirst === true) {
                            let month = file_name.split('-')[3];
                            let year = file_name.split('-')[2];
                            if(month != monthPrev) {
                                console.log('[' + `'`+ month+ `'`+','+ `'`+year + `'`+ '],')
                                let monthNumStr = monthPrev + '.' + year;
                                let delt = sum - stSum;
                                let profitInPerc = ((sum / stSum - 1) * 100).toFixed(1);
                                ArrBestMonthPerc.push([IMonth,monthNumStr, Number(profitInPerc), PERC.toFixed(5),stSum.toFixed(2),sum.toFixed(2)])
                                //console.log(monthNumStr + ': ' + delt.toFixed(2) + ' ' + '(' + stSum.toFixed(2) + ' -> ' + sum.toFixed(2) + ') ' + profitInPerc + '%');
                                monthPrev = month;
                                stSum = sum;
                                if(IsFix === true) sum = 100;
                                IMonth++;
                            }
                        }
                        else {
                            console.log(ArrBestMonthPerc)
                            let month = file_name.split('-')[3];
                            let year = file_name.split('-')[2];
                            if(month != monthPrev) {
                                let delt = sum - stSum;
                                let profitInPerc = Number(((sum / stSum - 1) * 100).toFixed(1));
                                // console.log(ArrBestMonthPerc)
                                if(IMonth < ArrBestMonthPerc.length) {
                                    if(ArrBestMonthPerc[IMonth][2] < profitInPerc) {
                                    
                                        ArrBestMonthPerc[IMonth][2] = profitInPerc;
                                        ArrBestMonthPerc[IMonth][3] = PERC.toFixed(5);
                                        ArrBestMonthPerc[IMonth][4] = stSum.toFixed(2);
                                        ArrBestMonthPerc[IMonth][5] = sum.toFixed(2);
                                    }
                                }
                                monthPrev = month;
                                stSum = sum;
                                if(IsFix === true) sum = 100;
                                IMonth++;
                            }
                        }
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
                    IsFirst = false;
                }
                // console.log('----\nEnd sum: ' + (max).toFixed(1) + 'USDT',
                // '\nBest perc: ' + p.toFixed(5) + '\nSucc/Loss: ' + succ +'/'+ loss, '~'+(succ / (succ + loss) * 100).toFixed(1)+'%\n\n');
        
                //console.log(PAIR, TF, '\nEnd sum: ' + (max).toFixed(1) + '\nBest perc: ' + p.toFixed(5) + '\nSucc/Loss: ' + succ +'/'+ loss, '~'+(succ / (succ + loss) * 100).toFixed(1)+'%\n\n')
        
                console.log('\nEnd sum: ' +  +(max).toFixed(1) + '\n\n')
        
                LINE = LINE + ';' + (max).toFixed(1) + ';' + p.toFixed(5);
            }
        }
        if(CSV === true) {
            fs.appendFileSync(csvResults + csvResultFileName,LINE + '\n')
        }
    
    }
}
console.log(ArrBestMonthPerc);
var s = 100;
for (let i = 0; i < ArrBestMonthPerc.length; i++) {
    s = s * (1 + Number(ArrBestMonthPerc[i][2]));
}
console.log(s)
