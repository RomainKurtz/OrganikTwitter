 //////////////// EXPRESS ////////////////

 var app = require('express')();

 var __dirname = "./public/"

 /* serves main page */
 app.get("/", function(req, res) {
     res.sendfile(__dirname + 'index.html');
 });

 app.post("/user/add", function(req, res) {
     /* some server side logic */
     res.send("OK");
 });

 /* serves all the static files */
 app.get(/^(.+)$/, function(req, res) {
     console.log('static file request : ' + req.params);
     res.sendfile(__dirname + req.params[0]);
 });

 var port = process.env.PORT || 5000;
 var server = app.listen(port, function() {
     console.log("Listening on " + port);
 });

 //////////////// TWITTER ////////////////
 var ArrayOfStream = [];
 var io = require('socket.io').listen(server);
 io.on('connection', function(socket) {
     clientTabOfallTweet = [];
     console.log('New Socket Client !');
     socket.on('getTweet1', function() {
         socket.emit('tweetArrived', allTweet);
     });
     //-------------------------
     socket.on('getTweet', function(getParam) {
         if (getParam.getType === 'getTweetbyHachtag') {
             var clientTabOfTweet = []
             getTweetbyHachtag(getParam.getWord, clientTabOfTweet, function() {
                 socket.emit('tweetArrived', {
                     'tweetsData': clientTabOfTweet,
                     'getParam': getParam
                 });
             });
         } else if (getParam.getType === 'getTweetbyStreaming') {
             getTweetbyStreaming(getParam.getWord, function(tweet) {
                 socket.emit('tweetArrived', {
                     'tweetsData': tweet,
                     'getParam': getParam
                 });
             });
         } else if (getParam.getType === 'getTweetbyHachtagAndStreaming') {
             //Search
             var clientTabOfTweet = []
             getTweetbyHachtag(getParam.getWord, clientTabOfTweet, function() {
                 socket.emit('tweetArrived', {
                     'tweetsData': clientTabOfTweet,
                     'getParam': getParam
                 });
             });
             //Stream
             getTweetbyStreaming(getParam.getWord, function(tweet) {
                 socket.emit('tweetArrived', {
                     'tweetsData': tweet,
                     'getParam': getParam
                 });
             });
         }
     });
     //--------------------------
     socket.on('getTweetbyHachtag', function(hachtag) {
         var getParam = {
             getType: 'getTweetbyHachtag',
             period: '',
             getWord: hachtag,
         }
         var clientTabOfTweet = []
         getTweetbyHachtag(hachtag, clientTabOfTweet, function() {
             socket.emit('tweetArrived', {
                 'tweetsData': clientTabOfTweet,
                 'getParam': getParam
             });
             //clientTabOfallTweet add clientTabOfTweet
         });
     });
     //----------------------------
     socket.on('getTweetbyStreaming', function(wordToStream) {
         var getParam = {
             getType: 'getTweetbyStreaming',
             period: '',
             getWord: wordToStream,
         }
         getTweetbyStreaming(wordToStream, function(tweet) {
             socket.emit('tweetArrived', {
                 'tweetsData': tweet,
                 'getParam': getParam
             });
         });
     })
     //----------------------------
     socket.on('unsubscribeStreaming', function(wordToUntrack){
        for(var i = 0 ; i< ArrayOfStream.length ; i++) {
         if(ArrayOfStream[i].track === wordToUntrack){
            console.log('UNTRACK '+ wordToUntrack);
            ArrayOfStream[i].stream.destroy();
            ArrayOfStream.splice(i,1);
         }
        }
     })
 });

 var Twitter = require('twitter');

 // Put your twitter api id here
 var client = new Twitter({

     request_options: {
         
     }
 });

 function getTweetbyHachtag(hachtag, allTweet, callback) {
     console.log(callback);
     var twitter_word_to_search = hachtag;
     var NUMBEROFDAY = 0; // 0 : Only today | 1: today + yesterday ...

     var dateToStart = getDateTime(NUMBEROFDAY);
     var params = {
         q: twitter_word_to_search + ' since:' + dateToStart,
         count: '100'
     };
     console.log('Get all tweet with : ' + twitter_word_to_search + ', after : ' + dateToStart + ' (' + NUMBEROFDAY + ' days)');
     getTweet(params, allTweet, callback);
     return allTweet;
 }

 //// SEARCH ////
 function getTweet(param, tabOfTweet, callback) {
     client.get('search/tweets', param, function(error, tweets, response) {
         if (!error) {
             for (var i = 0; i < tweets.statuses.length; i++) {
                 tabOfTweet.push(tweets.statuses[i])
             };
             if (tweets.search_metadata.next_results) {
                 param.max_id = getURLParameter('max_id', tweets.search_metadata.next_results)
                 console.log('Number of tweets : ' + tabOfTweet.length + ' |next_results|');
                 getTweet(param, tabOfTweet, callback);
             } else {
                 console.log('Total of tweets : ', tabOfTweet.length);
                 console.log(callback);
                 callback();
             }
         } else {
             console.log(error);
         }

     });
 }

 // //  //get the user TimeLine
 // var params = {screen_name: 'toto'};
 // client.get('statuses/user_timeline', params, function(error, tweets, response){
 //   if (!error) {
 //     console.log(tweets.length);
 //   }
 // }); 

 //// STREAMING ////
 function getTweetbyStreaming(word, callback) {
     var twitter_word_to_stream = word;
     client.stream('statuses/filter', {
         track: twitter_word_to_stream
     }, function(stream) {
         console.log('Livestream tweet with : ' + twitter_word_to_stream);
         ArrayOfStream.push({
             track: twitter_word_to_stream,
             stream: stream
         });
         stream.on('data', function(tweet) {
             console.log(tweet.text);
             callback(tweet);
         });

         stream.on('error', function(error) {
             throw error;
         });
     });
     console.log(client.stream)
 }


 //////////////// UTILITIES ////////////////

 function getURLParameter(parameter, url) {
     if (!url) url = location.href
     parameter = parameter.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
     var regexS = "[\\?&]" + parameter + "=([^&#]*)";
     var regex = new RegExp(regexS);
     var results = regex.exec(url);
     return results == null ? null : results[1];
 }

 function getDateTime(numberOfDayBeforeToday) {

     var date = new Date();
     date.setDate(date.getDate() - numberOfDayBeforeToday)

     // var hour = date.getHours();
     // hour = (hour < 10 ? "0" : "") + hour;

     // var min  = date.getMinutes();
     // min = (min < 10 ? "0" : "") + min;

     // var sec  = date.getSeconds();
     // sec = (sec < 10 ? "0" : "") + sec;

     var year = date.getFullYear();

     var month = date.getMonth() + 1;
     month = (month < 10 ? "0" : "") + month;

     var day = date.getDate();
     day = (day < 10 ? "0" : "") + day;

     return year + "-" + month + "-" + day /*+ "-" + hour + "-" + min + "-" + sec*/ ;
 }
