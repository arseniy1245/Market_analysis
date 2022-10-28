const fs = require('fs');

const R = ';';


//       0     1 2   3     4       5       6    7
//    [time,open,3,sell,timeSell,close,profPerc,1]

const dir = './binData/';
const Files = fs.readdirSync(dir);

var h = 'Month;Perc;Delt;Prof Fix;Prof Dif;Green;Red\n'
var h2 = 'Month;Perc;Delt;Prof Fix;Prof Dif;Green;Red';
for (let i = 0; i < 25; i++) {
    h2 += ';' + i
}
h2 += '\n';

for (let FileName of Files) {
    var ARR = JSON.parse(fs.readFileSync(dir + '/' +FileName, 'utf-8'));
    let m = FileName.split('.');
    let Month = m[1]+'-'+m[0];

    const PERC = 0.00240;
    var TarArr = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    var TimeExeArr = [];
    for (let i = 0; i < 62; i++) {TimeExeArr.push(0)}
    var ProfitArr = 0;
    var GreenKlines = 0;
    var RedKlines = 0;
    var sum = 1;
    var fix = 0;
    
    for (let i = 0; i < ARR.length; i++) {
        
        let tarPass = ARR[i][2];
        TarArr[tarPass] = TarArr[tarPass] + 1;
    
        let timeExe = ARR[i][4];
        if(timeExe == null) TimeExeArr[61] = TimeExeArr[61] + 1;
        else TimeExeArr[new Date(timeExe).getMinutes()] = TimeExeArr[new Date(timeExe).getMinutes()] + 1;

        let profit = +ARR[i][6].toFixed(6);
        if(profit > PERC) ProfitArr++;
    
        if(ARR[i][7] === 1) GreenKlines++
        else RedKlines++;
    
        let prPerc = ARR[i][6];
        sum = sum * (1 + prPerc);
        fix += prPerc;
    }
    let ttlK = GreenKlines + RedKlines;
    let gr = (GreenKlines/ttlK * 100).toFixed(0);
    let re = (RedKlines/ttlK * 100).toFixed(0);
    h += Month+R+0+R+0+R+(fix*100).toFixed(1)+'%'+R+((sum-1)*100).toFixed(1)+'%'+R+gr+'%'+R+re+'%';
    h2 += h;
    for (let i = 0; i < TarArr.length; i++) {
        h2 += ';'+TarArr[i]
    }
    h += '\n';
    h2 += '\n';

}
fs.writeFileSync('./1.txt',h)
fs.writeFileSync('./2.txt',h2)
    // console.log(TarArr,ProfitArr,GreenKlines,RedKlines)
    // console.log(((sum-1) * 100).toFixed(2))
    // console.log(TimeExeArr)
    // let t = ''
    // for (let i = 0; i < TimeExeArr.length; i++) {
    //     t+= ';'+i
    // }
    // t += '\n';
    // for (let i = 0; i < TimeExeArr.length; i++) {
    //     t+= ';' + TimeExeArr[i]
    // }
    // console.log(t)
// }
