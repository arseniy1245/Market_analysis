const fs = require('fs');

var dir = './binData';
const Files = fs.readdirSync(dir);

for (let FileName of Files) {
    fs.unlink(dir + '/' + FileName, err => {
        if(err) throw err;
    })
}


const InrevalPerc = 0.00010;
const DeltPerc =    0.00011;
const Vega_v1 = './jsMain/Vega/v1/';
const Vega_v2 = './jsMain/Vega/v2/';


const pathToPatterns_1dep = './jsMain/1AllPatterns/1_dep/';
const pathToPatterns_2dep = './jsMain/1AllPatterns/2_dep/';

const All_1dep = pathToPatterns_1dep + 'all_1dep';
const Each_month_1dep = pathToPatterns_1dep + 'each_month_1dep';
const Specify_month_1dep = pathToPatterns_1dep + 'specify_month_1dep';

const All_2dep = pathToPatterns_2dep + 'all_2dep';
const Each_month_2dep = pathToPatterns_2dep + 'each_month_2dep';
const Specify_month_2dep = pathToPatterns_2dep + 'specify_month_2dep';




require(All_1dep)('1h', Vega_v1 + 'Vega_v1_long', 'Vega_v1_long_all_1dep',InrevalPerc,DeltPerc);
require(Each_month_1dep)('1h',Vega_v1 + 'Vega_v1_long','Vega_v1_each_month_1dep',InrevalPerc,DeltPerc);
require(Specify_month_1dep)('1h',['2022','10'],Vega_v1 + 'Vega_v1_long','Vega_v1_specify_month_1dep',InrevalPerc,DeltPerc);


require(All_2dep)('1h',Vega_v2 + 'Vega_v2_long','Vega_v2_long_all_2dep',InrevalPerc,DeltPerc);
require(Each_month_2dep)('1h',Vega_v2 + 'Vega_v2_long','Vega_v2_each_month_2dep',InrevalPerc,DeltPerc);
require(Specify_month_2dep)('1h',['2022','10'],Vega_v2 + 'Vega_v2_long','Vega_v2_specify_month_2dep',InrevalPerc,DeltPerc);