angular.module('githubApp', ['ngTable'])
.controller('GithubController', function($scope, $http, $filter, NgTableParams) {
  $scope.githubTable = new NgTableParams({
    orderby: {
      full_name: 'asc'
    }
  }, {
    getData: function($defer, params) {
      // return $http.get('https://api.flickr.com/services/rest/?api_key=[5d0b99b598780adb1ce7f682110a03e6]')
      return $http.get('http://api.flickr.com/services/rest/?&method=flickr.people.getPublicPhotos&api_key=[5d0b99b598780adb1ce7f682110a03e6]&format=json');
      .then(function(response) {
        var filteredData = $filter('filter')(response.data, params.filter())
        var sortedData = $filter('orderBy')(filteredData, params.orderBy());
        return sortedData;
      });
    }
  });

  $scope.loadRepos = function() {
    $scope.githubTable.reload();
  }
});
