define("UI/UISettings", ['hbs!UI/templates/settings', 'Organik/AtomManager'],
    function(template, AtomManager) {
        // start method
        function UISettings() {
            this._initialize();
        }
        // public method
        UISettings.prototype = {
            _initialize: function() {
                this.createUI();
            },
            createUI: function() {
                var context = {};    
                    $('#group-settings').append(template(context));

                    this._buildUIBehaviour();
            },
            _buildUIBehaviour: function() {

                ////Footer Button////
                $('#buttonSettings').click(function() {
                    var modal = $('#modalSettings');
                    if (!modal.is(":visible")) {
                        modal.openModal({
                            opacity: 0,
                            in_duration: 350,
                            ready: function() {
                                $('div.lean-overlay:last').remove();
                            },
                            complete: function() {}
                        });
                    } else {
                        modal.closeModal();
                    }
                }.bind(this));

                ////Github Button////
                 $('#buttonGithub').click(function() {
                     var win = window.open('https://github.com/RomainKurtz/OrganikTwitter', '_blank');
                 });

                // $('.modal-trigger').leanModal();

                // // ////Modal////
                // var formScale = document.getElementById("AtomScale");
                // var inputScale = document.getElementById("input_scaleAtom");
                
                // formScale.onsubmit = function() {
                //     AtomManager.changeScaleCoeff(inputScale.value);
                //     return false;
                // }.bind(this);

            }
        }
        return UISettings;
    })
