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
    '1h'
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


const dirPairs = `./data/klines/`
const filesPairs = fs.readdirSync(dirPairs);
for (let fileNamePairs of filesPairs) {
    if(arrNeedPairs.indexOf(fileNamePairs) > -1 || arrNeedPairs[0] === 'all') {
        let filesTF = fs.readdirSync(dirPairs + fileNamePairs + '/csv');

        for (let fileNameTF of filesTF) {
            if(arrNeedTF.indexOf(fileNameTF) > -1 || arrNeedTF[0] === 'all') {
                let filesCSV = fs.readdirSync(dirPairs + fileNamePairs + '/csv/' + fileNameTF);

                for (let PERC = PERC_from; PERC <= PERC_to; PERC += 0.00001) {
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
                }
            }
        }
    }
}