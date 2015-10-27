define("UI/UIGroup", ['hbs!UI/templates/group', 'Organik/Utilities', 'Organik/AtomManager', 'colorPicker'],
    function(template, Utilities, AtomManager, colorPicker) {
        // start method
        function UIGroup(groupeName) {
            this.groupeName = groupeName;
            this.id = null;
            this._initialize();
        }
        // public method
        UIGroup.prototype = {
            _initialize: function() {
                this.id = Utilities.createDomID();
                this.createUI();
            },
            createUI: function() {
                var context = {
                    groupName: this.groupeName,
                    id: this.id
                };
                $('#group-buttons').append(template(context));
                this._buildUIBehaviour();
            },
            _buildUIBehaviour: function() {
                ////Footer Button////
                $('#button-' + this.id).click(function() {
                    var modal = $('#modal-' + this.id);
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
                var switchDisplay = $('#displaySwitch-' + this.id);
                switchDisplay.change(function() {
                    AtomManager.setGroupVisibility(this.groupeName, switchDisplay.is(':checked'));
                }.bind(this));

                //Button Delete//
                var buttonDelete = $('#buttonDelete-' + this.id);
                buttonDelete.click(function() {
                    AtomManager.deleteGroupByName(this.groupeName);
                    this.deleteUI();
                }.bind(this));

                ////Color/////
                //Color Ratio//
                var switchcolorpicker =  $('#colorPickerSwitch-' + this.id);
                var colorHasBeenChoosen = false;

                switchcolorpicker.change(function() {
                    var colorpickerDiv = $('#divColorPicker-' + this.id);
                    if(switchcolorpicker.is(':checked')){
                        colorpickerDiv.animate({height:colorpickerDiv.get(0).scrollHeight}, 300);
                    }else{
                            colorpickerDiv.animate({height:'0px'}, 300);
                            if(colorHasBeenChoosen){
                            AtomManager.setGroupColor(this.groupeName);
                            colorHasBeenChoosen = false;
                        }
                    }
                }.bind(this));

                //Color picker//
                var colorpicker =  $('#colorpicker-' + this.id);
                colorpicker.simplecolorpicker();

                colorpicker.simplecolorpicker({
                    picker: true
                }).on('change', function() {
                    colorHasBeenChoosen = true;
                    AtomManager.setGroupColor(this.groupeName, colorpicker.val());
                }.bind(this));

            },
            deleteUI: function() {
                $('#span-' + this.id).remove();
            }
        }
        return UIGroup;
    })
