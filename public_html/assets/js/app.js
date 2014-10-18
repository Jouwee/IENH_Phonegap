var coordenadas = {};
    
// Evento para inicializar o Phonegap
document.addEventListener("deviceready", onDeviceReady, false);

// Função que é executada quando o Phonegap estiver inicializado
function onDeviceReady() {
    window.navigator.geolocation.getCurrentPosition(function(g) {
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

    $scope.myMarkers = [];
    
    function coordinateStringToGeocoding(string) {
        var degrees = Number(string.substring(0, string.indexOf('°')));
        var minutes = Number(string.substring(string.indexOf('°') + 1, string.indexOf("'"))) * 1.66666667;
        var geocode;
        if(degrees > 0) {
            geocode = degrees + (minutes / 100);
        } else {
            geocode = degrees - (minutes / 100);
        }
        return geocode;
    }
    
    $http.get('data/paradas.json').success(function(paradas){
        $scope.paradas = paradas.data;
        console.log("ANGULAR: arquivo paradas.json carregado em memória!");
        var image = 'assets/img/bus-stop-16.png';
        
        $scope.paradas.forEach(function(target) {
            
            var latitude = coordinateStringToGeocoding(target.latitude);
            var longitude = coordinateStringToGeocoding(target.longitude);
            
            $scope.myMarkers.push(new google.maps.Marker({
                position: new google.maps.LatLng(latitude, longitude),
                map : $scope.myMap,
                title: target.logradouro,
                icon: image
            }));
        });
        
        console.log($scope.myMarkers.length);
        
        console.log('done');
        

    });

    $scope.mapOptions = {
        center: new google.maps.LatLng(coordenadas.latitude, coordenadas.longitude),
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    $timeout(function(){
        $scope.myMarkers.push(new google.maps.Marker({
            position: new google.maps.LatLng(coordenadas.latitude, coordenadas.longitude),
            map : $scope.myMap,
            title: 'Meu ponto legal!'
        }));
        
        $ionicLoading.hide();
    },300);
});

