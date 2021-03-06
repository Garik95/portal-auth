const db = require('../models/index');
const System = db.Systems;

const mongoose = require('mongoose');
const dbconfig = require('../dbconfig');
const redis = require('redis');
const rd = redis.createClient(dbconfig.redis);
const {
    nanoid
} = require('nanoid');

exports.create = async (req, res) => {
    console.log(req.body);
    try {
        req.body.token = nanoid();
        req.body.resetToken = nanoid();
        const system = new System(req.body);
        await system.validate();
        await system.save();
        rd.set("system:" + system._id, system.token, () => {});
        res.send({
            success: true,
            system
        })
    } catch (err) {
        res.send({
            success: false,
            err
        });
    }
}

exports.resetToken = async (req, res) => {
    var token = nanoid()
    var resetToken = nanoid()
    System.findOneAndUpdate({
        resetToken: req.params.resetToken
    }, {
        token: token,
        resetToken: resetToken
    }).then(response => {
        if (response != null) {
            rd.set("system:" + response._id, token, () => {});
            res.send({
                success: true,
                system: response
            })
        } else {
            res.send({
                success: false,
                system: {}
            })
        }
    }).catch(err => {
        res.send({
            success: false,
            err
        });
    })
}

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

// exports.findById = (req, res) => {
//     try {
//         var id = req.params.id
//         if (mongoose.Types.ObjectId.isValid(id))
//             Users.findById(id, {
//                 password: 0
//             })
//             .then(data => {
//                 res.send(data);
//             })
//             .catch(err => {
//                 res.status(500).send({
//                     message: err.message || "Some error occurred"
//                 });
//             });
//     } catch (err) {
//         res.send(err)
//     }
// };

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