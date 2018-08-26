'use strict';

const express = require('express');
const router = express.Router();

const jerkModel = require('./models');

//GET ALL

router.get('/', (req, res) => {
    jerkModel.find()

    .then(jerks => {

        res.json({
            jerks: jerks.map(

            (jerk) => jerk.cleanUp())
    })
    })
    .catch(err => {
    console.error(err)
    res.status(500).json("Unable to return the list of jerks")
    })
})


//GET BY ID

router.get('/:id', (req, res) => {
    jerkModel.findById(req.params.id)
    .then(theJerk => {
        res.json(theJerk.cleanUp())
    })
    .catch(err => {
        console.error(err)
        res.status(500).json("Unable to return the individual jerk")
    }) 
})



//POST

router.post('/', (req,res) => {

    const requiredFields = ['jerkname', 'jerkness'];

    for (let i=0; i<requiredFields; i++) {

        const field = requiredFields[i];

        if (!(field in req.body)) {
            res.status(400).json(`${field} is not present in the request`);
        }
        
    }

    jerkModel.create({
        jerkname: req.body.jerkname, 
        jerkness: req.body.jerkness,
        timesajerk: req.body.timesajerk
    })
    .then(theJerk => {
        res.status(201).json(theJerk.cleanUp())
    })
    .catch(err => {
        console.error(err)
        res.status(500).json("Unable to POST data")
    })

})

//PUT

router.put('/:id', (req,res) => {

    if(!(req.params.id && req.body.id && req.params.id === req.body.id)) {
        console.error(`req.params.id and req.body.id must match`)
        res.status(400).send(`req.params.id and req.body.id must match`)
    }

    const toUpdate = {};
    const canUpdate = ['jerkness', 'timesajerk'];

    canUpdate.forEach(data => {
        if(data in req.body) {
            toUpdate[data] = req.body[data];
        }

        jerkModel.findByIdAndUpdate(req.params.id, {$set: toUpdate}, {new: true}, function() {
            res.json(`${req.body.id} has been updated`)
        })

        .catch(err => {
            console.error(err)
            res.status(500).json('There was an error updating the jerk data')
        })
    })

})

//DELETE

router.delete('/:id', (req, res) => {
    jerkModel.findByIdAndRemove(req.params.id, function() {
        res.json(`${req.params.id} has been removed`)
    })

    .catch(err => {
        console.error(err)
        res.status(500).json('There was an error deleting the jerk')
    })
})




module.exports = router;