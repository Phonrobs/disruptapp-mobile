var CordovaInit = function(appModule) {

    var onDeviceReady = function() {
        receivedEvent('deviceready');
    };

    var receivedEvent = function(event) {
        console.debug('Start event received, bootstrapping application setup.');
        var body = document.getElementsByTagName("body")[0];
        angular.bootstrap(body, [appModule]);
    };

    this.bindEvents = function() {
        document.addEventListener('deviceready', onDeviceReady, false);
    };

    //If cordova is present, wait for it to initialize, otherwise just try to
    //bootstrap the application.
    if (window.cordova !== undefined) {
        console.debug('Cordova found, waiting for device.');
        this.bindEvents();
    } else {
        console.debug('Cordova not found, booting application');
        receivedEvent('manual');
    }
};