/* global requirejs */
requirejs(["three", "Organik/Atom", "Organik/CameraManager", "socketio"], 
function(THREE, Atom , CameraManager, io) {
	
	CameraManager.changeCameraPosition(new THREE.Vector3(-125,5,2.5));
	var socket = io.connect('http://localhost:5000');
    socket.on('tweetArrived', function(data) {
        //socket.emit('join', 'Hello World from client');
		var atom = new Atom();
		atom.setRandomPosition();
		atom.setRandomScale();
		atom.setRandomDirection();
		atom.setTweetData(data);
    });
	
	// for(var i = 0; i<1000 ; i++){
	// 	var atom = new Atom();
	// 	atom.setRandomPosition();
	// 	atom.setRandomScale();
	// 	atom.setRandomDirection();
	// 	//var link = new Link();
	// 	//atom.changeRotation(new THREE.Vector3(Math.random(),Math.random(),Math.random()));
	// }
});
