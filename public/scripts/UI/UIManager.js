define("UI/UIManager", ["Organik/AtomManager", "Organik/ServerMessageManager"],
    function(AtomManager, ServerMessageManager) {
        var instance = null;

        function UIManager() {
            if (instance !== null) {
                throw new Error("Cannot instantiate more than one UIManager, use UIManager.getInstance()");
            }
            this._initialize();
        }
        UIManager.prototype = {
            _initialize: function() {
                // summary:
                // Initializes the singleton. 
                this.createUI();
                this.onDomReady();
                
            },
            createUI: function(){
                
               /* this.domElement = document.createElement('div')
					document.body.appendChild(this.domElement);
					this.domElement.innerHTML = '<a class="waves-effect waves-light btn-large"><i class="material-icons left">cloud</i>button</a>';
           */ },
           onDomReady: function(){
                window.onload = function() {

                    ////Modal////
                    var formScale = document.getElementById("AtomScale"); 
                    var inputScale = document.getElementById("input_scaleAtom"); 
                    formScale.onsubmit = function(){
                        AtomManager.changeScaleCoeff(inputScale.value);
                        return false;
                    }.bind(this);

                    ////Search////
                    var formSearch = document.getElementById("searchFrom");
                    var divSearch =  document.getElementById("search");
                    var inputSearch = document.getElementById("input_Search"); 
                    formSearch.onsubmit = function(){
                        ServerMessageManager.getTweetbyHachtag(inputSearch.value);
                        var search = $('div#search');
                        search.slideUp();
                        return false;
                    }.bind(this);
                }.bind(this);
            }
        };
        UIManager.getInstance = function() {
            // summary:
            // Gets an instance of the singleton. It is better to use 
            if (instance === null) {
                instance = new UIManager();
            }
            return instance;
        };

        return UIManager.getInstance();
    }
);
