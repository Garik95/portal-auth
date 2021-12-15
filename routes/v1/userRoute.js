module.exports = (app) => {
    const user = require('../../controllers/userController');

    var router = require("express").Router();
    // return all documents
    router.get('/all', user.findAll);
    // return specific document by ID
    router.get('/emps', user.findAllPersonal);
    // return specific document
    // router.get('/', user.findOne);
    // auth specific user
    // router.post('/auth', user.auth);
    router.post('/LDAPAuth', user.LDAPAuth);
    // create new document
    // router.post('/', user.create);
    // update document
    router.put('/:id', user.update);
    // delete document
    // router.delete('/:id', user.delete);

    app.use('/api/v1/user',router);
}