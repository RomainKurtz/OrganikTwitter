define("Organik/CameraManager", ["three", "trackballcontrols", "Organik/RenderManager"],
    function(THREE, TrackballControls, RenderManager) {
        var instance = null;

        function CameraManager() {
            if (instance !== null) {
                throw new Error("Cannot instantiate more than one CameraManager, use CameraManager.getInstance()");
            }
            this._initialize();
        }
        CameraManager.prototype = {
            _initialize: function() {
                // summary:
                // Initializes the singleton.
                this.controls = null;
                this.camera = null;
                this._createCamera();
                this._createCameraControls();
                
                RenderManager.addOneCallbackToRenderer(this.renderCamera, this);
                RenderManager.setRendererCamera(this.camera);

                window.addEventListener('resize', this._onWindowResize.bind(this), false);
            },
            _onWindowResize: function(evt) {
                this.camera.aspect = window.innerWidth / window.innerHeight;
                this.camera.updateProjectionMatrix();
                RenderManager.resizeRenderer();
            },
            renderCamera: function(iMe) {
                //iMe.camera.rotation.y += 0.006;
                if(iMe.controls){
                    iMe.controls.update();
                }
            },
            changeCameraPosition: function(newPos) {
                this.camera.position.set(newPos.x, newPos.y, newPos.z);
            },
            changeCameraRotation: function(newOri) {
                this.camera.rotation.set(newOri.x, newOri.y, newOri.z);
            },
            getCamera: function() {
                return this.camera;
            },
            _createCamera: function() {
                this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            },
            _createCameraControls: function() {
                this.controls = new THREE.TrackballControls(this.camera, RenderManager.renderer.domElement);
                this.controls.rotateSpeed = 5.0;
                this.controls.zoomSpeed = 5;
                this.controls.panSpeed = 2;
                //Set the control target 
                this.controls.target = new THREE.Vector3(5, 5, 0);

                //this.controls.noZoom = true;
                this.controls.noPan = true;

                this.controls.staticMoving = true;
                this.controls.dynamicDampingFactor = 0.3;

                this.controls.keys = [65, 83, 68];
            }
        };
        CameraManager.getInstance = function() {
            // summary:
            // Gets an instance of the singleton. It is better to use 
            if (instance === null) {
                instance = new CameraManager();
            }
            return instance;
        };
        return CameraManager.getInstance();
    }
);
