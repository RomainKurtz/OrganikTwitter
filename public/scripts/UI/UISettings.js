define("UI/UISettings", ['handlebars', 'text!UI/templates/settings.hbs', 'Organik/AtomManager'],
    function(Handlebars, PlainTextTemplate, AtomManager) {
        // start method
        function UISettings(galaxyName) {
            this.galaxyName = galaxyName;
            this._initialize();
        }
        // public method
        UISettings.prototype = {
            _initialize: function() {
                this.createUI();
            },
            createUI: function() {
                var template = Handlebars.compile(PlainTextTemplate);
                var context = {
                    galaxyName: this.galaxyName
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
