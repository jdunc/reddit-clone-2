(function() {
    angular.module('app')
        .component('edit', {
            controller: editController,
            templateUrl: '../../edit.html',
        });

    function editController($http, $stateParams, $window) {
        console.log($stateParams, 'stateParams');
        const vm = this;
        vm.$onInit = function() {
            vm.postId = $stateParams.id;
            vm.showPost = true;
            vm.sortBy = 'date';
            // Test post.
            vm.getPost();
            vm.posts = [];
        };

        // Add the updated post.
        vm.addPost = function() {
            const newPost = {
                title: vm.post.title,
                body: vm.post.body,
                author: vm.post.author,
                image_url: vm.post.image_url,
            };
            console.log(newPost, 'newPost');
            $http.patch(
                `/posts/${vm.postId}`,
                newPost, {
                    headers: {
                        'Content-Type': 'application/json; charset=UTF-8'
                    }
                }
            ).then((response) => {
                console.log('new data added', response);
                delete vm.post;
                $window.location = '/';
            });
        };

        // call to get specific post information
        vm.getPost = function() {
            console.log('gettingPosts');
            $http({
                method: 'GET',
                url: `/posts/${vm.postId}`,
            }).then((response) => {
                vm.post = response.data;
                // vm.post.image_url = '';
                // vm.post.body = '';
                console.log('new data', vm.post);
            });
        }; // end of getPosts
    } // end of controller
}());
//
// method: 'GET',
//     url: `/posts/${vm.postId}`,
// }).then((response) => {
//     vm.post = response.data;
//     vm.post.image_url = '';
//     vm.post.body = '';
//     console.log('new data', vm.post);
// });
// }; // end of getPosts
// } // end of controller
// }());
