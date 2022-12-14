module.exports = (P) => {
    const fs = require('fs');

    var dir = `./data/klines/BTCUSDT/monthly/1h`;
    const Foldres = fs.readdirSync(dir);
    let data = '';

    const PERC_from = P;  //0.00060
    const PERC_to =   P;    //0.00700


    var MaxSum = 0;
    var BestPerc = 0;
    var Succ = 0;
    var Loss = 0;
    var Ttl = 0;


    for (let FolderName of Foldres) {
        let Files = fs.readdirSync(dir+'/'+FolderName);
        MaxSum = 0;
        BestPerc = 0;

        for (let PERC = PERC_from; PERC <= PERC_to; PERC += 0.0001) {
            var sum = 1;
            var I_succ = 0;
            var I_loss = 0;
            var I_ttl = 0;
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

    let f = 'Alcor_v1_long_Diff_monthly_fix_prec.txt';
    let h = 'Month;Profit;Perc;Succ;Loss;Ttl\n';

    fs.writeFileSync('./binData/'+f,h + data);
    return true
}