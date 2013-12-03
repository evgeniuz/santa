var santaApp = angular.module('santaApp', []);

santaApp.controller('SantaCtrl', ['$scope', function ($scope) {
    $scope.names = []; // participants
    $scope.receivers = []; // shuffled participants

    $scope.input = true; // toggles mode between input names/view results
    $scope.visible = false; // toggles visibility of assignment for current viewer
    $scope.done = false; // toggles when all participants viewed their assignments

    $scope.viewer = 0; // index of the current viewer

    $scope.arrange = function () {
        function random() {
            var max = Math.pow(2, 31), min = -max;
            return (sjcl.random.randomWords(1)[0] - min) / (max - min);
        }

        // http://bost.ocks.org/mike/shuffle/
        function shuffle(array) {
            var m = array.length, t, i;

            // While there remain elements to shuffle…
            while (m) {

                // Pick a remaining element…
                i = Math.floor(random() * m--);

                // And swap it with the current element.
                t = array[m];
                array[m] = array[i];
                array[i] = t;
            }

            return array;
        }

        function derangement(a, b) {
            for (var i = 0; i < a.length; i++) {
                if (a[i] === b[i]) {
                    return false;
                }
            }

            return true;
        }

        do {
            $scope.receivers = shuffle($scope.names.slice());
        } while (!derangement($scope.receivers, $scope.names));

        $scope.input = false;
    };

    $scope.add = function () {
        $scope.names.push($scope.name);
        $scope.name = '';
    };

    $scope.remove = function (index) {
        $scope.names.splice(index, 1);
    };

    $scope.validate = function () {
        return $scope.names.length > 1;
    };

    $scope.show = function () {
        $scope.visible = true;
    };

    $scope.current = function (index) {
        return index === $scope.viewer;
    };

    $scope.next = function () {
        if (++$scope.viewer >= $scope.names.length) {
            $scope.done = true;
        }
        $scope.visible = false;
    };

    $scope.color = function (name) {
        return {color: '#' + sjcl.codec.hex.fromBits(sjcl.hash.sha256.hash(name)).slice(0, 6)};
    };
}]);