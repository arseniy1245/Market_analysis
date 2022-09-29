
const express = require('express');
const app = express();

const path = require('path');
const __dirname1 = path.resolve()
const fs = require('fs');

const PORT = process.env.PORT || 80

require("./js/a5.js")
app.listen(PORT, ()=>{
      console.log('Server is working.....');
    })
