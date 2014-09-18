angular.module('treeview', [])

.controller('repoViewCtrl', function($scope, $http, $rootScope, $state, githubservice) {
  console.log($rootScope.repo)
  var updated = $rootScope.repo.updated_at;
  $scope.updated = updated.substring(0, 10);
  $scope.repo = $rootScope.repo;

  $scope.recentActivity = function(repo) {
    $scope.repo = repo;
    githubservice.getCommits(repo).then(function(response) {
      $state.go('commits')
      $rootScope.commits = response;
    })
  }

  $scope.seeTree = function(fullname) {
    githubservice.getTree(fullname).then(function(response) {
      $rootScope.tree = response;
      $state.go('treeview')
    })
  }

})

.controller('treeCtrl', function($scope, $http, $rootScope, $state, $ionicLoading, $ionicModal, githubservice, $ionicScrollDelegate) {
  $scope.repo = $rootScope.repo;


  $scope.items = $rootScope.tree;

  if ($rootScope.repo == undefined) {
    $state.go('search')
  } else if ($rootScope.tree == undefined) {
    $state.go('search')
  }

  githubservice.getCommits($scope.repo.full_name)
    .then(function(response) {
      $scope.commits = response.length;
    })

  githubservice.getStats($scope.repo.full_name)
    .then(function(response) {
      console.log('first call for for contribs')
    })

  $scope.file = function(item) {
    $ionicLoading.show({
      template: '<i class="ion-loading-c"></i>'
    });
    githubservice.getContents($scope.repo.full_name, item.path)
      .then(function(response) {
        if (item.type == 'file') {
          $ionicLoading.hide();
          $rootScope.code = atob(response.content.replace(/\s/g, ''))
          $state.go('content')
        } else {
          $ionicLoading.hide();
          console.log(response)
          $scope.items = response;
          $ionicScrollDelegate.scrollTop(true)
        }
      })
  }

  $scope.branch = function() {
    var ref = window.open('https://github.com/' + $rootScope.repo.full_name + '?files=1', '_blank', 'location=no');
  }

  $ionicModal.fromTemplateUrl('js/modals/contributors.html', {
    scope: $scope,
    animation: 'slide-in-up'
  })
    .then(function(modal) {
      $scope.modal = modal;

      $scope.contribs = function() {
        $scope.modal.show();
        githubservice.getStats($scope.repo.full_name)
          .then(function(response) {
            console.log(response)
            $scope.contributors = response;
          })
      };
      $scope.closeModal = function() {
        $scope.modal.hide();
      }

      $scope.toContrib = function(login) {
        $rootScope.uname = login;

        var url = 'https://api.github.com/users/' + login;

        console.log(url)

        $ionicLoading.show({
          template: '<i class="ion-loading-c"></i>'
        });

        $http.get(url)
          .success(function(data, headers, status, config) {
            $rootScope.ginfo = data;
            $ionicLoading.hide();
            $scope.modal.hide();
            $state.go('profile')
          })
          .error(function(data, headers, status, config) {
            console.log(data, headers, status)
          });
      }
    });

  if (!$scope.items) {
    $state.go('search')
  }

})
