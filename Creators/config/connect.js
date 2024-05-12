const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://hazemfelhi99:hf123@cluster0.zrd1ssf.mongodb.net/TikTok_Agency')
    .then(
        ()=>{
            console.log('connected to MongoDB')
        }
    )
    .catch(
        (err)=>{
            console.log(err);
        }
    )

    module.exports = mongoose;