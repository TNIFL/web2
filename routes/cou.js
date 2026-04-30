var express = require('express');
var router = express.Router();

/* 강좌관리 */
router.get('/cou', function(req, res, next) {
  res.render("index", {title: '강좌관리', pageName: 'haksa/cou.ejs'});
});

module.exports = router;
