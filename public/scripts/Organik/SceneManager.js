define("Organik/SceneManager", ["three", "Organik/RenderManager"],
    function(THREE, RenderManager) {
        var instance = null;

        function SceneManager() {
            if (instance !== null) {
                throw new Error("Cannot instantiate more than one SceneManager, use SceneManager.getInstance()");
            }
            this._initialize();
        }
        SceneManager.prototype = {
            _initialize: function() {
                // summary:
                // Initializes the singleton.
                this.scene = new THREE.Scene();
                RenderManager.setRendererScene(this.scene);

            },
            add: function(containerName, object) {
                var hasContainer = false;
                for (var i = 0; i < this.scene.children.length; i++) {
                    if (this.scene.children[i].name === containerName) {
                        this.scene.children[i].add(object);
                        hasContainer = true;
                        break;
                    }
                }
                if (!hasContainer) {
                    // if container undefined then create it
                    var newContainer = new THREE.Object3D();
                    newContainer.name = containerName;
                    newContainer.add(object);
                    this.scene.add(newContainer);
                }
            },
            remove: function(containerName, object) {
                var hasContainer = false;
                for (var i = 0; i < this.scene.children.length; i++) {
                    if (this.scene.children[i].name === containerName) {
                        this.scene.children[i].remove(object);
                        hasContainer = true;
                        break;
                    }
                }
                if (!hasContainer) {
                    console.log('object don\'t exist');
                }

            },
            getSceneContainer: function(nameOfContainer) {
                for (var i = 0; i < this.scene.children.length; i++) {
                    if (this.scene.children[i].name === nameOfContainer) {
                        return (this.scene.children[i]);
                    }
                }
                return null;
            },
            // getDistanceAB: function(v1, v2) {
            //         var dx = v1.x - v2.x;
            //         var dy = v1.y - v2.y;
            //         var dz = v1.z - v2.z;
            //         return Math.sqrt(dx * dx + dy * dy + dz * dz);
            // },

        };
        SceneManager.getInstance = function() {
            // summary:
            // Gets an instance of the singleton. It is better to use 
            if (instance === null) {
                instance = new SceneManager();
            }
            return instance;
        };


        return SceneManager.getInstance();
    });
