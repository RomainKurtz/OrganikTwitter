define("Organik/Utilities",["three", "Organik/CameraManager", "Organik/RenderManager", "threex"],
function(THREE, CameraManager, RenderManager, THREEx){
    var instance = null;

    function Utilities(){
        if(instance !== null){
            throw new Error("Cannot instantiate more than one Utilities, use Utilities.getInstance()");
        } 
        this._initialize();
    }
    Utilities.prototype = {
        _initialize: function(){
            // summary:
            // Initializes the singleton.           
        },
        get2DPositionOf3DObject: function(object3D){
            var position2D = THREEx.ObjCoord.cssPosition(object3D, CameraManager.camera,RenderManager.renderer);
            return position2D;
        }
        
    };
    Utilities.getInstance = function(){
        // summary:
        // Gets an instance of the singleton. It is better to use 
        if(instance === null){
            instance = new Utilities();
        }
        return instance;
    };


    return Utilities.getInstance();
});