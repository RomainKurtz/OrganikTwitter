define("Organik/Animation", ["three", "tweenjs", "Organik/RenderManager", "Organik/Utilities"],
    function(THREE, TWEEN , RenderManager, Utilities) {
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
                this.animationArray =[];
                RenderManager.addOneCallbackToRenderer(this.renderAnimation, this);
            },   
            renderAnimation: function(iMe){
                TWEEN.update();
            },
            //Function to execute something (callback : function) after a delay (timeout : ms)
            setTimeout: function(callback, timeout){
                new TWEEN.Tween()
                .to({},timeout)
                .onComplete(function() {
                    callback();
                })
                .start();
            },
            createAnimation: function(variablesStart, variableEnd, duration, easing, onUpdate, onComplete){
                //graph : http://sole.github.io/tween.js/examples/03_graphs.html
                if(!onUpdate){onUpdate = function(){}};
                if(!onComplete){onComplete = function(){}};
                if(!easing){ easing = TWEEN.Easing.Linear.None}
                else{
                    var path = easing.split('.');
                    easing = TWEEN.Easing[path[0]][path[1]];
                };
                
                var tween = new TWEEN.Tween(variablesStart)
                .to( variableEnd , duration)
                .easing(easing)
                .onUpdate(function() {onUpdate()})
                .onComplete(function() {onComplete()})
                .start();

                return tween;
            },
            deleteAnimationbyTween: function(tween){
                TWEEN.remove(tween);
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
