define("Organik/AtomManager", ["three", "Organik/RenderManager", "Organik/SceneManager", "Organik/LinkManager"],
    function(THREE, RenderManager, SceneManager, LinkManager) {
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
                this.atomDownScaleCoeff = 1;
                RenderManager.addOneCallbackToRenderer(this.renderAtomsManager, this);
            },
            addAtom: function(atom) {
                this.atomList.push(atom);
            },
            removeAtom: function(atom) {
                var i = this.atomList.indexOf(atom);
                this.atomList[i].remove();
                this.atomList.splice(i,1);
            },
            renderAtomsManager: function(iMe) {
                //SceneManager.getSceneContainer(iMe.containerAtomsName).rotation.y +=0.001;
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
            changeScaleCoeff: function(coeff) {
                this.atomDownScaleCoeff = coeff;
                for (var i = 0; i < this.atomList.length; i++) {
                    this.atomList[i].changeScale(this.atomList[i]._computeTweetScale(), true);
                }
            },
            getAtomBy3DObject: function(object3D) {
                for (var i = 0; i < this.atomList.length; i++) {
                    if (this.atomList[i].objectAvatar.id === object3D.id) {
                        return this.atomList[i];
                    }
                }
                return null;
            },
            getAtombyTweetID: function(ID) {
                for (var i = 0; i < this.atomList.length; i++) {
                    if (this.atomList[i].tweetData.id === ID) {
                        return this.atomList[i];
                    }
                }
                return null;
            },
            ////GroupFunction////
            getGroupLengthbyGroupName: function(groupName){
                return this.getAtomsbyGroupName(groupName).length;
            },
            getAtomsbyGroupName: function(groupName) {
                var groupAtom = [];
                for (var i = 0; i < this.atomList.length; i++) {
                    if (this.atomList[i].getGroupName() === groupName) {
                        groupAtom.push(this.atomList[i]);
                    }
                }
                return groupAtom;
            },
            setGroupAttributeToAtom: function(groupName, atom){
                var group = this.getAtomsbyGroupName(groupName);
                var olderAtom = group[0];
                atom.setGroupProperty('groupColor', olderAtom.getGroupColor());
                atom.setGroupProperty('groupVisibility', olderAtom.getGroupVisibility());
                atom.setGroupProperty('groupMaxLimit', olderAtom.getGroupMaxLimit());
                
                if(group.length > olderAtom.getGroupMaxLimit()){
                    this.removeAtom(olderAtom);
                }
            },
            setGroupVisibility: function(groupName, visible){
                var group = this.getAtomsbyGroupName(groupName);
                for(var i = 0; i < group.length; i++) {
                    group[i].setGroupProperty('groupVisibility', visible);
                }
            },
            setGroupColor: function(groupName, color){
                var group = this.getAtomsbyGroupName(groupName);
                for(var i = 0; i < group.length; i++) {
                    group[i].setGroupProperty('groupColor', color);
                }
            },
            setGroupMaxLimit: function(groupName, numberMax){
                var group = this.getAtomsbyGroupName(groupName);
                for(var i = 0; i < group.length; i++) {
                    group[i].setGroupProperty('groupMaxLimit', numberMax);
                }
                //delete the olders atoms if the group is full
                for(var i = 0; this.getAtomsbyGroupName(groupName).length > numberMax ; i++){
                    this.removeAtom(group[i]);
                }
            },
            getGroupParameterByName: function(groupName, parameter){
                var group = this.getAtomsbyGroupName(groupName);
                var olderAtom = group[0];
                if(parameter === 'maxLimit'){
                    return olderAtom.getGroupMaxLimit();
                }
                if(parameter === 'color'){
                    return olderAtom.getGroupColor();
                }
                if(parameter === 'visibility'){
                    return olderAtom.getGroupVisibility();
                }
                
            },
            changeGroupParameter: function(group,parameter,value){
                for(var i = 0; i < group.length; i++) {
                    group[i].objectAvatar[parameter] = value;
                }
            },
            deleteGroupByName: function(groupName){
                for (var i = 0; i < this.atomList.length; i++) {
                    if (this.atomList[i].getGroupName() === groupName) {
                        this.removeAtom(this.atomList[i]);
                        i--
                    }
                }
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
