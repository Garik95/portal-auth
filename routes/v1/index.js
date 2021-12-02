const db = require('../../dbconfig');
const redis = require('redis');
const user = require('../../controllers/userController');
const rd = redis.createClient(db.redis);

module.exports = (app) => {

    app.get("/", (req, res) => {
        res.send("OK");
    });

    app.get("/redis", (req, res) => {
        res.send(rd.ping())
    });

    app.post("/checkToken", (req, res) => {
        var key = "authToken:" + req.body.id
        var token = req.body.token
        rd.get(key, (err, result) => {
            if (err) throw err;
            else {
                if (result == token) {
                    res.sendStatus(200)
                } else {
                    res.sendStatus(404)
                }
            }
        })
    })

    app.get('/migration', user.crateUser);
}