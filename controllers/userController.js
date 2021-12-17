var {
    MongoClient,
    ObjectID
} = require('mongodb');
const db = require('../models/index');
const Users = db.Users;
const Maps = db.Map;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require('mongoose');
const dbconfig = require('../dbconfig');
const redis = require('redis');
const rd = redis.createClient(dbconfig.redis);
const ldap = require('ldapjs');
const nodemailer = require("nodemailer");
// const checks = require('../functions/checks.js');

// Deprecated
// exports.create = async (req, res) => {
//     //Encrypt user password
//     req.body.password = await bcrypt.hash(String(req.body.password), 10);

//     try {
//         const user = new Users(req.body);
//         await user.validate();
//         await user.save();
//         // return new user
//         res.status(201).json({
//             success: true,
//             user
//         });
//     } catch (err) {
//         res.send({
//             success: false,
//             err
//         });
//     }


// }

// exports.auth = (req, res) => {
//     if (Object.keys(req.body).length > 0 && Object.keys(req.body).includes('email') && Object.keys(req.body).includes('password')) {
//         Users.findOne({
//                 email: req.body.email
//             })
//             .then(async data => {
//                 if (data) {
//                     let compare_password = await bcrypt.compare(String(req.body.password), String(data.password));
//                     if (compare_password) {
//                         // Create token
//                         const token = jwt.sign({
//                                 user_id: data._id,
//                                 email: data.email,
//                             },
//                             "IPAKPASSSECRET"
//                         );
//                         Users.updateOne({
//                             "_id": data._id
//                         }, {
//                             token: token
//                         }).then(() => {
//                             var key = "authToken:" + data._id
//                             rd.set(key, token, (err, result) => {
//                                 if (err) throw err;
//                                 else {
//                                     res.send({
//                                         id: data._id,
//                                         token: token,
//                                         first_name: data.first_name,
//                                         last_name: data.last_name,
//                                     });
//                                 }
//                             })
//                         })
//                     } else {
//                         res.status(400).send({
//                             message: "Password is incorrect!"
//                         })
//                     }
//                 } else {
//                     res.status(400).send({
//                         message: "User not found!"
//                     })
//                 }
//             })
//             .catch(err => {
//                 res.status(500).send({
//                     message: err.message || "Some error occurred"
//                 });
//             });
//     } else {
//         console.log('there');
//         res.send('Wrong params');
//     }
// }

// exports.findOne = (req, res) => {
//     if (Object.keys(req.query).length > 0) {
//         Users.findOne(req.query)
//             .then(data => {
//                 console.log(data);
//                 res.send(data);
//             })
//             .catch(err => {
//                 res.status(500).send({
//                     message: err.message || "Some error occurred"
//                 });
//             });
//     } else {
//         res.send('Please specify params');
//     }
// };

