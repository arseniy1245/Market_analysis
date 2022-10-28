module.exports = (time,open,max,min,close,PERC1,PERC2,sum,succ,loss,ttl) => {
    var LongClose = Number((open * (1 + PERC2)).toFixed(2));
    var ShortClose = Number((LongClose * (1 - PERC1)).toFixed(2));

    
    if (min <= ShortClose) {
        sum += ((1 - (ShortClose / open)) * sum);
    
        if(max >= LongClose) {
            sum += (((LongClose / ShortClose) - 1) * sum);
        }
        else {
            sum += (((close / ShortClose) - 1) * sum);
        }
    }
    else {
        sum -= (((close / open) - 1) * sum);
    }
    return [sum,succ,loss,ttl];
}