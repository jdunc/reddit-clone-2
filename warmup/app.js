// BUGS: it doesn't update dynamically... requires to click.


(function () {
  angular.module('app', [])
        .component('reddit', {
          controller() {
            const vm = this;
            vm.$onInit = function () {
              vm.regex = '^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$';
            };
          },
          templateUrl: './reddit.html',
        })
        .directive('matchForm', () =>  // element, attribute, class, or comment

           ({
             require: 'ngModel',
             scope: {    //= two way binding, one way, either way, or & sign
               otherField: '=matchForm',
             },
             restrict: 'A', // this directive can only be used as an attribute (A), other options are class(C), element(E), comment(M)
             link(scope, element, attributes, ngModel) { // execute this, access to ngModel and do something to it
                // check validation
               ngModel.$validators.match = function (modelValue) { // modelValue = thing in this field
                  // console.log(modelValue, scope.otherField);
                 return (scope.otherField === modelValue);
               };
               scope.$watch('otherField', () => {
                 ngModel.$validate();
               });// end of scope.$watch
                  // watch value of other field
             }, //end of link
           }),
)
        .directive('checkPassword', () => ({
          require: 'ngModel',
          restrict: 'A',
          link(scope, element, attributes, ngModel) {
            ngModel.$validators.special = function (modelValue) {
              return !!(modelValue.match(/\d/) && modelValue.match(/[!#%@]/) && modelValue.match(/[a-zA-Z]/)); // use !! to change a string true or false to a boolean
            };
          },
        }));
}());
