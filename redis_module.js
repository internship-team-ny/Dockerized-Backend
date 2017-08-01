//setting up connection to redis using default settings
var redis = require('redis');
var client = redis.createClient('6379','redis');

module.exports = {

  //stores tweet in a list
  storeTweet: function(id, tweet) {
    var listTitle = id + ' tweets';
    client.rpush(listTitle,JSON.stringify(tweet));
  },


  //stores tweet's text in a list, takes a list of tweets
  storeTweets: function(id,tweets,parameters){
    if(arguments.length == 2) {
        for (var i = 0; i < tweets.length; i++)
            this.storeTweet(id, tweets[i].text);
    }

    //stores given parameters of tweets
    else{
        for(var i = 0; i < tweets.length; i++){
            var currentTweet = tweets[i];
            for(property in currentTweet){
                if ( !parameters.includes( property.toString() ) )
                    delete currentTweet[property];
            }
            this.storeTweet(id, currentTweet);
        }
    }
  },


  //retrieve tweets for a given ID in a list
  retrieveTweets: function(id, callback) {
    var listTitle = id + ' tweets';
    var retrieved = [];
    client.lrange(listTitle,0,-1, function(err, reply){
      for(i in reply)
        retrieved.push(JSON.parse(reply[i]));
      callback(retrieved);
    });
  },

  storeAnalysis: function(id, analysis) {
    console.log('Storing '+JSON.stringify(analysis));
    var listTitle = id + ' analysis';
    client.rpush(listTitle,JSON.stringify(analysis));
  },

  storeMultipleAnalysis: function(id, analysis){
     var listTitle = id + ' analysis';
     for(var i = 0; i < analysis.length; i++)
      this.storeAnalysis(id, analysis[i]);
  },

  retrieveAnalysis: function(id, callback) {
    var listTitle = id + ' analysis';
    var retrieved = [];
    client.lrange(listTitle,0,-1, function(err, reply){
      for(i in reply)
        retrieved.push(JSON.parse(reply[i]));
      callback(retrieved);
    });
  },

  quit: function(){
    client.quit();
  }
};
