require('dotenv').config();
const Twitter = require('twitter');
const client = new Twitter({
  consumer_key: process.env.consumer_key,
  consumer_secret: process.env.consumer_secret,
  access_token_key: process.env.access_token,
  access_token_secret: process.env.access_token_secret
});

function formatTweetObject(element){
  return {
    created_at: element.created_at,
    id: element.id_str,
    text: element.text,
    retweet_count: element.retweet_count,
    user: element.user,
    source: element.source
  }
}


function search(term, callbackFunction){
  const params = {
    q : term,
    result_type: "popular",
    count: 100,
    lang: "en"
  };

  if (callbackFunction){
    client.get('search/tweets', params, function(err, tweets){
      returnObj = {
        metadata: tweets.metadata,
        statuses: tweets.statuses.map(formatTweetObject)
      };
      callbackFunction(err,tweets);
    });
    return;
  }
    return new Promise(function (succeeded, failed) {
      client.get('/search/tweets', params)
          .then(function (tweets) {
              succeeded(tweets);
          })
          .catch(function (err) {
              failed(err);
          });
  });
}

module.exports = {
  search : search
};