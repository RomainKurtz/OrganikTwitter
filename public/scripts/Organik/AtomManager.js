define("Organik/AtomManager", ["three", "Organik/Atom", "Organik/RenderManager", "Organik/SceneManager"],
    function(THREE, Atom, RenderManager, SceneManager) {
        var instance = null;

        function AtomManager() {
            if (instance !== null) {
                throw new Error("Cannot instantiate more than one AtomManager, use AtomManager.getInstance()");
            }

            this._initialize();
        }
        AtomManager.prototype = {
            _initialize: function() {
                // summary:
                // Initializes the singleton.
                this.atomList = [];
                this.worldLimites = {
                    max: new THREE.Vector3(100, 100, 100),
                    min: new THREE.Vector3(-100, -100, -100)
                }
                this.containerAtomsName = 'atomContainer';
                RenderManager.addOneCallbackToRenderer(this.renderAtomsManager, this);
            },
            addAtom: function(atom) {
                this.atomList.push(atom);
            },
            renderAtomsManager: function(iMe) {
                //SceneManager.getSceneContainer(iMe.containerAtomsName).rotation.y +=0.01;
                iMe.renderAtoms();
            },
            renderAtoms: function() {
                for (var i = 0; i < this.atomList.length; i++) {
                    //call the render methode of the atom particle
                    this.atomList[i].renderTick();
                }
            },
            changeWorldLimits: function(min, max) {
                this.worldLimites.min = min;
                this.worldLimites.max = max;
            },
            getAtomBy3DObject: function(object3D) {
                for (var i = 0; i < this.atomList.length; i++) {
                    if (this.atomList[i].objectAvatar.id === object3D.id) {
                        return this.atomList[i];
                    }
                }
                return null;
            }
        };
        AtomManager.getInstance = function() {
            // summary:
            // Gets an instance of the singleton. It is better to use 
            if (instance === null) {
                instance = new AtomManager();
            }
            return instance;
        };


        return AtomManager.getInstance();
    }
);
