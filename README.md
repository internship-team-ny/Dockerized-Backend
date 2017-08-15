# Backend Modules
Redis module: stores and retrieves tweets and analysis (Ahmed Youssef)

NLU module: performs analysis for given text using IBM's NLU service (Ahmed Youssef)

Operations module: performs operations on analysis data to be displayed to the user (Ahmed Youssef)

Twitter module: retrieves tweets based on user's search query (Moaz Hamza)

***** **REDIS Module** *****:

(All functions should be passed the request id as the first parameter.)

- (storeTweet) stores an entire tweet just as it is passed to it.

- (storeTweets) stores a list of tweets. If only two parameters are passed, it stores the entire tweets. If a third parameter 'parameters' is passed, it stores only the given properties of a tweet, i.e. store a tweet's text and source only for example. The desired properties should be passed to the function as a list of strings with the name of the properties, e.g. ['text', 'source']. It thus can take two or three parameters.

- (storeAnalysis) and (storeMultipleAnalysis) store a single analysis or multiple analysis respectively.

- (retrieveTweets) and (retrieveAnalysis) functions each return a list of JSON objects each representing a tweet/analysis. They  need to be passed a callback function to handle the retrieved data.

- (quit) ends the connection to the redis server.


An example call for storing only the text, ID, and source of tweets and then retrieving them:

```
var redis = require('redis_module.js');

var tweets = [TweetOne,TweetTwo];
var parameters = ['text', 'id_str', 'source'];
redis.storeTweets('id', tweets, parameters);
redis.retrieveTweets('id', function(reply){
     var retrievedTweets = reply;
});
```

***** **NLU Module** *****:

(analyze) is the only function in this module:

- (analyze) can take two parameters: the text to be analyzed and a callback function to receive the analysis.
- (analyze) can take three parameters:  the text to be analyzed, desired analysis features, and a callback function to receive the analysis. Possible features are:(categories, concepts, entities, keywords)

An example call for performing analysis on a tweet's text with default parameters and storing it:

```
var nlu = require('NLU_module');

nlu.analyze(Tweet.text, function(response){
   redis.storeAnalysis('id', response);
});
 ``` 
 
 An example call for  analyzing a tweet's text entities and keywords only and storing the analysis:

```
var nlu = require('NLU_module');

nlu.analyze(Tweet.text, ['entities','keywords'], function(response){
   redis.storeAnalysis('id', response);
});
 ``` 
 
 
  
  ***An example of retrieving a user request's tweets, analyzing their texts, and then storing that analysis***:
  
```
var redis = require('redis_module.js');
var nlu = require('NLU_module');

redis.retrieveTweets('id', function(reply){
  for(i in reply){
    nlu.analyze(reply[i].text, function(response){
      redis.storeAnalysis('id', response);
    });
  }
});
```

***** **Operations Module** *****:

(every function takes an array of NLU analysis in JSON format as the paramater 'analysisList')

- overallSentiment(analysisList): Sum of sentiment score among all tweets analysis, each analysis has a sentiment score for each keyword and entity. Sentiment scores are between -1 and 1.

- averageEmotions(analysisList): Average of emotion score among all tweets analysis for each emotion, different emotions are: (sadness, joy, fear, disgust, anger). Each analysis has a score for each emotion for every keyword and entity. Return value is a list of 5 objects: each emotion and its score.

- topEntities(analysisList, number): Most common entities. The paramter 'number' determines how many top entites to display, i.e. passing 5 as 'number' returns an array of the 5 most common entities. Return value is a list of 'number' objects: each entity and its frequency.

- topKeywords(analysisList, number): Same as topEntities but for keywords.

- topEntityTypes(analysisList, number): Same as topEntities but for entity types.

- More functions to be added

  ***An example utilizing Redis, NLU and Operations module***:
  
```
var redis = require('redis_module.js');
var nlu = require('NLU_module');
var operations = require('operations_module.js');

redis.retrieveTweets('id', function(reply){
  for(i in reply){
    nlu.analyze(reply[i].text, function(response){
      redis.storeAnalysis('id', response);
    });
  }
});

redis.retrieveTweets('id', function(reply){
     console.log('Overall Sentiment: ' + operations.overallSentiment(reply)); //outputs overall sentiment (score from -1 to 1)
     console.log('Emotions: ' + operations.averageEmotions(reply)); //outputs each emotion followed by its score
     console.log('Top 3 Entities: ' + operations.topEntityTypes(reply,3)); //outputs 3 most common entities with frequencies 
     console.log('Top 2 Keywords: ' + operations.topKeywords(reply,2)); //outputs 2 most common keywords with frequencies
     console.log('Top Entity Type: ' + operations.topEntityTypes(reply,1)); //outputs top entity type
});

```


