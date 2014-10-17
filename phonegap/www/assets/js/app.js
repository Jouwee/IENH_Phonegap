var app = angular.module('app', [
    'ui.utils',
    'ui.map',
    'ionic'
]);

function onGoogleReady() {
  angular.bootstrap(document.getElementById("map"), ['app']);
};

app.controller('MapCtrl', function ($scope) {
    $scope.mapOptions = {
        center: new google.maps.LatLng(-29.6907268, -51.1189681),
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
});
  
app.config(function($stateProvider, $urlRouterProvider) {

    $stateProvider.state('Index', {
        url: '/',
        controller: 'ctrlIndex',
        templateUrl: 'assets/views/index.html'
    });

  $stateProvider.state('Map', {
        url: '/map',
        controller: 'ctrlMap',
        templateUrl: 'assets/views/map.html'
    });

  $stateProvider.state('Lista Paradas', {
        url: '/listaParadas',
        controller: 'ctrlListaParadas',
        templateUrl: 'assets/views/listaParadas.html'
    });

    $urlRouterProvider.otherwise("/");

});

app.run(function($rootScope, $location){
    $rootScope.go = function(path) {
        $location.path(path);
    }; 
});

app.controller('ctrlIndex', function($rootScope){});

app.controller('ctrlMap', function($rootScope){});

app.controller('ctrlListaParadas', function($scope, $http, $rootScope){
    $http.get('data/paradas.json').success(function(paradas){
        $scope.paradas = paradas.data;
    });
});
