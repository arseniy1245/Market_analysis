const fs = require('fs');

const dir = './data/klines/BTCUSDT/monthly/1m';
const files = fs.readdirSync(dir);

var ALL = [];
var ALL_TIME_ARR = [];

for (let FileName of files) {
    let m = FileName.split('-');
    if(m[2] == '2022' || m[2] == '2021' || m[2] == '2020' ){ //&& m[3] == '09.csv'
        var HourArr = [];
        var HourTime = 0;
    
        let ARR = fs.readFileSync(dir + '/' + FileName, 'utf-8').split('\n');
        for (let i = 0; i < ARR.length - 1; i++) {
            var lineArr = ARR[i].split(',');
    
            let time = Number(lineArr[0]);
            let open = Number(lineArr[1]);
            let close = Number(lineArr[4]);
    
            if(i % 60 === 0) {
                HourArr = [];
                HourTime = time;
            }
    
            if(open < close) {HourArr.push(1);}
            else {HourArr.push(0);}
        
            if((i+1) % 60 === 0) {
                ALL_TIME_ARR.push(HourTime);
                ALL.push(HourArr);
            }
        }
    }
}
fs.writeFileSync('./1Res_Data/Combinations/ALL.json', JSON.stringify(ALL, null, 2));

// ALL_TIME_ARR = [[0,0,0,0,0,0,1,1,0,1],[0,0,1,0,0,0,1,1,0,1]]
fs.writeFileSync('./1Res_Data/Combinations/ALL_TIME.json', JSON.stringify(ALL_TIME_ARR,'\t','\t'));