(function() {
    angular.module('app')
        .component('reddit', {
            controller: controller,
            templateUrl: './reddit.html',
        });

    controller.$inject = ['$http'];

    function controller($http) {
        const vm = this;
        vm.filter = '';
        vm.$onInit = function() {
            vm.showPost = true;
            vm.sortBy = 'date';
            // Test post.
            vm.posts = [];
            vm.getPosts();
            console.log('Angular Initialized.');
            // Check when all posts were created ~60 seconds.
            (function counter() {
                vm.checkTime();
                setTimeout(counter, 60000);
            }());
        };

        vm.showPostToggle = function() {
            if (vm.showPost) {
                vm.showPost = false;
                console.log('showPost:', vm.showPost);
            } else {
                vm.showPost = true;
                console.log('showPost:', vm.showPost);
            }
        };


        vm.byScore = function() {
            vm.posts.sort((a, b) => parseFloat(a.vote_count) - parseFloat(b.vote_count));
        };

        // Check the time of when the post is created.
        vm.checkTime = function() {
            console.log('checkTime Running.');
            const now = new Date();
            if (vm.posts != undefined) {
                for (let i = 0; i < vm.posts.length; i++) {
                    const then = new Date(vm.posts[i].created_at);
                    console.log(now, then);
                    const diffMs = (now - then);
                    const diffDays = Math.floor(diffMs / 86400000);
                    const diffHrs = Math.floor((diffMs % 86400000) / 3600000);
                    const diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000);
                    if (diffDays > 0) {
                        vm.posts[i].timePassed = `${diffDays} days,${diffHrs} hours, and ${diffMins} minutes ago.`;
                    } else if (diffHrs > 0) {
                        vm.posts[i].timePassed = `${diffHrs} hours and ${diffMins} minutes ago.`;
                    } else if (diffMins > 1) {
                        vm.posts[i].timePassed = `${diffMins} minutes ago.`;
                    }
                    if (diffMins < 1) {
                        vm.posts[i].timePassed = 'Recently posted.';
                    }
                    // console.log(`Posted ${i}: ${diffDays} days, ${diffHrs} hours, ${diffMins} minutes.`);
                    // console.log(vm.posts[i].timePassed);
                }
                console.log(vm.posts);
            } else {
                console.log('No posts to update.');
            }
        };

        // Raise and lower scores.
        vm.upvote_count = function(e, post) {
            $http.post(
                `/${post.id}/votes`
            ).then((response) => {
                vm.getPosts();
            });
        };
        vm.downvote_count = function(e, post) {
            $http.delete(
                `/${post.id}/votes`
            ).then((response) => {
                vm.getPosts();
            });
        };

        // Create a new post.
        vm.addPost = function() {
            const newPost = {
                title: vm.post.title,
                body: vm.post.body,
                author: vm.post.author,
                image_url: vm.post.image_url,
            };
            console.log(newPost, 'newPost');
            $http.post(
                '/posts',
                newPost, {
                    headers: {
                        'Content-Type': 'application/json; charset=UTF-8'
                    }
                }
            ).then((response) => {
                console.log('new data added', response);
                vm.getPosts();
                delete vm.post;
            });
        };
        vm.addComment = function(post) {
            vm.posts[vm.posts.indexOf(post)].comments.push(post.tempComment);
            delete post.tempComment;
        };

        // TODO Delete a post.
        vm.deletePost = function(e, post) {
            console.log(post);
            $http.delete(
                `/${post.id}`
            ).then((response) => {
                vm.getPosts();
            });
        };
        vm.getPosts = function() {
            console.log('gettingPosts');
            $http({
                method: 'GET',
                url: '/posts'
            }).then((response) => {
                vm.data = response.data;
                console.log('new data', vm.data);
                vm.posts = vm.data;
                vm.checkTime();
            });
        };
    } // end of controller
}());
