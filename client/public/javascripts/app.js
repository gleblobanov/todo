angular.module('nodeTodo', ['ngMaterial', 'datePicker', 'infinite-scroll'])

    .controller('mainController', function ($scope, $http) {
        $scope.formData = {};
        $scope.todoAll = [];

        function fillTodoData(data) {
            data.forEach(function(item) {
                    $scope.todoAll.push(item);
            });
        }

        $http.get('/api/v1/todos')
            .success(function (data) {
               fillTodoData(data);
            })
            .error(function (error) {
            });


        $scope.deleteTodo = function (idx, todoID) {
            console.log(idx);
            $scope.todoAll.splice(idx,1);
            $http.delete('/api/v1/todos/' + todoID)
                .success(function (data) {
                })
                .error(function (data) {
                })
        };


        $scope.createTodo = function () {

            $scope.formData.complete = false;

            $http.post('/api/v1/todos/',$scope.formData)
                .success(function (data) {
                   data.forEach(function (item)
                    {
                        $scope.todoAll.unshift(item);
                        $scope.formData.text = '';
                        $scope.formData.date = '';
                    })
                })
                .error(function (error) {
                })
        };

        $scope.completeTask = function (todoID, complete){

            complete = complete ? false : true;



            $http.post('/api/v1/todos/complete/', { id: todoID, new_value: complete } )
                .success(function (data) {

                })
                .error(function () {
                })
        };

        $scope.loadMoreAll = function() {
            var offset = $scope.todoAll.length;
            if (offset) {
                offset--;
            }
            else {
                return;
            }
            $http.post('/api/v1/todos/infinit', { offset: offset } )
                .success(function (data) {
                    data.forEach(function (item) {
                        $scope.todoAll.push(item);
                    })
                })
                .error(function () {
                })
        };

        $scope.isCompleted = function( criteria ) {
            return function( item ) {
                return item.complete === criteria;
            };
        };
    });