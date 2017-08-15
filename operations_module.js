module.exports = {

  overallSentiment: function(analysisList){
    var sentiment = 0;
    for(i in analysisList){
      for(j in analysisList[i].keywords)
        sentiment += analysisList[i].keywords[j].sentiment.score;
      for(j in analysisList[i].entities)
        sentiment += analysisList[i].entities[j].sentiment.score;
    }
    return sentiment;
  },

  averageEmotions: function(analysisList){
    var sadness=0; joy=0; fear=0; disgust=0; anger = 0;
    var keywordEntityCount = 0;
    for(i in analysisList){
      for(j in analysisList[i].keywords){
        keywordEntityCount++;
        sadness += analysisList[i].keywords[j].emotion.sadness;
        joy += analysisList[i].keywords[j].emotion.joy;
        fear += analysisList[i].keywords[j].emotion.fear;
        disgust += analysisList[i].keywords[j].emotion.disgust;
        anger += analysisList[i].keywords[j].emotion.anger;
      }
      for(j in analysisList[i].entities){
        keywordEntityCount++;
        sadness += analysisList[i].entities[j].emotion.sadness;
        joy += analysisList[i].entities[j].emotion.joy;
        fear += analysisList[i].entities[j].emotion.fear;
        disgust += analysisList[i].entities[j].emotion.disgust;
        anger += analysisList[i].entities[j].emotion.anger;
      }
    }
    return [ ['sadness',Math.round(sadness/keywordEntityCount*100)/100], ['joy',Math.round(joy/keywordEntityCount*100)/100],['fear',Math.round(fear/keywordEntityCount*100)/100], ['disgust',Math.round(disgust/keywordEntityCount*100)/100], ['anger',Math.round(anger/keywordEntityCount*100)/100] ]
  },

  topEntities: function(analysisList, number){
    var entities = {};
    for(i in analysisList){
    analysisList[i].entities.forEach(entity => {
         if (!entities[String(entity.text)])
           entities[String(entity.text)] = entity.count;
          else
           entities[String(entity.text)]+= entity.count;
         })
       }
       var array = [];
       for(entity in entities)
          array.push([entity,entities[entity]])
       array.sort(function(a,b){return a[1] - b[1]});
       array.reverse();
       if(number > array.length) number = array.length;
       return array.slice(0,number);
     },

topKeywords: function(analysisList, number){
   var keywords = {};
   for(i in analysisList){
   analysisList[i].keywords.forEach(keyword => {
        if (!keywords[String(keyword.text)])
          keywords[String(keyword.text)] = 1;
         else
          keywords[String(keyword.text)]++;
        })
  }
    var array = [];
    for(keyword in keywords)
      array.push([keyword,keywords[keyword]])
    array.sort(function(a,b){return a[1] - b[1]});
    array.reverse();
    if(number > array.length) number = array.length;
    return array.slice(0,number);
 },

topEntityTypes: function(analysisList, number){
   var types = {};
   for(i in analysisList){
   analysisList[i].entities.forEach(entity => {
        if (!types[String(entity.type)])
          types[String(entity.type)] = entity.count;
         else
          types[String(entity.type)]+= entity.count;
        })
      }
      var array = [];
      for(type in types)
         array.push([type,types[type]])
      array.sort(function(a,b){return a[1] - b[1]});
      array.reverse();
      if(number > array.length) number = array.length;
      return array.slice(0,number);
    }


}
