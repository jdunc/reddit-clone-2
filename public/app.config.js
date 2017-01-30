(function() {
    const myApp = angular.module('app', ['ui.router']);

    // myApp.config(config(['$stateProvider', '$locationProvider', '$urlRouterProvider']));
    // function config($stateProvider, $locationProvider, $urlRouterProvider) {
    //   $locationProvider
    //   .html5Mode(true) // enable html5Mode for pushstate ('#'-less URLs DOESN'T WORK)
    //   .hashPrefix('!');
    myApp.config(config);

    function config($stateProvider, $locationProvider) {
        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false,
        });
        const reddit = {
            name: 'reddit',
            url: '/',
            template: '<reddit></reddit>',
        };

        const helloState = {
            name: 'hello',
            url: '/posts/:id/edit',
            template: '<edit></edit>',
            // controller: editController($stateParams)
        };


        $stateProvider.state(helloState);
        $stateProvider.state(reddit);
    }
}());
