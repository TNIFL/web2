var express = require('express');
var router = express.Router();

/* 학생관리 */
router.get('/stu', function(req, res, next) {
  res.render("index", {title: '학생관리', pageName: 'hsksa/stu.ejs'});
});

module.exports = router;
