define("UI/UIGalaxy", ['handlebars', 'text!UI/templates/galaxy.hbs', 'Organik/Utilities', 'Organik/AtomManager'
],
    function(Handlebars, PlainTextTemplate,Utilities, AtomManager) {
        // start method
        function UIGalaxy(galaxyName) {
            this.galaxyName = galaxyName;
            this.id = null;
            this._initialize();
        }
        // public method
        UIGalaxy.prototype = {
            _initialize: function() {
                this.id = Utilities.createDomID();
                this.createUI();
            },
            createUI: function() {
                var template = Handlebars.compile(PlainTextTemplate);
                var context = {
                    galaxyName: this.galaxyName,
                    id: this.id
                };
                $('#galaxy-buttons').append(template(context));
                this._buildUIBehaviour();
            },
            _buildUIBehaviour: function() {
                ////Footer Button////
                $('#button-'+this.id).click(function() {
                    var modal = $('#modal-'+this.id);
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

                ////Modal////
                //Ratio : Hide/show//
                var switchDisplay = $('#displaySwitch-'+this.id);
                 switchDisplay.change(function() {
                    AtomManager.setGroupVisibility(this.galaxyName, switchDisplay.is(':checked'));
                 }.bind(this));

                 //Button Delete//
                var buttonDelete = $('#buttonDelete-'+this.id);
                 buttonDelete.click(function() {
                    AtomManager.deleteGroupByName(this.galaxyName);
                    this.deleteUI();
                 }.bind(this));       
            },
            deleteUI: function(){
                $('#span-'+this.id).remove();
            }
        }
        return UIGalaxy;
    })
