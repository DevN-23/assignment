var express = require('express');
var router = express.Router();
var connection = require('../helpers/db_connect');
var json2csv = require('json2csv').parse;
var exportExcel = require('excel-export');

/* GET users listing. */
router.get('/', function(req, res, next) {
  connection.query('SELECT * FROM users', (err, rows, fields) => {
    if(!err) {
      // return res.send(rows);
      res.render('users', { title: 'Users', users: rows })
    }
    else {
      console.log(err);
    }
  });
});

router.post('/update/:id', (req, res) => {
  var id = req.params.id;
  var name = req.body.name;
  var emailId = req.body.email_id;
  if(!name || !emailId) {
    var fieldName = (!name) ? 'Name' : 'Email'; 
    return res.status(400).json({ message: `${fieldName} is required.`});
  }
  var query = 'UPDATE users SET name=?, email_id=? WHERE id=?';
  connection.query(query,[name, emailId, id], (err, rows, fields) => {
    if(!err) {
      // return res.send(rows);
      res.json({ message: 'Succes! User is updated.' });
    }
    else {
      res.status(400).json({ message: 'Succes! User is updated.' });
    }
  });
});

router.get('/download-csv', (req, res) => {
  connection.query('SELECT * FROM users', (err, rows, fields) => {
    if(!err) {
      const csvString = json2csv(rows)
      res.setHeader('Content-disposition', 'attachment; filename=shifts-report.csv');
      res.set('Content-Type', 'text/csv');
      res.status(200).send(csvString);
    }
    else {
      console.log(err);
    }
  });
});

router.get('/download-excel', (req, res) => {
  var conf = {};
  conf.cols = [
    {
      caption: 'S.No.',
      type: 'number',
      width: 3
    },
    {
      caption: 'Name',
      type: 'string',
      width: 50
    },
    {
      caption: 'Email Id',
      type: 'string',
      width: 100
    },
    {
      caption: 'City',
      type: 'string',
      width: 45
    },
    {
      caption: 'Country',
      type: 'string',
      width: 45
    },
    {
      caption: 'Added On',
      type: 'string',
      width: 15
    }
  ];
  connection.query('SELECT * FROM users', (err, rows, fields) => {
    if(!err) {
      arr = [];
      for(var i=0; i<rows.length; i++){
        a = [i+1, rows[i].name, rows[i].email_id, rows[i].city, rows[i].country, rows[i].created_at];
        arr.push(a)
      }
      conf.rows=arr;
      const result = exportExcel.execute(conf);
      res.setHeader('Content-Type', 'application/vnd.openxmlformates');
      res.setHeader('Content-Disposition', 'attachment;filename='+'users.xlsx');
      res.end(result, 'binary');
    }
    else {
      console.log(err);
    }
  });
})

module.exports = router;
