define("Organik/Link", ["three", "Organik/LinkManager", "Organik/SceneManager"],
    function(THREE, LinkManager, SceneManager) {
        // start method
        function Link(atomOrigin, atomDestination) {
            this.atomA = atomOrigin;
            this.atomB = atomDestination;
            this._initialize();
        }
        // public method
        Link.prototype = {
            _initialize: function() {
                // define variable
                this.objectAvatar = null;
                this.createAvatar();
            },
            renderTick: function() {
                this.behaviourUpdate();
                this.anchorPositionUpdate();
            },
            anchorPositionUpdate: function(){
                this.objectAvatar.geometry.vertices[0] = this.atomA.objectAvatar.position;
                this.objectAvatar.geometry.vertices[1] = this.atomB.objectAvatar.position;
                this.objectAvatar.geometry.verticesNeedUpdate = true;
            },
            behaviourUpdate: function() {

            },
            createAvatar: function() {
                var material = new THREE.LineBasicMaterial({
                    color: 0x0000ff
                });
                var geometry = new THREE.Geometry();
                geometry.vertices.push(
                    this.atomA.objectAvatar.position,
                    this.atomB.objectAvatar.position
                );
                this.objectAvatar = new THREE.Line(geometry, material);
            },
        }
        return Link;
    })
