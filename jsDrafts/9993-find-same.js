const fs = require('fs');

let ARR = JSON.parse(fs.readFileSync('./1Res_Data/Combinations/ALL.json', 'utf-8'));

let ARRTIME = JSON.parse(fs.readFileSync('./1Res_Data/Combinations/ALL_TIME.json', 'utf-8'));

for (let i = 0; i < ARR.length; i++) {
    let a1 = JSON.stringify(ARR[i]);
    for (let i2 = 0; i2 < ARR.length; i2++) {
        if(i != i2) {
            let a2 = JSON.stringify(ARR[i2]);
            if(a1 == a2) {
                // console.log('find')
                console.log(ARRTIME[i],a1)
                console.log(ARRTIME[i2],a2)
            }
        }
    }
}