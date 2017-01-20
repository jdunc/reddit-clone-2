// BUGS: it doesn't update dynamically... requires to click.


(function() {
  'use strict';
  angular.module('app', ['ui.router'])
  .config(config)

  function config($stateProvider) {
    var editPost = {
      name: 'editPost',
      url: "/",
      template: '<house-new></house-new>'
    }

    var home = {
      name: 'home',
      url: '/',
      template: '<reddit></reddit>'
    }

    $stateProvider.state(home);
    $stateProvider.state(editPost);
  }//end of config function
}());
