var express = require('express');
var router = express.Router();

router.post('/', function(req, res, next) {
    res.send(JSON.stringify(Array.from(req.app.get('server').clients)));
});

router.post('/config', function(req, res, next) {
    res.send(JSON.stringify(req.app.get('server').serverConf));
});

router.get('/destroy', function(req, res, next) {
    req.app.get('server').clients = new Map();
    res.send("The deed is done");
});

router.post('/customize', function(req, res, next) {
    const id = Number.parseInt(req.body.id);
    const custom = JSON.parse(req.body.custom);

    req.app.get('server').clients.set(id, Object.assign(req.app.get('server').clients.get(id), custom));

    res.send(`<a href="/ghosts.html?id=${id}">Your ghost viewer</a>`);
});

module.exports = router;
