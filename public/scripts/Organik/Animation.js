define("Organik/Animation", ["three", "tweenjs", "Organik/RenderManager"],
    function(THREE, TWEEN , RenderManager) {
        var instance = null;

        function Animation() {
            if (instance !== null) {
                throw new Error("Cannot instantiate more than one Animation, use Animation.getInstance()");
            }
            this._initialize();
        }
        Animation.prototype = {
            _initialize: function() {
                // summary:
                // Initializes the singleton. 
                RenderManager.addOneCallbackToRenderer(this.renderAnimation, this);
            },   
            renderAnimation: function(iMe){
                TWEEN.update();
            },
            setTimeout: function(callback, timeout){
                var tween = new TWEEN.Tween()
                .to({ },timeout)
                .onComplete(function() {
                    callback();
                })
                .start();
            }
        };
        Animation.getInstance = function() {
            // summary:
            // Gets an instance of the singleton. It is better to use 
            if (instance === null) {
                instance = new Animation();
            }
            return instance;
        };

        return Animation.getInstance();
    }
);
