const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const router = express.Router();
const User = require('../models/user');


router.post('/signup', async (req, res)=>{

        data = req.body;
        usr = new User(data);

        salt = bcrypt.genSaltSync(10);
        cryptedPass = await bcrypt.hashSync(data.password , salt);

        usr.password = cryptedPass;

        usr.save()
            .then(
                (saved)=>{
                    res.status(200).send(saved);
                }
            )
            .catch(
                (err)=>{
                    res.status(400).send(err);
                }
            )
    
});

router.post('/login', async(req, res)=>{
    data = req.body;

    user = await User.findOne({email: data.email});

    if(!user){
        res.status(404).send('email invalid');
    }else{
        validPass = bcrypt.compareSync(data.password , user.password)

        if(!validPass){
            res.status(404).send('invalid password')
        }else{
            playload = {
                _id: user._id,
                email: user.email,
                name: user.name
            }
            token = jwt.sign(playload , '1234567')
            res.status(200).send({mytoken: token})
        }
    }
});

router.get('/getAll', async (req, res)=>{
    try {
        users = await User.find();
        res.status(200).send(users);
    } catch (error) {
        res.status(400).send(error);
    }
}
);

router.get('/getById/:id', async (req, res)=>{
    try {
        id = req.params.id;
        user = await User.findById({_id: id});
        res.send(user);
    } catch (error) {
        res.send(error);
    }
}
);

router.delete('/delete/:id', async (req, res)=>{
    try {
        id = req.params.id;
        deletedUser = await User.findByIdAndDelete({_id: id});
        res.send(deletedUser);
    } catch (error) {
        res.send(error);
    }
}
);
router.put('/update/:id', async (req, res)=>{
    
    try{
    id = req.params.id;
    newData = req.body;

    updatedUser = await User.findByIdAndUpdate({_id: id}, newData);
    res.send(updatedUser);
    }catch (error) {
    res.send(error);
    }
}
);

module.exports = router;