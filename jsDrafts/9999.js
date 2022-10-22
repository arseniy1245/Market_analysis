module.exports = (time,open,max,min,close,PERC1,sum,succ,loss,ttl) => {
    var ShortClose = Number((open * (1 - PERC1)).toFixed(2));

    if(min <= ShortClose) {
        sum += ((1 - (ShortClose / open)) * sum);
        sum += (((close / ShortClose) - 1) * sum);
        succ++;
    }
    else {
        sum -= (((close / open) - 1) * sum);
        loss++;
    }
    ttl++;
    return [sum,succ,loss,ttl];
}