define("UI/UIManager", ["Organik/AtomManager", "Organik/ServerMessageManager"],
    function(AtomManager, ServerMessageManager) {
        var instance = null;

        function UIManager() {
            if (instance !== null) {
                throw new Error("Cannot instantiate more than one UIManager, use UIManager.getInstance()");
            }
            this._initialize();
        }
        UIManager.prototype = {
            _initialize: function() {
                // summary:
                // Initializes the singleton. 
                this.createUI();
                this.onDomReady();

            },
            createUI: function() {

                // import footer
                var getImport = document.querySelector('#template-footer');
                var getContent = getImport.import.querySelector('#footer');
                document.body.appendChild(document.importNode(getContent, true));

                // import modal settings
                getImport = document.querySelector('#template-modalsettings');
                getContent = getImport.import.querySelector('#modalSettings');
                document.body.appendChild(document.importNode(getContent, true));

            },
            onDomReady: function() {
                window.onload = function() {

                    ////Modal////
                    var formScale = document.getElementById("AtomScale");
                    var inputScale = document.getElementById("input_scaleAtom");
                    formScale.onsubmit = function() {
                        AtomManager.changeScaleCoeff(inputScale.value);
                        return false;
                    }.bind(this);

                    ////Search////
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

                    this._buildUIBehaviour();

                }.bind(this);
            },
            _buildUIBehaviour: function() {

                //Press Enter
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

                $('.modal-trigger').leanModal();

                //Search button
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
            }
        };
        UIManager.getInstance = function() {
            // summary:
            // Gets an instance of the singleton. It is better to use 
            if (instance === null) {
                instance = new UIManager();
            }
            return instance;
        };

        return UIManager.getInstance();
    }
);
