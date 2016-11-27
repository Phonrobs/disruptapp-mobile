angular.module('starter.controllers', [])

.controller('DashCtrl', function ($scope, UI, AzureBlobService) {
    $scope.data = {};

    $scope.save = function () {
        var client = new WindowsAzure.MobileServiceClient('https://disruptapp.azurewebsites.net');
        var problemTable = client.getTable('ProblemItem');

        UI.startLoading('กำลังบันทึกข้อมูล');

        problemTable.insert($scope.data).then(function (data) {
            AzureBlobService.upload(_localPictureUrl, data.picture, data.sasToken).then(function () {
                UI.stopLoading();
                alert('บันทึกข้อมูลของคุณเรียบร้อยแล้ว');
            }, function (err) {
                UI.stopLoading();
                UI.error(err);
            });
        }, function (err) {
            UI.stopLoading();
            UI.error(err);
        });
    };

    var _localPictureUrl;

    $scope.takePhoto = function () {
        navigator.camera.getPicture(function (data) {
            _localPictureUrl = data;

            var image = document.getElementById('photo');
            image.src = data;
        }, function (err) {
        });
    };
})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
