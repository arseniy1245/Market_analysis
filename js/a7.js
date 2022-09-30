const fs = require('fs');

const dir = './data/klines/BTCUSDT/csv/1h'
const files = fs.readdirSync(dir);


const PERC_from = 0.00290;  //0.00060
const PERC_to = 0.00290;    //0.00700


var allProfit = 0;
var av_prec = 0;
var av_I = 1;
var year = '2021';
var month = '03';


calcAll(0.00060, 0.00700);
function calcAll(PERC_from,PERC_to) {
    console.log('All from: ' + PERC_from + ' to: ' + PERC_to);
    var max = 0;
    var p = 0;

    for (let PERC = PERC_from; PERC <= PERC_to; PERC += 0.00001) {
        var I_succ = 0;
        var I_loss = 0;
        var ttlProfit = 0;

        for (let file_name of files) {
            let ARR = fs.readFileSync(dir + '/' + file_name, 'utf-8').split('\n');

            for (let i = 0; i < ARR.length - 1; i++) {
                var lineArr = ARR[i].split(',');
                var sell = Number(lineArr[1]) * (1 + PERC);
                var open = Number(lineArr[1]);
                if(Number(lineArr[2]) >= sell) {
                    ttlProfit += sell / open - 1;
                    I_succ++;
                }
                else {
                    let close = Number(lineArr[4]);
                    ttlProfit += close / open - 1;
                    I_loss++;
                }
            }
        }
        if(max < ttlProfit) {
            max = ttlProfit;
            p = PERC;
        }
    }
    console.log((max * 100).toFixed(1) + '%', p.toFixed(5));
}

// calc()
function calc() {
    var max = 0;
    var p = 0;

    var ttlOrdres;
    var ttlSuccessOrders;
    var ttlLossOrders;

    for (let PERC = PERC_from; PERC <= PERC_to; PERC+= 0.00001) {
        var ttlProfit = 0;
        var I = 0;
        var I_loss = 0;
        var I_succ = 0;
        var ttlLoss = 0;
        var ttlSucc = 0;
    
        for (let file_name of files) {
            let name = file_name.split('-');
        
            if(name[2] == year && name[3] == month) {
                let ARR = fs.readFileSync(dir + '/' + file_name, 'utf-8').split('\n');
        
                for (let i = 0; i < ARR.length - 1; i++) {
                    var lineArr = ARR[i].split(',');
                    var sell = Number(lineArr[1]) * (1 + PERC);
                    var open = Number(lineArr[1]);
                    if(Number(lineArr[2]) >= sell) {
                        ttlProfit += sell / open - 1;
                        // ttlSucc += sell / open - 1;
                        I_succ++;
                        //console.log(open.toFixed(0),sell.toFixed(0),Number(lineArr[2]).toFixed(0),sell / open)
                    }
                    else {
                        let close = Number(lineArr[4]);
                        ttlProfit += close / open - 1;
                        I_loss++;
                        // ttlLoss += close / open - 1;
                        //console.log((close / open - 1).toFixed(4))
                    }
                    I++;
                }
            }
            
        }
        if(ttlProfit > max) {
            max = ttlProfit;
            p = PERC;
            ttlOrdres = I;
            ttlSuccessOrders = I_succ;
            ttlLossOrders = I_loss;
        }
    }

    // if(PERC = PERC_to) {
    //     allProfit += max;
    //     av_prec += p;
    //     av_I++;
    // }
    
    console.log(month + '.' + year, (max * 100).toFixed(1) + '%',p.toFixed(5), ttlOrdres, ttlSuccessOrders, ttlLossOrders, ' ~' + (ttlSuccessOrders / ttlOrdres * 100).toFixed(2) + '%');
    month = Number(month) + 1;
    if(month < 10) month = '0' + month;
    else if(Number(month) > 12) {month = '01', year = '2022'};
    // console.log(month + '.' + year,(allProfit*100).toFixed(0), (av_prec / av_I).toFixed(5));
    calc();
    // console.log((ttlProfit + 1).toFixed(3), I, I_loss, I_succ, (ttlLoss - 1).toFixed(3),(ttlSucc + 1).toFixed(3));
}


//difficPerc()
function difficPerc() {
    var sum = 100;
    var last = null;
    var suc = 1;
    var loss = 1;
    var maxSuc = 0;
    var maxLoss = 0;

    var maxDrop = 0;

    var prevMonth = '03';
    var stMonth = 0;
    // var endMonth = 0;
    for (let PERC = PERC_from; PERC <= PERC_to; PERC += 0.00001) {

        for (let file_name of files) {
            let ARR = fs.readFileSync(dir + '/' + file_name, 'utf-8').split('\n');
            let month = file_name.split('-')[3] 
            if(prevMonth != month) {
                pr = sum - stMonth;
                console.log(prevMonth, pr.toFixed(2), ((sum / stMonth - 1 ) * 100).toFixed(2) + '%', '\n-------------');
                stMonth = sum;
                prevMonth = month;
            }

            for (let i = 0; i < ARR.length - 1; i++) {
                var lineArr = ARR[i].split(',');
                var sell = Number(lineArr[1]) * (1 + PERC);
                var open = Number(lineArr[1]);
                if(Number(lineArr[2]) >= sell) {
                    sum = sum / open * sell;
                    //console.log(sum.toFixed(3))
                    loss = 1;
                    if(last == true) suc++;
                    last = true;
                    if(maxSuc < suc) maxSuc = suc;
                }
                else {
                    let close = Number(lineArr[4]);
                    sum = sum / open * close;
                    let drop = close / open - 1;
                    //console.log(sum.toFixed(3), (drop * 100).toFixed(2))
                    if(maxDrop > drop) maxDrop = drop;
                    suc = 1;
                    if(last = false) loss++;
                    last = false;
                    if(maxLoss < loss) maxLoss = loss;
                }
            }
        }
    }
    console.log(sum.toFixed(3), maxSuc, maxLoss, maxDrop);
}

// fixSum()
function fixSum() {
    var sum = 100;

    var endSum = 0;

    for (let PERC = PERC_from; PERC <= PERC_to; PERC += 0.00001) {

        for (let file_name of files) {
            let ARR = fs.readFileSync(dir + '/' + file_name, 'utf-8').split('\n');

            for (let i = 0; i < ARR.length - 1; i++) {
                var lineArr = ARR[i].split(',');
                var sell = Number(lineArr[1]) * (1 + PERC);
                var open = Number(lineArr[1]);
                if(Number(lineArr[2]) >= sell) {
                    endSum += (sum / open * sell) - sum;
                }
                else {
                    let close = Number(lineArr[4]);
                    endSum += (sum / open * close) - sum;
                }
            }
        }
    }
    console.log(endSum.toFixed(3));
}