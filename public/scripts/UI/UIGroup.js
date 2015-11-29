define("UI/UIGroup", ['hbs!UI/templates/group', 'Organik/Utilities', 'Organik/AtomManager', 'colorPicker', "Organik/ServerMessageManager", "Organik/Animation"],
    function(template, Utilities, AtomManager, colorPicker, ServerMessageManager, Animation) {
        // start method
        function UIGroup(groupName, UIManager) {
            this.groupName = groupName;
            this.UIManager = UIManager;
            this.id = null;
            this.buttonAnimating = false;
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
                    groupName: this.groupName,
                    id: this.id,
                    numberOfPlanets: AtomManager.getGroupLengthbyGroupName(this.groupName)
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

                //Set the activity icon invisible 
                $('#button-' + this.id).children('.right').css({
                    opacity: 0
                });

                ////Modal////
                //Ratio : Hide/show//
                var switchDisplay = $('#displaySwitch-' + this.id);
                switchDisplay.change(function() {
                    AtomManager.setGroupVisibility(this.groupName, switchDisplay.is(':checked'));
                }.bind(this));


                ////Color/////
                //Color Ratio//
                var switchcolorpicker = $('#colorPickerSwitch-' + this.id);
                var colorHasBeenChoosen = false;

                switchcolorpicker.change(function() {
                    var colorpickerDiv = $('#divColorPicker-' + this.id);
                    if (switchcolorpicker.is(':checked')) {
                        colorpickerDiv.animate({
                            height: colorpickerDiv.get(0).scrollHeight
                        }, 300);
                    } else {
                        colorpickerDiv.animate({
                            height: '0px'
                        }, 300);
                        if (colorHasBeenChoosen) {
                            AtomManager.setGroupColor(this.groupName);
                            this.colorIcon('white');
                            colorHasBeenChoosen = false;
                        }
                    }
                }.bind(this));

                //Color picker//
                var colorpicker = $('#colorpicker-' + this.id);
                colorpicker.simplecolorpicker();

                colorpicker.simplecolorpicker({
                    picker: true
                }).on('change', function() {
                    colorHasBeenChoosen = true;
                    AtomManager.setGroupColor(this.groupName, colorpicker.val());
                    this.colorIcon(colorpicker.val());
                }.bind(this));

                //Input Limit//
                //Input
                var inputLimit = $('#inputLimit-' + this.id);
                inputLimit.on('input', function() {
                    var groupLimit = AtomManager.getGroupParameterByName(this.groupName, 'maxLimit');
                    if (groupLimit === inputLimit.val() || (groupLimit === undefined && inputLimit.val() === '')) {
                        buttonLimit.css('opacity', '0');
                        Animation.setTimeout(function() {
                            buttonLimit.css('visibility', 'hidden');
                        }.bind(this), 300);
                        // animate opacity and display none
                    } else {
                        buttonLimit.css('visibility', 'visible');
                        buttonLimit.css('opacity', '1');

                    }
                }.bind(this));
                //Button
                var buttonLimit = $('#buttonLimit-' + this.id);
                buttonLimit.click(function() {
                    var inputValue = inputLimit.val();
                    if (inputValue === '0') { // If user enter '0' : it's like 'no limit';
                        inputLimit.val('');
                    } else if (inputValue === '') { // If user inter nothing it's interpreted by 'no limit'
                        AtomManager.setGroupMaxLimit(this.groupName, undefined);
                    } else {
                        AtomManager.setGroupMaxLimit(this.groupName, inputLimit.val());
                    }
                    buttonLimit.css('opacity', '0');
                    Animation.setTimeout(function() {
                        buttonLimit.css('visibility', 'hidden');
                    }.bind(this), 300);
                    this.updateUI();
                }.bind(this));
                //add class disabled when is not ok

                //Switch Unsubscribe//
                var liveSubscriberSwitch = $('#liveSubscriberSwitch-' + this.id);
                liveSubscriberSwitch.change(function() {
                    if (liveSubscriberSwitch.is(':checked')) {
                        ServerMessageManager.subscribeStreamingTweet(this.groupName);
                        this.UIManager.createNotification('Live acquisition enable');
                    } else {
                        ServerMessageManager.unsubscribeStreamingTweet(this.groupName);
                        this.UIManager.createNotification('Live acquisition stopped');
                    }
                }.bind(this));

                //Button Reset//
                // reset le numbre de planet
                var buttonReset = $('#buttonReset-' + this.id);
                buttonReset.click(function() {
                    if (switchcolorpicker.is(':checked')) {
                        switchcolorpicker.prop('checked', false);
                        var colorpickerDiv = $('#divColorPicker-' + this.id);
                        colorpickerDiv.animate({
                            height: '0px'
                        }, 300);
                    }
                    AtomManager.deleteGroupByName(this.groupName);
                    this.updateUI();
                }.bind(this));


                //Button Delete//
                var buttonDelete = $('#buttonDelete-' + this.id);
                buttonDelete.click(function() {
                    ServerMessageManager.unsubscribeStreamingTweet(this.groupName);
                    AtomManager.deleteGroupByName(this.groupName);
                    this.UIManager.removeGroupByName(this.groupName);
                }.bind(this));

            },
            delete: function() {
                $('#span-' + this.id).remove();
            },
            updateUI: function() {
                //bad bad - find way to update context whith Handlebars
                $('#titre-' + this.id).text(AtomManager.getGroupLengthbyGroupName(this.groupName) + ' PLANETS')
                this.animateIconActivity();
            },
            colorIcon: function(color) {
                var iconSignal = $('#button-' + this.id).children('.left');
                iconSignal.css({
                    color: color
                });
            },
            animateIconActivity: function() {
                //Button group icon activity

                if (!this.buttonAnimating) {
                    var iconSignal = $('#button-' + this.id).children('.right');

                    this.buttonAnimating = true;
                    iconSignal.animate({
                        opacity: 1
                    }, {
                        duration: 500,
                        complete: function() {
                            iconSignal.animate({
                                opacity: 0
                            }, {
                                duration: 500,
                                complete: function() {
                                    this.buttonAnimating = false;
                                }.bind(this)
                            })
                        }.bind(this)
                    });
                }
            }
        }
        return UIGroup;
    })
