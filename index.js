let port = process.env.PORT || 3000;

const passport = require('passport');
const Strategy = require('passport-http').BasicStrategy;
const db = require('./db');

const redis = require('./redis_module');
const nlu = require('./NLU_module');

passport.use(new Strategy(
  function(username, password, cb) {
      db.users.findByUsername(username, function(err, user) {
      if (err) { return cb(err); }
      if (!user) { return cb(null, false); }
      if (user.password !== password) { return cb(null, false); }
      return cb(null, user);
    });
  }));


const express = require('express');
const app = express();
const twitterSearch = require('./twitter.js').search;


app.get('/analyze', passport.authenticate('basic', { session: false }),
function(req, res) {
  if(!req.query.tweetQ){
      res.writeHead(400, "Missing 'tweetQ' API parameter");
      res.end("No search param");
      return
  }
  twitterSearch(req.query.tweetQ)
  .then(function(tweets){
      let id = new Date().valueOf();
      let returnObj = {
          query: req.query.tweetQ,
          uniqueID: id
      };
      // INSTEAD OF RETURNING TWEETS IN RESPOSE, WILL RETURN UNIQUE ID TO CALL BACK
      // AND INVOKE REDIS MODULE TO STORE TWEETS
      // for (let i = 0; i < tweets.statuses.length; i++) {
      //     // nlu.analyze(tweets.statuses[i].text, function (response) {
      //     //     returnObject= {
      //     //         analysis: response,
      //     //         tweet: tweets.statuses[i]
      //     //     };
      //     //     redis.storeAnalysis(id, returnObject);
      //     // });
      // }
      nlu.analyze(tweets.statuses[0].text, function (response) {
          returnObject= {
              analysis: response,
              tweet: tweets.statuses[0]
          };
          redis.storeAnalysis(id, returnObject);
      });
      res.json(returnObj);
  })
  .catch(function(err){
    res.statusCode = err[0].code;
    res.statusMessage = err[0].message;
    res.end();
  });

});
app.get('/results', passport.authenticate('basic', { session: false }), function(req, res) {
    redis.retrieveAnalysis(req.query.uniqueID, function(analysis) {
        res.json(analysis);
    });
});

app.listen(port, function () {
  console.log('Listening on port ' + port);
});
