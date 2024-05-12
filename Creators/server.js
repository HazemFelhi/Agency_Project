const express = require('express');

const userRoute = require('./routes/routes');

require('./config/connect');

const app = express();
app.use(express.json());

app.use('/creator', userRoute);

app.listen( 3000 , ()=>{
    console.log('Creator server is up')
}
);