const fs = require('fs');

const PERC_from = 0.00160;  //0.00060
const PERC_to = 0.00160;    //0.00700
const CSV = false;
const IsFix = false; //* false - сложные проценты, true - каждый период стартовая сумма
const arrNeedPairs = 
[
    'BTCUSDT'
];
const arrNeedTF = 
[
    '15m'
];
const arrMonth =
[
    ['03','2021'],
    ['04','2021'],
    ['05','2021'],
    ['06','2021'],
    ['07','2021'],
    ['08','2021'],
    ['09','2021'],
    ['10','2021'],
    ['11','2021'],
    ['12','2021'],
    ['01','2022'],
    ['02','2022'],
    ['03','2022'],
    ['04','2022'],
    ['05','2022'],
    ['06','2022'],
    ['07','2022'],
    ['08','2022'],
    ['09','2022'],
    ['10','2022']
]

const PATH = `./data/klines/`

var arrBestPerc = [];


for (let i0 = 0; i0 < arrNeedPairs.length; i0++) {
    let pairPath = PATH + arrNeedPairs[i0];
    for (let i = 0; i < arrNeedTF.length; i++) {
        let TFPath = pairPath + '/csv/' + arrNeedTF[i];
        const filesCSV = fs.readdirSync(TFPath);
        console.log(arrNeedPairs[i0],arrNeedTF[i])
        for (let i2 = 0; i2 < arrMonth.length; i2++) {
            let needMonth = arrMonth[i2][0];
            let needYear = arrMonth[i2][1];
            let max = -99999;
            let perc = 0;
            for (let PERC = PERC_from; PERC <= PERC_to; PERC += 0.00001) {
                let Sum = 100;
                for (let fileName of filesCSV) {
                    if(fileName.split('-')[3] == needMonth && fileName.split('-')[2] == needYear) {
                        let ARR = fs.readFileSync(TFPath + '/' + fileName, 'utf-8').split('\n');
                        for (let i = 0; i < ARR.length - 1; i++) {
                            var lineArr = ARR[i].split(',');
                            var sell = Number(lineArr[1]) * (1 + PERC);
                            var open = Number(lineArr[1]);
                            if(Number(lineArr[2]) >= sell) Sum = Sum / open * sell;
                            else Sum = Sum / open * Number(lineArr[4]);
                        }
                        if(max < Sum) {
                            max = Sum;
                            perc = PERC;
                        }
                    }
                }
            }
            arrBestPerc.push([needMonth + '.' + needYear, (max - 100).toFixed(1),perc.toFixed(5)])
            // console.log(needMonth + '.' + needYear +': ' + max.toFixed(2),perc.toFixed(5));
        }
    }
}
console.log(arrBestPerc);
var st = 100;
var avarage = 0;
for (let i = 0; i < arrBestPerc.length; i++) {
    st = st * ((Number(arrBestPerc[i][1]) + 100) / 100);
}
console.log(st.toFixed(2))

// for (let fileNamePairs of filesPairs) {
//     if(arrNeedPairs.indexOf(fileNamePairs) > -1 || arrNeedPairs[0] === 'all') {

//         let filesTF = fs.readdirSync(dirPairs + fileNamePairs + '/csv');

//         for (let fileNameTF of filesTF) {
//             if(arrNeedTF.indexOf(fileNameTF) > -1 || arrNeedTF[0] === 'all') {

//             }
//         }
//     }
// }


