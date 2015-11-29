require.config({
    paths: {
        text: "../../bower_components/text/text",
        three: '../../bower_components/three.js/build/three.min',
        trackballcontrols: '../../bower_components/TrackballControls/index',
        socketio: '/socket.io/socket.io',
        threexObjcoord: '../../bower_components/threex.objcoord/threex.objcoord',
        threexDomevents: '../../bower_components/threex.domevents/threex.domevents',
        threeProjector: '../../bower_components/three.js/examples/js/renderers/Projector',
        tweenjs: '../../bower_components/tween.js/src/Tween',
        handlebars: '../../bower_components/handlebars/handlebars.min',
        colorPicker: '../../bower_components/jquery-simplecolorpicker/jquery.simplecolorpicker',
        hbs: '../../bower_components/requirejs-hbs/hbs'
    },
    shim: {
        trackballcontrols: {
            deps: ['three']
        },
        threeProjector: {
            deps: ['three'],
        },
        threexObjcoord: {
            deps: ['three', 'threeProjector']
        },
        threexDomevents: {
            deps: ['three']
        },
        handlebars: {
            exports: 'Handlebars'
        },
    }
});