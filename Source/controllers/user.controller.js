const models = require('../models');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

function signUp(req, res){
    models.User.findOne({where:{mail:req.body.mail}}).then(result => {
        if(result){
            res.status(406).json({
                message: "Email already exists!"
            });
        } else {
            bcryptjs.genSalt(10, (err, salt) => {
                if(err === null) {
                    bcryptjs.hash(req.body.password, salt, (err, hash) => {
                        const user = {
                            name: req.body.name,
                            surname: req.body.surname,
                            mail:req.body.mail,
                            password: hash
                        }
                        models.User.create(user).then(result => {
                            res.status(201).json({
                                message: "User created successfully",
                                User: result
                            });
                        }).catch(error => {
                            res.status(500).json({
                                message: "Something went wrong!",
                                error: error.message
                            });
                        });
                    });
                } else {
                    res.status(500).json({
                        message: "Something went wrong!",
                        error: err.message
                    });
                }
            });
        }
    }).catch(error => {
        res.status(500).json({
            message: "Something went wrong!",
            error: error.message
        });
    });
}

function login(req, res){
    models.User.findOne({where:{mail: req.body.mail}}).then(user => {
        if(user === null){
            res.status(404).json({
                message: "User not found",
            });
        } else {
            bcryptjs.compare(req.body.password, user.password, (err, result) => {
                if(err === null) {
                    if(result){
                        const token = jwt.sign({
                            email: user.mail,
                            userId: user.id
                        }, process.env.JWT_KEY, (err, token) => {
                            res.status(200).json({
                                message: "Authentication successful!",
                                data: {
                                    token,
                                    User: user
                                }
                            });
                        });
                    } else {
                        res.status(401).json({
                            message: "Invalid credentials!"
                        });
                    }
                } else {
                    res.status(500).json({
                        message: "Something went wrong!",
                        error: err.message
                    });
                }
            });
        }
    }).catch(error => {
        res.status(500).json({
            message: "Something went wrong!",
            error: error.message
        });
    });
}

function updateUser(req, res) {
    models.User.findOne({where:{id:req.body.id}}).then(result => {
        if(result === null) {
            res.status(404).json({
                message: "User not found",
            });
        } else {
            models.User.findOne({where:{mail:req.body.mail}}).then(result2 => {
                if(result2) {
                    res.status(403).json({
                        message: "Email already in use.",
                    });
                } else {
                    const user = {
                        mail:req.body.mail,
                        name:req.body.name,
                        surname:req.body.surname
                    }
                    models.User.update(user, {where: {id: result.id}}).then( _ => {
                        res.status(201).json({
                            message: "User updated succesfully"
                        });
                    }).catch(error => {
                        res.status(500).json({
                            message: "Something went wrong!",
                            error: error.message
                        });
                    });
                }
            }).catch(error => {
                res.status(500).json({
                    message: "Something went wrong!",
                    error: error.message
                });
            });
        }
    }).catch(error => {
        res.status(500).json({
            message: "Something went wrong!",
            error: error.message
        });
    });
}

function deleteUser(req, res) {
    models.User.findOne({where: {id: req.body.id}}).then( result => {
        if(result === null) {
            res.status(404).json({
                message: "User not found"
            });
        } else {
            models.User.destroy({where: {id: req.body.id}}).then( result => {
                if(result == true) {
                    res.status(200).json({
                        message: "User succesfully deleted"
                    });
                } else {
                    res.status(400).json({
                        message: "User not found"
                    });
                }
            }).catch(error => {
                res.status(500).json({
                    message: "Something went wrong!",
                    error: error.message
                })
            });
        }
    }).catch(error => {
        res.status(500).json({
            message: "Something went wrong!",
            error: error.message
        })
    });
}

module.exports = {
    signUp,
    login,
    updateUser,
    deleteUser
} 