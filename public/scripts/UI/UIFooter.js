define("UI/UIFooter", ['hbs!UI/templates/footer', "Organik/ServerMessageManager", "UI/UISettings", "Organik/CommandRecognitionManager"],
    function(template, ServerMessageManager, UISettings, CommandRecognitionManager) {
        // start method
        function UIFooter() {
            this._initialize();
        }
        // public method
        UIFooter.prototype = {
            _initialize: function() {
                this.createUI();
            },
            createUI: function() {
                var context = {
                    searchbarPlaceholder: 'What galaxy are you looking for ? (#hashtag and @user works well)    (/stream : to steam only)'
                };
                $('body').append(template(context));
                var uISettings = new UISettings();
                this._buildUIBehaviour();
            },
            _buildUIBehaviour: function() {

                ////Search button and bar////
                $('a#toggle-search').click(function() {
                    var search = $('div#search');
                    if (search.is(":visible")) {
                        //close bar
                        this.launchCommand();
                        search.slideUp(function() {
                            search.find('input').val('');
                        });
                    } else {
                        //open bar :)
                        search.find('input').val('');
                        search.slideDown(function() {
                            search.find('input').focus();
                        });
                    }
                    return false;
                }.bind(this));

                ////Search bar////
                var formSearch = document.getElementById("searchFrom");

                formSearch.onsubmit = function() {
                    this.launchCommand();
                    return false;
                }.bind(this);

                ////Press Enter////
                $(document).keypress(function(e) {
                    if (e.which == 13) {
                        var search = $('div#search');
                        if (!search.is(":visible")) {
                            search.find('input').val('');
                            search.slideDown(function() {
                                search.find('input').focus();
                            });
                        };
                    }
                });
            },
            launchCommand: function() {
                var divSearch = document.getElementById("search");
                var inputSearch = document.getElementById("input_Search");

                if (inputSearch.value) {
                    CommandRecognitionManager.treatCommands(inputSearch.value);
                }
                var search = $('div#search');
                search.slideUp(function() {
                    search.find('input').val('');
                });
            },
            addWordIntoSearchBar: function(word) {
                var search = $('div#search');
                var searchBarInput = search.find('input');

                //if search bar is not empty and space before word
                if (searchBarInput.val() === '') {
                    searchBarInput.val(word);
                } else {
                    searchBarInput.val(searchBarInput.val() + ' ' + word);
                }
                // make the bar appear
                search.slideDown(function() {
                    search.find('input').focus();
                });
            }
        }
        return UIFooter;
    })
