const express = require('express');
const mongoose = require('mongoose');
const Brand = require('../model/Brand');

const router = express.Router();


router.post('/create', async (req, res)=>{

    try {
        data = req.body;
        brand = new Brand(data);

        savedBrand = await brand.save();

        res.send(savedBrand);

    } catch (error) {
        res.send(error);
    }
    
});

router.get('/getAll', async (req, res)=>{
    try {
        brands = await Brand.find();
        res.status(200).send(brands);
    } catch (error) {
        res.status(400).send(error);
    }
}
);

router.get('/getById/:id', async (req, res)=>{
    try {
        id = req.params.id;
        brand = await Brand.findById({_id: id});
        res.send(brand);
    } catch (error) {
        res.send(error);
    }
}
);

router.delete('/delete/:id', async (req, res)=>{
    try {
        id = req.params.id;
        deletedBrand = await Brand.findByIdAndDelete({_id: id});
        res.send(deletedBrand);
    } catch (error) {
        res.send(error);
    }
}
);
router.put('/update/:id', async (req, res)=>{
    
    try{
    id = req.params.id;
    newData = req.body;

    updatedBrand = await Brand.findByIdAndUpdate({_id: id}, newData);
    res.send(updatedBrand);
    }catch (error) {
    res.send(error);
    }
}
);

module.exports = router;