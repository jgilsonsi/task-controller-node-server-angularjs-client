(function () {
    angular.module('reportApp', [])
        .controller('reportController', reportController);

    reportController.$inject = ['$scope', '$http'];
    function reportController($scope, $http) {

        var SERVER_URL = 'http://159.203.139.69:8088/';

        //service metods ------------------------
        var getClosedTasks = function () {
            $http.get(SERVER_URL + 'close').then(function (response) {
                $scope.tasks = response.data;
            }, function (error) {
                console.log(error);
            });
        };

        //other ---------------------------------
        $scope.appliedClass = function (task) {
            if (task.date_done <= task.date_task) {
                return "bg-success";
            } else {
                return "bg-warning";
            }
        }

        //start ---------------------------------
        getClosedTasks();

        var reload = setInterval(function () {
            getClosedTasks();
        }, 10000);
    }

})(); 
