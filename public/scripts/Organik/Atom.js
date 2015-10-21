define("Organik/Atom", ["three", "Organik/AtomManager", "Organik/Utilities", "Organik/SceneManager", "Organik/AtomUI", "Organik/Animation"],
    function(THREE, AtomManager, Utilities, SceneManager, AtomUI, Animation) {
        // start method
        function Atom(tweet) {
            this.tweetData = tweet;
            this._initialize();
        }
        // public method
        Atom.prototype = {
            _initialize: function() {
                // define variable
                this.objectAvatar = null;
                this.direction = new THREE.Vector3(1, 0, 0);
                this.velocity = Math.random() / 2;
                this.highlighted = false;
                this.objectAvatarHighlight = null;
                
                this.atomUI = new AtomUI();
                this.createAvatar();
                this.treatTweetData();
                AtomManager.addAtom(this);
            },
            renderTick: function() {
                this.behaviourUpdate();
                if (this.atomUI.UIActive()) {
                    this._updateLayer2DPosition();
                }
                if(this.objectAvatarHighlight){
                    this.renderUpdateHighlightAvatar();
                }
            },
            /*
            * Set Position/Scale/Direction/Velocity 
            */
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
            /*
            * Behaviour Part
            */
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
            /*
            * Avatar Part
            */
            createAvatar: function() {
                var map = THREE.ImageUtils.loadTexture("../img/atom.png");
                var material = new THREE.SpriteMaterial({
                    map: map,
                    color: Math.random() * 0x808008 + 0x808080,
                });
                this.objectAvatar = new THREE.Sprite(material);
                SceneManager.add(AtomManager.containerAtomsName, this.objectAvatar);
            },
            /*
            * Random Position/Scale/Direction 
            */
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
            /*
            * Twitter Part 
            */
            _computeTweetScale: function() {
                var scale = this.tweetData.retweet_count;
                if (scale === 0) {
                    //scale = 0.3;
                    scale = 100;
                }
                return scale/100;
            },
            setTweetData: function(data) {
                this.tweetData = data;
                this.treatTweetData();
            },
            treatTweetData: function() {

                this.changeScale(this._computeTweetScale());
                //Atom Velocity = Favorite
                var velocity = this.tweetData.favorite_count / 10;
                this.changeVelocity(velocity);
            },
            /*
            * AtomUI 
            */
            createLayer2D: function() {
                var dataUI = {
                    userName : '',
                    img : this.tweetData.user.profile_image_url,
                    text : this.tweetData.text
                }  
                this.atomUI.createUI(dataUI);
            },
            _updateLayer2DPosition: function() {
                var position = Utilities.get2DPositionOf3DObject(this.objectAvatar);
                this.atomUI.setPosition(position);
            },
            removeLayer2D: function() {
                    this.atomUI.deleteUI();
            },
            /*
            * Highlight 
            */
            highlightEnter: function(){
                //scale up atom
                var newScale = this._computeTweetScale() * 1.5;
                var start = this.objectAvatar.scale;
                var end = {x : newScale, y : newScale, z : newScale}
                Animation.createAnimation(start, end, 500, 'Elastic.Out');
                
                this.createLayer2D();
                this.createHighlightAvatar();
                
                this.highlighted = true;
            },
            highlightExit: function(){
                //scale atom this original size
                var newScale = this._computeTweetScale();
                var start = this.objectAvatar.scale;
                var end = {x : newScale, y : newScale, z : newScale}
                Animation.createAnimation(start, end, 500, 'Elastic.Out');
                
                this.removeLayer2D();
                this.deleteHighlightAvatar();
                
                this.highlighted = false;
            },
            isHighlighted: function(){
                return this.highlighted;
            },
            createHighlightAvatar: function(){
                var AvatarScale = 1.5;
                var map = THREE.ImageUtils.loadTexture("../img/highlight.png");
                var material = new THREE.SpriteMaterial({
                    map: map,
                    // color: Math.random() * 0x808008 + 0x808080,
                    color: this.objectAvatar.material.color,
                });
                this.objectAvatarHighlight = new THREE.Sprite(material);
                this.objectAvatar.add(this.objectAvatarHighlight);
                this.objectAvatarHighlight.scale.set(AvatarScale,AvatarScale,AvatarScale);
            },
            deleteHighlightAvatar: function(){
                this.objectAvatar.remove(this.objectAvatarHighlight);
                this.objectAvatarHighlight = null;
            },
            renderUpdateHighlightAvatar: function(){
                this.objectAvatarHighlight.material.rotation -=.02;
            },
            /*
            * Interactions
            */
            addMouseInteraction: function() {
                Utilities.createEventOn3DObject(this.objectAvatar, 'mouseover', function(req) {
                    var atom = AtomManager.getAtomBy3DObject(req.target);
                    atom.highlightEnter();
                });
                Utilities.createEventOn3DObject(this.objectAvatar, 'mouseout', function(req) {
                    var atom = AtomManager.getAtomBy3DObject(req.target);
                    atom.highlightExit();
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
