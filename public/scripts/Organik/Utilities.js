define("Organik/Utilities", ["three", "Organik/CameraManager", "Organik/RenderManager", "threexObjcoord", "threexDomevents"],
    function(THREE, CameraManager, RenderManager, threexObjcoord, threexDomevents) {
        var instance = null;

        function Utilities() {
            if (instance !== null) {
                throw new Error("Cannot instantiate more than one Utilities, use Utilities.getInstance()");
            }
            this._initialize();
        }
        Utilities.prototype = {
            _initialize: function() {
                // summary:
                // Initializes the singleton. 
                this._domEvents = new THREEx.DomEvents(CameraManager.camera, RenderManager.renderer.domElement)
            },
            get2DPositionOf3DObject: function(object3D) {
                var position2D = THREEx.ObjCoord.cssPosition(object3D, CameraManager.camera, RenderManager.renderer);
                return position2D;
            },
            createEventOn3DObject: function(object3D, event, callback) {
                //the available events are click, dblclick, mouseup, mousedown, mouseover and mouse out
                //If the camera changes, you can use domEvents.camera(camera) to set the new one.
                this._domEvents.addEventListener(object3D, event, callback, false)
            },
            removeEventOn3DObject: function(object3D, event, callback) {
                this._domEvents.removeEventListener(object3D, event, callback, false)
            },
            createDomID: function() {
                function s4() {
                    return Math.floor((1 + Math.random()) * 0x10000)
                        .toString(16)
                        .substring(1);
                }
                return s4() + s4() + '-' + s4();
            },
            createID: function() {
                function s4() {
                    return Math.floor((1 + Math.random()) * 0x10000)
                        .toString(16)
                        .substring(1);
                }
                return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
                    s4() + '-' + s4() + s4() + s4();
            }

        };
        Utilities.getInstance = function() {
            // summary:
            // Gets an instance of the singleton. It is better to use 
            if (instance === null) {
                instance = new Utilities();
            }
            return instance;
        };

        return Utilities.getInstance();
    }
);
