module.exports = async () => {
    const fs = require('fs');

    let dir = `./data/klines/BTCUSDT/monthly/1h`;
    const Foldres = fs.readdirSync(dir);

    const PERC_from = 0.00060;  //0.00060
    const PERC_to =   0.00999;    //0.00700


    var MaxSum = 0;
    var BestPerc = 0;
    var Succ = 0;
    var Loss = 0;
    var Ttl = 0;

    c(PERC_from,PERC_to);
    function c(PERC_from,PERC_to) {
        for (let PERC = PERC_from; PERC <= PERC_to; PERC += 0.0001) {
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
                        let max = Number(lineArr[3]);
                        let close = Number(lineArr[4]);
    
                        let shortBuy = +(open * (1 + PERC)).toFixed(2);
    
                        if(max >= shortBuy) {
                            sum += (1 - (close / shortBuy)) * sum;
                            if(shortBuy < close) I_loss++
                            else I_succ++;
                        }
                        I_ttl++;
                    }
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
    }
    c(BestPerc-0.00011,BestPerc+0.00011)

    // console.log(((MaxSum - 1)*100).toFixed(1) + '%', BestPerc,Succ,Loss,Ttl);

    let t = 'Alcor_v1_short_Diff_all.txt';
    let h = 'Best Perc;Profit;Succ;Loss;Ttl\n';
    let data = `${BestPerc.toFixed(5)};${((MaxSum - 1)*100).toFixed(1)}%;${Succ};${Loss};${Ttl}\n`
    fs.writeFileSync('./binData/'+t,h + data);
    return BestPerc.toFixed(5)
}