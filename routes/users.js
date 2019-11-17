var express = require('express');
var router = express.Router();
var connection = require('../helpers/db_connect');
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

module.exports = router;
