define("Organik/ServerMessageManager", ["socketio"],
    function(io) {
        var instance = null;

        function ServerMessageManager() {
            if (instance !== null) {
                throw new Error("Cannot instantiate more than one ServerMessageManager, use ServerMessageManager.getInstance()");
            }
            this.SERVERADR = 'http://localhost:5000';
            this.socket = null;
            this.tabEvent = [
                {event : 'tweetArrived', callback : []},
                {event : 'isOK', callback : []},
            ];
            this._initialize();
        }
        ServerMessageManager.prototype = {
            _initialize: function() {
                this.initSocket();
                this.initSocketEvent();
            },
            initSocket : function(){
                this.socket = io.connect(this.SERVERADR);
            },
            initSocketEvent: function(){
                //tweetArrived
                this.socket.on(this.tabEvent[0].event, function(data) {
                    for(var u = 0; u< this.tabEvent[0].callback.length;u++){
                        this.tabEvent[0].callback[u](data);
                    }
                }.bind(this));
            },
            eventSubscriber: function(eventName, callback){
                for(var i=0 ; i< this.tabEvent.length ; i++){
                    if(this.tabEvent[i].event === eventName){
                        this.tabEvent[i].callback.push(callback);
                    }
                }
            },
            eventUnsubscriber: function(id){
                //todo : eventSubscriber return unique id
                //       eventUnsubscriber remove this.tabEvent[i].callback associat at the ID
            },
            eventSender: function(eventName, data){
                this.socket.emit(eventName, data)
            },
            getTweetbyHachtag: function(hachtag){
                this.eventSender('getTweetbyHachtag', hachtag);
            } 
        };
        ServerMessageManager.getInstance = function() {
            // summary:
            // Gets an instance of the singleton. It is better to use 
            if (instance === null) {
                instance = new ServerMessageManager();
            }
            return instance;
        };

        return ServerMessageManager.getInstance();
    }
);
