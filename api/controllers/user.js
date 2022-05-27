const User = require('../models/user');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const env = require('dotenv').config()




exports.user_signup = (req, res) => {
    User.find({
            email: req.body.email
        })
        .exec()
        .then(user => {
            if (user.length >= 1) {
                res.status(409).json({
                    message: "this email already exist"
                })
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        res.status(500).json({
                            error: err
                        })
                    } else {
                        const user = new User({
                            _id: new mongoose.Types.ObjectId,
                            email: req.body.email,
                            password: hash
                        })
                        user.save()
                            .then(result => {
                                console.log(result)
                                res.status(201).json({
                                    message: "User created"
                                })

                            }).catch(err => {
                                res.status(500).json({
                                    error: err
                                })
                            })
                    }
                })
            }
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })

}


exports.user_login = (req, res) => {
    User.find({
            email: req.body.email
        })
        .exec()
        .then(user => {
            if (user.length < 1) {
                res.status(404).json({
                    message: "Auth failled"
                })
            }
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if (err) {
                    return res.status(401).json({
                        message: "Auth failed"
                    })
                }
                if (result) {
                    const token = jwt.sign({
                            email: user[0].email,
                            userId: user[0]._id
                        },
                        process.env.JWT_KEY, {
                            expiresIn: "2h"
                        }
                    );

                    return res.status(200).json({
                        message: "Auth successful",
                        token: token
                    })
                }
                return res.status(401).json({
                    message: "Auth failed! Email or password are invalid"
                })

            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        });

}

exports.user_getAll = (req, res)=>{
    User.find()
    .exec()
    .then(result =>{
        res.status(400).json({
            count_user : result.length,
            result : result
        })
    })
    .catch(err =>{
        res.status(500).json({
            error : err
        })
    });
}


exports.user_delete = (req, res) => {
    const userId = req.params.userId
    User.findByIdAndDelete(userId)
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'user deleted',
                deleted_user: result

            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
}