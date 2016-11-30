var myApp = angular.module('myApp', []);
myApp.controller('AppCtrl',Controller);
    console.log("Hello World from controller");

/**
 * This is index controller. All functions are binded here
 * @param $scope
 * @param $http
 * @constructor
 */

function Controller($scope,$http) {

  refresh();    // reload the page as soon as controller loads

  /**
   * Refresh the view
   */
  function refresh() {
    console.log("Refreshing...");
    $http.get('/api/users/contactlist').success(function (response) {
      console.log("I got the data I requested");
      $scope.contactlist = response;
      $scope.contact = "";
    });
  }

  /**
   * Make a POST request for adding a new employee
   */
  $scope.addContact = function () {
    console.log("contact " ,$scope.contact);
    $http.post('/api/users/contactlist', $scope.contact).success(function (response) {
      console.log(response);
      refresh();
    });
  };


  /**
   * Make a DELETE request for removing an employee
   */
  $scope.remove = function(id) {
    console.log(id);
    $http.delete('/api/users/contactlist/' + id).success(function(response) {
      refresh();
    });
  };


  /**
   * Make a GET request for editing an employee
   */
  $scope.edit = function(id) {
    console.log(id);
    $http.get('/api/users/contactlist/' + id).success(function(response) {
      console.log("response received = ",response);
      $scope.contact = response;
    });
  };


  /**
   * Make a PUT request for updating an employee
   */
  $scope.update = function() {
    console.log($scope.contact._id);
    $http.put('/api/users/contactlist/' + $scope.contact._id, $scope.contact).success(function(response) {
      refresh();
    })
  };

  $scope.deselect = function() {
    $scope.contact = "";
  }

}





