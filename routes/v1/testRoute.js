module.exports = (app) => {
    const test = require('../../controllers/testController');

    var router = require("express").Router();
    // return all documents
    router.get('/', test.findAll);
    // return specific document
    router.get('/:id', test.findOne);
    // create new document
    router.post('/', test.create);
    // update document
    router.put('/:id', test.update);
    // delete document
    router.delete('/:id', test.delete);

    app.use('/api/v1/test',router);
}