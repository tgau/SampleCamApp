'use strict';
        
/* main App Controllers */
 
var mainAppControllers = angular.module('mainAppControllers', [ 'angular-flash.service', 'angular-flash.flash-alert-directive' ])
                                .config(function (flashProvider) {
                                    // Support bootstrap 3.0 "alert-danger" class with error flash types
                                    flashProvider.errorClassnames.push('alert-danger');
                                });

mainAppControllers.controller('LoginCtrl', ['$scope', '$http','$window','$location', 'flash',
    function ($scope, $http, $window, flash) {
        $scope.failed_login = "";
        $scope.login = function()
        {
            $scope.$parent.failed_login = "";
            var user = {"username": $scope.username, "password": $scope.password};
            if($scope.username!==undefined || $scope.password !==undefined){
                $http({method: 'POST', url: '/api/login', data:user}).
                    success(function(data, status, headers, config) {
                        flash.success = "Success";
                        $window.location.href="/home";
                    }).
                    error(function(data, status, headers, config) {
                        $scope.$parent.failed_login = "There was an error logging into the system. " + data.message;
                    });
            }
        }
    }
]);

mainAppControllers.controller('RegistrationCtrl', ['$scope', '$http','$window','$location', 'flash',
    function ($scope, $http, $window, flash) {
        $scope.failed_register = "";

        $scope.register = function()
        {
            $scope.$parent.failed_register = "";
            var user = {"username": $scope.username, "password": $scope.password, "check_password": $scope.check_password};
            if($scope.username!==undefined || $scope.password !==undefined){
                //check to see if the two passwords are the same
                if($scope.password != $scope.check_password){
                    $scope.$parent.failed_register = "The passwords need to match!";
                } else {
                    // check to see if the user exists already
                $http({method: 'POST', url: '/api/register', data:user}).
                    success(function(data, status, headers, config) {
                        $window.location.href="/home";
                    }).
                    error(function(data, status, headers, config) {
                        $scope.$parent.failed_register = "There was an error registering the user. " + data.message;
                    });
                } 
            }
            
        }
    }
]);

/** controllers for setting up the Cloudant DB, Index, and admin user **/

var setupAppControllers = angular.module('setupAppControllers', [ 'angular-flash.service', 'angular-flash.flash-alert-directive' ])
                                .config(function (flashProvider) {
                                    // Support bootstrap 3.0 "alert-danger" class with error flash types
                                    flashProvider.errorClassnames.push('alert-danger');
                                });


setupAppControllers.controller('SetupCtrl', ['$scope', '$http', 'flash',
    function ($scope, $http, flash) {
        console.log("In the Setup Cloudant Controller");

        $http({method: 'GET', url: '/setup/initialize'
            }).
            success(function(data, status, headers, config) {
                console.log("success");
                $scope.dbname = data.dbname;
                $scope.admin_user = data.admin_user;
                $scope.admin_pass = data.admin_pass;
                $scope.index_field = data.index_field;
                $scope.setup_done = true;
                $scope.setup_started = false;
                flash.success = "You have set up Cloudant successfully!";
            }).
            error(function(data, status, headers, config) {
                console.log(data);
                flash.error= data;
            });
    }
    
]);



/* web App Controllers */


var webAppControllers = angular.module('webAppControllers', []);
webAppControllers.controller('scanCtrl', function($scope, $window) {
    var _video = null,
        patData = null;

    $scope.patOpts = {x: 0, y: 0, w: 25, h: 25};

    // Setup a channel to receive a video property
    // with a reference to the video element
    // See the HTML binding in main.html
    $scope.channel = {};

    $scope.webcamError = false;
    $scope.onError = function (err) {
        $scope.$apply(
            function() {
                $scope.webcamError = err;
            }
        );
    };

    $scope.onSuccess = function () {
        // The video element contains the captured camera data
        _video = $scope.channel.video;
        $scope.$apply(function() {
            $scope.patOpts.w = _video.width;
            $scope.patOpts.h = _video.height;
            //$scope.showDemos = true;
        });
    };

    $scope.onStream = function (stream) {
        // You could do something manually with the stream.
    };

    $scope.makeSnapshot = function() {
        if (_video) {
            var patCanvas = document.querySelector('#snapshot');
            if (!patCanvas) return;

            patCanvas.width = _video.width;
            patCanvas.height = _video.height;
            var ctxPat = patCanvas.getContext('2d');

            var idata = getVideoData($scope.patOpts.x, $scope.patOpts.y, $scope.patOpts.w, $scope.patOpts.h);
            ctxPat.putImageData(idata, 0, 0);

            sendSnapshotToServer(patCanvas.toDataURL());

            patData = idata;
        }
    };
    
    /**
     * Redirect the browser to the URL given.
     * Used to download the image by passing a dataURL string
     */
    $scope.downloadSnapshot = function downloadSnapshot(dataURL) {
        window.location.href = dataURL;
    };
    
    var getVideoData = function getVideoData(x, y, w, h) {
        var hiddenCanvas = document.createElement('canvas');
        hiddenCanvas.width = _video.width;
        hiddenCanvas.height = _video.height;
        var ctx = hiddenCanvas.getContext('2d');
        ctx.drawImage(_video, 0, 0, _video.width, _video.height);
        return ctx.getImageData(x, y, w, h);
    };

    /**
     * This function could be used to send the image data
     * to a backend server that expects base64 encoded images.
     *
     * In this example, we simply store it in the scope for display.
     */
    var sendSnapshotToServer = function sendSnapshotToServer(imgBase64) {
        $scope.snapshotData = imgBase64;
    };
});
webAppControllers.controller('HomeCtrl', ['$scope', '$http','$window','$location',
    function ($scope, $http, $window, $location) {
        console.log("In the Home Controller");
    }
]);