const fs = require('fs');

const dir = './data/klines/BTCUSDT/csv/1h/'
const files = fs.readdirSync(dir);

let g = 0;
let r = 0;
let no = 0;
let profit = 0;

for (let file_name of files) {
    let a = file_name.split('-');
    if(a[2] == '2022' && a[3] == '09') {
        let ARR = fs.readFileSync(dir + '/' + file_name, 'utf-8').split('\n');

        let openDay;
    
        let check = false;
        let isFirst = true;
    
    
        for (let i = 0; i < ARR.length - 1; i++) {
            let lineArr = ARR[i].split(',');
            let open = Number(lineArr[1]);
            let close = Number(lineArr[4]);
            let min = Number(lineArr[3]);
    
            if(i == 0) openDay = open;
            else {
                if(min <= openDay) {
                    check = true;
                }
                else {
                    if(i == ARR.length - 2) no++;
                }
            }
    
            if(check == true && isFirst == true) {
                if(open < close) g++
                else r++;
                profit += (1 - close / open);
                isFirst = false
                break;
            }
        }
    }
}
console.log(g,r,no,profit.toFixed(5))