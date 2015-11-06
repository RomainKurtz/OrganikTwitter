define("UI/UIUtilities", [],
    function() {
        var instance = null;

        function UIUtilities() {
            if (instance !== null) {
                throw new Error("Cannot instantiate more than one UIUtilities, use UIUtilities.getInstance()");
            }
            this._initialize();
        }
        UIUtilities.prototype = {
            _initialize: function() {
                // summary:
                // Initializes the singleton. 
            },

            modifyIndicesFromUnicodeToUTF16: function(text, entities) {
                this.convertUnicodeIndices(text, entities, false);
            },

            modifyIndicesFromUTF16ToUnicode: function(text, entities) {
                this.convertUnicodeIndices(text, entities, true);
            },
            convertUnicodeIndices: function(text, entities, indicesInUTF16) {
                if (entities.length == 0) {
                    return;
                }

                var charIndex = 0;
                var codePointIndex = 0;
                // sort entities by start index
                entities.sort(function(a, b) {
                    return a.indices[0] - b.indices[0];
                });
                var entityIndex = 0;
                var entity = entities[0];

                while (charIndex < text.length) {
                    if (entity.indices[0] == (indicesInUTF16 ? charIndex : codePointIndex)) {
                        var len = entity.indices[1] - entity.indices[0];
                        entity.indices[0] = indicesInUTF16 ? codePointIndex : charIndex;
                        entity.indices[1] = entity.indices[0] + len;

                        entityIndex++;
                        if (entityIndex == entities.length) {
                            // no more entity
                            break;
                        }
                        entity = entities[entityIndex];
                    }

                    var c = text.charCodeAt(charIndex);
                    if (0xD800 <= c && c <= 0xDBFF && charIndex < text.length - 1) {
                        // Found high surrogate char
                        c = text.charCodeAt(charIndex + 1);
                        if (0xDC00 <= c && c <= 0xDFFF) {
                            // Found surrogate pair
                            charIndex++;
                        }
                    }
                    codePointIndex++;
                    charIndex++;
                }
            },

            //Function to move one object into an Array
            moveIntoArray: function(array, from, to) {
                if (to === from) return;

                var target = array[from];
                var increment = to < from ? -1 : 1;

                for (var k = from; k != to; k += increment) {
                    array[k] = array[k + increment];
                }
                array[to] = target;
            }
        };
        UIUtilities.getInstance = function() {
            // summary:
            // Gets an instance of the singleton. It is better to use 
            if (instance === null) {
                instance = new UIUtilities();
            }
            return instance;
        };

        return UIUtilities.getInstance();
    });
