const user = require('../../controllers/userController');
module.exports = (app) => {

    app.get("/", (req,res) => {
        res.send("OK");
    });

    app.get('/migration', user.crateUser);
}