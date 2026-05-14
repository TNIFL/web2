var express = require('express');
var router = express.Router();
var {getConnection} = require('./connect');
var oracledb = require('oracledb');
const { get } = require('./haksa');

/* 교수 관리 페이지 */
router.get('/pro', function(req, res, next) {
  res.render("index", {title: '교수관리', pageName: 'haksa/professors.ejs'});
});


router.get('/pro/list.json', async function(req, res) {
    let con;
    try {
        con = await getConnection();
        const sql = "select p.*, to_char(hiredate, 'YYYY-MM-DD') fdate, to_char(salary, '99,999,999') fsalary from professors p";
        const result = await con.execute(sql, 
          {}, 
          {outFormat:oracledb.OUT_FORMAT_OBJECT}
        );
        res.send(result.rows)
    } catch(err) {
        console.log(err);
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
  res.render("index", {title: '학생관리', pageName: 'haksa/students.ejs'});
});


router.post('/pro/insert', async function(req, res){
  console.log("교수등록");
  const pcode = req.body.pcode;
  const pname = req.body.pname;
  const dept = req.body.dept;
  const title = req.body.title;
  const hiredate = req.body.hiredate;
  const salary = req.body.salary;
  console.log(pcode, pname, dept, title, hiredate, salary);

  let con;
  try {
    con = await getConnection();
    let sql = "insert into professors(pcode,pname,dept,title,hiredate,salary) values(:pcode,:pname,:dept,:title,:hiredate,:salary)";
    await con.execute(
      sql,
      {pcode, pname, dept, title, hiredate, salary},
      {autoCommit:true}
    );

res.sendStatus(200);
  } catch (err) {

  } finally {
    if (con) await con.close();
  }
})

router.post('/pro/delete', async function(req, res) {
  const pcode = req.body.pcode;
  let con;
  try {
    con = await getConnection();
    let sql = "delete from professors where pcode=:pcode";
    await con.execute(sql, {pcode}, {autoCommit:true});
    res.sendStatus(200);
  } catch(err) {
    res.sendStatus(500);
  } finally {
    if (con) await con.close();
  }
})

// 학생목록 데이터
router.get('/stu/list.json', async function(req, res) {
  let con;
  try {
    con = await getConnection();
    let sql = "select * from view_students order by scode desc";
    let result = await con.execute(sql, {}, {outFormat:oracledb.OUT_FORMAT_OBJECT});
    res.send(result.rows);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  } finally {
    if (con) await con.close();
  }
})

/* 교수등록 페이지. */
router.get('/pro/insert', async function(req, res, next) {
  let code;
  let con;
  try {
    con = await getConnection();
    const sql ="select max(pcode) + 1 from professors";
    const result = await con.execute(sql);
    code = result.rows[0][0];
  } catch (err) {

  } finally {
    if (con) await con.close();
  }
  res.render('index', {title:'교수등록', pageName:'haksa/professor_insert.ejs', code});
});

//학생 등록 페이지
router.get('/stu/insert', async function(req, res) {
  let con;
  let code;
  try {
    con = await getConnection();
    let sql = "select max(scode) + 1 from students";
    let result = await con.execute(sql);
    code = result.rows[0][0];
  } catch (err) {

  } finally {
    if (con) await con.close();
  }
   res.render('index', {title: '학생입력', pageName:'haksa/students_insert.ejs', code});
})

//학생등록
router.post('/stu/insert', async function(req, res) {
  const scode = req.body.scode;
  const sname = req.body.sname;
  const dept = req.body.dept;
  const birthday = req.body.birthday;
  const year = req.body.year;
  const advisor = req.body.pcode;
  console.log(scode, sname, dept, birthday, year, advisor);
  let con;
  try {
    con = await getConnection();
    let sql = "insert into students(scode, sname, dept, birthday, year, advisor) values(:scode, :sname, :dept, :birthday, :year, :advisor)";
    await con.execute(sql, {scode, sname, dept, birthday, year, advisor}, {autoCommit:true});
    res.sendStatus(200);
  } catch(err) {
    console.error(err);
    res.sendStatus(500);
  } finally {
    if (con) await con.close();
  }
})

// 학생삭제
router.post('/stu/delete', async function(req, res){
    let con;
    const scode=req.body.scode;
    try{
        con = await getConnection();
        const sql=`delete from students where scode=${scode}`;
        console.log(sql);
        await con.execute(sql, {}, {autoCommit:true});
        res.sendStatus(200);
    }catch(err){
        res.sendStatus(500);
        console.log(err);
    }finally{
        if(con) await con.close();
    }
});


module.exports = router;