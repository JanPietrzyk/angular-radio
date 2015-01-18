/**
 * This is an example controller.
 * It triggers the UserdataService and puts the returned value on the scope
 *
 * @see services
 */
var controllers = angular.module('Radio.controllers', [])
    .controller('Stations', function ($scope, StationsService, PlayerService) {

        $scope.loading = true;
        $scope.playing = false;
        $scope.region = "Region Dortmund";
        $scope.activeIndex = StationsService.getActiveIndex();

        StationsService.getStationList().then(function(stationList) {
            $scope.stations = stationList;
        });
        
        $scope.$watch('activeIndex', function(newVal, oldVal) {
            if(!$scope.stations) {
                return;
            }
            
            if(null === $scope.activeIndex) {
                return;
            }
            
            $scope.loading = true;
            
            StationsService.setActiveIndex($scope.activeIndex);
            PlayerService.setStream($scope.stations[$scope.activeIndex].stream[0]).then(function() {
               $scope.loading = false;
               $scope.playing = true;
               PlayerService.play();
            }).catch(function() {
                $scope.playing = false;
            });
        });
        
        $scope.play = function() {
            $scope.loading = false;
            $scope.playing = true;
            PlayerService.play();
        };
        
        $scope.pause = function() {
            $scope.playing = false;
            PlayerService.pause();
        };

    });

