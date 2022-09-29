const fs = require('fs');

const dir = './data/klines/csv/1h'
const files = fs.readdirSync(dir);

var ttlP = 0;

var ii = 0;
for (let file_name of files) {
    let ARR = fs.readFileSync(dir + '/' + file_name, 'utf-8').split('\n');

for(let i = 0; i < ARR.length; i++){
	let lineArr = ARR[i].split(",");
	
	ttlP += (lineArr[3] / lineArr[1] - 1);
	ii++;
	}
}
console.log((ttlP / ii).toFixed(5));
