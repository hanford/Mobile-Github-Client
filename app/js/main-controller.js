angular.module('MobileGit')

.controller('MainCtrl', ['$ionicNavBarDelegate', '$scope', '$ionicLoading', 'githubservice', '$state', 'store', '$ionicHistory', '$ionicLoading', '$timeout',
  function ($ionicNavBarDelegate, $scope, $ionicLoading, githubservice, $state, store, $ionicHistory, $ionicLoading, $timeout) {

    // Base Object used in most controllers containing logged in users information along with a few other things
    $scope.flags = {
      user: {},
      access_token: '',
      FromSearch: false,
      repo: {},
      code: {}
    };

    if ($state.current.name == ("search" || "intro")) {
      $ionicNavBarDelegate.showBackButton(false);
    } else {
      $ionicNavBarDelegate.showBackButton(true);
    }

    $scope.$on('loading', function() {
      $ionicLoading.show({
        template: '<ion-spinner icon="ripple" class="spinner"></ion-spinner>'
      })
    });

    $scope.$on('done-loading', function() {
      $ionicLoading.hide();
    })

    // Utility function for debugging
    window.flags = function() {
      console.log('flags', $scope.flags)
    };

    if (store.get('access_token') == undefined) {
      $state.go('intro');
    } else {
      $scope.flags.access_token = store.get('access_token');
      $scope.flags.user = store.get('user');
    }

    $ionicNavBarDelegate.showBackButton(true);

    $scope.searchRepos = function(project) {
      $scope.$emit('loading');
      githubservice.getProjects(project).then(function(response) {
        $scope.$emit('done-loading');
        $scope.repos = response.data.items;
        $ionicNavBarDelegate.showBackButton(true);
        $state.go('searchpage');
      })
    }

    $scope.OtherProfile = function (user) {
      $scope.flags.FromSearch = true;
      $scope.$emit('loading');
      githubservice.getPerson(user).then(function(response) {
        $scope.$emit('done-loading');
        $scope.otherUser = response;
        $ionicHistory.clearCache();
        $state.go('profile');
      });
    };

    $scope.getRepo = function (repo) {
      $scope.$emit('loading');
      githubservice.getTree(repo).then(function(response) {
        $scope.$emit('done-loading');
        $ionicLoading.hide();
        $scope.flags.repo.fullname = repo;
        $scope.flags.repo.files = response;
        $state.go('repo');
      });
    };

    $scope.formatEvents = function(data) {
      var events = [];
      $scope.flags.loading = true;
      for (var i = data.length - 1; i >= 0; i--) {
        var instance = {};
        var evt = data[i];
        if (evt.type.indexOf("Event") > -1) {
          var eType = evt.type.substring(0, evt.type.indexOf("Event"));
          instance.type = eType;
        }
        instance.date = evt.created_at;
        instance.repo = evt.repo.name;
        instance.name = evt.actor.login;
        instance.avatar = evt.actor.avatar_url;
        events.push(instance);
      };
      return events;
    };

    // $scope.UpdateUser = function() {
    //   githubservice.getPerson($scope.flags.user.login).then(function(response) {
    //     console.log('updated!')
    //     $ionicHistory.clearCache();
    //     $scope.flags.user = reponse;
    //     store.set('user', reponse)
    //   });
    // }

}])