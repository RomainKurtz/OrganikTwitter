define("UI/UIManager", [],
    function() {
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
            },
            createUI: function(){
                
               /* this.domElement = document.createElement('div')
					document.body.appendChild(this.domElement);
					this.domElement.innerHTML = '<a class="waves-effect waves-light btn-large"><i class="material-icons left">cloud</i>button</a>';
           */ }   
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
