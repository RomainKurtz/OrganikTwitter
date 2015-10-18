define("Organik/AtomUI", [],
    function() {
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
				this.divIsActive = false;
			},
			createUI: function(param){
				this.divImgUrl = param.img;
				this.divUserName = param.userName;
				this.divText = param.text;
				this.domElement = document.createElement('div')
                document.body.appendChild(this.domElement);
				this.domElement.innerHTML = '<img src=\"'+ this. divImgUrl +'\"/> '+ this.divText;
				this.domElement.className = 'message';
				 
				this.divIsActive = true;
				
			},
			deleteUI: function(){
				setTimeout(function () {
                        this.domElement.parentNode.removeChild(this.domElement);
                        this.domElement = null;
                    }.bind(this),300);
                    this.domElement.style.animationName = "fadeOut";
                    this.domElement.style.opacity ='0';
				this.divIsActive = false;
			},
			showUI: function(){
				
			},
			hideUI: function(){
				
			},
			setPosition: function(position){
				var boundingRect = this.domElement.getBoundingClientRect();
                var left = (position.x - boundingRect.width / 2) ;
                var top = (position.y - boundingRect.height / 2 - 50) ;
				this.domElement.style.left = left + 'px';
				this.domElement.style.top = top + 'px';
			},
			UIisActive: function(){
				return this.divIsActive;
			}
			
		}
	return AtomUI;
    }
);
