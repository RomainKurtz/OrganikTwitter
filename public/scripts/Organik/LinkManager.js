define("organik/linkManager",
["three", "organik/link","organik/renderManager", "organik/sceneManager", "organik/atomManager"],
function(THREE, Link, RenderManager, SceneManager, AtomManager){
    var instance = null;

    function LinkManager(){
        if(instance !== null){
            throw new Error("Cannot instantiate more than one LinkManager, use LinkManager.getInstance()");
        } 
        
        this._initialize();
    }
    LinkManager.prototype = {
        _initialize: function(){
            // summary:
            // Initializes the singleton.
            this.LinkList = [];
            this.worldLimites = {
                max : new THREE.Vector3(100,100,100),
                min : new THREE.Vector3(-100,-100,-100)
            }
            this.containerLinksName = 'LinkContainer';
            RenderManager.addOneCallbackToRenderer(this.renderLinksManager,this);
        },
        addLink : function(Link){
            this.LinkList.push(Link);
        },
        renderLinksManager : function(iMe){
            //Test distance of atoms
            for(var i = 0 ; i < AtomManager.atomList.length ; i++ ){
                var firstCurrentAtom = AtomManager.atomList[i];
                var nextAtomNeartoFirst = null;
                for(var u = 0 ; u < AtomManager.atomList.length ; u++){
                    var secondCurrentAtom = AtomManager.atomList[u];  
                    var toto = SceneManager.getDistanceAB(firstCurrentAtom.objectAvatar.position,secondCurrentAtom.objectAvatar.position);
                    console.log(toto);
                    
                }
                
            }
          //iMe.atomManager.atomList
            
          iMe.renderLinks();
        },
        renderLinks : function(){
            for(var i=0;i<this.LinkList.length;i++){
                //call the render methode of the Link particle
                 this.LinkList[i].renderTick();
            }
        },
        changeWorldLimits : function(min, max){
            this.worldLimites.min = min;
            this.worldLimites.max = max;
        },
    };
    LinkManager.getInstance = function(){
        // summary:
        // Gets an instance of the singleton. It is better to use 
        if(instance === null){
            instance = new LinkManager();
        }
        return instance;
    };


    return LinkManager.getInstance();
});