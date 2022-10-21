// module.exports = () => {
    const fs = require('fs');

    let dir = `./data/klines/BTCUSDT/monthly/1h`;
    const Foldres = fs.readdirSync(dir);

    const PERC_from = 0.00060;  //0.00060
    const PERC_to =   0.00999;    //0.00700


    var MaxSum = 0;
    var BestPercDrop = 0;
    var BestPercUp = 0;
    var Succ = 0;
    var Loss = 0;
    var Ttl = 0;

    for (let PERCdrop = PERC_from; PERCdrop <= PERC_to; PERCdrop += 0.00001) {
        for (let PERC = PERC_from; PERC <= PERC_to; PERC += 0.00001) {
            let sum = 1;
            let I_succ = 0;
            let I_loss = 0;
            let I_ttl = 0;
    
            for (let FolderName of Foldres) {
                let Files = fs.readdirSync(dir+'/'+FolderName);
    
                for (let FileName of Files) {
                    let ARR = fs.readFileSync(dir + '/' +FolderName+'/'+ FileName, 'utf-8').split('\n');
    
                    for (let i = 0; i < ARR.length - 1; i++) {
                        let lineArr = ARR[i].split(',');
    
                        let open = Number(lineArr[1]);
                        let min = Number(lineArr[3]);
                        let close = Number(lineArr[4]);
    
                        let shortSell = +(open * (1- PERCdrop)).toFixed(2);
    
                        if(min <= shortSell) {
                            sum += (1 - (shortSell / open)) * sum;
                            sum += ((close / shortSell) - 1) * sum;
                            I_succ++;
                        }
                        else {
                            sum -= ((close / open) -1) * sum;
                            I_loss++;
                        }
                        I_ttl++;
                    }
                }
            }
            if(MaxSum < sum) {
                MaxSum = sum;
                BestPercDrop = PERCdrop;
                BestPercUp = PERC;
                Succ = I_succ;
                Loss = I_loss;
                Ttl = I_ttl;
            }
        }
    }

    // console.log(((MaxSum - 1)*100).toFixed(1) + '%', BestPerc,Succ,Loss,Ttl);
    let t = 'D_Dif_all.txt';
    let h = 'Perc Drop;Perc Up;Profit;Succ;Loss;Ttl\n';
    let data = `${BestPercDrop.toFixed(5)};${BestPercUp.toFixed(5)};${((MaxSum - 1)*100).toFixed(1)}%;${Succ};${Loss};${Ttl}\n`
    fs.writeFileSync('./binData/data/'+t,h + data);
    return true
// }