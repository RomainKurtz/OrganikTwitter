define("UI/UIGalaxy", ['handlebars', 'text!UI/templates/galaxy.hbs'],
    function(Handlebars, PlainTextTemplate) {
        // start method
        function UIGalaxy(galaxyName) {
            this.galaxyName = galaxyName;
            this._initialize();
        }
        // public method
        UIGalaxy.prototype = {
            _initialize: function() {
                this.createUI();
            },
            createUI: function() {
                var template = Handlebars.compile(PlainTextTemplate);
                var context = {
                    galaxyName: this.galaxyName
                };
                $('#galaxy-buttons').append(template(context));
                this._buildUIBehaviour();

            },
            _buildUIBehaviour: function() {
                $('#button-'+this.galaxyName).click(function() {
                    var modal = $('#modal-'+this.galaxyName);
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
            }
        }
        return UIGalaxy;
    })
