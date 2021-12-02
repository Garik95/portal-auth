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