define("UI/UIManager", ["Organik/AtomManager", "UI/UIFooter", "UI/UIGalaxy"],
    function(AtomManager, UIFooter, UIGalaxy) {
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
                // this.onDomReady();

            },
            createUI: function() {
                var uIFooter = new UIFooter();
                /* 

                // import modal settings
                getImport = document.querySelector('#template-modalsettings');
                getContent = getImport.import.querySelector('#modalSettings');
                document.body.appendChild(document.importNode(getContent, true));*/

            },
            onDomReady: function() {
            },
            addGalaxy: function(galaxyName){
                var uIGalaxy = new UIGalaxy(galaxyName);
            },
            _buildUIBehaviour: function() {
                
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
