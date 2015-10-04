/* global requirejs */
requirejs(["three", "Organik/Atom", "Organik/CameraManager", "socketio"],
    function(THREE, Atom, CameraManager, io) {

        CameraManager.changeCameraPosition(new THREE.Vector3(-125, 5, 2.5));

        var socket = io.connect('http://localhost:5000');
        socket.on('tweetArrived', function(data) {
            if (data instanceof Array) {
                for (var i = 0; i < data.length; i++) {
                    createAtom(data[i]);
                }
            } else {
                createAtom(data);
            }
        });

        function createAtom(data) {
            var atom = new Atom(data);
            atom.setRandomPosition();
            //atom.setRandomScale();
            atom.setRandomDirection();
            //atom.setTweetData(data);
            //atom.createLayer2D();
            atom.addMouseInteraction();
        }
    }
);
