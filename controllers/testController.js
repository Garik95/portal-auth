const db = require('../models/index');
const mongoose = require('mongoose')
const Tests = db.Tests;

exports.findAll = (req, res) => {
    Tests.find()
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred"
            });
        });
};

exports.findOne = (req, res) => {
    var id = req.params.id
    Tests.findById(id)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred"
            });
        });
};

exports.create = (req, res) => {
    Tests.create(req.body).then(data => {
        res.send(data)
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred"
        });
    });
}

exports.update = (req, res) => {
    var id = mongoose.Types.ObjectId(req.params.id);
    Tests.updateOne({"_id":id},req.body).then(data => {
        if(data.modifiedCount > 0) 
            res.send('Updated successfully');
        else {
            res.send('Update failed')
        }
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred"
        });
    });
}

exports.delete = (req, res) => {
    var id = mongoose.Types.ObjectId(req.params.id);
    Tests.deleteOne({"_id":id}).then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred"
        });
    });
}