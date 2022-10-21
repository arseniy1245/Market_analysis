module.exports = () => {
    const fs = require('fs');

    var dir = `./data/klines/BTCUSDT/monthly/1h`;
    const Foldres = fs.readdirSync(dir);
    let data = '';

    const PERC_from = 0.00060;  //0.00060
    const PERC_to =   0.00999;    //0.00700


    var MaxSum = 0;
    var BestPerc = 0;
    var Succ = 0;
    var Loss = 0;
    var Ttl = 0;

    var sumAll = 1;

    for (let FolderName of Foldres) {
        let Files = fs.readdirSync(dir+'/'+FolderName);
        MaxSum = 0;
        BestPerc = 0;

        var I_succ = 0;
        var I_loss = 0;
        var I_ttl = 0;

        for (let PERC = PERC_from; PERC <= PERC_to; PERC += 0.00001) {
            var sum = 1;
            for (let FileName of Files) {
                let ARR = fs.readFileSync(dir + '/' +FolderName+'/'+ FileName, 'utf-8').split('\n');

                for (let i = 0; i < ARR.length - 1; i++) {
                    var lineArr = ARR[i].split(',');

                    var open = Number(lineArr[1]);
                    var min = Number(lineArr[3]);
                    var close = Number(lineArr[4]);

                    var shortSell = +(open * (1- PERC)).toFixed(2);

                    if(min <= shortSell) {
                        sum += (1 - (shortSell / open)) * sum;
                        sum += ((close / shortSell) - 1) * sum;

                        sumAll += (1 - (shortSell / open)) * sumAll;
                        sumAll += ((close / shortSell) - 1) * sumAll;

                        I_succ++;
                    }
                    else {
                        sum -= ((close / open) -1) * sum;
                        sumAll -= ((close / open) -1) * sumAll;

                        I_loss++;
                    }
                    I_ttl++;
                }
            }
            if(MaxSum < sum) {
                MaxSum = sum;
                BestPerc = PERC;
                Succ = I_succ;
                Loss = I_loss;
                Ttl = I_ttl;
            }
        }
        //console.log(FolderName.split('.').join('-')+'\t'+ ((MaxSum - 1)*100).toFixed(1) + '%'+'\t'+BestPerc.toFixed(5))

        data +=`${FolderName.split('.').join('-')};${((MaxSum - 1)*100).toFixed(1)}%;${BestPerc.toFixed(5)};${Succ};${Loss};${Ttl}\n`
    }

    let f = 'D_Fix_mon_bst_perc.txt';
    let h = 'Month;Profit;Perc;Succ;Loss;Ttl\n';

    fs.writeFileSync('./binData/data/'+f,h + data);
    return true
}