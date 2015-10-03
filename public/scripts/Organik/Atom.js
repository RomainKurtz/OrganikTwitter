define("Organik/Atom", ["three", "Organik/AtomManager", "Organik/Utilities", "Organik/SceneManager"],
    function(THREE, AtomManager, Utilities, SceneManager) {
        // start method
        function Atom() {
            this._initialize();
        }
        // public method
        Atom.prototype = {
            _initialize: function() {
                // define variable
                this.objectAvatar = null;
                this.direction = new THREE.Vector3(1, 0, 0);
                this.velocity = Math.random() / 2;
                this.tweetData = null;
                this.layer2D = null;

                this.createAvatar();
                AtomManager.addAtom(this);
            },
            renderTick: function() {
                this.behaviourUpdate();
                if (this.layer2D) {
                    this._updateLayer2DPosition();
                }
            },
            changePosition: function(newPos) {
                this.objectAvatar.position.set(newPos.x, newPos.y, newPos.z);
            },
            changeRotation: function(newOri) {
                this.objectAvatar.rotation.set(newOri.x, newOri.y, newOri.z);
            },
            changeVelocity: function(newVelocity) {
                this.velocity = newVelocity;
            },
            changeScale: function(scale) {
                this.objectAvatar.scale.x = scale;
                this.objectAvatar.scale.y = scale;
                this.objectAvatar.scale.z = scale;
            },
            behaviourUpdate: function() {
                // move object
                this.objectAvatar.translateOnAxis(this.direction, this.velocity);

                // next frame behaviour test
                var positionAtomNextFrame = this.objectAvatar.position.clone();
                var v1 = new THREE.Vector3();
                v1.copy(this.direction).applyQuaternion(this.objectAvatar.quaternion);
                positionAtomNextFrame.add(v1.multiplyScalar(this.velocity));
                if (positionAtomNextFrame.x < AtomManager.worldLimites.min.x || positionAtomNextFrame.y < AtomManager.worldLimites.min.y || positionAtomNextFrame.z < AtomManager.worldLimites.min.z) {
                    this.direction.negate();
                }
                if (positionAtomNextFrame.x > AtomManager.worldLimites.max.x || positionAtomNextFrame.y > AtomManager.worldLimites.max.y || positionAtomNextFrame.z > AtomManager.worldLimites.max.z) {
                    this.direction.negate();
                }
                // end of next frame behaviour test
            },
            createAvatar: function() {
                var map = THREE.ImageUtils.loadTexture("../img/circle.png");
                var material = new THREE.SpriteMaterial({
                    map: map,
                    color: Math.random() * 0x808008 + 0x808080,
                });
                this.objectAvatar = new THREE.Sprite(material);
                SceneManager.add(AtomManager.containerAtomsName, this.objectAvatar);
            },
            setRandomPosition: function() {
                var axis = ['x', 'y', 'z'];
                var newPos = new THREE.Vector3();
                for (var i = 0; i < axis.length; i++) {
                    newPos[axis[i]] = Math.random() * (AtomManager.worldLimites.max[axis[i]] - AtomManager.worldLimites.min[axis[i]] + 1) + AtomManager.worldLimites.min[axis[i]];
                }
                this.objectAvatar.position.copy(newPos);
            },
            setRandomScale: function() {
                var min = 0.1;
                var max = 1;
                var scale = Math.random() * (max - min + 1) + min;
                this.changeScale(scale);
            },
            setRandomDirection: function() {
                var axis = ['x', 'y', 'z'];
                var newDir = new THREE.Vector3();
                for (var i = 0; i < axis.length; i++) {
                    newDir[axis[i]] = Math.random();
                }
                this.direction.copy(newDir);
            },
            setTweetData: function(data) {
                this.tweetData = data;
                this.treatTweetData();
            },
            treatTweetData: function() {
                //Atom Scale = Retweet
                var scale = this.tweetData.retweet_count;
                if (scale === 0) {
                    scale = 0.3;
                }
                this.changeScale(scale);

                //Atom Velocity = Favorite
                var velocity = this.tweetData.favorite_count;
                this.changeVelocity(velocity);
            },
            createLayer2D: function() {
                this.layer2D = document.createElement('div');
                this.layer2D.id = 'tweet';
                document.body.appendChild(this.layer2D);
                this.layer2D.innerHTML = this.tweetData.text;
            },
            _updateLayer2DPosition: function() {
                var position = Utilities.get2DPositionOf3DObject(this.objectAvatar);
                var boundingRect = this.layer2D.getBoundingClientRect()
                this.layer2D.style.left = (position.x - boundingRect.width / 2) + 'px';
                this.layer2D.style.top = (position.y - boundingRect.height / 2 - 70) + 'px';
            },
            removeLayer2D: function() {
                this.layer2D.parentNode.removeChild(this.layer2D);
                this.layer2D = null;
            },
            addMouseInteraction: function() {
                Utilities.createEventOn3DObject(this.objectAvatar, 'mouseover', function(req) {
                    var atom = AtomManager.getAtomBy3DObject(req.target);
                    var scale = 3;//atom.objectAvatar.scale.x * 3;
                    atom.changeScale(scale)
                    atom.createLayer2D();
                });
                Utilities.createEventOn3DObject(this.objectAvatar, 'mouseout', function(req) {
                    var atom = AtomManager.getAtomBy3DObject(req.target);
                    atom.treatTweetData();
                    atom.removeLayer2D();
                });
                Utilities.createEventOn3DObject(this.objectAvatar, 'click', function(req) {
                    var atom = AtomManager.getAtomBy3DObject(req.target);
                    console.log(atom.tweetData);
                });
            }
        }
        return Atom;
    }
);
