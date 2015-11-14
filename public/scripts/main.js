/* global requirejs */
requirejs(["three", "Organik/Atom", "Organik/CameraManager", "socketio", "UI/UIManager", "Organik/ServerMessageManager"],
    function(THREE, Atom, CameraManager, io, UIManager, ServerMessageManager) {

        CameraManager.changeCameraPosition(new THREE.Vector3(-125, 5, 2.5));

        ServerMessageManager.eventSubscriber('tweetArrived', function(data) {
            if (data.tweetsData instanceof Array) {
                for (var i = 0; i < data.tweetsData.length; i++) {
                    createAtom(data.tweetsData[i], data.getParam.getWord);
                }
                UIManager.createNotification(data.tweetsData.length + ' planets added');
                UIManager.addGroup(data.getParam.getWord);
            } else {
                createAtom(data.tweetsData, data.getParam.getWord);
                UIManager.addGroup(data.getParam.getWord);
            }
        });
        //ServerMessageManager.eventSender('getTweet');
        //ServerMessageManager.getTweetbyHachtag('dassault systemes');
        ServerMessageManager.getTweetbyHachtag('3dsmax');
        //  ServerMessageManager.getTweetbyHachtag('micheletaugustin');
        // ServerMessageManager.getTweetbyHachtag('Diego Vélasquez');
        // ServerMessageManager.getTweetbyHachtag('Francisco de Goya');
        // ServerMessageManager.getTweetbyHachtag('Le Caravage');
        // ServerMessageManager.getTweetbyHachtag('Georges Braque');

        function createAtom(data, groupName) {
            if (data.limit) {
                //UIManager.createNotification("Alert limitation API : "+ data.limit.track);
            } else {
                var atom = new Atom(data);
                atom.setGroupProperty('groupName', groupName);
                atom.setRandomPosition();
                atom.setRandomDirection();
                atom.addMouseInteraction();
                //atom.setRandomScale();
                //atom.setTweetData(data);
                //atom.createLayer2D();
            }
        }
    }
);
