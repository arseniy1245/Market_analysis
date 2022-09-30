
//! -----------------------------------   ONLY RU TIME  ----------------------

const got = require('got');
const fs = require('fs');
const AdmZip = require('adm-zip');



const PAIR = 'SOLUSDT';
const TF = [
    '1m',

    '1d',
    '2h',
    '1h',
    '30m',
    '15m',
    '5m',
    '3m',
]



const path_main = 'y.txt';  //  C:/Arseniy/all_progs/Antares/data/klines/csv/1h/BTCUSDT-1h-2021-03-01.csv
const path_1m = `C:/Arseniy/all_progs/Antares/data/klines/${PAIR}/csv/1m/${PAIR}-1m-`;
const path_csv_1h = `./data/klines/${PAIR}/csv/1h`;
const path_download = `./data/klines/${PAIR}/csv/`;


get_data();

var arr = [];
for (let i_create_arr = 0; i_create_arr <= 60; i_create_arr++) {
    arr.push([0,0,0])
}
var ttl_ex = 0;
var ttl_profit = 0;
var ttl_green = 0;

var csv = fs.readFileSync(path_main, 'utf-8');
var arr_of_csv = csv.split('\n');


//? ===================================================

const drop_perc_from = 0.00408;
const drop_perc_to = 0.00408;
const step = 0.00001;

//all();
// month_statistic('2022', '02');
// month_statistic('2022', '03');
// month_statistic('2022', '04');
// month_statistic('2022', '05');
// month_statistic('2022', '06');
// month_statistic('2022', '07');
// month_statistic('2022', '08');
// month_statistic('2022', '09');


//dif_perc('2022','09', 0.00330, 0.00400, 0.00001)

//? ====================================================




function transform_date_to_file_name(ms,i,period)
{
    let t = new Date(ms);
    let arr_date = new Date(t.setDate(t.getDate() + i)).toLocaleDateString().split('.');
    return `${PAIR}-${period}-${arr_date[2]}-${arr_date[1]}-${arr_date[0]}`;
}

async function download(file_name, period)
{
    let url = `https://data.binance.vision/data/spot/daily/klines/${PAIR}/${period}/${file_name}.zip`;
    const data = await got.get(url).buffer();
    const zip = new AdmZip(data);
    zip.extractAllTo(path_download + period, true);
    

    // if(period == '1h')
    // {
    //     let date = `date,${file_name.slice(11,file_name.length)}.csv\n`;
    //     fs.appendFileSync('./y.txt', date + fs.readFileSync(`${path_download}/${period}/${file_name}.csv`, 'utf-8'));
    // }
    
    console.log('Successfully downloaded: ' + file_name)
}

function get_data()
{
    var last = '';
    const files = fs.readdirSync(path_csv_1h);
    for (const file_name of files) {last = file_name}

    last = last.slice(11,last.length-4).split('-');

    var t = new Date();
    var yest = t.setDate(t.getDate() - 1);
    var last_t = t.setFullYear(Number(last[0]),Number(last[1]) -1 ,Number(last[2]));
    let delt = (yest - last_t) / 1000 / 60 / 60 / 24;

    let i = 1;
    check_and_download();
    async function check_and_download()
    {
        if(i <= delt)
        {
            for (let i2 = 0; i2 < TF.length; i2++) {
                download(transform_date_to_file_name(last_t,i,TF[i2]),TF[i2]);
            }
            // function d() {
            //     download(transform_date_to_file_name(last_t,i,TF[i]),TF[i]);
            //     i++;
            // }

            //await download(transform_date_to_file_name(last_t,i,TF[0]),TF[0]);

            // await download(transform_date_to_file_name(last_t,i,TF[1]),TF[1]);
            // await download(transform_date_to_file_name(last_t,i,TF[2]),TF[2]);
            // await download(transform_date_to_file_name(last_t,i,TF[3]),TF[3]);
            // await download(transform_date_to_file_name(last_t,i,TF[4]),TF[4]);
            // await download(transform_date_to_file_name(last_t,i,TF[5]),TF[5]);
            // await download(transform_date_to_file_name(last_t,i,TF[6]),TF[6]);
            // await download(transform_date_to_file_name(last_t,i,TF[7]),TF[7]);
            i++;
            check_and_download();
        }
        else 
        {
            console.log('Its latest data');
        }
    }
}





