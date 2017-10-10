//module
var weatherApp = angular.module('weatherApp', [ 'ui.router','angularUtils.directives.dirPagination']);
//Routes
weatherApp.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/home');

    $stateProvider
        .state('home', {
            url: '/home',
            templateUrl: 'pages/home.html',
            controller: 'homeController',
            controllerAs: 'homeCtrl'
        })
        .state('forecast', {
            url: '/forecast',
            templateUrl: 'pages/forecast.html',
            controller: 'forecastController',
            controllerAs: 'forecastCtrl'
        })
}]);
//service
weatherApp.service('cityService', function(){
    this.city = 'Bradford';
});
//controller
weatherApp.controller('homeController', ['$scope', 'cityService', function($scope, cityService){
    $scope.city = cityService.city;

    $scope.$watch('city', function(){
        cityService.city = $scope.city;
    })
}]);
weatherApp.controller('forecastController', ['$scope','$http', 'cityService', function($scope, $http, cityService){
    $scope.city = cityService.city;
    $http.get('https://www.metoffice.gov.uk/pub/data/weather/uk/climate/stationdata/bradforddata.txt')
        .then(function (response) {
            $scope.weatherArr = response.data.split('\n');
            $scope.weatherArr.splice(0, 7);
            $scope.result = [];
            $scope.weatherArr.forEach(function (el) {
                var tmpRowArr = el.replace(/  +/g, ' ').replace(/^\s*/, '').split(' ');
                var tmpOBj = {
                    year: tmpRowArr[0],
                    month: tmpRowArr[1],
                    tmax: tmpRowArr[2],
                    tmin: tmpRowArr[3],
                    af: tmpRowArr[4],
                    rain: tmpRowArr[5],
                    hours: tmpRowArr[6]

                };
                $scope.result.push(tmpOBj);
            }, function (reason) {
                console.log('Data Error');
            });

            $scope.currentPageNum = function () {
                return pagination.getCurrentPageNum();
            };
            $scope.sort = function (keyname) {
                $scope.sortKey = keyname;
                $scope.reverse = !$scope.reverse;
            }
        }
        )}]);
