define("UI/UISettings", ['hbs!UI/templates/settings', 'Organik/AtomManager', 'Organik/Utilities'],
    function(template, AtomManager, Utilities) {
        // start method
        function UISettings() {
            this._initialize();
            this.id = null;
        }
        // public method
        UISettings.prototype = {
            _initialize: function() {
                this.id = Utilities.createDomID();
                this.createUI();
            },
            createUI: function() {
                var context = {
                    id:this.id,
                    scaleRange : {
                        min : 0.1,
                        max : 10,
                        step : 0.01, 
                        value : 1 // Default value
                    }
                };    
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
                var rangeScale = $('#rangeScale-' + this.id);
                rangeScale.on("change mousemove", function() {
                    var val = (rangeScale.val());
                    console.log(val);
                    AtomManager.changeScaleCoeff(val);
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
