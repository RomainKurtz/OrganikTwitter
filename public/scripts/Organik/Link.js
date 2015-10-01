define("organik/link", ["three","organik/linkManager", "organik/sceneManager"],
    function(THREE, LinkManager, SceneManager) {
        // start method
        function Link() {
            this._initialize();
        }
        // public method
        Link.prototype = {
            _initialize : function(){
                // define variable
                this.objectAvatar = null;
                this.createAvatar();
                this.velocity = Math.random()/5;
                
                LinkManager.addLink(this);
            },
            renderTick : function(){
               this.behaviourUpdate();
            },
            changePosition : function(newPos){
                this.objectAvatar.position.set(newPos.x,newPos.y,newPos.z);
            },
            changeRotation : function(newOri){
                this.objectAvatar.rotation.set(newOri.x,newOri.y,newOri.z);
            },
            changeVelocity : function(newVelocity){
                this.velocity = newVelocity;
            },
            behaviourUpdate : function(){

                // goings and comings
                if(this.direction){
                    this.objectAvatar.position.z +=this.velocity;
                }
                else{
                    this.objectAvatar.position.z -=this.velocity;
                }
                if ( this.objectAvatar.position.z < LinkManager.worldLimites.min.z){
                    this.direction = true;
                }
                if ( this.objectAvatar.position.z > LinkManager.worldLimites.max.z){
                    this.direction = false;
                }
            },
            createAvatar : function(){
                var color = '#'+Math.floor(Math.random()*16777215).toString(16);
                // color = 0x00ff00;
                var geometry = new THREE.Geometry();
                geometry.vertices.push(
                    new THREE.Vector3( -1000, 0, 0 ),
                    new THREE.Vector3( 0, 10, 0 )
                );
                var material = new THREE.LineDashedMaterial( {/*wireframe:true,*/ color: color } );
                this.objectAvatar = new THREE.Line( geometry, material );
                SceneManager.add( LinkManager.containerLinksName , this.objectAvatar );
                console.log(this.objectAvatar);
            },
            setRandomPosition :function(){
                var axis = ['x','y','z'];
                var newPos = new THREE.Vector3();
                for(var i = 0 ; i< axis.length ; i++){
                    newPos[axis[i]] = Math.random()*(LinkManager.worldLimites.max[axis[i]]-LinkManager.worldLimites.min[axis[i]]+1)+LinkManager.worldLimites.min[axis[i]];
                }
                this.objectAvatar.position.copy(newPos) ;
            }
        }
        return Link;
   })
