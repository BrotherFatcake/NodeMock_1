'use strict';

const mongoose = require('mongoose');

const jerkSchema = mongoose.Schema({
    jerkname: {type: String, require: true},
    jerkness: {type: String, require: true},
    timesajerk: {type: Number}
});


jerkSchema.methods.cleanUp = function() {
    return {
        id: this._id,
        jerkname: this.jerkname,
        jerkness: this.jerkness,
        timesajerk: this.timesajerk
    }
};

const jerkModel = mongoose.model('jerks', jerkSchema);

module.exports = jerkModel;