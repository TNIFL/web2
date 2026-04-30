var express = require('express');
var router = express.Router();
var {getConnection} = require('./connect');
var oracledb = require('oracledb');

/* 교수 관리 페이지 */
router.get('/pro', function(req, res, next) {
  res.render("index", {title: '교수관리', pageName: 'haksa/professors.ejs'});
});


router.get('/pro/list.json', async function(req, res) {
    let con;
    try {
        con = await getConnection();
        const sql = "select * from professors";
        const result = await con.execute(sql, {}, {outFormat:oracledb.OUT_FROMAT_OBJECT});
        res.send(result.rows)
    } catch(err) {

    }finally {
        if (con) await con.close();
    }
});

/* 강좌관리 */
router.get('/cou', function(req, res, next) {
  res.render("index", {title: '강좌관리', pageName: 'haksa/cou.ejs'});
});


/* 학생관리 */
router.get('/stu', function(req, res, next) {
  res.render("index", {title: '학생관리', pageName: 'haksa/stu.ejs'});
});

module.exports = router;