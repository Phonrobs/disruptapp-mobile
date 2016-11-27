angular.module('starter.controllers', [])

.controller('DashCtrl', function ($scope, UI, AzureBlobService, AzureClient, $ionicModal) {
    var _client;
    var _feedTable;
    var _localPictureUrl;
    var _addFeedModal;
    var _readFeedModal;

    $scope.add = function () {
        $scope.item = {};

        if (!_addFeedModal) {
            $ionicModal.fromTemplateUrl('add-feed-modal.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                _addFeedModal = modal;
                _addFeedModal.show();
            });
        }
        else
            _addFeedModal.show();
    };

    $scope.save = function () {
        UI.startLoading('Saving...');

        _feedTable.insert($scope.item).then(function (data) {
            AzureBlobService.upload(_localPictureUrl, data.picture, data.sasToken).then(function () {
                $scope.items.splice(0, 0, data);
                UI.stopLoading();
                _addFeedModal.hide();
            }, function (err) {
                UI.stopLoading();
                UI.error(err);
            });
        }, function (err) {
            UI.stopLoading();
            UI.error(err);
        });
    };

    $scope.cancel = function () {
        _addFeedModal.hide();
    };

    $scope.takePhoto = function () {
        navigator.camera.getPicture(function (data) {
            _localPictureUrl = data;

            var image = document.getElementById('photo');
            image.src = data;
        }, function (err) {
        });
    };

    $scope.read = function (item) {
        $scope.item = item;

        if (!_readFeedModal) {
            $ionicModal.fromTemplateUrl('read-feed-modal.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                _readFeedModal = modal;
                _readFeedModal.show();
            });
        }
        else
            _readFeedModal.show();
    };

    $scope.like = function () {
        _readFeedModal.hide();
    };

    $scope.close = function () {
        _readFeedModal.hide();
    };

    $scope.refresh = function () {
        if (!_client) {
            _client = new WindowsAzure.MobileServiceClient(AzureClient.getServiceUrl());
            _feedTable = _client.getTable('FeedItem');
        }

        _feedTable.read().then(function (data) {
            $scope.items = data;
        }, function (err) {
            UI.error(err);
        });
    };

    $scope.refresh();
})

.controller('ChatsCtrl', function ($scope, Chats) {
    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    $scope.chats = Chats.all();
    $scope.remove = function (chat) {
        Chats.remove(chat);
    };
})

.controller('ChatDetailCtrl', function ($scope, $stateParams, Chats) {
    $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function ($scope, AzureClient) {
    //$scope.username = AzureClient.getCurrentUser().displayableId;

    $scope.login = function () {
        AzureClient.login();
    };
});
