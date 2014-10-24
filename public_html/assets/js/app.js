var coordenadas = {};

// Inicializa o módulo principal da aplicação
var app = angular.module('app', [
    'ui.utils',
    'ui.map',
    'ionic',
    'ngCordova'
]);

// Tarefas que devem rodar quando a aplicação inicaliza
app.run(function($rootScope, $location) {
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
        url: '/paradas',
        controller: 'ctrlParadas',
        templateUrl: 'assets/views/paradas.html'
    });
    $urlRouterProvider.otherwise("/");
});

// Controllers (manupulam os dados para a view)
app.controller('ctrlIndex', function() {
    console.log("ANGULAR: view inicial carregada!");
});

app.controller('ctrlMap', function() {
    console.log("ANGULAR: view do mapa carregado!");
});

app.controller('ctrlParadas', function() {
    console.log("ANGULAR: view do mapa carregado!");
});

app.controller('MapCtrl', function($scope, $http, $timeout, $ionicLoading) {
    $ionicLoading.show();

    $scope.myMarkers = [];

    /**
     * Converte string do dataserver para geocordenadas
     * 
     * @param {type} string
     * @returns {Number|_L66.coordinateStringToGeocoding.degrees}
     */
    function coordinateStringToGeocoding(string) {
        var degrees = Number(string.substring(0, string.indexOf('°')));
        var minutes = Number(string.substring(string.indexOf('°') + 1, string.indexOf("'"))) * 1.66666667;
        var geocode;
        if (degrees > 0) {
            geocode = degrees + (minutes / 100);
        } else {
            geocode = degrees - (minutes / 100);
        }
        return geocode;
    }

    // Carrega os pontos de onibus
    $http.get('data/paradas.json').success(function(paradas) {
        $scope.paradas = paradas.data;
        console.log("ANGULAR: arquivo paradas.json carregado em memória!");
        var image = 'assets/img/bus-stop-16.png';

        $scope.paradas.forEach(function(target, index) {
            // Ajusta as latitudes
            var latitude = coordinateStringToGeocoding(target.latitude);
            var longitude = coordinateStringToGeocoding(target.longitude);
            target.latitudeMsk = target.latitude;
            target.longitudeMsk = target.longitude;
            target.latitude = latitude;
            target.longitude = longitude;
            var marker = new google.maps.Marker({
                position: new google.maps.LatLng(latitude, longitude),
                map: $scope.myMap,
                title: target.logradouro,
                icon: image,
                paradaIndex: index
            });

            google.maps.event.addListener(marker, 'click', function(mark) {
                $scope.selectedParada = $scope.paradas[this.paradaIndex];
            });
            $scope.myMarkers.push(marker);
        });

        $scope.selectedParada = undefined;

    });

    $scope.mapOptions = {
        center: new google.maps.LatLng(coordenadas.latitude, coordenadas.longitude),
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    $timeout(function() {
        $scope.myMarkers.push(new google.maps.Marker({
            position: new google.maps.LatLng(coordenadas.latitude, coordenadas.longitude),
            map: $scope.myMap,
            title: 'Meu ponto legal!'
        }));

        $ionicLoading.hide();
    }, 300);
});

app.controller('IndexCtrl', function($scope, $http, $timeout, $ionicLoading) {

    $scope.getAcceleration = function() {
        $cordovaDeviceMotion.getCurrentAcceleration().then(function(result) {
            console.log('xisto');
        }, function(err) {
            console.log('errororor ');
            console.log(err);
        });
    };

});

app.controller('ParadasCtrl', function($scope, $http, $timeout, $ionicLoading) {
    $ionicLoading.show();

    // Carrega os pontos de onibus
    $http.get('data/paradas.json').success(function(paradas) {
        $scope.paradas = paradas.data;
        $ionicLoading.hide();
    });

});

// Função que é executada quando o Phonegap estiver inicializado
function onDeviceReady() {
    window.navigator.geolocation.getCurrentPosition(function(g) {
        coordenadas = g.coords;
    });
    // Inicializa a aplicação Angular
    angular.bootstrap(document,['app']);
};

function onGoogleReady() {
    angular.bootstrap(document.getElementById("map"), ['app']);
    // Evento para inicializar o Phonegap
    document.addEventListener("deviceready", onDeviceReady, false);
};
