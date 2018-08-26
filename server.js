'use strict';

require('dotenv').config();


const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');

mongoose.Promise = global.Promise;

const {PORT, DATABASE_URL} = require('./config');
const jerkModel = require('./models');

const app = express();

app.use(express.json());
app.use(morgan('common'));

const routeName = require('./router');

app.use('/jerk', routeName);

//Catch-All Endpoint
app.use('*', function(req, res) {
    res.status(404).json({"message": "Endpoint does not exist!"});
})

//Server Start

let server;

function startServer(databaseUrl, port=PORT) {
    return new Promise((resolve, reject) => {
        mongoose.connect(databaseUrl, err => {
            if (err) {
                return reject(err)
            }
            server = app.listen(port, () => {
                console.log(`The server is listening on port ${port}`)
                resolve();
            })

            .on('error', err => {
                mongoose.disconnect() 
                reject(err)
                
            })
        })
    })
}

function stopServer() {
    return mongoose.disconnect()
    .then(() => {
    return new Promise((resolve, reject) => {
        console.log('The server is being stopped')
        server.close(err => {
            if (err) {
                return reject(err)
            }
            resolve();
            })
        })
    })
}


if(require.main === module) {
    startServer(DATABASE_URL).catch(err => {console.error(err)})
}

module.exports = {app, startServer, stopServer};