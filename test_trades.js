const fs = require('fs');
const readline = require('readline');

const config = JSON.parse(fs.readFileSync('config.json', 'utf-8'));


const files_trades = fs.readdirSync(config.trades_path);

//for (const file_name of files_trades)
// {
    //let csv = fs.readFileSync(`${config.trades_path}/${file_name}`, 'utf-8');

    // let stream = new fs.ReadStream(`${config.trades_path}/${file_name}`, {encoding: 'utf-8'});

    // stream.on('readable', function() {
    //     let data = stream.read();
    //     //let ARR = data.split('\n');
    //     console.log(data);
    //     stream.destroy();
    // })
    // stream.on("end", function () {
    //     console.log("All the data in the file has been read");
    // })

    // let ARR = csv.split('\n');

    // var prev_price = 1;

    // for (let i = 0; i < ARR.length; i++) {
    //     let arr = ARR[i].split(',');
    //     let price = Number(arr[1]);
    //     let time = Number(arr[4]);
    //     let def_time = new Date(time).toLocaleTimeString() + ',' + new Date(time).getMilliseconds();

    //     let change_perc = 100 - ((price * 100) / prev_price);

    //     fs.appendFileSync('yt.txt',def_time + '\t' + change_perc);
    //}


    
// }


//--------- ./data/klines/csv/1h/BTCUSDT-1h-2021-03-01.csv

const readInterface = readline.createInterface({
    input: fs.createReadStream(config.trades_path + '/BTCUSDT-trades-2022-09-13.csv'),
    output: process.stdout,
    console: false
});

var prev_price = 1;
var is_find = false;
var i = 1;

readInterface.on('line', function(line) {
    var arr = line.split(',');
    
    var time = Number(arr[4]);

    if(time > 1663072199003 && time < 1663072299003)  // 14:52 - 16:00  1663069959003  1663074059003
    {
        var price = Number(arr[1]);
        let ms = new Date(time).getMilliseconds();
        if(ms < 10) ms = '00' + ms;
        if(ms < 100) ms = '0' + ms;
    
        var def_time = new Date(time).toLocaleTimeString() + ',' + ms;
    
        var change_perc = (((price * 100) / prev_price) - 100).toFixed(6);
        prev_price = price;
        if(is_find == false && price <= 22621) 
        {
            console.log(i)
            is_find = true;
            fs.appendFileSync('yt.txt',def_time + '\t' + change_perc+'\t'+ price + '\t'+ 'true' +'\n');
            i++;
        }
        else
        {
            i++;
            fs.appendFileSync('yt.txt',def_time + '\t' + change_perc+'\t'+ price +'\n');
        }
    }
});