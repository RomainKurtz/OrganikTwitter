define("UI/UIFooter", ['handlebars', 'text!UI/templates/footer.hbs', "Organik/ServerMessageManager", "UI/UISettings"],
    function(Handlebars, PlainTextTemplate, ServerMessageManager, UISettings) {
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
                var template = Handlebars.compile(PlainTextTemplate);
                var context = {
                    searchbarPlaceholder: 'What galaxy are you looking for ? (#hachtag and @user works well)'
                };
                $('body').append(template(context));
                var uISettings = new UISettings();
                this._buildUIBehaviour();
            },
            _buildUIBehaviour: function() {

                ////Search button////
                $('a#toggle-search').click(function() {
                    var search = $('div#search');
                    if (search.is(":visible")) {
                        search.slideUp();
                    } else {
                        search.find('input').val('');
                        search.slideDown(function() {
                            search.find('input').focus();
                        });
                    }
                    return false;
                });

                ////Search bar////
                var formSearch = document.getElementById("searchFrom");
                var divSearch = document.getElementById("search");
                var inputSearch = document.getElementById("input_Search");

                formSearch.onsubmit = function() {
                    if (inputSearch.value) {
                        ServerMessageManager.getTweetbyHachtag(inputSearch.value);
                    }
                    var search = $('div#search');
                    search.slideUp();
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

            }
        }
        return UIFooter;
    })
