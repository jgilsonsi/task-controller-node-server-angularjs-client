(function () {
    angular.module('tasksApp', ['angularjs-datetime-picker'])
        .controller('tasksController', tasksController);

    tasksController.$inject = ['$scope', '$http', '$filter'];
    function tasksController($scope, $http, $filter) {

        $scope.task = {};
        var taskEdition;
        var SERVER_URL = 'http://159.203.139.69:8088/';

        //service metods ------------------------
        var getOpenTasks = function () {
            $http.get(SERVER_URL + 'open').then(function (response) {
                $scope.tasks = response.data;
            }, function (error) {
                console.log(error);
            });
        };

        var addTask = function () {
            if ($scope.task.description && $scope.task.date_task) {
                if (taskEdition) {
                    taskEdition.description = $scope.task.description;
                    taskEdition.date_task = $scope.task.date_task;
                    $http.put(SERVER_URL, taskEdition).then(function (response) {
                        console.log(response.data);
                        getOpenTasks();
                        taskEdition = null;
                    }, function (error) {
                        console.log(error);
                    });
                } else {
                    var task = {
                        description: $scope.task.description,
                        date_task: $scope.task.date_task
                    };
                    $http.post(SERVER_URL, task).then(function (response) {
                        console.log(response.data);
                        getOpenTasks();
                    }, function (error) {
                        console.log(error);
                    });
                }
                $scope.task.description = '';
                $scope.task.date_task = '';
                $scope.info = '';
            } else {
                $scope.info = 'There are empty fields';
            }
        };

        var closeTask = function (task) {
            task.date_task = $filter('date')(task.date_task, 'yyyy-MM-dd HH:mm');
            task.date_done = 'now';
            $http.put(SERVER_URL, task).then(function (response) {
                console.log(response.data);
                getOpenTasks();
            }, function (error) {
                console.log(error);
            });
        };

        var editTask = function (task) {
            $scope.task.description = task.description;
            $scope.task.date_task = $filter('date')(task.date_task, 'yyyy-MM-dd HH:mm');
            taskEdition = task;
        };

        var removeTask = function (taskId) {
            $http.delete(SERVER_URL + taskId).then(function (response) {
                console.log(response.data);
                getOpenTasks();
            }, function (error) {
                console.log(error);
            });
        };

        //start ---------------------------------
        getOpenTasks();
        $scope.addTask = addTask;
        $scope.closeTask = closeTask;
        $scope.editTask = editTask;
        $scope.removeTask = removeTask;

        var reload = setInterval(function () {
            getOpenTasks();
        }, 10000);
    }

})(); 
