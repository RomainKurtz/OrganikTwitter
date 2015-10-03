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

 var io = require('socket.io').listen(server);
 io.on('connection', function() {
     console.log('New Socket Client !');
     io.sockets.emit('tweetArrived', allTweet);
 });

 var Twitter = require('twitter');

// Put your twitter api id here
 var client = new Twitter({
     
 });



 // //  //get the user TimeLine
 // var params = {screen_name: 'toto'};
 // client.get('statuses/user_timeline', params, function(error, tweets, response){
 //   if (!error) {
 //     console.log(tweets.length);
 //   }
 // }); 



 //var params = {q: 'Dassault+Systemes since:2015-10-02', count: '100'};
 //var params = {q: 'Francois+Hollande since:2015-10-02', count: '100'};

 twitter_word_to_search = 'michel+et+augustin'
 var params = {
     q: twitter_word_to_search + ' since:2015-10-02',
     count: '100'
 };

 var allTweet = [];
 getTweet(params, allTweet);



 //// tweet by search ////
 function getTweet(param, tabOfTweet) {
     client.get('search/tweets', param, function(error, tweets, response) {
         if (!error) {
             for (var i = 0; i < tweets.statuses.length; i++) {
                 tabOfTweet.push(tweets.statuses[i])
             };

             if (tweets.search_metadata.next_results) {
                 param.max_id = getURLParameter('max_id', tweets.search_metadata.next_results)
                 console.log('next_results');
                 getTweet(param, tabOfTweet);
             } else {
                 console.log('Number of tweets : ', tabOfTweet.length);
                 io.sockets.emit('tweetArrived', tabOfTweet);
             }
         } else {
             console.log(error);
         }

     });
 }

 //// tweet by streaming ////
 client.stream('statuses/filter', {
     track: 'twitter_word_to_search'
 }, function(stream) {
     stream.on('data', function(tweet) {
         console.log(tweet.text);
         io.sockets.emit('tweetArrived', tweet);
     });

     stream.on('error', function(error) {
         throw error;
     });
 });

 function getURLParameter(parameter, url) {
     if (!url) url = location.href
     parameter = parameter.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
     var regexS = "[\\?&]" + parameter + "=([^&#]*)";
     var regex = new RegExp(regexS);
     var results = regex.exec(url);
     return results == null ? null : results[1];
 }
