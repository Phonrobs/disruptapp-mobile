angular.module('starter.services', [])

.service('UI', function ($ionicPopup, $ionicLoading) {
    this.error = function (msg) {
        $ionicPopup.alert({
            title: 'Error',
            template: msg
        });

        console.log(JSON.stringify(msg));
    };

    this.alert = function (msg) {
        $ionicPopup.alert({
            title: 'Message',
            template: msg
        });

        console.log(JSON.stringify(msg));
    };

    this.startLoading = function (msg) {
        if (!msg)
            msg = 'Loading...';

        $ionicLoading.show({
            template: msg
        });
    };

    this.stopLoading = function () {
        $ionicLoading.hide();
    };
})

.service('AzureClient', function (UI) {
    var _serviceUrl = 'https://disruptapp.azurewebsites.net';
    var _authority = "https://login.windows.net/up.ac.th";
    var _redirectUri = "http://disruptapp.mobile.com";
    var _resourceUri = "https://graph.windows.net";
    var _clientId = "eee4b8a2-bf4e-49ed-acc7-ecdf5af43f4f";
    var _graphApiVersion = "2013-11-08";    
    var _client;

    var _adalContext;
    var _adalUser;

    this.getClient = function () {
        if (!_client) {
            _client = client = new WindowsAzure.MobileServiceClient(_serviceUrl);
        }

        return _client;
    };

    this.getServiceUrl = function () {
        return _serviceUrl;
    };

    this.login = function (onSuccess) {
        _adalContext = new Microsoft.ADAL.AuthenticationContext(_authority);

        _adalContext.tokenCache.readItems().then(function (items) {
            if (items.length > 0) {
                _authority = items[0].authority;
                _adalContext = new Microsoft.ADAL.AuthenticationContext(_authority);
            }

            _adalContext.acquireTokenSilentAsync(_redirectUri, _clientId).then(function () {
                _adalContext.tokenCache.readItems().then(function (items2) {
                    _adalUser = items2[0].userInfo;
                    onSuccess(_adalUser);
                });
            }, function () {
                _adalContext.acquireTokenAsync(_resourceUri, _clientId, _redirectUri).then(function () {
                    _adalContext.tokenCache.readItems().then(function (items2) {
                        _adalUser = items2[0].userInfo;
                        onSuccess(_adalUser);
                    });
                }, function (err) {
                    UI.error(err);
                });
            });
        });
    };

    this.getCurrentUser = function () {
        return _adalUser;
    };
})

.service('AzureBlobService', function ($q) {
    var _defer;
    var _remoteFileUrl;
    var _sasToken;

    function fail(err) {
        _defer.reject(err);
    }

    function uploadSuccess() {
        _defer.resolve();
    }

    function success(e) {
        if (e.target.readyState === FileReader.DONE) {
            var data = e.target.result;
            var url = _remoteFileUrl + _sasToken;

            var xhr = new XMLHttpRequest();
            xhr.onerror = fail;
            xhr.onloadend = uploadSuccess;
            xhr.open("PUT", url);
            xhr.setRequestHeader('x-ms-blob-type', 'BlockBlob');
            xhr.setRequestHeader('x-ms-blob-content-type', 'image/jpeg');
            xhr.send(data);
        }
    }

    this.upload = function (localFileUrl, remoteFileUrl, sasToken) {
        _defer = $q.defer();

        _remoteFileUrl = remoteFileUrl;
        _sasToken = sasToken;

        window.resolveLocalFileSystemURL(localFileUrl, function (fe) {
            fe.file(function (file) {
                var reader = new FileReader();
                reader.onloadend = success;
                reader.onerror = fail;
                reader.readAsArrayBuffer(file);
            }, fail);
        }, fail);

        return _defer.promise;
    };
})

.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'img/ben.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'img/max.png'
  }, {
    id: 2,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'img/adam.jpg'
  }, {
    id: 3,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'img/perry.png'
  }, {
    id: 4,
    name: 'Mike Harrington',
    lastText: 'This is wicked good ice cream.',
    face: 'img/mike.png'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
});
