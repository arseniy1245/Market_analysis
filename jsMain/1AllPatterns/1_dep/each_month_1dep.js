module.exports = (TF,requireScript,modeName,InrevalPerc,DeltPerc) => 
{
    console.log('\n' + '\n' + modeName + '\n');
    const fs = require('fs');

    var dir = './data/klines/BTCUSDT/monthly/';
    const path = '../../../';

    const PERC_from = 0.00060; 
    const PERC_to =   0.00999;

    var h = 'Month;Profit;PERC;Success;Loss;Total\n';

    var maxSum = 0;
    var P = 0;
    var S = 0;
    var L = 0;
    var T = 0;

    const Folders = fs.readdirSync(dir + TF);
    for (let FolderName of Folders) {
        maxSum = 0;
        c(PERC_from,PERC_to,FolderName);
        function c(PERC_from,PERC_to,FolderName) {
            var Files = fs.readdirSync(dir + TF + '/' + FolderName);
            for (let PERC = PERC_from; PERC <= PERC_to; PERC += InrevalPerc) {
                var sum = 1;
                var succ = 0;
                var loss = 0;
                var ttl = 0;
                for (let FileName of Files) {
                    let ARR = fs.readFileSync(dir + TF + '/' + FolderName +'/'+ FileName, 'utf-8').split('\n');
                    pa = dir + TF + '/' + FolderName +'/'+ FileName
                    for (let i = 0; i < ARR.length - 1; i++) {
                        var a = ARR[i].split(',');

                        let arr = require(path + requireScript)
                        (Number(a[0]),Number(a[1]),Number(a[2]),Number(a[3]),Number(a[4]),PERC,sum,succ,loss,ttl);

                        sum = arr[0];
                        succ = arr[1];
                        loss = arr[2];
                        ttl = arr[3];
                    }
                }
                if(maxSum < sum) {
                    maxSum = sum;
                    P = PERC;
                    S = succ;
                    L = loss;
                    T = ttl;
                }
            }
        }
        c(P - DeltPerc,P + DeltPerc,FolderName);
        h += `${FolderName.split('.').join('-')};${((maxSum - 1)*100).toFixed(1)}%;${P.toFixed(5)};${S};${L};${T}\n`;
        console.log(FolderName,((maxSum - 1)*100).toFixed(1)+'%', P.toFixed(5),S,L,T);
    }

    fs.writeFileSync('./binData/'+modeName+'.txt', h);
    return true;
}