exports.LDAPAuth = async (req, res) => {
    var ldap = await LDAPAuth(req);
    if (ldap.success) {
        console.log(ldap);
        MongoClient.connect(dbconfig.personal, function (err, db) {
            if (err) {
                res.send({
                    success: false,
                    message: 'could not connect to database!'
                })
                throw err;
            } else {
                var dbo = db.db("ok-test");
                // dbo.collection('personals').find({
                //     STATUS_CODE: 2
                // }, {
                //     projection: {
                //         "FIRST_NAME": 1,
                //         "FAMILY": 1,
                //         "PATRONYMIC": 1,
                //         "FIRST_NAME_LAT": 1,
                //         "FAMILY_LAT": 1,
                //         "PATRONYMIC_LAT": 1,
                //         "GENDER_CODE": 1,
                //         "BRANCH": 1,
                //     }
                // }).toArray((err, result) => {
                //     if (err) {
                //         res.send({
                //             success: false,
                //             message: 'bad query!'
                //         })
                //     } else {
                //         res.send(result)
                //     }
                // })
                dbo.collection('personals').aggregate([{
                        $match: {
                            BRANCH: "00444",
                            STATUS_CODE: {
                                $in: [2, 5]
                            }
                        }
                    }, {
                        $project: {
                            FIRST_NAME_LAT: {
                                $toLower: "$FIRST_NAME_LAT"
                            },
                            FAMILY_LAT: {
                                $toLower: "$FAMILY_LAT"
                            },
                            PATRONYMIC_LAT: {
                                $toLower: "$PATRONYMIC_LAT"
                            },
                            "FIRST_NAME": 1,
                            "FAMILY": 1,
                            "PATRONYMIC": 1,
                            "GENDER_CODE": 1,
                            "BRANCH": 1,
                        }
                    },
                    {
                        $match: {
                            $or: [{
                                    _id: ObjectID(ldap.data.personal_id)
                                },
                                {
                                    _id: ObjectID(ldap.data.personal_id),
                                    FIRST_NAME_LAT: ldap.data.givenName.toLowerCase(),
                                    FAMILY_LAT: ldap.data.sn.toLowerCase(),
                                }
                            ]
                        }
                    }
                ]).toArray(async (err, result) => {
                    if (err) throw err;
                    else {
                        if (result.length != 0 && typeof ldap.data.mail !== 'undefined') {
                            var pers = result[0];

                            const token = jwt.sign({
                                    user_id: pers._id,
                                    email: ldap.data.email,
                                },
                                "IPAKPASSSECRET"
                            );
                            var key = "authToken:" + pers._id
                            rd.set(key, token, (err, result) => {
                                if (err) throw err;
                                else {
                                    res.send({
                                        id: pers._id,
                                        token: token,
                                        first_name: pers.FIRST_NAME,
                                        last_name: pers.FAMILY,
                                    });
                                }
                            })
                        } else {
                            if (typeof ldap.data.mail !== 'undefined') {
                                ldap.data.cause = 'Could not found personal'
                            } else {
                                ldap.data.cause = 'Could not found email'
                            }
                            var map = new Maps(ldap.data);
                            await map.validate()
                            await map.save((err, result) => {
                                if (err) res.send({
                                    success: false,
                                    data: [],
                                    status: 'processing',
                                    message: err,
                                })
                                else {
                                    res.send({
                                        success: true,
                                        status: 'processing',
                                        data: result
                                    })
                                }
                            })
                        }
                    }
                })
            }
        });
    } else {
        console.log("falseeee");
        res.send({
            success: false,
            data: {},
            message: 'Authorization error!'
        })

    }
}

// exports.findById = async (req, res) => {
//     if (await checkSystem(req)) {
//         try {
//             var id = req.params.id
//             if (mongoose.Types.ObjectId.isValid(id))
//                 Users.findById(id, {
//                     password: 0
//                 })
//                 .then(data => {
//                     res.send(data);
//                 })
//                 .catch(err => {
//                     res.status(500).send({
//                         message: err.message || "Some error occurred"
//                     });
//                 });
//         } catch (err) {
//             res.send(err)
//         }
//     } else {
//         res.sendStatus(404)
//     }

// };

exports.findAllPersonal = async (req, res) => {

    MongoClient.connect(dbconfig.personal, function (err, db) {
        var dbo = db.db("ok-test");

        dbo.collection('personals').find({
            "BRANCH": '00444',
            "STATUS_CODE": {
                "$in": [2, 5]
            }
        }).toArray((err, result) => {
            if (err) throw err;
            res.send(result)
        })
    });
}

exports.findAll = async (req, res) => {
    Maps.find({
        "$or": [{
                "personal_id": null
            },
            {
                "mail": {
                    "$exists": false
                }
            }
        ]
    }, {
        password: 0
    }).then(response => {
        res.send(response)
    }).catch(err => {
        res.send(err)
    })
}

exports.update = async (req, res) => {
    try {
        var item = req.body;
        console.log(item);
        if (mongoose.Types.ObjectId.isValid(item._id)) {
            Maps.updateOne({
                    _id: item._id
                }, item)
                .then(data => {
                    console.log(sendMail(item.mail));
                    res.send(data);
                })
                .catch(err => {
                    res.status(500).send({
                        message: err.message || "Some error occurred"
                    });
                });
        }
    } catch (err) {
        res.send(err)
    }
}

