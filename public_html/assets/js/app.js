var coordenadas = {};
    
// Evento para inicializar o Phonegap
document.addEventListener("deviceready", onDeviceReady, false);

// Função que é executada quando o Phonegap estiver inicializado
function onDeviceReady() {
    console.log("ANGULAR: OnDeviceReady");
    window.navigator.geolocation.getCurrentPosition(function(g) {
        console.log('ANGULAR: getCurrentPosition')
        coordenadas = g.coords;
    });

};

function onGoogleReady() {
    angular.bootstrap(document.getElementById("map"), ['app']);
    console.log("GOOGLE: carregou o maps");
};

// Inicializa o módulo principal da aplicação
var app = angular.module('app', [
    'ui.utils',
    'ui.map',
    'ionic'
]);

// Tarefas que devem rodar quando a aplicação inicaliza
app.run(function($rootScope, $location){
    $rootScope.go = function(path) {
        $location.path(path);
    }; 
    console.log("ANGULAR: carregou run");
});

// Carrega as telas do SPA (Single Page Application)
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

// Controllers (manupulam os dados para a view)
app.controller('ctrlIndex', function(){
    console.log("ANGULAR: view inicial carregada!");
});

app.controller('ctrlMap', function(){
    console.log("ANGULAR: view do mapa carregado!");
});

app.controller('MapCtrl', function ($scope, $http, $timeout, $ionicLoading) {
    $ionicLoading.show();
    
    $http.get('data/paradas.json').success(function(paradas){
        $scope.paradas = paradas.data;
        console.log("ANGULAR: arquivo paradas.json carregado em memória!");
    });

        $scope.mapOptions = {
            center: new google.maps.LatLng(coordenadas.latitude, coordenadas.longitude),
            zoom: 15,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

    $scope.myMarkers = [];
    
    $timeout(function(){
        $scope.myMarkers.push(new google.maps.Marker({
            position: new google.maps.LatLng(coordenadas.latitude, coordenadas.longitude),
            map : $scope.myMap,
            title: 'Meu ponto legal!'
        }));
        $ionicLoading.hide();
    },300);
});
