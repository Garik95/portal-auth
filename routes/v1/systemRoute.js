module.exports = (app) => {
    const system = require('../../controllers/systemController');

    var router = require("express").Router();
    // return all documents
    // router.get('/', user.findAll);
    // return specific document by ID
    // router.get('/:id', user.findById);
    // return specific document
    // router.get('/', user.findOne);
    // auth specific user
    // router.post('/auth', user.auth);
    // create new document
    router.post('/', system.create);
    // update document
    router.put('/reset/:resetToken', system.resetToken);
    // delete document
    // router.delete('/:id', user.delete);

    app.use('/api/v1/system',router);
}