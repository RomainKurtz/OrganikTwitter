define("Organik/LinkManager", ["Organik/Link", "Organik/RenderManager", "Organik/SceneManager"],
    function(Link, RenderManager, SceneManager) {
        var instance = null;

        function LinkManager() {
            if (instance !== null) {
                throw new Error("Cannot instantiate more than one LinkManager, use LinkManager.getInstance()");
            }

            this._initialize();
        }
        LinkManager.prototype = {
            _initialize: function() {
                // summary:
                // Initializes the singleton.
                this.LinkList = [];
                this.AtomRetweetedList = [];
                this.containerLinksName = 'LinkContainer';
                RenderManager.addOneCallbackToRenderer(this.renderLinksManager, this);
            },
            addLink: function(Link) {
                this.LinkList.push(Link);
            },
            updateLinksTable: function(atomList){
                this.AtomRetweetedList = [];
                for(var i = 0 ; i< atomList.length ; i++){
                    if(atomList[i].tweetData.retweeted_status){
                        this.AtomRetweetedList.push(atomList[i]);
                    }
                }
                for(var i = 0 ; i< this.AtomRetweetedList.length ; i++){
                    for(var u = 0 ; u < atomList.length ; u++){
                        if(this.AtomRetweetedList[i].tweetData.retweeted_status.id === atomList[u].tweetData.id ){
                            var link = new Link(atomList[u], this.AtomRetweetedList[i]);
                            this.addLink(link);
                            SceneManager.add(this.containerLinksName, link.objectAvatar);
                        }
                    }
                } 
            },
            renderLinksManager: function(iMe) {
                //Test distance of atoms
                iMe.renderLinks();
            },
            renderLinks: function() {
                for (var i = 0; i < this.LinkList.length; i++) {
                    //call the render methode of the Link particle
                    this.LinkList[i].renderTick();
                }
            },
        };
        LinkManager.getInstance = function() {
            // summary:
            // Gets an instance of the singleton. It is better to use 
            if (instance === null) {
                instance = new LinkManager();
            }
            return instance;
        };
        return LinkManager.getInstance();
    });
