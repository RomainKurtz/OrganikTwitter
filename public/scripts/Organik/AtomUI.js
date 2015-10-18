define("Organik/AtomUI", ["Organik/Animation"],
    function(Animation) {
        // start method
        function AtomUI() {
            this._initialize();
        }
        // public method
        AtomUI.prototype = {
            _initialize: function() {
				this.domElement = null;
				this.divImgUrl = null;
				this.divUserName = null;
				this.divText = null;
				
				this.divIsCreate = false
				this.divIsActive = false;
			},
			createUI: function(param){
				if(this.UICreated()){
					this.deleteUI();
				}
				if(!this.UICreated()){
					this.divImgUrl = param.img;
					this.divUserName = param.userName;
					this.divText = param.text;
					this.domElement = document.createElement('div')
					document.body.appendChild(this.domElement);
					this.domElement.innerHTML = '<img src=\"'+ this. divImgUrl +'\"/> '+ this.divText;
					this.domElement.className = 'message';
					
					this.divIsCreate = true; 
					this.divIsActive = true;
				}
				
			},
			deleteUI: function(){
				if(this.divIsCreate){
					Animation.setTimeout(function () {
						if(this.domElement){
							this.domElement.parentNode.removeChild(this.domElement);
							this.domElement = null;
							this.divIsCreate = false;
							this.divIsActive = false;
							}
						}.bind(this),300);
					this.domElement.style.animationName = "fadeOut";
					this.domElement.style.opacity ='0';
					
				}
			},
			showUI: function(){
				if(this.UICreated() && !this.UIActive()){
					// TODO Display div
					this.divIsActive = true;
				}
			},
			hideUI: function(){
				if(this.UICreated() && this.UIActive()){
					//TODO Hide div
					this.divIsActive = false;
				}
			},
			setPosition: function(position){
				var boundingRect = this.domElement.getBoundingClientRect();
                var left = (position.x - boundingRect.width / 2) ;
                var top = (position.y - boundingRect.height / 2 - 50) ;
				this.domElement.style.left = left + 'px';
				this.domElement.style.top = top + 'px';
			},
			UIActive: function(){
				return this.divIsActive;
			},
			UICreated: function(){
				return this.divIsCreate;
			}
			
		}
	return AtomUI;
    }
);
