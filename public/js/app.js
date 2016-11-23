'use strict';

var mainApp = angular.module('mainApp', ['ngRoute', 'mainAppControllers', 'webcam' ]);

mainApp.config(['$routeProvider', '$locationProvider',
    function($routeProvider, $locationProvider) {
        console.log("In the route controller function");
        $routeProvider.
        when('/login', {
            templateUrl: 'partial/login',
            controller: 'LoginCtrl'
        }).
        when('/register', {
            templateUrl: 'partial/register',
            controller: 'RegistrationCtrl'
        }).
        otherwise({
            redirectTo: '/login'
        });
    }
    ]);

// Seperate module and controller for initializing the Cloudant data: database, admin user, and CQ Index
var setupApp = angular.module('setupApp', [ 'setupAppControllers' ]);

var webApp = angular.module('webApp', [
    'ngRoute',
    'webAppControllers', 
    'webcam'
    ]);

webApp.config(['$routeProvider', '$locationProvider',
    function($routeProvider, $locationProvider) {
        $routeProvider.
        when('/main', {
            templateUrl: 'partial/auth/home',
            controller: 'HomeCtrl'
        }).
        when('/scan', {
            templateUrl: 'partial/auth/scanner',
            controller: 'scanCtrl'
        }).
        otherwise({
            redirectTo: '/main'
        });
    }
    ]);