function all() {
    for (var i0 = drop_perc_from; i0 <= drop_perc_to; i0+= step) {
        
        for (let i = 0; i < arr_of_csv.length; i++)
        {
            var line_arr = arr_of_csv[i].split(',');
            var date;
            var time = line_arr[0];
            var open = line_arr[1];
            //let max;
            var min;
            var close;
    
            var isProfit = 0;
    
            if(time == 'date') {date = open;}
            else
            {
                //max = line_arr[2];
                min = Number(line_arr[3]);
                close = line_arr[4];
    
                let entry_price = +(open * (1 - i0.toFixed(5))).toFixed(2);
                if(entry_price >= min)
                {
                    ttl_ex++;
                    if(open < close) {isProfit++;ttl_green++;}
    
                    var profit = Number((close / entry_price - 1).toFixed(4));
                    ttl_profit += profit;
                    let arr_csv_1m = fs.readFileSync(`${path_1m}${date}`, 'utf-8').split('\n');
    
                    let i_in_1m = arr_csv_1m.findIndex(a =>a.split(',')[0] == time);
    
                    for (let i2 = i_in_1m; i2 < i_in_1m + 60 && i_in_1m > -1; i2++)
                    {
                        let line_arr_1m = arr_csv_1m[i2].split(',');
                        let time_1m = line_arr_1m[0];
                        //let open_1m = line_arr_1m[1];
                        //let max_1m = line_arr_1m[2];
                        let min_1m = Number(line_arr_1m[3]);
                        if(entry_price >= min_1m)
                        {
                            let delt = +((Number(time_1m) - Number(time)) / 1000 / 60).toFixed();
    
                            arr[delt][0] += 1;
                            arr[delt][1] += isProfit;
                            arr[delt][2] += profit;
    
                            break;
                        }
                    }
                }
            }
        }
        console.log(i0.toFixed(5) + ':\n');
    
        var ttl_profit_plus = 0;
    
        for (let i3 = 1; i3 < arr.length; i3++) {
            let minute = i3;
            let ex = '000';
            let green = '000';
            let perc = '-----';
            let profit = arr[i3][2].toFixed(4);
    
            if(i3 < 10) {minute = '0' + i3;}
    
            switch (arr[i3][0].toString().length) {
                case 1:
                    ex = arr[i3][0] + ' '+ ' ';
                break;
    
                case 2:
                    ex = arr[i3][0] + ' ';
                break;
    
                case 3:
                    ex = arr[i3][0];
                break;
            }
    
            switch (arr[i3][1].toString().length) {
                case 1:
                    green = arr[i3][1] + ' '+ ' ';
                break;
    
                case 2:
                    green = arr[i3][1] + ' ';
                break;
    
                case 3:
                    green = arr[i3][1];
                break;
            }
    
            if(arr[i3][1] != 0 && arr[i3][0] != 0)
            {
                perc = Number(arr[i3][1] / arr[i3][0] * 100);
                if(perc < 10) {perc = perc.toFixed(2) + '%'}
                else {perc = perc.toFixed(1) + '%'}
            }
    
            if(profit > 0) {ttl_profit_plus += Number(profit)}
    
            if(profit >= 0) {profit = ' ' + profit}
            console.log(`${minute} min: \t Ex: ${ex} \t Green: ${green}\t${perc} \t${profit}`);
    
            
        }
       // console.log(` \t\t\t     ${ttl_ex}     ${ttl_profit}`);
        //console.log(' '+' '+' '+' '+' '+' '+' '+' \t ' +'TL: ' + ttl_ex);
        console.log('__________ ' +'TL: ' + ttl_ex + '_ TL: ' + ttl_green + ' __________ ' + ttl_profit.toFixed(4));
        console.log('__________ ' +'TL: ' + ttl_ex + '_ TL: ' + ttl_green + ' __________ ' + ttl_profit_plus.toFixed(4));
    
        console.log('\n')
        
    }
}

