//setting up NLU, no need to hide credentials as this code is only accessed locally
var NaturalLanguageUnderstandingV1 = require('watson-developer-cloud/natural-language-understanding/v1.js');
var natural_language_understanding = new NaturalLanguageUnderstandingV1({
  'username': 'c1b1a5cc-a738-405c-bd27-24b3211d0cab',
  'password': 'ZoCp1BxpMWeh',
  'version_date': '2017-02-27'
});

  module.exports = {


//returns analysis with only the passed features, if no features are passed then default features instead
analyze: function(text, features, callback) {

    if (arguments.length == 2){
        var parameters = {
            'text':text,
            'features':{
                'categories': {},
                'concepts': {
                    'limit': 5
                },
                'entities':{
                    'emotion': true,
                    'sentiment': true,
                    'limit': 5
                },
                'keywords':{
                    'emotion':true,
                    'sentiment':true,
                    'limit': 5
                }
            }
        }
console.log('About to analyze: '+text);
        natural_language_understanding.analyze(parameters, function(err, response) {
            if (err)
                console.log('error:', err);
            else
                features(response);
        });
    }

    else
    {
        var parameters = {
            'text': text,
            'features': {}
        }

        if (features.includes('categories'))
            parameters.features.categories = {};
        if (features.includes('concepts'))
            parameters.features.concepts = {
                'limit': 5
            };
        if (features.includes('entities'))
            parameters.features.entities = {
                'emotion': true,
                'sentiment': true,
                'limit': 5
            };
        if (features.includes('keywords'))
            parameters.features.keywords = {
                'emotion': true,
                'sentiment': true,
                'limit': 5
            };

        natural_language_understanding.analyze(parameters, function (err, response) {
            if (err)
                console.log('error:', err);
            else
                callback(response);
        });
    }
}
}
