const express = require('express');
const brandRoute = require('./routes/routes');

require('./config/connect');

const app = express();
app.use(express.json());


app.use('/brand', brandRoute);

app.listen( 3100 , ()=>{
    console.log('Brand server is up')
}
);