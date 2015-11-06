define("Organik/AtomUI", ["Organik/Animation", "UI/UILinkManager", "UI/UIUtilities"],
    function(Animation, UILinkManager, UIUtilities) {
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
                this.param = null;
            },
            createUI: function(param) {
                if (this.UICreated()) {
                    this.deleteUI();
                }
                if (!this.UICreated()) {
                    this.param = JSON.parse(JSON.stringify(param)); //Make a copy of param
                    this.divImgUrl = this.param.img;
                    this.divUserName = this.param.userName;
                    this.divText = this.computeTextLinks(this.param);
                    this.domElement = document.createElement('div')
                    document.body.appendChild(this.domElement);
                    this.domElement.innerHTML = '<img src=\"' + this.divImgUrl + '\"/> ' + this.divText;
                    this.domElement.className = 'message';

                    this.divIsCreate = true;
                    this.divIsActive = true;

                    this._buildUIBehaviour();
                }

            },
            _buildUIBehaviour: function() {
                $(".message a").click(function(handler) {
                    // Route the link click to the UILinkManager to treat him
                    UILinkManager.LinkClicked(handler.target.hash)
                });
            },
            deleteUI: function() {
                if (this.divIsCreate) {
                    Animation.setTimeout(function() {
                        if (this.domElement) {
                            this.domElement.parentNode.removeChild(this.domElement);
                            this.domElement = null;
                            this.divIsCreate = false;
                            this.divIsActive = false;
                        }
                    }.bind(this), 300);
                    this.domElement.style.animationName = "fadeOut";
                    this.domElement.style.opacity = '0';

                }
            },
            showUI: function() {
                if (this.UICreated() && !this.UIActive()) {
                    // TODO Display div
                    this.divIsActive = true;
                }
            },
            hideUI: function() {
                if (this.UICreated() && this.UIActive()) {
                    //TODO Hide div
                    this.divIsActive = false;
                }
            },
            setPosition: function(position2D) {
                var boundingRect = this.domElement.getBoundingClientRect();
                var left = (position2D.x - boundingRect.width / 2);
                var top = (position2D.y - boundingRect.height / 2 - 45);
                this.domElement.style.left = left + 'px';
                this.domElement.style.top = top + 'px';
            },
            UIActive: function() {
                return this.divIsActive;
            },
            UICreated: function() {
                return this.divIsCreate;
            },
            computeTextLinks: function(param) {
            
                var innerHTML = param.text;
                var entities = [];

                // Get all the link into one object with the entities provide by Twitter

                // adapt the Unicode indices for they match with the UTF8 javascript string 
                UIUtilities.modifyIndicesFromUnicodeToUTF16(param.text, param.entities.hashtags);
                UIUtilities.modifyIndicesFromUnicodeToUTF16(param.text, param.entities.urls);
                UIUtilities.modifyIndicesFromUnicodeToUTF16(param.text, param.entities.user_mentions);

                // externalLink : exemple (https://github.com/RomainKurtz/OrganikTwitter)
                if (param.entities.urls.length > 0) {
                    for (var i = 0; i < param.entities.urls.length; i++) {
                        entities.push({
                            text: param.entities.urls[i].url,
                            indices: param.entities.urls[i].indices,
                            type: 'externalLink'
                        });
                    }
                }
                // user : exemple (@KurtzRomain)
                if (param.entities.user_mentions.length > 0) {
                    for (var u = 0; u < param.entities.user_mentions.length; u++) {
                        entities.push({
                            text: param.entities.user_mentions[u].screen_name,
                            indices: param.entities.user_mentions[u].indices,
                            type: 'user'
                        });
                    }
                }
                // hashtag : exemple (#backtothefutur)
                if (param.entities.hashtags.length > 0) {
                    for (var o = 0; o < param.entities.hashtags.length; o++) {
                        entities.push({
                            text: param.entities.hashtags[o].text,
                            indices: param.entities.hashtags[o].indices,
                            type: 'hashtag'
                        });
                    }
                }

                //Bubble sort
                var permutation = true;
                var step = 0;
                while (permutation) {
                    permutation = false;
                    step++;
                    for (var i = 0; i < entities.length - step; i++) {
                        if (entities[i].indices[0] < entities[i + 1].indices[0]) {
                            permutation = true;
                            UIUtilities.moveIntoArray(entities, i, i + 1);
                        }

                    }
                }
                for (i = 0; i < entities.length; i++) {
                    innerHTML = addLink(innerHTML, entities[i].type, entities[i].indices[0], entities[i].indices[1]);
                }

                return innerHTML;


                function addLink(textRef, linkType, index1, index2) {

                    var keyword = textRef.slice(index1, index2);

                    // Don't link something if it is out of the limit of twitter
                    // Usefull for retweet
                    if (index1 + keyword.length < 140) {
                        if (linkType==='externalLink'){
                            keyword = encodeURI(keyword);
                        }
                        var stringFirstPart = "<a href=\"#" + keyword + "?type=" + linkType + "\">";
                        var stringSecondPart = "</a>";
                        var txt2 = textRef.slice(0, index1) + stringFirstPart + keyword + stringSecondPart + textRef.slice(index2);
                        return txt2;
                    }
                    return textRef;
                }

            }

        }
        return AtomUI;
    }
);
