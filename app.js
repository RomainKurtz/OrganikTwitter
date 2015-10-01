
 var app = require('express')();
 
 
 var __dirname = "./public/"
 
 /* serves main page */
 app.get("/", function(req, res) {
    res.sendfile( __dirname +'index.html');
 });
 
  app.post("/user/add", function(req, res) { 
	/* some server side logic */
	res.send("OK");
  });
 
 /* serves all the static files */
 app.get(/^(.+)$/, function(req, res){ 
     console.log('static file request : ' + req.params);
     res.sendfile( __dirname + req.params[0]); 
 });
 
 var port = process.env.PORT || 5000;
 var server = app.listen(port, function() {
   console.log("Listening on " + port);
 });
 

 var io = require('socket.io').listen(server);
 io.on('connection', function(){
    console.log('New Socket Client !'); 
    });
 
 
 var Twitter = require('twitter');
 
var client = new Twitter({
  consumer_key: '',
  consumer_secret: '',
  access_token_key: '',
  access_token_secret: ''
});
 
 
 /* get the user TimeLine
var params = {screen_name: 'kurtzRomain'};
client.get('statuses/user_timeline', params, function(error, tweets, response){
  if (!error) {
    console.log(tweets);
  }
}); */

client.stream('statuses/filter', {track: 'obama'}, function(stream) {
  stream.on('data', function(tweet) {
    console.log(tweet.text);
    io.sockets.emit('tweetArrived',tweet);
  });
 
  stream.on('error', function(error) {
    throw error;
  });
});
