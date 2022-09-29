const express = require('express');
const app = express();

const PORT = process.env.PORT || 80



const FILE = "a5"



app.listen(PORT, ()=>{
  console.log('serv start');
  require(`./js/${FILE}.js`);
})
