const user = require('../../controllers/userController');
module.exports = (app) => {

    app.get("/", (req,res) => {
        res.send("OK");
    });

    app.get('/api/v1/checkToken', user.checkToken)
}