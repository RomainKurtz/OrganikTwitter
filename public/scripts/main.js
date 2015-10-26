/* global requirejs */
requirejs(["three", "Organik/Atom", "Organik/CameraManager", "socketio", "UI/UIManager" , "Organik/ServerMessageManager"],
    function(THREE, Atom, CameraManager, io, UIManager, ServerMessageManager) {
        
        CameraManager.changeCameraPosition(new THREE.Vector3(-125, 5, 2.5));

        ServerMessageManager.eventSubscriber('tweetArrived',function(data){
            if (data.tweetsData instanceof Array) {
                for (var i = 0; i < data.tweetsData.length; i++) {
                    createAtom(data.tweetsData[i],data.getParam.getWord);
                }
                Materialize.toast(data.tweetsData.length + ' planets added', 4000);
                UIManager.addGalaxy(data.getParam.getWord);
            } else {
                createAtom(data.tweetsData);
            }
        });
        //ServerMessageManager.eventSender('getTweet');
        //ServerMessageManager.getTweetbyHachtag('dassault systemes');
        // ServerMessageManager.getTweetbyHachtag('3dsmax');
        ServerMessageManager.getTweetbyHachtag('micheletaugustin');

      
        function createAtom(data, galaxyName) {
            var atom = new Atom(data);
            atom.setGroup(galaxyName);
            atom.setRandomPosition();
            atom.setRandomDirection();
            atom.addMouseInteraction();
            //atom.setRandomScale();
            //atom.setTweetData(data);
            //atom.createLayer2D();
            
        }
    }
);
