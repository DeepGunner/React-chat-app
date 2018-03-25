const express = require('express');
const router = express.Router();
const db = require('../models')

/* GET users listing. */
// /api/users
router.get('/users', function (req, res) {
  const { username, email } = req.query;
  var query = {};
  if (username) {
    query.username = username;
  } else if (email) {
    query.email = email;
  } else {
    res.status(500)
    return res.json({
      error: "There's some goof-up!"
    })
  }

  db.User.findOne(query, {password: 0}, function (err, user) {
    if (err) {
      res.status(500)
      return res.json({
        error: "There's some goof-up finding the user!"
      })
    } else if (!user) {
      res.status(500)
      return res.json({
        error: "There's some goof-up finding the user!"
      })
    }
    res.status(200)
    return res.json({
      error: null,
      user,
    })
  })
})

module.exports = router;
