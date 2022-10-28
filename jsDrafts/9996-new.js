const fs = require('fs');

// const dir = './data/klines/BTCUSDT/csv/1m'
const dir = './data/klines/BTCUSDT/monthly/1m';
const Files = fs.readdirSync(dir);

var MaxProfit = 0;
var MaxPerc = 0;
var MaxDelt = 0;
var MaxDealsArr = [];
var MaxSum = 0;

for (let FileName of Files) {
    MaxProfit = 0;
    MaxPerc = 0;
    MaxDelt = 0;
    MaxDealsArr = [];
    MaxSum = 0;

    let m = FileName.split('-');
    let Name = m[2] + '.' + m[3];


    for (let PERC = 0.00060; PERC < 0.00400; PERC+=0.00010) {
        for (let DELT = 1; DELT < 4; DELT+=0.5) {
            var TTLprofit = 0;
            var sum = 1;

            var DealsArr = [];  //    [time,open,3,sell,timeSell,close,profPerc,1]
            var IsSell = false;
            var TarCount = 0;
            // var isD = false;
            // for (let FileName of Files) {
            // if(isD == false) {
                isD = true;
                // var minArr = [];
                // var maxArr = [];
                var openHour = 0;
                var closeHour = 0;
                // var timeHour = 0;
            
                var profitHour = 0;
            
                // var firstTarget = 0;
                // var target1 = 0;
                var TargetsArr = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
                var lastTargetPass = -1;
                // var isReach = false;
            
                // let m = FileName.split('-');
                // if(m[2] === '2022' && m[3] === '09') {
                    // let ARR = fs.readFileSync(dir +'/'+ FileName, 'utf-8').split('\n');
            
                    let ARR = fs.readFileSync(dir + '/' + FileName, 'utf-8').split('\n');
                    for (let i = 0; i < ARR.length - 1; i++) {
                        var lineArr = ARR[i].split(',');
                
                        var time = Number(lineArr[0]);
            
                        var open = Number(lineArr[1]);
                        var max = Number(lineArr[2]);
                        var min = Number(lineArr[3]);
                        var close = Number(lineArr[4]);
            
                        
            
                        if(i % 60 === 0) {
                            timeHour = time;
                            openHour = open;
            
                            profitHour = 0;
                            // TargetsArr = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
                            lastTargetPass = -1;
                            IsSell = false;
                            TarCount = 0;
                            TargetsArr[0] = +((1 + PERC) * openHour).toFixed(2);
                            for (let i2 = 1; i2 < TargetsArr.length; i2++) {
                                TargetsArr[i2] = TargetsArr[i2-1] + DELT;
                            }
                            // console.log(TargetsArr)
                            closeHour = 0;
                        }
            
                        if(IsSell == false) {
                            if(lastTargetPass != -1) {
                                var sellPrice = TargetsArr[lastTargetPass];
                                    // console.log(new Date(time).toLocaleTimeString(),close,TargetsArr[lastTargetPass] )
                                    if(min < sellPrice) {
                                        profitHour = sellPrice / openHour - 1;
                                        sum = (1 + profitHour) * sum;
                                        IsSell = true;
                                        TarCount = lastTargetPass+1;
                                        DealsArr.push([timeHour,openHour,TarCount,sellPrice,time,0,profitHour,1])
                                        
                                        // console.log('Pass tar ' + TargetsArr[lastTargetPass] +', and go down, sell at '+TargetsArr[lastTargetPass])
                                        // console.log(new Date(time).toLocaleTimeString())
                                        
                                    }
                                    else {
                                        for (let i3 = 0; i3 < TargetsArr.length; i3++) {
                                            if(max > TargetsArr[i3]) {
                                                lastTargetPass = i3;   
                                            }
                                            else break;
                                        }
                                        if(close < sellPrice) {
                                            profitHour = sellPrice / openHour - 1;
                                            IsSell = true;
                                            sum = (1 + profitHour) * sum;
                                            TarCount = lastTargetPass+1;
                                            DealsArr.push([timeHour,openHour,TarCount,sellPrice,time,0,profitHour,1])
                                            // console.log('Pass tar ' + TargetsArr[lastTargetPass] +', and go down, sell at '+TargetsArr[lastTargetPass])
                                            // console.log(new Date(time).toLocaleTimeString())
                                        }
                                    }
                            }
                            else {
                                for (let i3 = 0; i3 < TargetsArr.length; i3++) {
                                    if(max > TargetsArr[i3]) {
                                        lastTargetPass = i3;
                                    }
                                    //else break;
                                }
                                // console.log(new Date(time).toLocaleTimeString(),close,TargetsArr[lastTargetPass] )
                                if(lastTargetPass != -1) {
                                    if(close < TargetsArr[lastTargetPass]) {
                                        profitHour = TargetsArr[lastTargetPass] / openHour - 1;
                                        IsSell = true;
                                        sum = (1 + profitHour) * sum;
                                        TarCount = lastTargetPass+1;
                                        DealsArr.push([timeHour,openHour,TarCount,TargetsArr[lastTargetPass],time,0,profitHour,1])
                                        // console.log('Pass tar ' + TargetsArr[lastTargetPass] +', and go down, sell at '+TargetsArr[lastTargetPass])
                                        // console.log(new Date(time).toLocaleTimeString())
                                    }
                                }
                            }
                        }
            
            
            
            
                        if((i+1) % 60 === 0) {
                            closeHour = close;
                            if(profitHour == 0) {
                                profitHour = (closeHour / openHour - 1);
                                sum = (1 + profitHour) * sum;
                                let k = 0;
                                if(openHour < closeHour) k = 1;
                                DealsArr.push([timeHour,openHour,0,0,null,closeHour,profitHour,k])
                                
                            }
                            DealsArr[DealsArr.length-1][5] = closeHour;
                            TTLprofit += profitHour;
                        }
                    }
                // }
                //else {break}
            // }
            
            // }
            // console.log(TTLprofit.toFixed(8),ii)
            
            // console.log(new Date(1666745940000))
            if(MaxProfit < TTLprofit) {
                MaxProfit = Number(TTLprofit);
                MaxPerc = PERC;
                MaxDelt = DELT;
                MaxSum = sum;
                MaxDealsArr = DealsArr;
            }
        }

    }
    fs.writeFileSync('./BinData/'+Name+'.json', JSON.stringify(MaxDealsArr, null, 2))
    console.log(Name);
    console.log((MaxProfit*100).toFixed(1)+'%',MaxPerc.toFixed(5),MaxDelt);
    console.log(((MaxSum-1)*100).toFixed(1)+'%',MaxPerc.toFixed(5),MaxDelt + '\n')

    // var ARR = MaxDealsArr;
    // const PERC = 0.00240;
    // var TarArr = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    // var TimeExeArr = [];
    // var ProfitArr = 0;
    // var GreenKlines = 0;
    // var RedKlines = 0;
    // var sum = 1;

    // for (let i = 0; i < ARR.length; i++) {
    //     let tarPass = ARR[i][2];
    //     TarArr[tarPass] = TarArr[tarPass] + 1;

    //     let timeExe = ARR[i][4];
    //     if(timeExe === null) TimeExeArr[61] = TimeExeArr[61] + 1;
    //     else TimeExeArr[new Date(timeExe).getMinutes()] = TimeExeArr[new Date(timeExe).getMinutes()] + 1;

    //     let profit = +ARR[i][6].toFixed(6);
    //     if(profit > PERC) ProfitArr++;

    //     if(ARR[i][7] === 1) GreenKlines++
    //     else RedKlines++;

    //     let prPerc = ARR[i][6];
    //     sum = sum * (1 + prPerc);
    // }
    // // console.log(TarArr,ProfitArr,GreenKlines,RedKlines)
    // console.log(((sum-1) * 100).toFixed(2) + '%')
}