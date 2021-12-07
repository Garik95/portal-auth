const ldap = require('ldapjs');
const dbconfig = require('../dbconfig')

exports.module = function checkSystem(req) {
    return new Promise(resolve => {
        rd.get("system:" + req.headers.systemid, (err, result) => {
            if (err) throw err;
            else {
                resolve(result == req.headers.systemtoken)
            }
        })
    })
}

exports.module = function LDAPAuth(req) {
    console.log(dbconfig.ldap);
    const client = ldap.createClient({
        url: dbconfig.ldap
    });

    var login = req.body.login
    var password = req.body.password

    // client.bind(login, password, function (error) {
    //     if (error) {
    //         console.log(error);
    //         console.log("failed to connect!")
    //     } else {
    //         const opts = {
    //             filter: '(&(objectClass=user)(|(userPrincipalName=' + login + ')(sAMAccountName=' + login + ')))',
    //             scope: 'sub',
    //             paged: true,
    //             sizeLimit: 10000,
    //             attributes: ['givenName', 'sn', 'userPrincipalName', 'sAMAccountName', 'mail']
    //         };
    //         client.search('DC=IPAKYULIBANK,DC=UZ', opts, (err, res) => {
    //             console.log(err);

    //             res.on('searchRequest', (searchRequest) => {

    //                 console.log('searchRequest: ', searchRequest.messageID);
    //             });
    //             res.on('searchEntry', (entry) => {
    //                 arr.push(entry.object)
    //                 //console.log('entry: ' + JSON.stringify(entry.object));
    //             });
    //             res.on('searchReference', (referral) => {
    //                 console.log('referral: ' + referral.uris.join());
    //             });
    //             res.on('error', (err) => {
    //                 console.error('error: ' + err);
    //             });
    //             res.on('end', (result) => {
    //                 console.log('status: ' + result.status);
    //                 console.log(arr);
    //             });
    //         });
    //         /*client.unbind(err => {
    //             console.log(err)
    //         })*/
    //     }
    // });
}