// exports.checkToken = (req, res) => {
//     var userid = req.body.userid;
//     var token = req.body.token;
//     if (userid && token) {
//         Users.findOne({
//             _id: mongoose.Types.ObjectId(userid),
//             token: token
//         }).then(data => {
//             if (data) {
//                 res.send(data)
//             } else {
//                 res.status(500).send({
//                     message: "Some error occurred"
//                 })
//             }
//         }).catch(err => res.status(500).send({
//             message: err.message || "Some error occurred"
//         }));
//     } else {
//         res.sendStatus(404)
//     }
// }

// Deprecated
// exports.crateUser = async (req, res) => {

//     let password = await bcrypt.hash("123456", 10);
//     Users.countDocuments().then(data => {
//         if (data == 0) {
//             const user = new Users({
//                 first_name: "name",
//                 last_name: "name",
//                 email: "email",
//                 password
//             });
//             user.save();
//             res.send('user created');
//         } else {
//             res.send("migration already completed")
//         }
//     }).catch(err => {
//         res.send(err)
//     })
// }


// function checkSystem(req) {
//     return new Promise(resolve => {
//         rd.get("system:" + req.headers.systemid, (err, result) => {
//             if (err) throw err;
//             else {
//                 resolve(result == req.headers.systemtoken)
//             }
//         })
//     })
// }


function LDAPAuth(req) {
    return new Promise(resolve => {
        const client = ldap.createClient({
            url: dbconfig.ldap
        });

        var login = req.body.login
        var password = req.body.password

        var reg = /^[\w-\.]+@ipakyulibank.uz$/
        if (!reg.test(login)) {
            login += '@ipakyulibank.uz'
        }

        client.bind(login, password, function (error) {
            // login = 'Bohodirov_b'
            if (error) {
                console.log(error);
                console.log("failed to connect!")
                resolve({
                    success: false,
                    data: []
                })
            } else {
                const opts = {
                    filter: '(&(objectClass=user)(|(userPrincipalName=' + login + ')(sAMAccountName=' + login + ')))',
                    scope: 'sub',
                    paged: true,
                    sizeLimit: 10000,
                    attributes: ['givenName', 'sn', 'userPrincipalName', 'sAMAccountName', 'mail']
                };
                client.search('DC=IPAKYULIBANK,DC=UZ', opts, (err, res) => {
                    // res.on('searchRequest', (searchRequest) => {
                    //     console.log('searchRequest: ', searchRequest.messageID);
                    // });
                    res.on('searchEntry', async (entry) => {
                        var ldap = entry.object;
                        Maps.findOne({
                            sAMAccountName: ldap.sAMAccountName
                        }).then(data => {
                            if (data)
                                resolve({
                                    success: true,
                                    data
                                })
                            else
                                resolve({
                                    success: true,
                                    data: ldap
                                })
                        });
                    });
                    // res.on('searchReference', (referral) => {
                    //     console.log('referral: ' + referral.uris.join());
                    // });
                    res.on('error', (err) => {
                        resolve(err)
                    });
                    res.on('end', (result) => {
                        console.log('status: ' + result.status);
                        client.unbind(err => {
                            if (err) console.log(err)
                        })
                    });
                });

            }
        });
    })
}

function sendMail(email) {
    return new Promise(resolve => {
        let transporter = nodemailer.createTransport({
            host: "mail.ipakyulibank.uz",
            port: 25,
            secure: false, // true for 465, false for other ports
            auth: {
                user: 'g.nurmurodov@ipakyulibank', // generated ethereal user
                pass: 'Ls142536', // generated ethereal password
            },
        });
        // send mail with defined transport object
        transporter.sendMail({
            from: '"delta.ipakyulibank.uz" <Δ@ipakyulibank.uz>', // sender address
            to: email, // list of receivers
            subject: "Успешная регистрация в системе Delta", // Subject line
            // text: "Hello world?", // plain text body
            html: `<h1>Уважаемый сотрудник банка Ипак Йули!</h1>
            <h2>Поздравляю с успешной регистрацией в корпоративной системы банка Ипак Йули</h2>
            <h2>Для входа в систему пожалуйста еще раз введите данные для входа на портале</h2>`, // html body
        }, (err, info) => {
            if (err) resolve(false);
            else {
                resolve(true)
            }
        });
    })
}