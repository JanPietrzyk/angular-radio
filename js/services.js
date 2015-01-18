/**
 * Restangular-based data service, fetches user data from the backend
 *
 * @see https://github.com/mgonto/restangular
 */
var services = angular.module('Radio.services', [])
    .factory('StationsService', ['$q', function StationsService($q) {
        var storage = window.localStorage;    
            
        return {
            getActiveIndex: function() {
                if(!storage.getItem('activeIndex')) {
                    storage.setItem('activeIndex', 0);
                }
                
                return parseInt(storage.getItem('activeIndex'));
            },
            setActiveIndex: function(activeIndex) {
                storage.setItem('activeIndex', activeIndex);
            },
            /**
             * @function getFirstUsername
             * @returns a Promise that eventually resolves to the username of the first user
             */
            getStationList: function() {
                var stationListDeferred = $q.defer();
                
                if(!storage.getItem('stations')) {
                    storage.setItem('stations', JSON.stringify([{"title":"EINS LIVE","freq":"106,7 MHz","stream":["http:\/\/1live.akacast.akamaistream.net\/7\/706\/119434\/v1\/gnl.akacast.akamaistream.net\/1live"],"music":[]},{"title":"WDR 2","freq":"87,8 MHz","stream":["http:\/\/wdr-mp3-m-wdr2-duesseldorf.akacast.akamaistream.net\/7\/371\/119456\/v1\/gnl.akacast.akamaistream.net\/wdr-mp3-m-wdr2-duesseldorf"],"music":[]},{"title":"WDR 4","freq":"101,3 MHz","stream":["http:\/\/wdr-4.akacast.akamaistream.net\/7\/42\/119438\/v1\/gnl.akacast.akamaistream.net\/wdr-4"],"music":[]}]));
                }
                
                stationListDeferred.resolve(JSON.parse(storage.getItem('stations')));
                
                return stationListDeferred.promise;
            },
            addStation: function(station) {
                this.getStationList.then(function(stations) {
                    stations.push(station);
                    
                    storage.setItem('stations', JSON.stringify(stations));
                });
            }
        }}])
        .factory('PlayerService', ['$q', function StationsService($q) {
            var audio = new Audio();
            var deferred;
            var canPlay = false;
            var errorCount = 0;
            var _check = function() {
                //catches a ios bug
                setTimeout(function() {
                    if(errorCount > 3 || canPlay) {
                        
                        if(deferred) {
                            deferred.reject();
                        }
                        
                        return;
                    }

                    audio.load();
                    errorCount++;
                    _check();

                }, 1500);
            };

            audio.volume = 1.0;
    
            audio.addEventListener('canplay', function(event) {
                canPlay = true;
                errorCount = 0;
                
                if(deferred)  {
                    deferred.resolve();
                    deferred = null;
                }
            });
            
            return {
                setStream: function(stream) {
                    audio.src = stream;
                    audio.load();
                    _check();
                    
                    return (deferred  = $q.defer()).promise;
                },
                play: function() {
                    audio.play();
                },
                pause: function() {
                    audio.pause();
                }
            };
        }]);
