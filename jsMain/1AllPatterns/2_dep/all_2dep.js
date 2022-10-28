module.exports = (TF,requireScript,modeName,InrevalPerc,DeltPerc) => 
{
    console.log('\n' + '\n' + modeName + '\n');
    const fs = require('fs');

    var dir = './data/klines/BTCUSDT/csv/';
    const path = '../../../';
    
    const PERC_from = 0.00060; 
    const PERC_to =   0.00999;
    
    
    var maxSum = 0;
    var P1 = 0;
    var P2 = 0;
    var S = 0;
    var L = 0;
    var T = 0;
    
    const Files = fs.readdirSync(dir + TF);
    c(PERC_from,PERC_to);
    function c(PERC_from,PERC_to) {
        for (let PERC1 = PERC_from; PERC1 <= PERC_to; PERC1 += InrevalPerc) {
            for (let PERC2 = PERC_from; PERC2 <= PERC_to; PERC2 += InrevalPerc) {
                var sum = 1;
                var succ = 0;
                var loss = 0;
                var ttl = 0;
                for (let FileName of Files) {
                    let ARR = fs.readFileSync(dir + TF +'/'+ FileName, 'utf-8').split('\n');
                    for (let i = 0; i < ARR.length - 1; i++) {
                        var a = ARR[i].split(',');
    
                        let arr = require(path + requireScript)
                        (Number(a[0]),Number(a[1]),Number(a[2]),Number(a[3]),Number(a[4]),PERC1,PERC2,sum,succ,loss,ttl);
    
                        sum = arr[0];
                        succ = arr[1];
                        loss = arr[2];
                        ttl = arr[3];
                    }
                }
                if(maxSum < sum) {
                    maxSum = sum;
                    P1 = PERC1;
                    P2 = PERC2;
                    S = succ;
                    L = loss;
                    T = ttl;
                }
            }
        }
    }
    if(P1 < P2) c(P1 - DeltPerc,P2 + DeltPerc);
    else c(P2 - DeltPerc,P1 + DeltPerc);

    let h = 'Profit;BestPERCdown;BestPERCup;Succ;Loss;Ttl\n';
    let t = `${((maxSum - 1)*100).toFixed(1)}%;${P1.toFixed(5)};${P2.toFixed(5)};${S};${L};${T}\n`;

    console.log('Profit: ' + ((maxSum - 1)*100).toFixed(1)+'%' +
    '\nPerc1: ' + P1.toFixed(5) +
    '\nPerc2: ' + P2.toFixed(5) + 
    '\nSuccess: ' + S + 
    '\nLoss: ' + L + 
    '\nTotal: ' + T);

    fs.writeFileSync('./binData/'+modeName+'.txt', h + t);
    return true;
}