function month_statistic(year, month) {

    var isFind = false;
    var date_arr = [];

    for (var i0 = drop_perc_from; i0 <= drop_perc_to; i0+= step) {
        for (let i = 0; i < arr_of_csv.length; i++)
        {
            var line_arr = arr_of_csv[i].split(',');
            var date;
            var time = line_arr[0];
            var open = line_arr[1];
            //let max;
            var min;
            var close;
    
            var isProfit = 0;

           
    
            if(time == 'date') {

                date = open;
                date_arr = open.split('-');

                //if(isFind == true) {break;}
            }
            else
            {
                if(date_arr[0] == year && date_arr[1] == month)
                {
                    isFind = true;

                    min = Number(line_arr[3]);
                    close = line_arr[4];
        
                    let entry_price = +(open * (1 - i0.toFixed(5))).toFixed(2);
                    if(entry_price >= min)
                    {
                        ttl_ex++;
                        if(open < close) {isProfit++;ttl_green++;}
        
                        var profit = Number((close / entry_price - 1).toFixed(4));
                        ttl_profit += profit;
                        let arr_csv_1m = fs.readFileSync(`${path_1m}${date}`, 'utf-8').split('\n');
        
                        let i_in_1m = arr_csv_1m.findIndex(a =>a.split(',')[0] == time);
        
                        for (let i2 = i_in_1m; i2 < i_in_1m + 60 && i_in_1m > -1; i2++)
                        {
                            let line_arr_1m = arr_csv_1m[i2].split(',');
                            let time_1m = line_arr_1m[0];
                            //let open_1m = line_arr_1m[1];
                            //let max_1m = line_arr_1m[2];
                            let min_1m = Number(line_arr_1m[3]);
                            if(entry_price >= min_1m)
                            {
                                let delt = +((Number(time_1m) - Number(time)) / 1000 / 60).toFixed();
        
                                arr[delt][0] += 1;
                                arr[delt][1] += isProfit;
                                arr[delt][2] += profit;
        
                                break;
                            }
                        }
                    }
                }
                else
                {
                    if(isFind == true) {break};
                }
            }
        }
        console.log(i0.toFixed(5) + ':\n');
    
        var ttl_profit_plus = 0;
    
        for (let i3 = 1; i3 < arr.length; i3++) {
            let minute = i3;
            let ex = '000';
            let green = '000';
            let perc = '-----';
            let profit = arr[i3][2].toFixed(4);
    
            if(i3 < 10) {minute = '0' + i3;}
    
            switch (arr[i3][0].toString().length) {
                case 1:
                    ex = arr[i3][0] + ' '+ ' ';
                break;
    
                case 2:
                    ex = arr[i3][0] + ' ';
                break;
    
                case 3:
                    ex = arr[i3][0];
                break;
            }
    
            switch (arr[i3][1].toString().length) {
                case 1:
                    green = arr[i3][1] + ' '+ ' ';
                break;
    
                case 2:
                    green = arr[i3][1] + ' ';
                break;
    
                case 3:
                    green = arr[i3][1];
                break;
            }
    
            if(arr[i3][1] != 0 && arr[i3][0] != 0)
            {
                perc = Number(arr[i3][1] / arr[i3][0] * 100);
                if(perc < 10) {perc = perc.toFixed(2) + '%'}
                else {perc = perc.toFixed(1) + '%'}
            }
    
            if(profit > 0) {ttl_profit_plus += Number(profit)}
    
            if(profit >= 0) {profit = ' ' + profit}
            console.log(`${minute} min: \t Ex: ${ex} \t Green: ${green}\t${perc} \t${profit}`);
    
            
        }
       // console.log(` \t\t\t     ${ttl_ex}     ${ttl_profit}`);
        //console.log(' '+' '+' '+' '+' '+' '+' '+' \t ' +'TL: ' + ttl_ex);
        console.log('__________ ' +'TL: ' + ttl_ex + '_ TL: ' + ttl_green + ' __________ ' + ttl_profit.toFixed(4));
        console.log('__________ ' +'TL: ' + ttl_ex + '_ TL: ' + ttl_green + ' __________ ' + ttl_profit_plus.toFixed(4));
    
        console.log('\n')
        
    }
}

function dif_perc(year, month, from, to, step)
{
    const files = fs.readdirSync(path_csv_1h);

    var prev_perc = 0.00408;
    var day_number = 1;

    for (const file_name of files)
    {
        var isFind = false;
        var profit = 0;
        let name_arr = file_name.split('-');

        if(name_arr[2] == year && name_arr[3] == month)
        {
            isFind = true;
            var in_file = fs.readFileSync(`${path_csv_1h}/${file_name}`, 'utf-8');
            var arr = in_file.split('\n');

            for (let i = 0; i < arr.length; i++) {
                let line_arr = arr[i].split(',');
                let open = line_arr[0];
                let min = line_arr[2];
                let close = line_arr[3];
                
                let entry_price = +(open * (1 - prev_perc.toFixed(5))).toFixed(2);
                if(entry_price >= min)
                {
                    profit += Number((close / entry_price - 1).toFixed(4)); 
                }
            }

            var arr_of_profit = [];
            for (let i = from; i <= to; i+=step) {
                var test_profit = 0;

                for (let i = 0; i < arr.length; i++) {
                    let line_arr = arr[i].split(',');
                    let open = line_arr[0];
                    let min = line_arr[2];
                    let close = line_arr[3];
                    
                    let entry_price = +(open * (1 - prev_perc.toFixed(5))).toFixed(2);
                    if(entry_price >= min)
                    {
                        test_profit += Number((close / entry_price - 1).toFixed(4)); 
                    }
                }
                arr_of_profit.push(test_profit);
            }
            console.log(Math.max(arr_of_profit))
            console.log(arr_of_profit.indexOf(Math.max(arr_of_profit)))
        }
        else
        {
            if(isFind == true) break
        }
        console.log(day_number,profit)
        day_number++;
    }
}