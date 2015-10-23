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
 io.on('connection', function(socket) {
     console.log('New Socket Client !');
     socket.on('getTweet', function() {
         socket.emit('tweetArrived', allTweet);
     });
     socket.on('getTweetbyHachtag', function(hachtag){
         socket.emit('tweetArrived', getTweetbyHachtag(hachtag));
     });
 });

 var Twitter = require('twitter');

// Put your twitter api id here
 var client = new Twitter({
     

  request_options: {
    //proxy: ''
  }
 });

function getTweetbyHachtag(hachtag){
    //var twitter_word_to_search = 'michel+et+augustin';
    //var twitter_word_to_search = 'Francois+Hollande';
    //var twitter_word_to_search = '#jefaisdestestsaveclapi';
    // var twitter_word_to_search = '#republique';
    //var twitter_word_to_search = 'Dassault+Systemes';
    //var twitter_word_to_search = 'Leonardo+vinci';
    var twitter_word_to_search = hachtag;
    var NUMBEROFDAY = 0; // 0 : Only today | 1: today + yesterday ...
    
    var dateToStart = getDateTime(NUMBEROFDAY);
    var params = {
        q: twitter_word_to_search + ' since:'+dateToStart,
        count: '100'
    };
    
    var allTweet = [];
    console.log('Get all tweet with : '+ twitter_word_to_search + ', after : ' + dateToStart +' ('+ NUMBEROFDAY +' days)');
    getTweet(params, allTweet);
    return allTweet;
}

 //// SEARCH ////
 function getTweet(param, tabOfTweet) {
     client.get('search/tweets', param, function(error, tweets, response) {
         if (!error) {
             for (var i = 0; i < tweets.statuses.length; i++) {
                 tabOfTweet.push(tweets.statuses[i])
             };
             if (tweets.search_metadata.next_results) {
                 param.max_id = getURLParameter('max_id', tweets.search_metadata.next_results)
                 console.log('Number of tweets : '+ tabOfTweet.length +' |next_results|');
                 getTweet(param, tabOfTweet);
             } else {
                 console.log('Total of tweets : ', tabOfTweet.length);
                 io.sockets.emit('tweetArrived', tabOfTweet);
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
 var twitter_word_to_search = 'dfgdfgdfgdfgdfgdfgdfgdfdfgdfgdf';
 client.stream('statuses/filter', {
     track: twitter_word_to_search
 }, function(stream) {
     console.log('Livestream tweet with : '+ twitter_word_to_search)
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


//////////////// UTILITIES ////////////////
function getDateTime(numberOfDayBeforeToday) {

    var date = new Date();
    date.setDate(date.getDate()-numberOfDayBeforeToday)

    // var hour = date.getHours();
    // hour = (hour < 10 ? "0" : "") + hour;

    // var min  = date.getMinutes();
    // min = (min < 10 ? "0" : "") + min;

    // var sec  = date.getSeconds();
    // sec = (sec < 10 ? "0" : "") + sec;

    var year = date.getFullYear();

    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;

    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;

    return year + "-" + month + "-" + day /*+ "-" + hour + "-" + min + "-" + sec*/;

}