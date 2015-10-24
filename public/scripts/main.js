/* global requirejs */
requirejs(["three", "Organik/Atom", "Organik/CameraManager", "socketio", "UI/UIManager" , "Organik/ServerMessageManager"],
    function(THREE, Atom, CameraManager, io, UIManager, ServerMessageManager) {
        
        CameraManager.changeCameraPosition(new THREE.Vector3(-125, 5, 2.5));
        ServerMessageManager.eventSubscriber('tweetArrived',function(data){
            if (data instanceof Array) {
                for (var i = 0; i < data.length; i++) {
                    createAtom(data[i]);
                }
                Materialize.toast(data.length + ' planets added', 4000)
            } else {
                createAtom(data);
            }
        });
        //ServerMessageManager.eventSender('getTweet');
        //ServerMessageManager.getTweetbyHachtag('dassault');

      
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
