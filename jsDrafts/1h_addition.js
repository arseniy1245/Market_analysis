const fs = require('fs');

var dir = `./data/klines/BTCUSDT/csv/1m`;
const Files = fs.readdirSync(dir);

// for (let FileName of Files) {
//     let m = FileName.split('-');
//     if(m[2] === '2022' && m[3] === '09') {
//         let ARR = fs.readFileSync(dir +'/'+ FileName, 'utf-8').split('\n');
//         if(ARR.length - 1 != 1440) {console.log('a')}
//     }
// }

var ii = 1;
for (let FileName of Files) {

    var minArr = [];
    var maxArr = [];
    var openH = 0;
    var closeH = 0;
    var timeH = 0;
    let m = FileName.split('-');
    if(m[2] === '2022' && m[3] === '09') {
        let ARR = fs.readFileSync(dir +'/'+ FileName, 'utf-8').split('\n');
        for (let i = 0; i < ARR.length - 1; i++) {
            var lineArr = ARR[i].split(',');
    
            var time = Number(lineArr[0]);

            var open = Number(lineArr[1]);
            var max = Number(lineArr[2]);
            var min = Number(lineArr[3]);
            var close = Number(lineArr[4]);

            if(i % 60 === 0) {
                timeH = time;
                openH = open;
                minArr = [];
                maxArr = [];
                closeH = 0;
            }

            minArr.push(min);
            maxArr.push(max);

            if((i+1) % 60 === 0) {
                closeH = close;
                var minH = Math.min.apply(null, minArr);
                var maxH = Math.max.apply(null, maxArr)
                maxIndex = maxArr.indexOf(maxH);
                minIndex = minArr.indexOf(minH);
                
                // console.log(ii,maxH,minH);
                // ii++;

                var EndArr = [timeH,openH,0,0,0,0,0,0]; ////////

                if(minIndex < maxIndex) {
                    var lmax = 0;
                    for (let iLocalMax = 0; iLocalMax < minIndex; iLocalMax++) {
                        let localMax = Number(maxArr[i]);
                        if(lmax < localMax) lmax = localMax;
                    }
                    EndArr[7] = 0;
                    EndArr[2] = lmax;
                    EndArr[3] = minH;
                    EndArr[4] = maxH;

                    var lmin = 0;
                    for (let iLocalMin = maxIndex + 1; iLocalMin < minIndex.length; iLocalMin++) {
                        let localMin = Number(minArr[i]);
                        if(localMin < localMin) localMin = localMin;
                    }
                    EndArr[5] = lmin;
                    EndArr[6] = closeH;

                    //console.log(lmax,lmin)
                }
                else {
                    let lmin = 0;
                    for (let iLocalMin = 0; iLocalMin < maxIndex; iLocalMin++) {
                        let localMin = Number(minArr[i]);
                        if(lmin < localMin) lmin = localMin;
                    }
                    EndArr[7] = 1;
                    EndArr[2] = lmin;
                    EndArr[3] = maxH;
                    EndArr[4] = minH;

                    let lmax = 0;
                    for (let iLocalMin = maxIndex + 1; iLocalMin < minIndex.length; iLocalMin++) {
                        let localMin = Number(minArr[i]);
                        if(lmax < localMin) lmax = localMin;
                    }
                    EndArr[5] = lmax;
                    EndArr[6] = closeH;
                }
                let t = EndArr.join(';') + '\n';
                //console.log(typeof t);
                fs.writeFileSync('./TestData/'+timeH + '.txt', t);
            }
    
        }
    }
}
    
//       1982319321123;open;max;min;close;  open; mediumMin; max; 

    if([0] != [1]) {console.log('s')}
