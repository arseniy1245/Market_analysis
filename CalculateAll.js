const fs = require('fs');

var dir = './binData';
const Files = fs.readdirSync(dir);

for (let FileName of Files) {
    fs.unlink(dir + '/' + FileName, err => {
        if(err) throw err;
    })
}





// const ArrOfJs = 
// [
//     'D_Fix_all',
//     'D_Fix_mon_bst_perc',
//     //'D_Fix_mon_fix_perc'
// ]
// var i = 0;
// g()
// function g() {
//     require(Vega_v1_long +ArrOfJs[i])()
//     i++;
//     if(i < ArrOfJs.length) g()
// }

// for (let i = 0; i < ArrOfJs.length; i++) {
//     require(Vega_v1_long +ArrOfJs[i])()
// }

const Alcor_v1_long = './jsMain/Alcor/v1/difficult/long/';
const Alcor_v1_short = './jsMain/Alcor/v1/difficult/short/';

require(Alcor_v1_long + 'Alcor_v1_long_Diff_all')();
require(Alcor_v1_long + 'Alcor_v1_long_Diff_monthly_bst_prec')();
require(Alcor_v1_long + 'Alcor_v1_long_Diff_monthly_fix_prec')(0.00290);

require(Alcor_v1_short + 'Alcor_v1_short_Diff_all')();
require(Alcor_v1_short + 'Alcor_v1_short_Diff_monthly_bst_prec')();
require(Alcor_v1_short + 'Alcor_v1_short_Diff_monthly_fix_prec')(0.00290);




const Altarf_v1_long = './jsMain/Altarf/v1/long/difficult/';
const Altarf_v1_short = './jsMain/Altarf/v1/short/difficult/';

require(Altarf_v1_long + 'Altarf_v1_long_Diff_all')();
require(Altarf_v1_long + 'Altarf_v1_long_Diff_monthly_bst_prec')();
require(Altarf_v1_long + 'Altarf_v1_long_Diff_monthly_fix_prec')(0.00290);

require(Altarf_v1_short + 'Altarf_v1_short_Diff_all')();
require(Altarf_v1_short + 'Altarf_v1_short_Diff_monthly_bst_prec')();
require(Altarf_v1_short + 'Altarf_v1_short_Diff_monthly_fix_prec')(0.00290);




const Vega_v1_long = './jsMain/Vega/v1/long/';
const Vega_v1_short = './jsMain/Vega/v1/short/';

require(Vega_v1_long + 'D_Fix_all')();
require(Vega_v1_long + 'D_Fix_mon_bst_perc')();
require(Vega_v1_long + 'D_Fix_mon_fix_perc')(0.00290);

require(Vega_v1_short + 'D_Fix_all')();
require(Vega_v1_short + 'D_Fix_mon_bst_perc')();
require(Vega_v1_short + 'D_Fix_mon_fix_perc')(0.00290);




