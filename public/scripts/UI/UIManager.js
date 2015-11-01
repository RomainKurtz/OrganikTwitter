define("UI/UIManager", ["UI/UIFooter", "UI/UIGroup"],
    function( UIFooter, UIGroup) {
        var instance = null;

        function UIManager() {
            if (instance !== null) {
                throw new Error("Cannot instantiate more than one UIManager, use UIManager.getInstance()");
            }
            this._initialize();
        }
        UIManager.prototype = {
            _initialize: function() {
                // summary:
                // Initializes the singleton. 
                this.uIGroupTab = [];
                this.createUI();

            },
            createUI: function() {
                var uIFooter = new UIFooter();
            },
            addGroup: function(groupName){
                var uIGroup = this.getUIGroupByGroupName(groupName); 
                if(!uIGroup){
                    // Group don't exist, we create it
                    uIGroup = new UIGroup(groupName, this);
                    this.uIGroupTab.push(uIGroup);
                }else{
                    // Group alrealy exist
                    uIGroup.updateUI();
                }
            },
            removeGroupByName: function(groupName){
                var group = this.getUIGroupByGroupName(groupName);
                if(group){
                    this.uIGroupTab.splice(this.uIGroupTab.indexOf(group),1);
                    group.delete();               
                }
            },
            _buildUIBehaviour: function() {
                
            },
            getUIGroupByGroupName: function(groupName){
                for( var i = 0 ; i< this.uIGroupTab.length ; i++){
                    if(this.uIGroupTab[i].groupName === groupName)
                    {
                        return this.uIGroupTab[i]; 
                    }
                }
                return null;
            }
        };
        UIManager.getInstance = function() {
            // summary:
            // Gets an instance of the singleton. It is better to use 
            if (instance === null) {
                instance = new UIManager();
            }
            return instance;
        };

        return UIManager.getInstance();
    }
);
