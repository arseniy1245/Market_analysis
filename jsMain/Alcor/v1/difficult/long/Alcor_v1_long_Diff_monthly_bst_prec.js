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


    for (let FolderName of Foldres) {
        let Files = fs.readdirSync(dir+'/'+FolderName);
        MaxSum = 0;
        BestPerc = 0;

        c(PERC_from,PERC_to);
        function c(PERC_from,PERC_to) {
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
                        let min = Number(lineArr[3]);
                        let close = Number(lineArr[4]);
    
                        let longBuy = +(open * (1 - PERC)).toFixed(2);
    
                        if(min <= longBuy) {
                            sum += ((close / longBuy) - 1) * sum;
                            if(longBuy > close) I_loss++
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
        }
        c(BestPerc-0.00011,BestPerc+0.00011);


        //console.log(FolderName.split('.').join('-')+'\t'+ ((MaxSum - 1)*100).toFixed(1) + '%'+'\t'+BestPerc.toFixed(5))

        data +=`${FolderName.split('.').join('-')};${((MaxSum - 1)*100).toFixed(1)}%;${BestPerc.toFixed(5)};${Succ};${Loss};${Ttl}\n`
    }

    let f = 'Alcor_v1_long_Diff_monthly_bst_prec.txt';
    let h = 'Month;Profit;Perc;Succ;Loss;Ttl\n';

    fs.writeFileSync('./binData/'+f,h + data);
    return true
}