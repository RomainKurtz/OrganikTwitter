define("UI/UISettings", ['hbs!UI/templates/settings', 'Organik/AtomManager'],
    function(template, AtomManager) {
        // start method
        function UISettings(groupName) {
            this.groupName = groupName;
            this._initialize();
        }
        // public method
        UISettings.prototype = {
            _initialize: function() {
                this.createUI();
            },
            createUI: function() {
                var context = {
                    groupName: this.groupName
                };    
                    $('body').append(template(context));

                    this._buildUIBehaviour();
            },
            _buildUIBehaviour: function() {

                $('.modal-trigger').leanModal();

                // ////Modal////
                var formScale = document.getElementById("AtomScale");
                var inputScale = document.getElementById("input_scaleAtom");
                
                formScale.onsubmit = function() {
                    AtomManager.changeScaleCoeff(inputScale.value);
                    return false;
                }.bind(this);

            }
        }
        return UISettings;
    })
