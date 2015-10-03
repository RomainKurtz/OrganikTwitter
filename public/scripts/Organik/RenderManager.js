define("Organik/RenderManager", ["three"],
    function(THREE) {
        var instance = null;

        function RenderManager() {
            if (instance !== null) {
                throw new Error("Cannot instantiate more than one RenderManager, use RenderManager.getInstance()");
            }
            this._initialize();
        }
        RenderManager.prototype = {
            _initialize: function() {
                // summary:
                // Initializes the singleton.
                this.renderer = null;
                this.rendererScene = null;
                this.rendererCamera = null;
                this.callbackRenderer = [];
                this._createRenderer()
                this._render();

            },
            _createRenderer: function() {
                this.renderer = new THREE.WebGLRenderer();
                this.renderer.setSize(window.innerWidth, window.innerHeight);
                document.body.appendChild(this.renderer.domElement);
            },
            _render: function() {
                requestAnimationFrame(function() {
                    RenderManager.getInstance()._render();
                }); -
                this.callbackRenderer.forEach(function(element) {
                    element.renderCallback(element.context);
                }, this);
                if (this.rendererScene instanceof THREE.Scene && this.rendererCamera instanceof THREE.Camera) {
                    this.renderer.render(this.rendererScene, this.rendererCamera);
                }
            },
            resizeRenderer: function() {
                this.renderer.setSize(window.innerWidth, window.innerHeight);
            },
            addOneCallbackToRenderer: function(callback, context) {
                this.callbackRenderer.push({
                    renderCallback: callback,
                    context: context
                });
            },
            setRendererCamera: function(camera) {
                this.rendererCamera = camera;
            },
            setRendererScene: function(scene) {
                this.rendererScene = scene;
            },
        };
        RenderManager.getInstance = function() {
            // summary:
            // Gets an instance of the singleton. It is better to use 
            if (instance === null) {
                instance = new RenderManager();
            }
            return instance;
        };

        return RenderManager.getInstance();
    }
);
