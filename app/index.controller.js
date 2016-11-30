var myApp = angular.module('myApp', []);
myApp.controller('AppCtrl',['$scope','bankService',function ($scope,bankService) {
    console.log("Hello World from controller");
    $scope.doSearch =function(){
    console.log("inside dosearch");

  bankService.findBankDetailsByName($scope.searchBankName, function(r){
    $scope.bankName =r.bankName
  })
}
}])

myApp.service('bankService',['$http','$log',function($http,$log){
this.findBankDetailsByName =function (bankName, cb) {
    $http({
        url: 'http://localhost:3000/api/bankdetails' +bankname,
        method: 'GET'

    }).then(function(resp){
        cb(resp.data)
    },function (resp) {
        $log.error("ERROR occurred")
    })
}
}])

myApp.directive('bankDetails',function(){
        return{

            templateUrl: 'bank-details.html'
        }

})





