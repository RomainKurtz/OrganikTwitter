define("UI/UILinkManager", ["UI/UIManager"],
    function(UIManager) {
        var instance = null;

        function UILinkManager() {
            if (instance !== null) {
                throw new Error("Cannot instantiate more than one UILinkManager, use UILinkManager.getInstance()");
            }
            this._initialize();
        }
        UILinkManager.prototype = {
            _initialize: function() {
                // summary:
                // Initializes the singleton. 
            },
            LinkClicked: function(path) {
                //remove the first '#'
                var pathwithouhach = path.slice(1);
                //get the link part and the type part
                var pathArray = pathwithouhach.split( '?type=' );
                var type = pathArray[1];
                var link = pathArray[0];
                // select what to do in case of type
                if (type === 'user' || type === 'hachtag') {
                    UIManager.addWordIntoSearchBar(link);
                } else if (type === 'externalLink') {
                    window.open(link);
                } else {
                   UIManager.addWordIntoSearchBar(link);
                }
            },

        };
        UILinkManager.getInstance = function() {
            // summary:
            // Gets an instance of the singleton. It is better to use 
            if (instance === null) {
                instance = new UILinkManager();
            }
            return instance;
        };

        return UILinkManager.getInstance();
    }
);
