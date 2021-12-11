var package = require('../package.json');
var jwt = require('jsonwebtoken')
var express = require('express');
var router = express.Router();
const session = require('express-session')
const archiver = require('archiver')
const jose = require('jose')
const fs = require('fs')
const mongoose = require('mongoose')
const Leaderboard = require('./models/leaderboard.js')

/* GET /api/leaderboard. */
router.get('/leaderboard', async function(req, res, next) {
  const leaders = await Leaderboard.findOne()
  res.json(leaders.leaders)
});

router.post('/stats', async function(req, res) {
  const leaderDoc = await Leaderboard.findOne()
  const name = req.body.name
  const score = req.body.score
  const leaders = [...leaderDoc.leaders, {name, score}].sort((a, b) => b.score-a.score).slice(0, 5)
  leaderDoc.leaders = leaders
  await leaderDoc.save()
  res.send('ok')
})

// catch 404 and forward to error handler
router.use(function(req, res, next) {
  next(createError(404));
});

// error handler
router.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send(err.message)
  console.log(err)
  console.log(err.stack)
});

module.exports = router;