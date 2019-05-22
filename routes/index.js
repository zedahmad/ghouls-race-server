var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/ghosts', function(req, res, next) {
  res.render('public/ghosts.html');
});

module.exports = router;
