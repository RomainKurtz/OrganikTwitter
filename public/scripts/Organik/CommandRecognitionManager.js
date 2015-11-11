define("Organik/CommandRecognitionManager", ["Organik/ServerMessageManager"],
    function(ServerMessageManager) {
        var instance = null;

        function CommandRecognitionManager() {
            if (instance !== null) {
                throw new Error("Cannot instantiate more than one CommandRecognitionManager, use CommandRecognitionManager.getInstance()");
            }
            this._initialize();
        }
        CommandRecognitionManager.prototype = {
            _initialize: function() {
                // summary:
                // Initializes the singleton.
                this.CommandEnum = {
                    "SEARCH": 1,
                    "STREAM": 2,
                    "STREAMSEARCH": 3
                };
                this.commandArray = [{
                    commandText: '/stream',
                    Commandvalue: this.CommandEnum.STREAM
                }, {
                    commandText: '/s',
                    Commandvalue: this.CommandEnum.STREAM
                }, {
                    commandText: '/search',
                    Commandvalue: this.CommandEnum.SEARCH
                }]
            },
            treatCommands: function(text) {
                // chunck the text with the space 
                // in eatch chunk find '/' for the first character
                // if true it's an argument if not it's text to send
                var arrayOfCommandTreated = [];
                var textIndex = -2;
                var arrayOfString = text.split(' ');
                for (var i = 0; i < arrayOfString.length; i++) {
                    if (arrayOfString[i][0] !== '/') {
                        // it's text 
                        if (i === textIndex + 1) { // it's a multi word text
                            arrayOfCommandTreated[arrayOfCommandTreated.length - 1].text += ' ' + arrayOfString[i];
                        } else {
                            arrayOfCommandTreated.push({
                                text: arrayOfString[i],
                                arguments: [],
                                error: ''
                            });
                        }
                        textIndex = i;
                    } else {
                        var findCommand = false;
                        for (var u = 0; u < this.commandArray.length; u++) {
                            if (arrayOfString[i].indexOf(this.commandArray[u].commandText) !== -1) {
                                if (arrayOfCommandTreated.length === 0) {
                                    this._errorMessage();
                                    // arrayOfCommandTreated[i].error = true;
                                    break;
                                }
                                arrayOfCommandTreated[arrayOfCommandTreated.length - 1].arguments.push(this.commandArray[u]);
                                findCommand = true;
                            } else {
                                if (!findCommand && (u === this.commandArray.length - 1)) {
                                    if (arrayOfCommandTreated.length === 0) {
                                        this._errorMessage('Error syntax text don\'t find');
                                    } else {
                                        arrayOfCommandTreated[arrayOfCommandTreated.length - 1].error += 'Error syntax argument unknown : ' + arrayOfString[i];
                                    }
                                }
                            }
                        }
                    }
                }

                for (var i = 0; i < arrayOfCommandTreated.length; i++) {
                    if (arrayOfCommandTreated[i].text === '' || arrayOfCommandTreated[i].error) {
                        this._errorMessage(arrayOfCommandTreated[i].error);
                        arrayOfCommandTreated.splice(i, 1);
                        i--;
                    }
                }
                console.log(arrayOfCommandTreated);
                this._buildCommandWithArrayCommands(arrayOfCommandTreated);

                // ServerMessageManager.getTweetbyHachtag(text);
                //ServerMessageManager.getTweetbyStreaming(text);
            },
            _buildCommandWithArrayCommands: function(arrayCommand) {
                for (var i = 0; i < arrayCommand.length; i++) {
                    //create command
                    var commandParam = {
                            getType: '',
                            getWord: ''
                        }
                        //add the text of the command
                    commandParam.getWord = arrayCommand[i].text;

                    //add arguments of the command
                    for (var u = 0; u < arrayCommand[i].arguments.length; u++) {
                        if (arrayCommand[i].arguments[u].Commandvalue === this.CommandEnum.SEARCH) {
                            commandParam.getType = 'getTweetbyHachtag';
                        } else if (arrayCommand[i].arguments[u].Commandvalue === this.CommandEnum.STREAM) {
                            commandParam.getType = 'getTweetbyStreaming';
                        } else if (arrayCommand[i].arguments[u].Commandvalue === this.CommandEnum.STREAMSEARCH) {
                            commandParam.getType = 'getTweetbyHachtagAndStreaming';
                        }
                    }
                    //if they miss add default argument
                    if (!commandParam.getType) { //search and stream by default
                        commandParam.getType = 'getTweetbyHachtagAndStreaming';
                    }
                    this._successMessage();
                    ServerMessageManager.getTweet(commandParam);
                }
            },
            _errorMessage: function(error) {
                if (!error) {
                    Materialize.toast('Error syntax in command parameters', 4000);
                } else {
                    Materialize.toast(error, 4000);
                }
            },
            _successMessage: function(success) {
                if (!success) {
                    Materialize.toast('Galaxy in comming ...', 4000);
                } else {
                    Materialize.toast(error, 4000);
                }
            }

        };

        CommandRecognitionManager.getInstance = function() {
            // summary:
            // Gets an instance of the singleton. It is better to use 
            if (instance === null) {
                instance = new CommandRecognitionManager();
            }
            return instance;
        };


        return CommandRecognitionManager.getInstance();
    });
